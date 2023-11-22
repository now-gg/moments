
import google.cloud.logging
import logging
from flask import Flask, request, jsonify
import json
import os
import time
import requests
import tempfile
from flask_cors import CORS
import psutil
import ffmpeg
from pubsub import publish_message, get_subscriber
from redis_wrapper  import RedisWrapper
import threading

app = Flask(__name__)
CORS(app)

client = google.cloud.logging.Client()
client.setup_logging()

redis_client = RedisWrapper()

logging.info("starting flask app")

@app.route("/")
def home():
    return "Moments backend"


@app.route("/video/upload", methods=["POST"])
def upload():
    try:
        body = request.get_json()
        title = body["title"]
        video_url = body["videoUrl"]
        auth_token = request.headers.get("token")

        file_extension = video_url.split(".")[-1]
        
        video_name = title + "." + file_extension
        video_name = video_name.replace(" ", "_")

        stream = ffmpeg.input(video_url)

        # write clip to a temp file
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
            stream = ffmpeg.filter(stream, 'scale', 1280, -1)
            stream = ffmpeg.output(stream, temp_file.name)
            stream = ffmpeg.overwrite_output(stream)
            ffmpeg.run(stream)
            logging.info("clip written to temp file")
            temp_file.seek(0)
            upload_url, new_video_id = create_video(title, auth_token)
            upload_res = upload_video(temp_file.name, title, upload_url)
            temp_file.close()
            os.remove(temp_file.name)
        

        if upload_res.status_code != 200:
            return jsonify({"status": "error", "message": "Something went wrong while uploading the video"}), upload_res.status_code

        res_dict = {
            "status": "success",
            "message": "Video uploaded successfully",
            "video_id": new_video_id
        }

        return jsonify(res_dict), 200

    except Exception as e:
        logging.error(e)
        if isinstance(e, KeyError):
            return jsonify({"status": "error", "message": f'Key {e} missing from request body'}), 400
        return jsonify({"status": "error", "message": f'Something went wrong', "error": str(e)}), 500


def edit_video(video_id, title, trim, crop, auth_token, input_video_url, upload_url):
    request_init_time = time.time()

    stream = ffmpeg.input(input_video_url)

    if trim:
        trim_start = int(float(trim.get("start", "0")))
        trim_end = int(float(trim.get("end", "1")))
        # validate input
        stream = ffmpeg.trim(stream, start=trim_start, end=trim_end)

    if crop:
        x1 = int(float(crop["x1"]))
        y1 = int(float(crop["y1"]))
        x2 = int(float(crop["x2"]))
        y2 = int(float(crop["y2"]))
        width = x2 - x1
        height = y2 - y1
        # validate input
        stream = ffmpeg.crop(stream, x1, y1, width, height)

    # write clip to a temp file
    with tempfile.NamedTemporaryFile(suffix=".mp4") as temp_file:
        log_resource_usage(f'temp file created {temp_file.name}')
        try:
            stream = ffmpeg.filter(stream, 'scale', 1280, -1)
            stream = ffmpeg.output(stream, temp_file.name)
            stream = ffmpeg.overwrite_output(stream)
            ffmpeg.run(stream)
        except ffmpeg.Error as e:
            logging.error(e.stderr)
            return jsonify({"status": "error", "message": f'Something went wrong while writing the video', "error": str(e)}), 500
        except Exception as e:
            logging.error(e)
            log_resource_usage()
            return jsonify({"status": "error", "message": f'Something went wrong while writing the video', "error": str(e)}), 500
        log_resource_usage("clip written to temp file")
        temp_file.seek(0)
        upload_res = upload_video(temp_file.name, title, upload_url)
        temp_file.close()
        del temp_file
    
    log_resource_usage()

    if upload_res.status_code != 200:
        return jsonify({"status": "error", "message": "Something went wrong while uploading the video"}), upload_res.status_code

    delete_res = delete_video(video_id, auth_token)
    if delete_res.status_code != 200:
        return jsonify({"status": "error", "message": "Something went wrong while deleting the previous video"}), delete_res.status_code
    logging.info(f'previous video deleted: {video_id}')

    res_dict = {
        "status": "success",
        "message": "Video processed successfully",
        "request_processing_time": time.time() - request_init_time
    }

    logging.info(f'response to be sent: {res_dict}')
    log_resource_usage()
    return jsonify(res_dict), 200


@app.route("/video/process", methods=["POST"])
def process():
    try:
        body = request.get_json()
        title = body["title"]
        video_id = body["videoId"]
        crop = body.get("crop")
        trim = body.get("trim")
        auth_token = request.headers.get("token")

        logging.info(f'video edit request for {video_id}')

        try:
            video_info = get_video_info(video_id)
            if not video_info:
                return jsonify({"status": "error", "message": f'Info for video with id {video_id} not found'}), 404
            video_url = video_info["downloadUrl"]
            if not video_url:
                return jsonify({"status": "error", "message": f'Download url for video with id {video_id} not found'}), 404
            logging.info("downloadUrl received")
        except Exception as e:
            return jsonify({"status": "error", "message": f'Something went wrong with getting downloadUrl of {video_id}', "error": str(e)}), 500
        
        upload_url, new_video_id = create_video(title, auth_token)
        logging.info(f'new video id: {new_video_id}')

        message = {
            "video_id": video_id,
            "title": title,
            "trim": trim,
            "crop": crop,
            "auth_token": auth_token,
            "video_url": video_url,
            "upload_url": upload_url
        }
        logging.info(f'message to be published: {message}')
        publish_message(json.dumps(message))
        # res = edit_video(video_id, title, trim, crop, auth_token, video_url, upload_url)
        return jsonify({"status": "success", "message": "Video processing started", "new_video_id": new_video_id}), 200

    except Exception as e:
        logging.error(e)
        log_resource_usage("error")
        if isinstance(e, KeyError):
            return jsonify({"status": "error", "message": f'Key {e} missing from request body'}), 400
        return jsonify({"status": "error", "message": f'Something went wrong', "error": str(e)}), 500


@app.route("/video/title", methods=["POST"])
def edit_title():
    try:
        body = request.get_json()
        video_id = body["videoId"]
        title = body["title"]
        auth_token = request.headers.get("token")

        url = 'https://stagingngg.net/6/api/vid/v1/updateVideo'
        headers = {
            'Authorization': f'Bearer {auth_token}'
        }
        data = {
            "videoId": video_id,
            "title": title
        }
        # res = requests.post(url, headers=headers, json=data)
        # return res.json(), res.status_code
        res = publish_message(title)
        logging.info(f'response from publish_message: {res}')
        return "message published"
    except Exception as e:
        logging.error(e)
        return jsonify({"status": "error", "message": f'Something went wrong', "error": str(e)}), 500


@app.route("/video/delete", methods=["POST"])
def delete():
    try:
        body = request.get_json()
        video_id = body["videoId"]
        auth_token = request.headers.get("token")

        logging.info("request to delete video")

        delete_res = delete_video(video_id, auth_token)
        if delete_res.status_code != 200:
            return jsonify({"status": "error", "message": "Something went wrong while deleting the video"}), delete_res.status_code
        logging.info("video deleted")

        return jsonify({
            "status": "success",
            "message": "Video deleted successfully",
        }), 200

    except Exception as e:
        logging.error(e)
        if isinstance(e, KeyError):
            return jsonify({"status": "error", "message": f'Key {e} missing from request body'}), 400
        return jsonify({"status": "error", "message": f'Something went wrong', "error": str(e)}), 500


@app.route("/video/info", methods=["GET"])
def info():
    try:
        # get video id from query param
        video_id = request.args.get("videoId")

        logging.info(f'video info request for {video_id}')

        video_info = get_video_info(video_id)

        log_resource_usage()

        if video_info:
            logging.info("video info received", video_info)
            return jsonify({
                "status": "success",
                "message": "Video info received successfully",
                "video": video_info
            }), 200
        
        return jsonify({"status": "error", "message": f'Video with id {video_id} not found'}), 404

    except Exception as e:
        logging.error(e)
        return jsonify({"status": "error", "message": f'Something went wrong', "error": str(e)}), 500


def pull_message_callback(message):
    logging.info('Received message on subscriber: {}'.format(message))
    try:
        message = json.loads(message)
        video_id = message["video_id"]
        title = message["title"]
        trim = message["trim"]
        crop = message["crop"]
        auth_token = message["auth_token"]
        video_url = message["video_url"]
        upload_url = message["upload_url"]
        logging.info('data received in callback')
        logging.info(f'video_id: {video_id}, title: {title}, trim: {trim}, crop: {crop}, auth_token: {auth_token}, video_url: {video_url}, upload_url: {upload_url}')
    except Exception as e:
        logging.error(e)
    logging.info('Message processed: {}'.format(message))


def pull_messages():
    try:
        subscriber, subscription_path = get_subscriber()
        while True:
            logging.info("pulling messages")
            res = subscriber.pull(subscription=subscription_path, max_messages=1)
            if res.received_messages:
                for received_message in res.received_messages:
                    message = received_message.message
                    redis_key = f'moments-editor-{message.message_id}'
                    if redis_client.get(redis_key):
                        logging.info(f'message {message.data} with id {message.message_id} already processed')
                        break
                    redis_client.set(redis_key, 1)
                    pull_message_callback(message.data)
                    subscriber.acknowledge(subscription=subscription_path, ack_ids=[received_message.ack_id])
                time.sleep(10)
            else:
                logging.info("no messages received")
                time.sleep(30)
    except Exception as e:
        logging.error(e)


def upload_video(video_path, title, cloudflare_upload_url):
    try:
        with open(video_path, 'rb') as video_file:
            res = requests.post(cloudflare_upload_url, files={"file": (title, video_file)})
        return res
    except Exception as e:
        logging.error(e)


def create_video(title, token):
    try:
        headers = {
            'Authorization': f'Bearer {token}'
        }
        # TODO: send data from video info
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
        logging.error("error in createVideo call")
        logging.error(e)
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


def log_resource_usage(message=""):
    resources_used = {
        "cpu": psutil.cpu_percent(),
        "disk": psutil.disk_usage("/"),
        "memory": psutil.virtual_memory(),
    }

    logging.info(f'{message} resources used: {resources_used}')


pull_message_threading = threading.Thread(target=pull_messages)
pull_message_threading.start()