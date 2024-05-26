#!/bin/sh
docker compose down

# Variables
baseKafkaStream="kafka-streams_base-application"
applicationsStream="plate-recognizer_stream"
deploymentBridgeClient="deployment-bridge_client"
deploymentBridgeServer="deployment-bridge_server"

# Remove previous kafka stream application image
#docker image rm -f $baseKafkaStream:1.0

# Build and export the Kafka Streams application images
cd kafka-streams
docker build -t $baseKafkaStream:1.0 .
if [ $? -ne 0 ]; then
    echo "Error occurred while building the Kafka Streams $baseKafkaStream image"
    exit 1
fi

# Build and export the Plate Recognizer Kafka Streams application images
cd applications
#docker image rm -f $applicationsStream:1.0

docker build -t $applicationsStream:1.0 .
if [ $? -ne 0 ]; then
    echo "Error occurred while building the Kafka Streams $applicationsStream image"
    exit 1
fi

# Build and export the deployment bridge server image
cd ../../deployment_bridge_server
#docker image rm -f $deploymentBridgeServer:1.0

docker build -t $deploymentBridgeServer:1.0 .
if [ $? -ne 0 ]; then
    echo "Error occurred while building the deployment bridge server image"
    exit 1
fi

# Build and export the deployment bridge client image
cd ../deployment_bridge_client
#docker image rm -f $deploymentBridgeClient:1.0

docker build -t $deploymentBridgeClient:1.0 .
if [ $? -ne 0 ]; then
    echo "Error occurred while building the deployment bridge client image"
    exit 1
fi

# Start the docker-compose
cd ../
docker-compose up -d #--remove-orphans
