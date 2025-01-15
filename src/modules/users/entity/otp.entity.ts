import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityName } from 'src/common/enums/entity-name.enum';

@Entity(EntityName.OTP)
export class OTPEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  userId: number;
  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  user: UserEntity;
}
