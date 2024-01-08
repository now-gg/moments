
import google.cloud.logging
import logging
from flask import Flask, request, send_from_directory, session, redirect
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
from bigquery import send_stat_to_bq, VIDEO_EDIT_PROCESSED, VIDEO_EDIT_REQUEST, VIDEO_DELETED
from uuid import uuid4
from constants import VIDEO_PORTAL_HOST, ALLOWED_ORIGINS, FE_HOST, API_KEY, CLIENT_ID, CLIENT_ID_HOST, CLIENT_SECRET
from utils import send_response
from uuid import uuid4
from googleapiclient.discovery import build


app = Flask(__name__)
app.secret_key = str(uuid4())
CORS(app, origins=ALLOWED_ORIGINS, methods=['GET','POST'], allow_headers=['Content-Type', 'Authorization', 'token'])

client = google.cloud.logging.Client()
client.setup_logging()

redis_client = RedisWrapper()

logging.info("starting flask app")
logging.info(f'env is {os.environ.get("ENVIRONMENT")}')


@app.route("/")
def home():
    return send_response({"message": "Welcome to Moments Backend"}, 200)


@app.route("/robots.txt")
def robots():
    return send_from_directory("./templates", request.path[1:])


@app.route("/video/process", methods=["POST"])
def process():
    try:
        body = request.get_json()
        title = body["title"]
        video_id = body["videoId"]
        crop = body.get("crop")
        trim = body.get("trim")
        aspect_ratio = body.get("aspectRatio")
        user_id = body.get("userId")
        country = body.get("country")
        auth_token = request.headers.get("token")
        request_id = str(uuid4())

        logging.info(f'video edit request for {video_id}')

        video_cache_key = f'moments-editor-video-{video_id}'
        if redis_client.get(video_cache_key) == "processing":
            return send_response({"message": f'Video with id {video_id} is already being processed'}, 400)

        try:
            video_info = get_video_info(video_id)
            if not video_info:
                return send_response({"message": f'Info for video with id {video_id} not found'}, 404)
            video_url = video_info["downloadUrl"]
            if not video_url:
                return send_response({"message": f'Download url for video with id {video_id} not found'}, 404)
            logging.info("downloadUrl received")
        except Exception as e:
            return send_response({"message": f'Something went wrong with getting downloadUrl of {video_id}', "error": str(e)}, 500)

        create_video_res = create_video(title, auth_token, video_info)
        if create_video_res.status_code != 200:
            return create_video_res.json(), create_video_res.status_code
        create_video_res = create_video_res.json()
        upload_url, new_video_id = create_video_res["uploadUrl"], create_video_res["videoId"]

        arg5_log = {
            "request_id": request_id,
            "trim": trim if trim else "",
            "crop": crop if crop else "",
            "aspect_ratio": aspect_ratio if aspect_ratio else ""
        }

        data_for_bq = {
            "arg1": user_id,
            "arg2": video_id,
            "arg3": new_video_id,
            "arg4": video_info.get("durationSecs", ""),
            "arg5": json.dumps(arg5_log),
            "country": country
        }
        send_stat_to_bq(VIDEO_EDIT_REQUEST, data_for_bq)

        message = {
            "user_id": user_id,
            "request_id": request_id,
            "video_id": video_id,
            "title": title,
            "trim": trim,
            "crop": crop,
            "auth_token": auth_token,
            "video_url": video_url,
            "upload_url": upload_url,
            "new_video_id": new_video_id,
            "user_country": country,
        }
        logging.info(f'message to be published: {message}')
        redis_client.set(video_cache_key, "processing")
        publish_message(json.dumps(message))
        return send_response({"message": "Video processing started", "new_video_id": new_video_id}, 200)

    except Exception as e:
        logging.error(e)
        if isinstance(e, KeyError):
            return send_response({ "message": f'Key {e} missing from request body'}, 400)
        return send_response({ "message": f'Something went wrong', "error": str(e)}, 500)


@app.route("/video/title", methods=["POST"])
def edit_title():
    try:
        body = request.get_json()
        video_id = body["videoId"]
        title = body["title"]
        auth_token = request.headers.get("token")

        url = f'{VIDEO_PORTAL_HOST}/updateVideo'
        headers = {
            'Authorization': f'Bearer {auth_token}'
        }
        data = {
            "videoId": video_id,
            "title": title
        }
        res = requests.post(url, headers=headers, json=data)
        return send_response(res.json(), res.status_code)
    except Exception as e:
        logging.error(e)
        return send_response({ "message": f'Something went wrong', "error": str(e)}, 500)


@app.route("/video/delete", methods=["POST"])
def delete():
    try:
        body = request.get_json()
        video_id = body["videoId"]
        auth_token = request.headers.get("token")
        user_id = body.get("userId")
        country = body.get("country")

        logging.info("request to delete video")

        delete_res = delete_video(video_id, auth_token)
        if delete_res.status_code != 200:
            if delete_res.status_code == 401:
                return send_response({"message": "You are not authorized to delete this video"}, 401)
            return send_response({ "message": "Something went wrong while deleting the video"}, delete_res.status_code)

        send_stat_to_bq(VIDEO_DELETED, {"arg1": user_id, "arg2": video_id, "country": country})
        return send_response({"message": "Video deleted successfully",}, 200)

    except Exception as e:
        logging.error(e)
        if isinstance(e, KeyError):
            return send_response({ "message": f'Key {e} missing from request body'}, 400)
        return send_response({ "message": f'Something went wrong', "error": str(e)}, 500)


@app.route("/video/info", methods=["GET"])
def info():
    try:
        # get video id from query param
        video_id = request.args.get("videoId")

        logging.info(f'video info request for {video_id}')
        logging.debug(f'debug: video info request for {video_id}')

        video_info = get_video_info(video_id)

        if video_info:
            logging.info(f'video info received for {video_id}')
            return send_response({"message": "Video info received successfully", "video": video_info}, 200)
        
        return send_response({ "message": f'Video with id {video_id} not found'}, 404)

    except Exception as e:
        logging.error(e)
        return send_response({ "message": f'Something went wrong', "error": str(e)}, 500)


@app.route("/video/status", methods=["POST"])
def status():
    try:
        body = request.get_json()
        old_video_id = body["oldVideoId"]
        new_video_id = body["newVideoId"]
        res_status = ""
        video_cache_key = f'moments-editor-video-{old_video_id}'
        video_status = redis_client.get(video_cache_key)
        if video_status == "success":
            video_info = get_video_info(new_video_id)
            if video_info:
                res_status = "success"
            else:
                res_status = "processedButNotPublishedYet"
        elif video_status == "processing":
            res_status = "processing"            
        elif video_status == "failed":
            res_status = "failed"
        return send_response({"videoStatus": res_status, "message": "Video status received successfully"}, 200)
    except Exception as e:
        logging.error(e)
        return send_response({ "message": f'Something went wrong', "error": str(e)}, 500)


@app.route('/oauth2callback/youtube')
def oauth2callback():
    redirect_uri = f'https://{request.host}/oauth2callback/youtube'
    scope = 'https://www.googleapis.com/auth/youtube.upload'
    logging.info(f'redirect_uri: {redirect_uri}')
    video_id = request.args.get('state')
    if 'code' not in request.args:
        auth_uri = f'https://accounts.google.com/o/oauth2/v2/auth?scope={scope}&include_granted_scopes=true&state={video_id}&redirect_uri={redirect_uri}&response_type=code&client_id={CLIENT_ID}'
        logging.info(auth_uri)
        return redirect(auth_uri)
    code = request.args.get('code')
    params = {
        'code': code,
        'client_id': CLIENT_ID_HOST,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }
    res = requests.post('https://oauth2.googleapis.com/token', params=params)
    if res.status_code != 200:
        return 'Error while fetching access token', res.status_code
    session['youtube_credentials'] = res.json()
    return redirect(f'{FE_HOST}/video/edit?videoId=' + video_id)


@app.route('/video/youtube-upload', methods=['POST'])
def youtube_upload():
    try:
        body = request.get_json()
        video_id = body['videoId']
        video_url = body['videoUrl']
        title = body['title']
        description = body.get('description', '')
        privacy = body.get('privacy_status', 'private')

        if 'youtube_credentials' not in session:
            return send_response({'message': 'Not logged in'}, 401)
        credentials = session['youtube_credentials']
        if credentials['expires_in'] <= 0:
            return send_response({'message': 'Token expired'}, 401)
        logging.info("credentials checked")
        access_token = credentials['access_token']
        filename = 'tmp/' + video_id + '.mp4'
        try:
            file_res = requests.get(video_url)
            if file_res.status_code != 200:
                return 'Error while downloading file', file_res.status_code
            with open(filename, 'wb') as f:
                f.write(file_res.content)
        except Exception as e:
            logging.error(e)
        os.remove(filename)
        
        youtube = build('youtube', 'v3', developerKey=API_KEY)
        youtube_request = youtube.videos().insert(
            part="snippet,status",
            body={
            "snippet": {
                "categoryId": "22",
                "description": description,
                "title": title
            },
            "status": {
                "privacyStatus": privacy
            }
            },
            media_body=filename
        )
        request.headers['Authorization'] = f'Bearer {access_token}'
        response = youtube_request.execute()
        return response
    except Exception as e:
        logging.error(e)
        return send_response({ "message": f'Something went wrong', "error": str(e)}, 500)


def edit_video(user_id, request_id, video_id, title, trim, crop, auth_token, input_video_url, upload_url, new_video_id, country):
    try:
        request_init_time = time.time()
        video_cache_key = f'moments-editor-video-{video_id}'
        stream = ffmpeg.input(input_video_url)
        arg5_log = {
            "request_id": request_id,
            "edit_time": "",
            "upload_time": "",
            "total_time": ""
        }
        data_for_bq = {
            "arg1": user_id,
            "arg2": video_id,
            "arg3": new_video_id,
            "arg4": "failed",
            "country": country
        }

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
                stream = ffmpeg.filter(stream, 'setpts', 'PTS-STARTPTS')
                stream = ffmpeg.filter(stream, 'pad', 'ceil(iw/2)*2', 'ceil(ih/2)*2')
                stream = ffmpeg.output(stream, temp_file.name, loglevel="error")
                stream = ffmpeg.overwrite_output(stream)
                ffmpeg.run(stream)
                arg5_log["edit_time"] = time.time() - request_init_time
            except ffmpeg.Error as e:
                redis_client.set(video_cache_key, "failed", xx=True)
                data_for_bq["arg5"] = json.dumps(arg5_log)
                send_stat_to_bq(VIDEO_EDIT_PROCESSED, data_for_bq)
                logging.error(e.stderr)
                return send_response({ "message": f'Something went wrong while writing the video', "error": str(e)}, 500)
            except Exception as e:
                redis_client.set(video_cache_key, "failed", xx=True)
                data_for_bq["arg5"] = json.dumps(arg5_log)
                send_stat_to_bq(VIDEO_EDIT_PROCESSED, data_for_bq)
                logging.error(e)
                return send_response({ "message": f'Something went wrong while writing the video', "error": str(e)}, 500)
            logging.info("clip written to temp file")
            temp_file.seek(0)
            upload_res = upload_video(temp_file.name, title, upload_url)
            arg5_log["upload_time"] = time.time() - request_init_time - arg5_log["edit_time"]
            temp_file.close()
            del temp_file
        

        if upload_res.status_code != 200:
            redis_client.set(video_cache_key, "failed", xx=True)
            data_for_bq["arg5"] = json.dumps(arg5_log)
            send_stat_to_bq(VIDEO_EDIT_PROCESSED, data_for_bq)
            logging.error(f'error while uploading video: {upload_res.json()}')
            return send_response({ "message": "Something went wrong while uploading the video"}, upload_res.status_code)


        arg5_log["total_time"] = time.time() - request_init_time
        data_for_bq["arg4"] = "success"
        data_for_bq["arg5"] = json.dumps(arg5_log)
        send_stat_to_bq(VIDEO_EDIT_PROCESSED, data_for_bq)

        res_dict = {
            "message": "Video processed successfully"
        }

        redis_client.set(video_cache_key, "success", xx=True)

        logging.info(f'response to be sent: {res_dict}')
        return send_response(res_dict, 200)
    
    except Exception as e:
        redis_client.set(video_cache_key, "failed", xx=True)
        logging.error(e)
        return send_response({ "message": f'Something went wrong', "error": str(e)}, 500)


def pull_message_callback(message):
    logging.info('Received message on subscriber: {}'.format(message))
    try:
        message = json.loads(message)
        user_id = message["user_id"]
        request_id = message["request_id"]
        video_id = message["video_id"]
        title = message["title"]
        trim = message["trim"]
        crop = message["crop"]
        auth_token = message["auth_token"]
        video_url = message["video_url"]
        upload_url = message["upload_url"]
        new_video_id = message["new_video_id"]
        country = message["user_country"]
        with app.app_context():
            res = edit_video(user_id, request_id, video_id, title, trim, crop, auth_token, video_url, upload_url, new_video_id, country)
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
                    redis_client.set(message_cache_key, 1, nx=True)
                    subscriber.acknowledge(subscription=subscription_path, ack_ids=[received_message.ack_id])
                    pull_message_callback(message.data)
                time.sleep(1)
            else:
                time.sleep(15)
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
    url = f'{VIDEO_PORTAL_HOST}/createVideo'
    res = requests.post(url, headers=headers, json=create_video_body)
    return res


def delete_video(video_id, token):
    try:
        url = f'{VIDEO_PORTAL_HOST}/updateVideo'
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
        url = f'{VIDEO_PORTAL_HOST}/getVideoInfo?videoId={video_id}'
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