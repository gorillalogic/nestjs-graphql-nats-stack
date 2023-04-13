import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar', { length: 30 })
  firstName: string;

  @Column('varchar', { length: 30 })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
