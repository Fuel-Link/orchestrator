import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class VehicleInfo {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 6 })
  public plate: string;

  @Column({ type: 'varchar', length: 120 })
  public fuel: string;

  @Column({ type: 'varchar', length: 120 })
  public type: string;

  @Column({ type: 'varchar', length: 120 })
  public model: string;

  @Column({ type: 'varchar', length: 120 })
  public brand: string;

  @Column({ type: 'varchar', length: 120 })
  public color: string;



}