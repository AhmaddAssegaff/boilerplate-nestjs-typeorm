import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
  role: 'USER' | 'ADMIN';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
