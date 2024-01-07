from flask import Flask, request, redirect, session, url_for
import requests
from googleapiclient.discovery import build
from urllib.request import urlretrieve, URLopener
import os

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

API_KEY = 'AIzaSyChUnDXV5XgAbBjq_-FmGixHqcGfsSNAgc'

@app.route('/')
def index():
    if 'access_token' in session:
        return session['access_token']
    return 'Hello World!'


@app.route('/oauth2callback/')
def oauth2callback():
    code = request.args.get('code')
    
    res = requests.post('https://oauth2.googleapis.com/token', params={
        'code': code,
        'client_id': '631912626478-do5ioe4vdv8pibdftq7416iia764fnth.apps.googleusercontent.com',
        'client_secret': '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',
        'redirect_uri': 'http://127.0.0.1:5000/oauth2callback',
        'grant_type': 'authorization_code'
    })
    if res.status_code != 200:
        return 'Error while fetching access token', 500
    print(res.json()['access_token'])
    session['access_token'] = res.json()['access_token']
    return redirect(url_for('index'))


@app.route('/upload')
def upload():
    if 'access_token' not in session:
        return redirect(url_for('index'))
    access_token = session['access_token']
    video_url = request.args.get('video_url')
    video_id = request.args.get('video_id')
    filename = 'tmp/' + video_id + '.mp4'
    try:
        file_res = requests.get(video_url)
        if file_res.status_code != 200:
            return 'Error while downloading file', 500
        with open(filename, 'wb') as f:
            f.write(file_res.content)
    except Exception as e:
        print(e)
    os.remove(filename)
    return 'Hello World!'
    
    youtube = build('youtube', 'v3', developerKey=API_KEY)
    request = youtube.videos().insert(
        part="snippet,status",
        body={
          "snippet": {
            "categoryId": "22",
            "description": "Description of uploaded video.",
            "title": "Test video upload FINALLY"
          },
          "status": {
            "privacyStatus": "private"
          }
        },
        media_body="static/video.mp4"
    )
    request.headers['Authorization'] = f'Bearer {access_token}'
    response = request.execute()
    return response