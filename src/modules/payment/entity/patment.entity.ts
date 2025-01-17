import { EntityName } from 'src/common/enums/entity-name.enum';
import { OrderEntity } from 'src/modules/order/entity/order.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(EntityName.Payment)
export class PaymentEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: false })
  status: boolean;

  @Column()
  amount: number;

  @Column()
  invoice_number: string;

  @Column({ nullable: true })
  authority: string;

  @Column()
  invoice_date: Date;

  @Column()
  userId: number;

  @Column()
  orderId: number;

  @ManyToOne(() => UserEntity, (user) => user.payments, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.payments, {
    onDelete: 'CASCADE',
  })
  order: OrderEntity;

  @CreateDateColumn()
  created_at: Date;
}
