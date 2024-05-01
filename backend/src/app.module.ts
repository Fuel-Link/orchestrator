import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleInfoModule } from './vehicle-info/vehicle-info.module';
import { FuelMovementsModule } from './fuel-movements/fuel-movements.module';
import { GasPumpModule } from './gas-pump/gas-pump.module';
import { UsersModule } from './users/users.module';
import { KafkaCommunicationModule } from './kafka-communication/kafka-communication.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    VehicleInfoModule,
    FuelMovementsModule,
    GasPumpModule,
    UsersModule,
    KafkaCommunicationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
