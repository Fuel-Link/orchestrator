import { Kafka, logLevel } from 'kafkajs';
const kafka = new Kafka({
 clientId: 'my-nest-app',
 brokers: ['localhost:9092'], 
 logLevel: logLevel.ERROR, 
});
export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'my-group' });