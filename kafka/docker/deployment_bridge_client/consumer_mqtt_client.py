import asyncio
import json
from kafka import KafkaConsumer, KafkaProducer
import paho.mqtt.client as mqtt

# Kafka configuration
KAFKA_BROKER = 'kafka:29092'
KAFKA_CONSUMER_TOPICS = ['gas-pump_uplink', 'plateRecognized']
KAFKA_PRODUCER_TOPIC = 'gas-pump_downlink'

# MQTT configuration
MQTT_BROKER = 'grupo1-egs-deti.ua.pt'
MQTT_CONSUMING_TOPIC = 'gas-pump_downlink'
MQTT_WEBSOCKET_PORT = 80
MQTT_URI = '/gas-pump-mqtt5'

# Initialize Kafka consumer
kafka_consumer = KafkaConsumer(
    *KAFKA_CONSUMER_TOPICS,
    bootstrap_servers=KAFKA_BROKER,
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

# Initialize Kafka producer
kafka_producer = KafkaProducer(bootstrap_servers=KAFKA_BROKER)

# MQTT client setup
mqtt_client = mqtt.Client(transport='websockets')

def on_connect(client, userdata, flags, rc):
    """Callback for when the client receives a CONNACK response from the server."""
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe(MQTT_CONSUMING_TOPIC)
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, obj, msg):
    """Callback for when a PUBLISH message is received from MQTT."""
    print(f"Received from MQTT: {msg.payload}")
    data = msg.payload.decode('utf-8')
    kafka_producer.send(KAFKA_PRODUCER_TOPIC, value=data.encode('utf-8'))
    print(f"Received from MQTT and sent to Kafka: {data}")

def on_publish(client, obj, mid):
    """Callback for when a PUBLISH message is sent to the MQTT broker."""
    print(f"Published message to MQTT with MID {mid}")

def start_mqtt_client():
    """Start the MQTT client."""
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.on_publish = on_publish
    mqtt_client.ws_set_options(path=MQTT_URI)
    mqtt_client.connect(MQTT_BROKER, MQTT_WEBSOCKET_PORT, 60)
    mqtt_client.loop_start()
    print("Started MQTT client successfully")

async def kafka_to_mqtt():
    """Consume messages from Kafka and publish to MQTT."""
    for message in kafka_consumer:
        print(f"Received from Kafka, in topic {message.topic}: {message.value}")
        data = message.value
        print(f"Received from Kafka, in topic {message.topic}: {data}")
        if message.topic == 'plateRecognized':
            mqtt_client.publish(message.topic, json.dumps(data))
        elif message.topic == 'gas-pump_uplink':
            if 'path' in data.keys() and (data["path"] == "/features/pump_init" or data["path"] == "/features/supply_completed"):
                print("Sending message to MQTT")
                # convert the dict to string to send to MQTT
                mqtt_client.publish(message.topic, json.dumps(data))
            else:
                print(f"Message not sent to MQTT, because isn't destined to the pump")

if __name__ == '__main__':
    # Start MQTT client
    start_mqtt_client()

    # Start Kafka to MQTT coroutine
    loop = asyncio.get_event_loop()
    loop.run_until_complete(kafka_to_mqtt())
    loop.run_forever()
