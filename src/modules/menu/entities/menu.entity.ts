import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuTypeEntity } from './type.entity';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';
import { FeedbackEntity } from './feedback.entity';
import { EntityName } from 'src/common/enums/entity-name.enum';

@Entity(EntityName.Menu)
export class MenuEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  imageKey: string;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'double', default: 0 })
  discount: number;

  @Column()
  description: string;

  @Column({ type: 'double', default: 0 })
  score: number;

  @Column()
  typeId: number;

  @Column()
  supplierId: number;

  @ManyToOne(() => MenuTypeEntity, (type) => type.menu)
  type: MenuTypeEntity;

  @ManyToOne(() => SupplierEntity, (sup) => sup.items)
  supplier: SupplierEntity;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.food)
  feedbacks: FeedbackEntity[];
}
