
import google.cloud.logging
import logging
from flask import Flask, request, jsonify, Response, render_template
import json
import os
import time
import requests
import tempfile
from flask_cors import CORS
import ffmpeg
import threading
from pubsub import publish_message, get_subscriber
from redis_wrapper  import RedisWrapper
from bigquery import send_stat_to_bq
from utils import get_operation
from credentials import CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN

app = Flask(__name__)
CORS(app)

client = google.cloud.logging.Client()
client.setup_logging()

redis_client = RedisWrapper()

logging.info("starting flask app")


@app.route("/video/upload-page", methods=["GET"])
def upload_page():
    return render_template("upload.html")


@app.route("/video/upload-tus", methods=["GET","POST"])
def upload_tus():
    try:
        logging.info(f'cf {CLOUDFLARE_ACCOUNT_ID} {CLOUDFLARE_API_TOKEN}')
        endpoint = f'https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/stream?direct_user=true'
        headers = {
            'Authorization': f'bearer {CLOUDFLARE_API_TOKEN}',
            'Tus-Resumable': '1.0.0',
            'Upload-Length': request.headers.get('Upload-Length'),
            'Upload-Metadata': request.headers.get('Upload-Metadata'),
        }
        res = requests.post(endpoint, headers=headers)
        destination = res.headers.get('Location')

        res_headers = {
            'Location': destination,
            'Access-Control-Expose-Headers': 'Location',
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Origin': '*'
        }

        return Response(status=201, headers=res_headers)
    except Exception as e:
        logging.error(e)
        return jsonify({"status": "error", "message": f'Error in upload-tus'}), 500    


@app.route("/")
def home():
    return "Moments backend"


@app.route("/video/upload", methods=["POST"])
def upload():
    try:
        body = request.get_json()
        auth_token = request.headers.get("token")
        video_url = body["video_url"]
        video_url_2 = body.get("video_url_2")
        video_id = body["video_id"]

        logging.info("request to upload video")

        video_info = get_video_info(video_id)
        create_video_res = create_video(video_url, auth_token, video_info)
        if create_video_res.status_code != 200:
            return jsonify({"status": "error", "message": f'Error in creating video on nowgg'}), 500
        create_video_res = create_video_res.json()
        upload_url, new_video_id = create_video_res["uploadUrl"], create_video_res["videoId"]

        stream = ffmpeg.input(video_url)
        if video_url_2:
            stream_2 = ffmpeg.input(video_url_2)
            stream = ffmpeg.concat(stream, stream_2)
            
        with tempfile.NamedTemporaryFile(suffix=".mp4") as temp_file:
            try:
                stream = ffmpeg.output(stream, temp_file.name, loglevel="quiet")
                stream = ffmpeg.overwrite_output(stream)
                ffmpeg.run(stream)
            except Exception as e:
                logging.error(e)
                return jsonify({"status": "error", "message": f'Error in running ffmpeg'}), 500 

            temp_file.seek(0)
            upload_res = upload_video(temp_file.name, new_video_id, upload_url)
            temp_file.close()
            del temp_file

        if upload_res.status_code != 200:
            return jsonify({"status": "error", "message": f'Error in uploading video'}), 500
        
        return jsonify({"status": "success", "message": "Video uploaded successfully", "new_video_id": new_video_id}), 200
    
    except Exception as e:
        logging.error(e)
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

        video_cache_key = f'moments-editor-video-{video_id}'
        if redis_client.get(video_cache_key):
            return jsonify({"status": "error", "message": f'Video with id {video_id} is already being processed'}), 400

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

        create_video_res = create_video(title, auth_token, video_info)
        if create_video_res.status_code != 200:
            return create_video_res.json(), create_video_res.status_code
        create_video_res = create_video_res.json()
        upload_url, new_video_id = create_video_res["uploadUrl"], create_video_res["videoId"]

        data_for_bq = {
            "arg1": video_id,
            "arg2": video_info.get("durationSecs", ""),
            "arg3": get_operation(trim, crop)
        }
        send_stat_to_bq("video_edit_request", data_for_bq)

        message = {
            "video_id": video_id,
            "title": title,
            "trim": trim,
            "crop": crop,
            "auth_token": auth_token,
            "video_url": video_url,
            "upload_url": upload_url,
            "new_video_id": new_video_id
        }
        logging.info(f'message to be published: {message}')
        redis_client.set(video_cache_key, "processing")
        publish_message(json.dumps(message))
        return jsonify({"status": "success", "message": "Video processing started", "new_video_id": new_video_id}), 200

    except Exception as e:
        logging.error(e)
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
        res = requests.post(url, headers=headers, json=data)
        return res.json(), res.status_code
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
        logging.debug(f'debug: video info request for {video_id}')

        video_info = get_video_info(video_id)

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


def edit_video(video_id, title, trim, crop, auth_token, input_video_url, upload_url, new_video_id):
    request_init_time = time.time()
    video_cache_key = f'moments-editor-video-{video_id}'
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
        try:
            stream = ffmpeg.filter(stream, 'scale', 1280, -1)
            stream = ffmpeg.output(stream, temp_file.name, loglevel="quiet")
            stream = ffmpeg.overwrite_output(stream)
            ffmpeg.run(stream)
        except ffmpeg.Error as e:
            redis_client.delete(video_cache_key)
            logging.debug(e.stderr)
            return jsonify({"status": "error", "message": f'Something went wrong while writing the video', "error": str(e)}), 500
        except Exception as e:
            redis_client.delete(video_cache_key)
            logging.error(e)
            return jsonify({"status": "error", "message": f'Something went wrong while writing the video', "error": str(e)}), 500
        logging.info("clip written to temp file")
        temp_file.seek(0)
        upload_res = upload_video(temp_file.name, title, upload_url)
        temp_file.close()
        del temp_file
    

    if upload_res.status_code != 200:
        redis_client.delete(video_cache_key)
        return jsonify({"status": "error", "message": "Something went wrong while uploading the video"}), upload_res.status_code

    delete_res = delete_video(video_id, auth_token)
    if delete_res.status_code != 200:
        redis_client.delete(video_cache_key)
        return jsonify({"status": "error", "message": "Something went wrong while deleting the previous video"}), delete_res.status_code

    data_for_bq = {
        "arg1": video_id,
        "arg2": new_video_id,
        "arg3": time.time() - request_init_time
    }
    send_stat_to_bq("video_edit_processed", data_for_bq)

    res_dict = {
        "status": "success",
        "message": "Video processed successfully"
    }

    redis_client.delete(video_cache_key)

    logging.info(f'response to be sent: {res_dict}')
    return jsonify(res_dict), 200


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
        new_video_id = message["new_video_id"]
        with app.app_context():
            res = edit_video(video_id, title, trim, crop, auth_token, video_url, upload_url, new_video_id)
            logging.info(f'response from edit_video async: {res}')
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
                    message_cache_key = f'moments-editor-message-{message.message_id}'
                    if redis_client.get(message_cache_key):
                        logging.info(f'message {message.data} with id {message.message_id} already processed')
                        break
                    redis_client.set(message_cache_key, 1)
                    subscriber.acknowledge(subscription=subscription_path, ack_ids=[received_message.ack_id])
                    pull_message_callback(message.data)
                time.sleep(1)
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


def create_video(title, token, video_info):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    create_video_body = {
        "title": title if title else video_info["title"],
        "description": video_info["description"],
        "tags": video_info["tags"],
        "mimeType": "video/mp4",
        "creatorPlatform": video_info["creatorPlatform"],
        "appName": video_info["appName"]
    }

    url = 'https://stagingngg.net/6/api/vid/v1/createVideo'

    res = requests.post(url, headers=headers, json=create_video_body)

    return res


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
        if res.status_code == 200:
            logging.info(f'video {video_id} deleted successfully')
        return res
    
    except Exception as e:
        logging.error(e)
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



pull_message_threading = threading.Thread(target=pull_messages)
pull_message_threading.start()