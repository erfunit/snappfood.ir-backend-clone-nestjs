import { EntityName } from 'src/common/enums/entity-name.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupplierOTPEntity } from './supplier-otp.entity';
import { SupplierStatus } from '../enum/supplier-status.enum';
import { SupplierDocsEntity } from './supplier-docs.entity';
import { MenuTypeEntity } from 'src/modules/menu/entities/type.entity';
import { MenuEntity } from 'src/modules/menu/entities/menu.entity';

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

  @OneToMany(() => MenuTypeEntity, (type) => type.supplier)
  menu_types: MenuTypeEntity[];

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => SupplierOTPEntity, (otp) => otp.supplier)
  @JoinColumn()
  otp: SupplierOTPEntity;

  @Column()
  docsId: number;

  @OneToOne(() => SupplierDocsEntity, (doc) => doc.supplier)
  @JoinColumn({ name: 'docsId' })
  docs: SupplierDocsEntity;

  @OneToMany(() => MenuEntity, (menu) => menu.supplier)
  items: MenuEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
