
    import { Injectable, OnModuleInit } from '@nestjs/common';
    import { Users } from './users.entity';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import axios from 'axios';
    
    @Injectable()
    export class UsersService implements OnModuleInit {
        async onModuleInit() {
          await this.syncUsersWithKeycloak();
        }
    
        @InjectRepository(Users)
        private readonly repository: Repository<Users>;
    
        async syncUsersWithKeycloak() {
            try {
                // Step 1: Fetch users from Keycloak
                const keycloakUsersResponse = await axios.get('http://auth-getusers:3000/getusers');
                if (keycloakUsersResponse.status !== 200) {
                    throw new Error(`Failed to fetch users from Keycloak: ${keycloakUsersResponse.data}`);
                }
                
                let keycloakUsers = keycloakUsersResponse.data;
                
                // Ensure keycloakUsers is an array
                if (!Array.isArray(keycloakUsers)) {
                    // Handle non-array response (if needed)
                    throw new Error(`Invalid response: keycloakUsers is not an array`);
                }
                
                // Step 2: Get users from the database
                const dbUsers = await this.repository.find();
                const dbUsernames = new Set(dbUsers.map(user => user.username));
        
                // Step 3: Compare and insert new users
                const newUsers = keycloakUsers.filter(user => !dbUsernames.has(user.username));
        
                for (const user of newUsers) {
                    const newUser = {
                        username: user.username,
                        role: user.roles ? user.roles[0] : '',  // Assuming user.roles is an array and taking the first role
                        hash: '',  // Assuming hash needs to be generated or provided separately
                        pumpAuth: 'false',  // Assuming default pumpAuth is 'false'
                        date: new Date().toISOString(),
                    };
        
                    // Use the existing save method to save the new user
                    await this.save(newUser);
                }
        
                return { status: 'success', newUsersCount: newUsers.length };
            } catch (error) {
                throw new Error(`Error during syncUsersWithKeycloak: ${error.message}`);
            }
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
    
