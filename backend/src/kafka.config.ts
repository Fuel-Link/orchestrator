import { Kafka, logLevel } from 'kafkajs';
const kafka = new Kafka({
 clientId: 'hello-world',
 brokers:[ 
 "orchestrator-kafka-rest-api-1:8082",
 "orchestrator-kafka-rest-api-1:8082",
 "orchestrator-kafka-rest-api-1:8082",
], 
logLevel: logLevel.ERROR, 
});
export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'hello-world' });