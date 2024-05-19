import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { kafkaConsumer, kafkaProducer } from 'src/kafka.config';
import { KafkaCommunication } from './kafka-communication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KafkaCommunicationService {

    // Recebe as mensagens enviadas ao topico
    constructor(
        @InjectRepository(KafkaCommunication)
        private readonly kafkaRepository: Repository<KafkaCommunication>
    ) {
        this.initializeKafkaConsumer();
    }

    async findAll(): Promise<KafkaCommunication[]> {
        return this.kafkaRepository.find();
    }
    
    async create(comm: KafkaCommunication): Promise<KafkaCommunication> {
        return this.kafkaRepository.save(comm);
    }

    private async initializeKafkaConsumer() {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: 'plateRecognized' });
    await kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
    // Handle incoming Kafka messages here
    console.log(`Received message: ${message.value}`);
    },
    });
    }

    // Producer => Envia Authorized
    async send(authorized: string): Promise<void> {
        await kafkaProducer.connect();
        await kafkaProducer.send({
        topic: 'gas-pump_downlink',
        messages: [{ value: authorized }],
        });
        await kafkaProducer.disconnect();
    }


}
