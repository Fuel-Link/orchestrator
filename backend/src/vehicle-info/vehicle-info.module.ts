import { Module } from '@nestjs/common';
import { VehicleInfoController } from './vehicle-info.controller';
import { VehicleInfoService } from './vehicle-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleInfo } from './vehicle-info.entity';
import { AppService } from 'src/app.service';

@Module({
  imports:[TypeOrmModule.forFeature([VehicleInfo])],
  controllers: [VehicleInfoController],
  providers: [VehicleInfoService, AppService],
  exports:[VehicleInfoService]
})
export class VehicleInfoModule {}
