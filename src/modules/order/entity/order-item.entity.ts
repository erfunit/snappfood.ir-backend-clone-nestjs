import { EntityName } from 'src/common/enums/entity-name.enum';
import { OrderItemStatus } from 'src/common/enums/order-status.enum';
import { MenuEntity } from 'src/modules/menu/entities/menu.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';

@Entity(EntityName.OrderItem)
export class OrderItemEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  foodId: number;

  @Column()
  orderId: number;

  @Column()
  count: number;

  @Column()
  supplierId: number;

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.Pending,
  })
  status: string;

  @ManyToOne(() => MenuEntity, (food) => food.orders, { onDelete: 'CASCADE' })
  food: MenuEntity;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  order: OrderEntity;

  @ManyToOne(() => SupplierEntity, (sup) => sup.orders, { onDelete: 'CASCADE' })
  supplier: SupplierEntity;
}
