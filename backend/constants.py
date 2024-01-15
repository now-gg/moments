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

ENGG_REDIS_HOST = '10.216.98.51'
PROD_REDIS_HOST = '10.32.129.20'
REDIS_HOST = PROD_REDIS_HOST if is_prod else ENGG_REDIS_HOST
REDIS_PORT = 6379

ENGG_FE_HOST = 'https://stagingngg.net'
PROD_FE_HOST = 'https://now.gg'
FE_HOST = PROD_FE_HOST if is_prod else ENGG_FE_HOST

STAGING_ALLOWED_ORIGINS = [PROD_FE_HOST, ENGG_FE_HOST , 'http://localhost:5173']
PROD_ALLOWED_ORIGINS = ['https://now.gg']
ALLOWED_ORIGINS = PROD_ALLOWED_ORIGINS if is_prod else STAGING_ALLOWED_ORIGINS

APP_SECRET_KEY = '603aa269-6788-424c-b1ef-c1114346d4d5-e899991a-28a7-4ac3-8a7c-a501292933b0'