import { Module } from '@nestjs/common';
import { KafkaCommunicationController } from './kafka-communication.controller';
import { KafkaCommunicationService } from './kafka-communication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaCommunication } from './kafka-communication.entity';
import { AppService } from 'src/app.service';
import { GasPump } from 'src/gas-pump/gas-pump.entity';
import { Users } from 'src/users/users.entity';
import { FuelMovements } from 'src/fuel-movements/fuel-movements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KafkaCommunication, GasPump, Users, FuelMovements])],
  controllers: [KafkaCommunicationController],
  providers: [KafkaCommunicationService, AppService],
  exports: [KafkaCommunicationService]
})
export class KafkaCommunicationModule {}
