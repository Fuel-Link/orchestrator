import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { kafkaConsumer, kafkaProducer } from 'src/kafka.config';
import { KafkaCommunication } from './kafka-communication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KafkaCommunicationService {

    constructor(
        @InjectRepository(KafkaCommunication)
        private readonly kafkaRepository: Repository<KafkaCommunication>
    ) {
        this.initializeKafkaConsumer();
    }

    async findAll(): Promise<KafkaCommunication[]> {
        return this.kafkaRepository.manager.query('Select * from "kafka_communication"');
    }
    
    async create(comm: KafkaCommunication): Promise<KafkaCommunication> {
        return this.kafkaRepository.save(comm);
    }

    private async initializeKafkaConsumer() {
        await kafkaConsumer.connect();
        await kafkaConsumer.subscribe({ topic: 'plateRecognized' });
        await kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    const plate = data.results[0].plate;
                    const thingId = data.thingId;
                    const newComm = new KafkaCommunication();
                    newComm.plate = plate;
                    newComm.thingId = thingId;
                    await this.kafkaRepository.save(newComm);
                } catch (error) {
                    console.error(`Error parsing message: ${message.value.toString()}`, error);
                }
            },
        });
    }
    

    async send(authorized: string): Promise<void> {
        await kafkaProducer.connect();
        await kafkaProducer.send({
            topic: 'gas-pump_downlink',
            messages: [{ value: authorized }],
        });
        await kafkaProducer.disconnect();
    }

    async delete(id: number): Promise<void> {
        const existingComm = await this.kafkaRepository.findOne({ where: { id } });
        if (!existingComm) {
            throw new NotFoundException(`KafkaCommunication with ID ${id} not found`);
        }
        await this.kafkaRepository.remove(existingComm);
    }
}
