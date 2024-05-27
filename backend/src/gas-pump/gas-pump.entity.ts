import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { VehicleInfo } from 'src/vehicle-info/vehicle-info.entity';

@Entity()
export class GasPump {
  @PrimaryGeneratedColumn()
  public gaspump_id!: number;

  @Column({ type: 'varchar', length: 120 })
  public fuel: string;

  @Column()
  public stock: number;

  @Column({unique:true})
  public thingId: string;

  @Column()
  public capacity: number;

}