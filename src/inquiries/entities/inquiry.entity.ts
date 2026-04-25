import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 📝 الرسالة اللي العميل هيكتبها للسمسار
  @Column('text')
  message: string;

  // 🚦 حالة الطلب: pending (قيد الانتظار) أو contacted (تم التواصل)
  @Column({ default: 'pending' })
  status: string;

  // 🔗 مين العميل اللي بعت الطلب؟
  @ManyToOne(() => User)
  client: User;

  // 🔗 إيه هو العقار اللي العميل بيسأل عليه؟
  @ManyToOne(() => Property)
  property: Property;

  @CreateDateColumn()
  createdAt: Date;
}