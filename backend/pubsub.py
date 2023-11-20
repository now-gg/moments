from google.cloud import pubsub_v1
import google.cloud.logging
import logging
from concurrent.futures import TimeoutError

# Instantiates a logging client
client = google.cloud.logging.Client()
client.setup_logging()

project_id = "bs3-appcenter-engg"
topic_name = "moments-editor"
subscription_id = "moments-editor-sub"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_name)

subscriber = pubsub_v1.SubscriberClient()
subscription_path = subscriber.subscription_path(project_id, subscription_id)

def publish_message(message):
    try:
        data = message.encode('utf-8')
        future = publisher.publish(topic_path, data=data)
        return future.result()
    except Exception as e:
        logging.error(e)


def receive_messages():
    try:
        def callback(message):
            logging.info('Received message on subscriber: {}'.format(message))
            message.ack()

        streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)
        logging.info('Listening for messages on {}'.format(subscription_path))

        with subscriber:
            try:
                streaming_pull_future.result(timeout=5)
            except TimeoutError:
                streaming_pull_future.cancel()
                streaming_pull_future.result()
    except Exception as e:
        logging.error(e)
