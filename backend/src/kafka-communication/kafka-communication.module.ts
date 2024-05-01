import { Module } from '@nestjs/common';
import { KafkaCommunicationController } from './kafka-communication.controller';
import { KafkaCommunicationService } from './kafka-communication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaCommunication } from './kafka-communication.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([KafkaCommunication])],
  controllers: [KafkaCommunicationController],
  providers: [KafkaCommunicationService, AppService],
  exports: [KafkaCommunicationService]
})
export class KafkaCommunicationModule {}
