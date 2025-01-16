import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuEntity } from './menu.entity';
import { EntityName } from 'src/common/enums/entity-name.enum';

@Entity(EntityName.MenuType)
export class MenuTypeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  supplierId: number;

  @ManyToOne(() => SupplierEntity, (sup) => sup.menu_types, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;

  @OneToMany(() => MenuEntity, (menu) => menu.menu_type)
  menu: MenuEntity[];
}
