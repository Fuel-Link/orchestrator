import json
from kafka import KafkaConsumer
import requests

# Configuration
kafka_topic = 'plateRecognized'
kafka_bootstrap_servers = 'kafka:29092'
#http_endpoint = 'http://bridge-server:8000/licensePlateAPI'
http_endpoint = 'http://grupo1-egs-deti.ua.pt:80/licensePlateAPI/licensePlateAPI'

# Initialize Kafka Consumer
consumer = KafkaConsumer(
    kafka_topic,
    bootstrap_servers=kafka_bootstrap_servers,
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

print("Listening for messages...")

for message in consumer:
    print(f"Received message: {message.value}")
    try:
        response = requests.post(http_endpoint, json=message.value)
        response.raise_for_status()
        print(f"Message sent to remote server: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to send message: {e}")
