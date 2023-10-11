from flask import Flask, render_template, request, jsonify
import os
import time
from moviepy.editor import *
from utils import get_upload_file_path, save_input_video


app = Flask(__name__)


@app.route("/")
def home():
    return "Moments backend"
    

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
        processed_video_url = request.host_url + processed_video_path

        return jsonify({
            "status": "success",
            "video_url": processed_video_url,
            "original_video_size": original_video_size,
            "original_video_duration": original_video_duration,
            "result_video_size": clip.size,
            "result_video_duration": clip.duration,
            "time_taken_to_init": time_before_trim - time_before_init,
            "time_taken_to_trim": time_after_trim - time_before_trim if trim else 0,
            "time_taken_to_crop": time_after_crop - time_after_trim if crop else 0,
        }), 200

    except Exception as e:
        if isinstance(e, KeyError):
            return jsonify({"status": "error", "message": f'Key {e} missing from request body'}), 400
        print(e)
        return jsonify({"status": "error", "message": f'Something went wrong {e}'}), 500
