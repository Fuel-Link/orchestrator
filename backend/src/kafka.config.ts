import { Kafka, logLevel } from 'kafkajs';
const kafka = new Kafka({
 clientId: 'hello-world',
 brokers:[ 
    "kafka:29092",
    "kafka:29092"

], 
logLevel: logLevel.ERROR, 
});
export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'hello-world' });