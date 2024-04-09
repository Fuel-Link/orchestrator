import { Module } from '@nestjs/common';
import { FuelMovementsController } from './fuel-movements.controller';
import { FuelMovementsService } from './fuel-movements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelMovements } from './fuel-movements.entity';
import { AppService } from 'src/app.service';

@Module({
  imports:[TypeOrmModule.forFeature([FuelMovements])],
  controllers: [FuelMovementsController],
  providers: [FuelMovementsService, AppService],
  exports: [FuelMovementsService]
})
export class FuelMovementsModule {}
