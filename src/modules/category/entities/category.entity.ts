import { EntityName } from 'src/common/enums/entity-name.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(EntityName.Category)
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  imageKey: string;

  @Column()
  show: boolean;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => CategoryEntity, (parent) => parent.children, {
    onDelete: 'CASCADE',
  })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (child) => child.parent)
  children: CategoryEntity[];
}
