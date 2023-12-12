import os

is_prod = os.environ.get('ENVIRONMENT') == 'prod'

PROD_VIDEO_PORTAL_HOST = 'https://now.gg/6/api/vid/v1'
STAGING_VIDEO_PORTAL_HOST = 'https://stagingngg.net/6/api/vid/v1'
VIDEO_PORTAL_HOST = PROD_VIDEO_PORTAL_HOST if is_prod else STAGING_VIDEO_PORTAL_HOST

PROD_GCP_PROJECT_ID = 'bluestacks-cloudv2'
STAGING_GCP_PROJECT_ID = 'bs3-appcenter-engg'
GCP_PROJECT_ID = PROD_GCP_PROJECT_ID if is_prod else STAGING_GCP_PROJECT_ID

PUBSUB_TOPIC_NAME = 'moments-editor'
PUBSUB_SUBSCRIPTION_ID = 'moments-editor-sub'

BQ_DATASET_NAME = 'BS5WWStats'
BQ_TABLE_NAME = 'MomentsStats'