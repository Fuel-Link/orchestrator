#!/bin/sh
docker compose down

# Variables
baseKafkaStream="kafka-streams_base-application"
applicationsStream="plate-recognizer_stream"

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

# Start the docker-compose
cd ../../
docker-compose up --remove-orphans
