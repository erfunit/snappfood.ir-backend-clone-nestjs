import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuEntity } from './menu.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';

@Entity('feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @Column()
  foodId: number;

  @Column()
  comment: string;

  @ManyToOne(() => MenuEntity, (menu) => menu.feedbacks, {
    onDelete: 'CASCADE',
  })
  food: MenuEntity;

  @ManyToOne(() => UserEntity, (user) => user.feedbacks, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn()
  created_at: Date;
}
