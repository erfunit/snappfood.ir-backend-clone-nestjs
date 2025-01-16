import { EntityName } from 'src/common/enums/entity-name.enum';
import { BasketEntity } from 'src/modules/basket/entity/basket.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity(EntityName.Discount)
export class DiscountEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  code: string;

  @Column({ type: 'double' })
  percent: number;

  @Column({ nullable: true })
  expires_in: Date;

  @Column({ nullable: true })
  limit: number;

  @Column({ nullable: true, default: 0 })
  usage: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => BasketEntity, (basket) => basket.discount)
  baskets: BasketEntity[];
}
