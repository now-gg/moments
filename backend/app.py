from flask import Flask, render_template, request, jsonify
import os
import time
from moviepy.editor import *
from utils import get_upload_file_path
from credentials import CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN
import requests


app = Flask(__name__)


@app.route("/")
def home():
    return "Moments backend"


def upload_video(video_url, title, files):
    # cloudflare_upload_url = f'https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/stream/copy'
    cloudflare_upload_url = f'https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/stream'
    headers = {
        'Authorization': f'Bearer {CLOUDFLARE_API_TOKEN}'
    }
    data = {
        'url': video_url,
        'meta': {
            'name': title
        }
    }
    # res = requests.post(cloudflare_upload_url, headers=headers, json=data)
    res = requests.post(cloudflare_upload_url, headers=headers, files=files)
    
    return res

    

@app.route("/video/process", methods=["POST"])
def process():
    try:
        body = request.get_json()
        title = body["title"]
        video_url = body["video_url"]
        crop = body.get("crop")
        trim = body.get("trim")
        try:
            file_extension = video_url.split(".")[-1]
        except IndexError:
            return jsonify({"status": "error", "message": "Video url does not have file extension"}), 400
        
        video_name = title + "." + file_extension
        video_name = video_name.replace(" ", "_")

        time_before_init = time.time()

        clip = VideoFileClip(video_url)
        
        original_video_size = clip.size
        original_video_duration = clip.duration 
        time_before_trim = time.time()

        if trim:
            clip = clip.subclip(trim["start"], trim["end"])
        time_after_trim = time.time()
        if crop:
            clip = clip.crop(x1=crop["x1"], y1=crop["y1"], x2=crop["x2"], y2=crop["y2"])
        time_after_crop = time.time()


        processed_video_path = get_upload_file_path(video_name, "edit")
        # clip.write_videofile(processed_video_path)
        processed_video_url = request.host_url + processed_video_path

        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video_file:
            clip.write_videofile(temp_video_file.name, codec='libx264')

        files = {'video': (temp_video_file.name, open(temp_video_file.name, 'rb'))}

        upload_res = upload_video(processed_video_url, title, files)
        upload_res_json = upload_res.json()
        if upload_res.status_code != 200:
            return jsonify({"status": "error", "message": "Something went wrong while uploading to cloudflare", "errors": upload_res_json["errors"]}), upload_res.status_code

        return jsonify({
            "status": "success",
            "message": "Video processed successfully",
            "result": upload_res_json["result"],
            "server_save_url": processed_video_url,
            "original_video_size": original_video_size,
            "original_video_duration": original_video_duration,
            "time_taken_to_init": time_before_trim - time_before_init,
            "time_taken_to_trim": time_after_trim - time_before_trim if trim else 0,
            "time_taken_to_crop": time_after_crop - time_after_trim if crop else 0,
        }), 200

    except Exception as e:
        if isinstance(e, KeyError):
            return jsonify({"status": "error", "message": f'Key {e} missing from request body'}), 400
        return jsonify({"status": "error", "message": f'Something went wrong', "error": str(e)}), 500
