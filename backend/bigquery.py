from google.cloud import bigquery
import logging
from datetime import datetime
from enum import Enum
from constants import BQ_DATASET_NAME, BQ_TABLE_NAME, GCP_PROJECT_ID

client = bigquery.Client(project=GCP_PROJECT_ID)

# Event Types
VIDEO_EDIT_REQUEST = "video_edit_request"
VIDEO_EDIT_PROCESSED =  "video_edit_processed"
VIDEO_DELETED =  "video_deleted"


def insert_data(data):
    try:
        dataset_ref = client.dataset(BQ_DATASET_NAME)
        table_ref = dataset_ref.table(BQ_TABLE_NAME)
        table = client.get_table(table_ref)
        errors = client.insert_rows(table, [data])
        if errors == []:
            logging.info("Data added to BQ")
        else:
            logging.info("Error while adding data to BQ: {}".format(errors))
    except Exception as e:
        logging.error(e)


def send_stat_to_bq(event, data):
    try:
        data["event_type"] = event
        data["created_at"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        insert_data(data)
    except Exception as e:
        logging.error(e)