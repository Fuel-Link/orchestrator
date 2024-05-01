import { Controller, Get, Post, Body } from '@nestjs/common';
import { KafkaCommunicationService } from './kafka-communication.service';
import { KafkaCommunication } from './kafka-communication.entity';

@Controller('kafka-communication')
export class KafkaCommunicationController {
    constructor(private readonly kafkaService: KafkaCommunicationService) {}

    @Get()
    async findAll(): Promise<KafkaCommunication[]> {
        return this.kafkaService.findAll();
    }

    @Post()
    async create(@Body() comm: KafkaCommunication): Promise<KafkaCommunication> {
        return this.kafkaService.create(comm);
    }
}
