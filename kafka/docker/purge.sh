#!/bin/sh
docker compose down

# Variables
baseKafkaStream="kafka-streams_base-application"
applicationsStream="plate-recognizer_stream"

# Remove kafka stream application image
docker image rm -f $baseKafkaStream:1.0

# Remove Plate Recognizer Kafka Streams application image
docker image rm -f $applicationsStream:1.0
