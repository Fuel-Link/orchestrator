# Stop and remove running docker-compose containers
docker-compose down

# Variables
$baseKafkaStream="kafka-streams_base-application"
$applicationsStream="plate-recognizer_stream"

# Remove previous kafka stream application image
# docker image rm -f "$baseKafkaStream:1.0"
# docker image rm -f "$applicationsStream:1.0"

# Build and export the Kafka Streams application images
cd "kafka-streams"
docker build -t "$baseKafkaStream:1.0" . | Write-Output
if ($?) {
    Write-Host "Error occurred while building the Kafka Streams $baseKafkaStream image"
    exit 1
}

# Build and export the Plate Recognizer Kafka Streams application images
cd "..\applications"
docker build -t "$applicationsStream:1.0" . | Write-Output
if ($?) {
    Write-Host "Error occurred while building the Kafka Streams $applicationsStream image"
    exit 1
}

# Start the docker-compose
cd "..\.."
docker-compose up #--remove-orphans
