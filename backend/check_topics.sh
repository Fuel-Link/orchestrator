#!/bin/bash

set -e  # Exit on failure

# Replace with your desired topic names
topics=(
  hello-world 
  imageCaptured 
  plateRecognized 
  streams-plaintext-input 
  streams-wordcount-output 
  gas-pump_uplink
  gas-pump_downlink
)

# Function to check for all topics
check_topics() {
  for topic in "${topics[@]}"; do
    kafka-topics --list --bootstrap-server kafka:29092 | grep -q "^$topic$" || return 1  # Return 1 if any topic is missing
  done
  return 0  # Return 0 if all topics are found
}

# Keep checking until all topics are found
while ! check_topics; do
  echo "Error: Not all topics found. Waiting..."
  sleep 5  # Wait a few seconds before retrying
done

echo "All topics found. Kafka is ready!"
