import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    @InjectRepository(Users)
    private readonly repository : Repository<Users>;

    
    async findAll() {
        return await this.repository.manager.query('Select * from "users"');
    }

    async save( user:{username:string, role:string, hash:string,pumpAuth:string}) {
        return await this.repository.save(user);
    }


    async remove(id:string) {
        return await this.repository.delete(id);
    }

    async findId(idSearched: number) {
        return await this.repository.find({
            loadRelationIds: true,
            where: { user_id: idSearched }
        });
    }
}
