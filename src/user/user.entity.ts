import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Animal } from '../animal/animal.entity';
import { OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  userName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;
  @Column({ type: 'varchar', nullable: false, unique: true })
  email2: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToMany(() => Animal, (animal) => animal.user, { cascade: true })
  animals: Animal[];
}
