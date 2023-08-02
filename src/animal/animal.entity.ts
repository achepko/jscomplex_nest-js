import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  class: string;

  @Column({ type: 'boolean', default: true })
  type: boolean;

  @Column({ type: 'int', nullable: true })
  age: number;

  @OneToOne(() => User, (user) => user.animals)
  @JoinColumn()
  user: User;
}
