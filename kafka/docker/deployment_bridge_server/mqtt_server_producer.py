import asyncio
import json
from kafka import KafkaConsumer, KafkaProducer
import paho.mqtt.client as mqtt

# Kafka configuration
KAFKA_BROKER = 'kafka:29092'
KAFKA_CONSUMER_TOPIC = 'gas-pump_downlink'
KAFKA_PRODUCER_TOPICS = {
    'gas-pump_uplink': 'gas-pump_uplink',
    'plateRecognized': 'plateRecognized'
}

# MQTT configuration
MQTT_BROKER = 'gas-pump-mqtt5-mqtt'
MQTT_CONSUMING_TOPICS = ['gas-pump_uplink', 'plateRecognized']
MQTT_PORT = 1883

# Initialize Kafka consumer
kafka_consumer = KafkaConsumer(
    KAFKA_CONSUMER_TOPIC,
    bootstrap_servers=KAFKA_BROKER,
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

# Initialize Kafka producer
kafka_producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Initialize MQTT client
mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

def on_connect(client, userdata, flags, rc, properties):
    """Callback for when the client receives a CONNACK response from the server."""
    if rc == 0:
        print("Connected to MQTT broker")
        for topic in MQTT_CONSUMING_TOPICS:
            client.subscribe(topic)
            print(f"Subscribed to {topic}")
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    """Callback for when a PUBLISH message is received from MQTT."""
    data = msg.payload.decode('utf-8')
    print(f"Received from MQTT topic {msg.topic}: {data}")
    data = json.loads(data)
    kafka_producer.send(KAFKA_PRODUCER_TOPICS[msg.topic], value=data)
    print(f"Sent to Kafka topic {KAFKA_PRODUCER_TOPICS[msg.topic]}: {data}")

def start_mqtt_client():
    """Start the MQTT client."""
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_start()
    print("Started MQTT client successfully")

async def kafka_to_mqtt():
    """Consume messages from Kafka and publish to MQTT."""
    for message in kafka_consumer:
        data = message.value
        print(f"Received from Kafka topic {message.topic}: {data}")
        mqtt_client.publish('gas-pump_downlink', json.dumps(data))


if __name__ == '__main__':
    # Start MQTT client
    start_mqtt_client()

    # Start Kafka to MQTT coroutine
    loop = asyncio.get_event_loop()
    loop.run_until_complete(kafka_to_mqtt())
    loop.run_forever()
