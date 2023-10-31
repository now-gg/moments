import logging
from flask import Flask, request, jsonify
import os
import time
from moviepy.editor import *
from utils import get_upload_file_path
import requests
import tempfile
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Moments backend"


@app.route("/video/process", methods=["POST"])
def process():
    try:
        body = request.get_json()
        title = body["title"]
        video_id = body["videoId"]
        crop = body.get("crop")
        trim = body.get("trim")
        auth_token = request.headers.get("token")

        try:
            video_info = get_video_info(video_id)
            video_url = video_info["downloadUrl"]
            file_extension = video_url.split(".")[-1]
        except Exception as e:
            return jsonify({"status": "error", "message": f'Something went wrong while fetching video info for {video_id}', "error": str(e)}), 500


        video_name = title + "." + file_extension
        video_name = video_name.replace(" ", "_")

        time_before_init = time.time()

        clip = VideoFileClip(video_url)
        
        original_video_size = clip.size
        original_video_duration = clip.duration 
        time_before_trim = time.time()

        if trim:
            trim_start = int(float(trim.get("start", "0")))
            trim_end = int(float(trim.get("end", str(clip.duration))))
            if trim_start < 0 or trim_end > clip.duration or trim_start > trim_end:
                return jsonify({"status": "error", "message": "Invalid trim start or end"}), 400
            clip = clip.subclip(trim_start, trim_end)
        time_after_trim = time.time()

        if crop:
            clip = clip.crop(x1=crop["x1"], y1=crop["y1"], x2=crop["x2"], y2=crop["y2"])
        time_after_crop = time.time()

        # write clip to a temp file
        with tempfile.NamedTemporaryFile(suffix=".mp4") as temp_file:
            clip.write_videofile(temp_file.name)
            temp_file.seek(0)
            upload_res, new_video_id = upload_video(temp_file.name, title, auth_token)

        if upload_res.status_code != 200:
            return jsonify({"status": "error", "message": "Something went wrong while uploading the video"}), upload_res.status_code

        delete_res = delete_video(video_id, auth_token)
        if delete_res.status_code != 200:
            return jsonify({"status": "error", "message": "Something went wrong while deleting the previous video"}), delete_res.status_code

        return jsonify({
            "status": "success",
            "message": "Video processed successfully",
            "video_id": new_video_id,
            "original_video_size": original_video_size,
            "original_video_duration": original_video_duration,
            "time_taken_to_init": time_before_trim - time_before_init,
            "time_taken_to_trim": time_after_trim - time_before_trim if trim else 0,
            "time_taken_to_crop": time_after_crop - time_after_trim if crop else 0,
        }), 200

    except Exception as e:
        logging.error(e)
        if isinstance(e, KeyError):
            return jsonify({"status": "error", "message": f'Key {e} missing from request body'}), 400
        return jsonify({"status": "error", "message": f'Something went wrong', "error": str(e)}), 500


def upload_video(video_path, title, token):
    cloudflare_upload_url, new_video_id = create_video(title ,token)
    with open(video_path, 'rb') as video_file:
        res = requests.post(cloudflare_upload_url, files={"file": (title, video_file)})
    return res, new_video_id


def create_video(title, token):
    try:
        headers = {
            'Authorization': f'Bearer {token}'
        }
        create_video_body = {
            "title": title,
            "description": "",
            "tags": ["moments", "edit"],
            "mimeType": "video/mp4",
            "creatorPlatform": "BS5",
            "appName": "2048"
        }

        url = 'https://stagingngg.net/6/api/vid/v1/createVideo'

        res = requests.post(url, headers=headers, json=create_video_body)

        res_json = res.json()

        return res_json["uploadUrl"], res_json["videoId"]
    
    except Exception as e:
        logging.error(e)
        print(e)
        return None, None


def delete_video(video_id, token):
    try:
        url = 'https://stagingngg.net/6/api/vid/v1/updateVideo'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        data = {
            "videoId": video_id,
            "state": "Deleted"
        }
        res = requests.post(url, headers=headers, json=data)
        return res
    
    except Exception as e:
        logging.error(e)
        print(e)
        return e


def get_video_info(video_id):
    try:
        url = f'https://stagingngg.net/6/api/vid/v1/getVideoInfo?videoId={video_id}'
        res = requests.get(url)
        res_json = res.json()
        if res.status_code != 200:
            return {}
        return res_json["video"]

    except Exception as e:
        logging.error(e)
        return {}
