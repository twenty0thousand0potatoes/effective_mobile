import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('users') 
@Index('idx_users_has_problem', ['problem']) 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column({ default: false, name: 'problem' }) 
  problem: boolean;
}
