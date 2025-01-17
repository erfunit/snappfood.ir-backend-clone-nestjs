import { EntityName } from 'src/common/enums/entity-name.enum';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { UserAddressEntity } from 'src/modules/users/entity/address.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { PaymentEntity } from 'src/modules/payment/entity/patment.entity';

@Entity(EntityName.Order)
export class OrderEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  addressId: number;

  @Column()
  payment_amount: number;

  @Column()
  discount_amount: number;

  @Column()
  total_amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => UserAddressEntity, (addr) => addr.orders, {
    onDelete: 'SET NULL',
  })
  address: UserAddressEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];
}
