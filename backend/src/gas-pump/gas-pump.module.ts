import { Module } from '@nestjs/common';
import { GasPumpController } from './gas-pump.controller';
import { GasPumpService } from './gas-pump.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GasPump } from './gas-pump.entity';
import { AppService } from 'src/app.service';
@Module({
  imports:[TypeOrmModule.forFeature([GasPump])],
  controllers: [GasPumpController],
  providers: [GasPumpService, AppService],
  exports:[GasPumpService]
})
export class GasPumpModule {}
