
import google.cloud.logging
import logging
from flask import Flask, request, jsonify
import os
import time
import requests
import tempfile
from flask_cors import CORS
import psutil
import ffmpeg
from pubsub import publish_message, get_subscriber

app = Flask(__name__)
CORS(app)

client = google.cloud.logging.Client()
client.setup_logging()

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
            upload_res, new_video_id = upload_video(temp_file.name, title, auth_token)
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
        request_init_time = time.time()
        log_resource_usage("request hit")

        try:
            video_info = get_video_info(video_id)
            video_url = video_info["downloadUrl"]
            logging.info("video info received")
        except Exception as e:
            return jsonify({"status": "error", "message": f'Something went wrong while getting downloadUrl for {video_id}', "error": str(e)}), 500

        if not video_url:
            return jsonify({"status": "error", "message": f'Download url for video with id {video_id} not found'}), 404

        stream = ffmpeg.input(video_url)

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

        log_resource_usage()

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
            upload_res, new_video_id = upload_video(temp_file.name, title, auth_token)
            temp_file.close()
            del temp_file
        
        logging.info(f'upload done for new video {new_video_id}')
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
            "video_id": new_video_id,
            "request_processing_time": time.time() - request_init_time
        }

        logging.info(f'response to be sent: {res_dict}')
        log_resource_usage()
        return jsonify(res_dict), 200

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
    time.sleep(5)
    logging.info('Message processed: {}'.format(message))
    message.ack()


@app.route("/pubsub/pull", methods=["GET"])
def pull_messages():
    try:
        subscriber, subscription_path = get_subscriber()
        
        streaming_pull_future = subscriber.subscribe(subscription_path, callback=pull_message_callback)
        logging.info('Listening for messages on {}'.format(subscription_path))

        with subscriber:
            try:
                streaming_pull_future.result(timeout=5)
            except TimeoutError:
                streaming_pull_future.cancel()
                streaming_pull_future.result()

        return "call to pull pubsub messages"
    except Exception as e:
        logging.error(e)


def upload_video(video_path, title, token):
    try:
        cloudflare_upload_url, new_video_id = create_video(title ,token)
        with open(video_path, 'rb') as video_file:
            res = requests.post(cloudflare_upload_url, files={"file": (title, video_file)})
        return res, new_video_id
    except Exception as e:
        logging.error(e)


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
