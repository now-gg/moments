from google.cloud import pubsub_v1
from concurrent.futures import TimeoutError

project_id = "bs3-appcenter-engg"
topic_name = "moments-editor"
subscription_id = "moments-editor-sub"

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

