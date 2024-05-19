import { VehicleInfo } from 'src/vehicle-info/vehicle-info.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
@Entity()
 export class KafkaCommunication {
 @PrimaryGeneratedColumn()
 id: number;

 @ManyToOne(()=> VehicleInfo)
 @JoinColumn({name: 'plate'})
 plate: string;
 
 @Column()
 thingId: string;
 }