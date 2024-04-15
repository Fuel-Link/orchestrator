
## Create the Maven project

```bash
mvn archetype:generate \
    -DarchetypeGroupId=org.apache.kafka \
    -DarchetypeArtifactId=streams-quickstart-java \
    -DarchetypeVersion=3.7.0 \
    -DgroupId=streams.applications \
    -DartifactId=kafka-streams\
    -Dversion=0.1 \
    -Dpackage=applications
```

## Compile

```bash
mvn clean package
```

## Run app

```bash
mnv exec:java -Dexec.mainClass=applications.<app_name>
```

## Compile container

```bash
docker build -t plate-recognizer_stream:1.0 --no-cache=true .
```

## Run container

```bash
docker run -it --user=root --network=kafka-network plate-recognizer_stream:1.0 /bin/bash
```

## Delete container

```bash
docker image rm -f plate-recognizer_stream:1.0
```

# WordCount Stream application

## Launch Consumer

```bash
docker run --rm --network=host confluentinc/cp-kafka:6.2.0 /bin/kafka-console-consumer --bootstrap-server localhost:9092  --topic streams-wordcount-output --from-beginning --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property print.value=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer
```

## Launch Producer

```bash
docker run -it --rm --network=host confluentinc/cp-kafka /bin/kafka-console-producer --bootstrap-server localhost:9092 --topic streams-plaintext-input
```