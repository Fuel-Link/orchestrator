# http_server_producer.py

import json
from flask import Flask, request, jsonify
from kafka import KafkaProducer

app = Flask(__name__)

# Configuration
kafka_topic = 'hello-world' #'plateRecognized'
kafka_bootstrap_servers = 'kafka:29092'

# Initialize Kafka Producer
producer = KafkaProducer(
    bootstrap_servers=kafka_bootstrap_servers,
    value_serializer=lambda m: json.dumps(m).encode('utf-8')
)

@app.route('/licensePlateAPI', methods=['POST'])
def receive_message():
    message = request.get_json()
    print(f"Received message via HTTP POST: {message}")

    try:
        producer.send(kafka_topic, message)
        producer.flush()
        return jsonify({'status': 'Message produced to Kafka'}), 200
    except Exception as e:
        print(f"Failed to produce message: {e}")
        return jsonify({'status': 'Error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
