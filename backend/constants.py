import os

is_prod = os.environ.get('ENVIRONMENT') == 'prod'

PROD_VIDEO_PORTAL_HOST = 'https://now.gg/6/api/vid/v1'
STAGING_VIDEO_PORTAL_HOST = 'https://stagingngg.net/6/api/vid/v1'
VIDEO_PORTAL_HOST = PROD_VIDEO_PORTAL_HOST if is_prod else STAGING_VIDEO_PORTAL_HOST

PROD_GCP_PROJECT_ID = 'bluestacks-cloudv2'
ENGG_GCP_PROJECT_ID = 'bs3-appcenter-engg'
GCP_PROJECT_ID = PROD_GCP_PROJECT_ID if is_prod else ENGG_GCP_PROJECT_ID

PUBSUB_TOPIC_NAME = 'moments-editor'
PUBSUB_SUBSCRIPTION_ID = 'moments-editor-sub'

BQ_DATASET_NAME = 'BS5WWStats'
BQ_TABLE_NAME = 'MomentsStats'

PROD_BLUESTACKS_CLOUD_HOST = 'https://cloud.bluestacks.com'
ENGG_BLUESTACKS_CLOUD_HOST = 'https://bs3-cloud-engg.bstkinternal.net'
BLUESTACKS_CLOUD_HOST = PROD_BLUESTACKS_CLOUD_HOST if is_prod else ENGG_BLUESTACKS_CLOUD_HOST