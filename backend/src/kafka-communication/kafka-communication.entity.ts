import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
 export class KafkaCommunication {
 @PrimaryGeneratedColumn()
 id: number;
@Column()
 plate: string;
 @Column()
 authorization: string;
 }