import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleInfo } from './vehicle-info.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleInfoService {
    @InjectRepository(VehicleInfo)
    private readonly repository: Repository<VehicleInfo>;

    async findAll() {
        return await this.repository.manager.query('Select * from "vehicle_info"');
    }

    async save(vehicle:{plate:string, fuel:string, type:string,model:string,brand:string, color:string}) {
        return await this.repository.save(vehicle);
    }

    async remove(id:string) {
        return await this.repository.delete(id);
    }

}
