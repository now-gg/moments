from google.cloud import pubsub_v1
import google.cloud.logging
import logging

# Instantiates a client
client = google.cloud.logging.Client()
client.setup_logging()

project_id = "bs3-appcenter-engg"
topic_name = "moments-editor"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_name)

def publish_message(message):
    try:
        data = message.encode('utf-8')
        future = publisher.publish(topic_path, data=data)
        return future.result()
    except Exception as e:
        logging.error(e)
