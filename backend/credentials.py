from google.cloud import secretmanager

def get_secret(secret_id, version_id="latest"):
    PROJECT_ID = "bs3-appcenter-engg"
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{PROJECT_ID}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")


CLOUDFLARE_ACCOUNT_ID = get_secret("NG_CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = get_secret("NG_CLOUDFLARE_API_TOKEN")