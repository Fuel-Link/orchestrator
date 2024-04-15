# Remove previous kafka stream application image
docker image rm -f plate-recognizer_stream:1.0

# Build and export the Kafka Streams application images
cd kafka-streams
docker build -t plate-recognizer_stream:1.0 --no-cache=true .

# Start the docker-compose
cd ..
docker-compose up 
