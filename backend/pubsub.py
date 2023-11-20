from google.cloud import pubsub_v1

project_id = "bs3-appcenter-engg"
topic_name = "moments-editor"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, topic_name)

def publish_message(message):
    data = message.encode('utf-8')
    future = publisher.publish(topic_path, data=data)
    return future.result()