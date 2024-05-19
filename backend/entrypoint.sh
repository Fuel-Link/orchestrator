#!/bin/bash

# Wait for kafka to be ready
cub kafka-ready -b kafka:29092 1 20

# Wait for all topics to be created
./check_topics.sh

# Execute your application
npm run start:dev
