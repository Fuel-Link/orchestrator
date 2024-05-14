# Kafka Orchestrator

In the Fuelink system, Kafka acts as an Orchestrator, providing easy communication between the Composer environment and the remainig components located at the Pump (Gas pump and License-Plate Reader). To configure Kafka properly with it's services, we opted to use Docker as to make our implementation platform-agnostic.

Please check the `docker` directory for indication on how to operate kafka.

# References

* https://medium.com/@Wajahat_Hussain_/a-comprehensive-guide-to-getting-started-with-apache-kafka-using-docker-61cc27e1ffb0
* https://www.youtube.com/watch?v=uvb00oaa3k8
* https://kafka.apache.org/37/documentation/streams/tutorial
* https://github.com/wurstmeister/kafka-docker/wiki/Connectivity
* https://stackoverflow.com/questions/72435550/confluent-cloud-add-basic-auth-to-kafka-rest-proxy-docker-container
* https://github.com/confluentinc/kafka-rest?tab=readme-ov-file
* https://docs.confluent.io/platform/current/kafka-rest/index.html