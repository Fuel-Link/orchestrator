import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { VehicleInfo } from 'src/vehicle-info/vehicle-info.entity';

@Entity()
export class GasPump {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
  public fuel: string;

  @Column()
  public stock: number;

  @Column()
  public capacity: number;

}