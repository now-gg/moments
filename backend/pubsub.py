from google.cloud import pubsub_v1
from concurrent.futures import TimeoutError
from constants import GCP_PROJECT_ID, PUBSUB_TOPIC_NAME, PUBSUB_SUBSCRIPTION_ID

project_id = GCP_PROJECT_ID
topic_name = PUBSUB_TOPIC_NAME
subscription_id = PUBSUB_SUBSCRIPTION_ID

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_name)

def publish_message(message):
    data = message.encode('utf-8')
    future = publisher.publish(topic_path, data=data)
    return future.result()


def get_subscriber():
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path(project_id, subscription_id)
    return subscriber, subscription_path

