import { EntityName } from 'src/common/enums/entity-name.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAddressEntity } from './address.entity';

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

  @Column({ unique: true, nullable: false })
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
