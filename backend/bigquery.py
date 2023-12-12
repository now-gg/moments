from google.cloud import bigquery
import logging
from datetime import datetime
from enum import Enum
from constants import BLUESTACKS_CLOUD_HOST
import requests

# Event Types
VIDEO_EDIT_REQUEST = "video_edit_request"
VIDEO_EDIT_PROCESSED =  "video_edit_processed"
VIDEO_DELETED =  "video_deleted"


def send_stat_to_bq(event, data):
    try:
        stats_url = f'{BLUESTACKS_CLOUD_HOST}/app_player/miscellaneousstats'
        form_data = {
            "event_type": event,
            "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "tag": "moments",
            "arg1": data.get("arg1", ""),
            "arg2": data.get("arg2", ""),
            "arg3": data.get("arg3", ""),
            "arg4": data.get("arg4", ""),
            "arg5": data.get("arg5", ""),
        }
        res = requests.post(stats_url, data=form_data)
        if res.status_code == 200:
            logging.info("Stats sent to BQ")
        else:
            logging.error("Error while sending stats to BQ: {}".format(res.text))
    except Exception as e:
        logging.error(e)