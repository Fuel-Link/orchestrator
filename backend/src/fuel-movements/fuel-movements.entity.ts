import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { VehicleInfo } from 'src/vehicle-info/vehicle-info.entity';
import { GasPump } from 'src/gas-pump/gas-pump.entity';
@Entity()
export class FuelMovements {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(()=>VehicleInfo)
  @JoinColumn({name: 'plate'})
  public plate: string;

  @Column({ type: 'varchar', length: 120 })
  public liters: string;

  @ManyToOne(()=>GasPump)
  @JoinColumn({name: 'id'})
  public gaspump_id: number;

  @Column()
  public user_id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  public date: string;

}