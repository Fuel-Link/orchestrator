
    import { Injectable, OnModuleInit } from '@nestjs/common';
    import { Users } from './users.entity';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { getusers } from './getusers';
    
    @Injectable()
    export class UsersService implements OnModuleInit {
        async onModuleInit() {
            //await this.syncUsersWithKeycloak();
        }
    
        @InjectRepository(Users)
        private readonly repository: Repository<Users>;
    
        async syncUsersWithKeycloak() {
            // Step 1: Fetch users from Keycloak
            const keycloakUsersResponse = await getusers();
            if (keycloakUsersResponse.status !== 'success') {
                throw new Error(`Failed to fetch users from Keycloak: ${keycloakUsersResponse.data}`);
            }
            const keycloakUsers = keycloakUsersResponse.data;
    
            // Step 2: Get users from the database
            const dbUsers = await this.repository.find();
            const dbUsernames = new Set(dbUsers.map(user => user.username));
    
            // Step 3: Compare and insert new users
            const newUsers = keycloakUsers.filter(user => !dbUsernames.has(user.username));
    
            for (const user of newUsers) {
                const newUser = new Users();
                newUser.username = user.username;
                newUser.role = user.roles[0];  // Assuming user.roles is an array and taking the first role
                newUser.hash = '';  // Assuming hash needs to be generated or provided separately
                newUser.pumpAuth = 'false';  // Assuming default pumpAuth is 'false'
                newUser.date = new Date().toISOString();
    
                await this.repository.save(newUser);
            }
    
            return { status: 'success', newUsersCount: newUsers.length };
        }
    
        async findAll() {
            return await this.repository.find();
        }
    
        async save(user: { username: string, role: string, hash: string, pumpAuth: string }) {
            return await this.repository.save(user);
        }
    
        async remove(id: string) {
            return await this.repository.delete(id);
        }
    
        async findId(idSearched: number) {
            return await this.repository.find({
                loadRelationIds: true,
                where: { user_id: idSearched }
            });
        }
    }
    
