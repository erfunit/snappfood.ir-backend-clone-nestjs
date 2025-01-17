import { EntityName } from 'src/common/enums/entity-name.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAddressEntity } from './address.entity';
import { OTPEntity } from './otp.entity';
import { FeedbackEntity } from 'src/modules/menu/entities/feedback.entity';
import { BasketEntity } from 'src/modules/basket/entity/basket.entity';
import { OrderEntity } from 'src/modules/order/entity/order.entity';
import { PaymentEntity } from 'src/modules/payment/entity/patment.entity';

@Entity(EntityName.User)
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  mobile: string;

  @Column({ nullable: true, default: false })
  mobile_verify: boolean;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  invite_code: string;

  @Column({ default: 0 })
  score: number;

  @Column({ nullable: true })
  agent_id: number;

  @OneToMany(() => UserAddressEntity, (user_address) => user_address.user, {
    nullable: true,
  })
  addressList: UserAddressEntity[];

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OTPEntity, (otp) => otp.user)
  @JoinColumn()
  otp: OTPEntity;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.user)
  feedbacks: FeedbackEntity[];

  @OneToMany(() => BasketEntity, (basket) => basket.user)
  basketItems: BasketEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.user)
  payments: PaymentEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
