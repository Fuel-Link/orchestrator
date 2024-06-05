import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { kafkaConsumer, kafkaProducer } from 'src/kafka.config';
import { KafkaCommunication } from './kafka-communication.entity';
import { Repository } from 'typeorm';
import { GasPump } from 'src/gas-pump/gas-pump.entity';
import { Users } from 'src/users/users.entity';
import { v4 as uuidv4 } from 'uuid'; 
import { FuelMovements } from 'src/fuel-movements/fuel-movements.entity';

@Injectable()
export class KafkaCommunicationService {

    constructor(
        @InjectRepository(KafkaCommunication)
        private readonly kafkaRepository: Repository<KafkaCommunication>,

        @InjectRepository(GasPump)
        private readonly repository: Repository<GasPump>,

        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,

        @InjectRepository(FuelMovements)
        private readonly fuelRepository: Repository<FuelMovements>


    ) {
        this.initializeKafkaConsumer();
    }

    async findAll(): Promise<KafkaCommunication[]> {
        return this.kafkaRepository.manager.query('Select * from "kafka_communication"');
    }
    
    async create(comm: KafkaCommunication): Promise<KafkaCommunication> {
        return this.kafkaRepository.save(comm);
    }

    private async initializeKafkaConsumer() {
        await kafkaConsumer.connect();
        await kafkaConsumer.subscribe({ topics: ['plateRecognized', 'gas-pump_uplink', 'gas-pump_auth'] });
        await kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                let messageValue = message.value.toString();
                console.log(`Message received from topic ${topic}:`, messageValue);
    
                messageValue = this.correctMessageFormat(messageValue);
    
                try {
                    const data = JSON.parse(messageValue);
                    //console.log("Parsed data:", data); 
    
                    switch (topic) {
                        case 'plateRecognized':
                            let results = data.results;
                            if (typeof results === 'string') {
                                results = JSON.parse(results);
                            }
                            console.log("Parsed results:", results);
                            for (const [index, result] of results.entries()) {
                                console.log("Processing result", index + 1, ":", result); 
                                const plate = result.plate;
                                const thingId = data.thingId;
                                console.log("Plate:", plate, "ThingId:", thingId); 
                                const newComm = new KafkaCommunication();
                                newComm.plate = plate.toUpperCase();
                                newComm.thingId = thingId;
                                await this.kafkaRepository.save(newComm);
                                //console.log("Saved:", newComm); 
                            }
                            break;
    
                        case 'gas-pump_uplink':
                            try {
                                const data = JSON.parse(message.value.toString());
                                const path = data.path;
                                const thingId = data.extra.thingId;
                        
                                // Handle pump_init
                                if (path === "/features/pump_init") {
                                    const stock = data.value.properties.stock.properties.value;
                                    console.log("ThingId:", thingId, "Stock:", stock);
                                    const gasPump = await this.repository.findOne({ where: { thingId } });
                                    if (gasPump) {
                                        gasPump.stock = stock;
                                        await this.repository.save(gasPump);
                                        console.log("Updated gas pump:", gasPump);
                                    } else {
                                        console.error(`Gas pump with thingId ${thingId} not found`);
                                    }
                                }
                                
                                // Handle supply_completed
                                else if (path === "/features/supply_completed") {
                                    const liters = data.value.properties.amount.properties.value;
                                    const lastKafkaComms = await this.kafkaRepository.find({
                                        order: { id: "DESC" },
                                        take: 1
                                    });
                                    // const lastKafkaComm = lastKafkaComms[0];
                                    // console.log("LAST KAFKA COMM"+lastKafkaComm);
                                    // if (!lastKafkaComm) {
                                    //     throw new Error("No previous Kafka communication found");
                                    // }
    
                                    const lastAuths = await this.userRepository.find({
                                        order: { user_id: "DESC" },
                                        take: 1
                                    });
                                    const lastAuth = lastAuths[0];
                                    if (!lastAuth) {
                                        throw new Error("No previous user authentication found");
                                    };
    
                                    // if (!lastKafkaComm) {
                                    //     throw new Error("No previous Kafka communication found");
                                    // }
                                    // const plate = lastKafkaComm.plate;
                                    // console.log("PLATEEEEE : " + plate);
                                    const user = await this.userRepository.findOne({
                                        where: { user_id: lastAuth.user_id }
                                    });
                                    if (!user) {
                                        throw new Error("User not found");
                                    }
                                    const gaspump = await this.repository.findOne({ where: { thingId } });
                                    if (!gaspump) {
                                        throw new Error(`Gas pump with thingId ${thingId} not found`);
                                    }
                                    
                                    const fuelMovement = new FuelMovements();
                                    fuelMovement.plate = (await this.findLastMovementPlate());
                                    fuelMovement.liters = liters;
                                    fuelMovement.gaspump_id = gaspump.gaspump_id;
                                    fuelMovement.user_id = user.user_id;
                                    fuelMovement.date = new Date().toISOString();
                        
                                    await this.fuelRepository.save(fuelMovement);
                                    console.log("Saved fuel movement:", fuelMovement);
                                }
                                
                                else {
                                    console.error(`Unknown path: ${path}`);
                                }
                            } catch (error) {
                                console.error(`Error processing message from topic ${topic}: ${message.value.toString()}`, error);
                            }
                            break;
                            
    
                        case 'gas-pump_auth':
                            try {
                                const { username, hash } = JSON.parse(message.value.toString());
                        
                                const user = await this.userRepository.findOne({ where: { hash } });
                        
                                const authorization = user ? 1 : 0;
                        
                                if (user) {
                                    // Update the user authorization and timestamp
                                    user.pumpAuth = authorization.toString();
                                    user.date = new Date().toISOString();
                                    await this.userRepository.save(user);
                                    console.log("Updated user authorization and timestamp:", user);
                                }
                        
                                const authMessage = {
                                    thingId: "org.eclipse.ditto:9b0ec976-3012-42d8-b9ea-89d8b208ca20",
                                    topic: "org.eclipse.ditto/9b0ec976-3012-42d8-b9ea-89d8b208ca20/things/twin/commands/modify",
                                    path: "/features/authorize_supply/properties/",
                                    messageId: "{{ uuid() }}",  
                                    timestamp: "{{ timestamp }}",
                                    source: "gas-pump",
                                    method: "update",
                                    target: "/features/authorize_supply",
                                    value: {
                                        msgType: 1,
                                        thingId: "org.eclipse.ditto:9b0ec976-3012-42d8-b9ea-89d8b208ca20",
                                        topic: "org.eclipse.ditto/9b0ec976-3012-42d8-b9ea-89d8b208ca20/things/twin/commands/modify",
                                        path: "/features/authorize_supply/properties/",
                                        authorization: authorization,
                                        timestamp: new Date().toISOString()
                                    }
                                };
                        
                                await this.send(JSON.stringify(authMessage));
                            } catch (error) {
                                console.error(`Error processing message from topic ${topic}: ${message.value.toString()}`, error);
                            }
                            break;
                        
                        default:
                            console.warn("Unhandled topic:", topic);
                            break;
                    }
                } catch (error) {
                    console.error(`Error processing message from topic ${topic}: ${messageValue}`, error);
    
                    if (error instanceof SyntaxError) {
                        console.error("SyntaxError: Invalid JSON format:", messageValue);
                    }
                }
            },
        });
    }
    
    correctMessageFormat(message: string) {
        return message
            .replace(/([{,])(\s*)(\w+)(\s*):/g, '$1"$3":')  
            .replace(/:\s*([^,"\s}]+)\s*([,}])/g, (match, p1, p2) => {
                return isNaN(p1) && p1 !== 'true' && p1 !== 'false' && p1 !== 'null' ? `: "${p1}"${p2}` : `: ${p1}${p2}`;
            })
            .replace(/:\s*([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\+[0-9]{4})/g, ': "$1"');  // Add quotes around timestamp
    }

    async findLastMovementPlate(): Promise<string | null> {
        try {
            // Ensure kafkaRepository is initialized
            if (!this.kafkaRepository) {
                console.error("kafkaRepository is not initialized.");
                throw new Error("kafkaRepository is not initialized.");
            }
    
            console.log("Attempting to fetch the last movement plate...");
    
            // Fetch the last movement along with its plate using a custom query
            const result = await this.kafkaRepository.manager.query(`
                SELECT kc.id, vi.plate
                FROM "kafka_communication" kc
                JOIN "vehicle_info" vi ON kc.plate = vi.plate
                ORDER BY kc.id DESC
                LIMIT 1
            `);
    
            // Log the result
            console.log("Query result:", result);
    
            // If no movement found, return null
            if (result.length === 0) {
                console.log("No movement found.");
                return null;
            }
    
            const lastMovement = result[0];
    
            // Log the ID and plate of the last movement
            console.log("Last movement ID:", lastMovement.id);
            console.log("Last movement plate:", lastMovement.plate);
    
            // Return the plate of the last movement
            return lastMovement.plate;
        } catch (error) {
            // Handle errors here
            console.error("Error occurred while fetching last movement plate:", error);
            throw error;
        }
    }
    
    

    async send(authorized: string): Promise<void> {
        await kafkaProducer.connect();
        await kafkaProducer.send({
            topic: 'gas-pump_downlink',
            messages: [{ value: authorized }],
        });
        await kafkaProducer.disconnect();
    }

    async delete(id: number): Promise<void> {
        const existingComm = await this.kafkaRepository.findOne({ where: { id } });
        if (!existingComm) {
            throw new NotFoundException(`KafkaCommunication with ID ${id} not found`);
        }
        await this.kafkaRepository.remove(existingComm);
    }
}
