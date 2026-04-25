import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'agent', 'client'], default: 'client' })
  role: string;

  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  // 🔗 علاقة المفضلة: مستخدمين كتير بيحبوا عقارات كتير
  @ManyToMany(() => Property)
  @JoinTable({ name: 'user_favorites' }) // اسم الجدول الوسيط اللي هيتكريه في الداتا بيز
  favorites: Property[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}