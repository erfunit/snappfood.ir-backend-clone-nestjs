import { EntityName } from 'src/common/enums/entity-name.enum';
import { DiscountEntity } from 'src/modules/discount/entity/discount.entity';
import { MenuEntity } from 'src/modules/menu/entities/menu.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity(EntityName.Basket)
export class BasketEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  foodId: number;

  @Column()
  userId: number;

  @Column()
  count: number;

  @Column({ nullable: true })
  discountId: number;

  @ManyToOne(() => MenuEntity, (food) => food.baskets, { onDelete: 'CASCADE' })
  food: MenuEntity;

  @ManyToOne(() => UserEntity, (user) => user.basketItems, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: 'SET NULL',
  })
  discount: DiscountEntity;
}
