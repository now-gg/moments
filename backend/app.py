import logging
from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import time
from moviepy.editor import *
from utils import get_upload_file_path
from credentials import CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN
import requests
import tempfile

app = Flask(__name__)


@app.route("/")
def home():
    return "Moments backend"


@app.route("/videos/<path:filename>", methods=["HEAD"])
def serve_video_head(filename):
    filesize = os.path.getsize(os.path.join("static","videos", filename))

    headers = {
        'Accept-Ranges': 'bytes',
        'Content-Length': filesize,
        'Content-Type': 'video/mp4',
    }

    return '', 200, headers


def extract_range(range_header, file_size):
    if range_header:
        start, end = range_header.replace('bytes=', '').split('-')
        start = int(start) if start else 0
        end = int(end) if end else file_size - 1
        end = min(end, file_size - 1)
        return start, end
    return 0, file_size - 1


@app.route("/videos/<path:filename>", methods=["GET"])
def serve_video(filename):
    video_path = os.path.join("static", "videos", filename)
    file_size = os.path.getsize(video_path)
    
    range_header = request.headers.get('Range', None)
    start, end = extract_range(range_header, file_size)

    requested_video_data = None
    with open(video_path, 'rb') as video_file:
        video_file.seek(start)
        requested_video_data = video_file.read(end - start + 1)
    
    headers = {
        'Content-Type': 'video/mp4',  # Adjust content type as needed
        'Accept-Ranges': 'bytes',
        'Content-Length': len(requested_video_data),
        'Content-Range': f'bytes {start}-{end}/{file_size}',
    }

    return requested_video_data, 206, headers


@app.route("/static/videos/<path:filename>")
def server_video_file(filename):
    return send_from_directory("videos", filename)


def upload_video(video_url, title):
    cloudflare_upload_url = f'https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/stream/copy'
    headers = {
        'Authorization': f'Bearer {CLOUDFLARE_API_TOKEN}'
    }
    data = {
        'url': video_url,
        'meta': {
            'name': title
        }
    }
    res = requests.post(cloudflare_upload_url, headers=headers, json=data)
    
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
        clip.write_videofile(processed_video_path)
        video_download_route = request.host_url + "videos/" + video_name       

        logging.debug("url_given_to_cloudflare: %s", video_download_route)

        upload_res = upload_video(video_download_route, title)
        upload_res_json = upload_res.json()
        if upload_res.status_code != 200:
            return jsonify({"status": "error", "message": "Something went wrong while uploading to cloudflare", "errors": upload_res_json["errors"], "messages": upload_res_json["messages"]}), upload_res.status_code

        return jsonify({
            "status": "success",
            "message": "Video processed successfully",
            "result": upload_res_json["result"],
            "url_given_to_cloudflare": video_download_route,
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
