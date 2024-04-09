import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';


@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  public user_id!: number;

  @Column({ type: 'varchar', length: 120 })
  public username: string;

  @Column({ type: 'varchar', length: 120 })
  public role: string;

  @Column({ type: 'varchar', length: 120 })
  public hash: string;

}