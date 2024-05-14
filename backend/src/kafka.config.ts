import { Kafka, logLevel } from 'kafkajs';
const kafka = new Kafka({
 clientId: 'fuel-link',
 ssl: true,
 brokers: ["172.21.0.6:8082",
            "172.21.0.6:8082",
            "172.21.0.6:8082"
], 
 logLevel: logLevel.ERROR, 
});
export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'streams-wordcount-output' });