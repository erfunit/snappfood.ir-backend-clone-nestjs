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

@Entity('menu')
export class MenuEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'double' })
  discount: number;

  @Column()
  description: string;

  @Column({ type: 'double' })
  score: number;

  @Column()
  typeId: number;

  @Column()
  supplierId: number;

  @ManyToOne(() => MenuTypeEntity, (type) => type.menu)
  menu_type: MenuTypeEntity;

  @ManyToOne(() => SupplierEntity, (sup) => sup.items)
  supplier: SupplierEntity;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.food)
  feedbacks: FeedbackEntity[];
}
