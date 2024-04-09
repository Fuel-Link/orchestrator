import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelMovements } from './fuel-movements.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FuelMovementsService {

    @InjectRepository(FuelMovements)
    private readonly repository : Repository<FuelMovements>;

    
    async findAll() {
        return await this.repository.manager.query('Select * from "fuel_movements"');
    }

    async save( movement:{plate:string, liters:string, gaspump_id:number,user_id:number, date:string}) {
        return await this.repository.save(movement);
    }


    async remove(id:string) {
        return await this.repository.delete(id);
    }


}
