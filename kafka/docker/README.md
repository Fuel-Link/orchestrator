
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

### Example Payload

```json
{"topic":"org.eclipse.ditto/c5ae6b75-3da1-4cd3-b0c5-ff22fa509233/things/twin/events/modified","headers":{"mqtt.retain":"false","mqtt.topic":"plate-reader/org.eclipse.ditto:c5ae6b75-3da1-4cd3-b0c5-ff22fa509233/uplink","mqtt.qos":"0","ditto-originator":"nginx:ditto","response-required":false,"version":2,"requested-acks":[],"content-type":"application/json","correlation-id":"ed3fff1b-3fff-4342-ada5-cfe89eaecfb4"},"path":"/features","value":{"imageCaptured":{"properties":{"timestamp":{"value":"2024-04-10T23:47:15+0100"},"imageId":{"properties":{"value":85635070}},"url":{"properties":{"value":"http://192.168.60.221:80/images?id=85635070"}}}}},"extra":{"thingId":"org.eclipse.ditto:c5ae6b75-3da1-4cd3-b0c5-ff22fa509233","features":{"imageCaptured":{"properties":{"timestamp":{"value":"2024-04-10T23:47:15+0100"},"imageId":{"properties":{"value":85635070}},"url":{"properties":{"value":"http://192.168.60.221:80/images?id=85635070"}}}}}},"revision":1878,"timestamp":"2024-04-10T22:47:15.648650832Z"}
```

## Launch Producer

```bash
docker run -it --rm --network=host confluentinc/cp-kafka /bin/kafka-console-producer --bootstrap-server localhost:9092 --topic streams-plaintext-input

docker run -it --rm --network=host confluentinc/cp-kafka /bin/kafka-console-producer --bootstrap-server localhost:9092 --topic imageCaptured
```

# PlateRecognizer Stream application

## Launch Consumer

```bash
docker run --rm --network=host confluentinc/cp-kafka:6.2.0 /bin/kafka-console-consumer --bootstrap-server localhost:9092 --topic plateRecognized --from-beginning --property print.value=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.StringDeserializer
```

### Example Payload

```json
{"topic":"org.eclipse.ditto/c5ae6b75-3da1-4cd3-b0c5-ff22fa509233/things/twin/events/modified","headers":{"mqtt.retain":"false","mqtt.topic":"plate-reader/org.eclipse.ditto:c5ae6b75-3da1-4cd3-b0c5-ff22fa509233/uplink","mqtt.qos":"0","ditto-originator":"nginx:ditto","response-required":false,"version":2,"requested-acks":[],"content-type":"application/json","correlation-id":"ed3fff1b-3fff-4342-ada5-cfe89eaecfb4"},"path":"/features","value":{"imageCaptured":{"properties":{"timestamp":{"value":"2024-04-10T23:47:15+0100"},"imageId":{"properties":{"value":85635070}},"url":{"properties":{"value":"http://192.168.60.221:80/images?id=85635070"}}}}},"extra":{"thingId":"org.eclipse.ditto:c5ae6b75-3da1-4cd3-b0c5-ff22fa509233","features":{"imageCaptured":{"properties":{"timestamp":{"value":"2024-04-10T23:47:15+0100"},"imageId":{"properties":{"value":85635070}},"url":{"properties":{"value":"http://192.168.60.221:80/images?id=85635070"}}}}}},"revision":1878,"timestamp":"2024-04-10T22:47:15.648650832Z"}
```

## Launch Producer

```bash
docker run -it --rm --network=host confluentinc/cp-kafka /bin/kafka-console-producer --bootstrap-server localhost:9092 --topic imageCaptured
```