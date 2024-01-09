from google.cloud import secretmanager
from constants import GCP_PROJECT_ID

def get_secret(secret_id, version_id="latest"):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{GCP_PROJECT_ID}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")


CLOUDFLARE_ACCOUNT_ID = get_secret("NG_CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = get_secret("NG_CLOUDFLARE_API_TOKEN")
YOUTUBE_API_KEY = get_secret("MOMENTS_YOUTUBE_KEY")
OAUTH_CLIENT_ID = get_secret("MOMENTS_YOUTUBE_OAUTH_ID")
OAUTH_CLIENT_SECRET = get_secret("MOMENTS_YOUTUBE_OAUTH_SECRET")
OAUTH_CLIENT_ID_HOST = f'{OAUTH_CLIENT_ID}.apps.googleusercontent.com'