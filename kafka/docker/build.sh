# Remove previous kafka stream application image
#docker image rm -f plate-recognizer_stream:1.0

# Build and export the Kafka Streams application images
cd kafka-streams
docker build -t plate-recognizer_stream:1.0 --no-cache=true .
if [ $? -ne 0 ]; then
    echo "Error occurred while building the Kafka Streams application image"
    exit 1
fi


# Start the docker-compose
#cd ..
#docker-compose up 
