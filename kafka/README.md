# Kafka

Bootstrap server is handled by Zookeper in port 22181.

* Attention, need to include volumes in order to have data persistence

## Terminal

### Launch kafka in docker

* Only in development environment, before starting, execute the command:
```bash
docker network create kafka-network
```

```bash
cd docker
docker compose up -d
```

Kadrop Web Ui management tool can be acessed in `localhost:9007`

### Stop Kafka in docker

```bash
docker compose down
```



### Create a topic

```bash
# In production environment
docker run -it --rm confluentinc/cp-kafka /bin/kafka-topics --create --topic <TOPIC> --bootstrap-server <HOST_IP_ADDRESS>:29092

# In development environment
docker run -it --rm --network=host confluentinc/cp-kafka /bin/kafka-topics --create --topic hello-world --bootstrap-server localhost:9092
```

![kafka possible commands](image.png)

### Launch a consumer in a docker environment

```bash
# In production environment
docker run -it --rm confluentinc/cp-kafka /bin/kafka-console-consumer --bootstrap-server <HOST_IP_ADDRESS>:29092 --topic <TOPIC>

# In development environment
docker run --rm --network=host confluentinc/cp-kafka:6.2.0 kafka-console-consumer --bootstrap-server localhost:9092 --topic hello-world
```

* Flag `--from-beginning` can be used to obtain all messages sent to the system


### Launch a producer in a docker environment
```bash
# In production environment
docker run -it --rm confluentinc/cp-kafka /bin/kafka-console-producer --bootstrap-server <HOST_IP_ADDRESS>:29092 --topic <TOPIC>

# In development environment
docker run -it --rm --network=host confluentinc/cp-kafka /bin/kafka-console-producer --bootstrap-server localhost:9092 --topic hello-world
```

### Launch the Kafka cluster monitoring tool

* Attention, probably make a composer for this

```bash
docker run -it -p 9080:8080 -e DYNAMIC_CONFIG_ENABLED=true provectuslabs/kafka-ui
```

After, the Web Ui can be acessed at `localhost:9080`

## References

* https://medium.com/@Wajahat_Hussain_/a-comprehensive-guide-to-getting-started-with-apache-kafka-using-docker-61cc27e1ffb0
* https://www.youtube.com/watch?v=uvb00oaa3k8
* https://kafka.apache.org/37/documentation/streams/tutorial