import { EntityName } from 'src/common/enums/entity-name.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(EntityName.Supplier)
export class SupplierEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  manager_name: string;

  @Column()
  manager_family: string;

  @Column({ unique: true })
  mobile: string;

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
}
