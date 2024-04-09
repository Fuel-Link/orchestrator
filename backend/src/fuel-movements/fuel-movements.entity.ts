import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { VehicleInfo } from 'src/vehicle-info/vehicle-info.entity';
import { GasPump } from 'src/gas-pump/gas-pump.entity';
import { Users } from 'src/users/users.entity';

@Entity()
export class FuelMovements {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(()=>VehicleInfo)
  @JoinColumn({name: 'plate'})
  public plate: number;

  @Column({ type: 'varchar', length: 120 })
  public liters: string;

  @ManyToOne(()=>GasPump)
  @JoinColumn({name: 'gaspump_id'})
  public gaspump_id: number;

  @ManyToOne(()=>Users)
  @JoinColumn({name: 'user_id'})
  public user_id: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  public date: string;

}