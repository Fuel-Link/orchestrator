import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GasPump } from './gas-pump.entity';
import { Repository } from 'typeorm';
import { kafkaConsumer } from 'src/kafka.config';

@Injectable()
export class GasPumpService {

    @InjectRepository(GasPump)
    private readonly repository: Repository<GasPump>;

    constructor() {
        //this.initializeKafkaConsumer();
    }

    async findAll() {
        return await this.repository.manager.query('Select * from "fuel_movements"');
    }

    async save(gasPump: { fuel: string, stock: number, capacity: number, thingId: string }) {
        return await this.repository.save(gasPump);
    }

    async remove(id: string) {
        return await this.repository.delete(id);
    }

    private async initializeKafkaConsumer() {
        await kafkaConsumer.connect();
        await kafkaConsumer.subscribe({ topic: 'gas-pump_uplink' });
        await kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    console.log(message);
                    const data = JSON.parse(message.value.toString());
                    const thingId = data.thingId;  
                    const stock = data.stock;
                    

                    const gasPump = await this.repository.findOne({ where: { thingId } });
                    
                    if (gasPump) {
                        gasPump.stock = stock;
                        await this.repository.save(gasPump);
                    } else {
                        console.error(`Gas pump with thingId ${thingId} not found`);
                    }
                } catch (error) {
                    console.error(`Error processing message: ${message.value.toString()}`, error);
                }
            },
        });
    }
}
