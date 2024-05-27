import json
from flask import Flask, request, jsonify
from kafka import KafkaProducer

app = Flask(__name__)

# Configuration
#kafka_topic = 'hello-world'
kafka_topic = 'plateRecognized'
kafka_bootstrap_servers = 'kafka:29092'

# Initialize Kafka Producer
producer = KafkaProducer(
    bootstrap_servers=kafka_bootstrap_servers,
    value_serializer=lambda m: json.dumps(m).encode('utf-8')
)

@app.route('/licensePlateAPI', methods=['POST'])
@app.route('/licensePlateAPI/', methods=['POST'])
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

@app.route('/hello', methods=['GET'])
def hello_world():
    print("Received request on /hello endpoint")
    return "Hello, World!", 200

if __name__ == '__main__':
    print("Starting HTTP server...")
    print(f"Kafka topic: {kafka_topic}")
    print(f"Kafka bootstrap servers: {kafka_bootstrap_servers}")
    app.run(host='0.0.0.0', port=8000)
    print("HTTP server stopped.")
