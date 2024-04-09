import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GasPump } from './gas-pump.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GasPumpService {
    
    @InjectRepository(GasPump)
    private readonly repository : Repository<GasPump>;

    
    async findAll() {
        return await this.repository.manager.query('Select * from "fuel_movements"');
    }

    async save( gasPump:{fuel:string, stock:number, capacity:number}) {
        return await this.repository.save(gasPump);
    }


    async remove(id:string) {
        return await this.repository.delete(id);
    }


}
