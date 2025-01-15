import { EntityName } from 'src/common/enums/entity-name.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupplierOTPEntity } from './supplier-otp.entity';
import { SupplierStatus } from '../enum/supplier-status.enum';

@Entity(EntityName.Supplier)
export class SupplierEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  manager_name: string;

  @Column()
  manager_family: string;

  @Column({ nullable: true, unique: true })
  national_code: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ default: SupplierStatus.Registered })
  status: SupplierStatus;

  @Column({ unique: true })
  mobile: string;

  @Column({ nullable: true, default: false })
  mobile_verify: boolean;

  @Column()
  store_name: string;

  @Column()
  category_id: number;

  @ManyToOne(() => CategoryEntity, (cat) => cat.suppliers, {
    onDelete: 'SET NULL',
  })
  category: CategoryEntity;

  @Column()
  invite_code: string;

  @Column({ nullable: true })
  agentId: number;

  @ManyToOne(() => SupplierEntity, (sup) => sup.subsets)
  agent: SupplierEntity;

  @OneToMany(() => SupplierEntity, (sub) => sub.agent)
  subsets: SupplierEntity[];

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => SupplierOTPEntity, (otp) => otp.supplier)
  @JoinColumn()
  otp: SupplierOTPEntity;
}
