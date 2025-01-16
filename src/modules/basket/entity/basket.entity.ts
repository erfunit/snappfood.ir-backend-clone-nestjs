import { EntityName } from 'src/common/enums/entity-name.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  discountId: number;
}
