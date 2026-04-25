import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity'; 

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  address: string;

  @Column({ type: 'int', default: 1 })
  bedrooms: number;

  @Column({ type: 'int', default: 1 })
  bathrooms: number;

  @Column('decimal')
  area: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  // 🔗 علاقة الربط: كل عقار له مستخدم واحد (صاحب العقار)
  @ManyToOne(() => User, (user) => user.properties)
  user: User;

  // 🔗 علاقة المفضلة: العقار الواحد يقدر يحفظه مستخدمين كتير
  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}