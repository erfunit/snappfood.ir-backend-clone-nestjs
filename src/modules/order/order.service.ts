import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { BasketType } from '../basket/basket.type';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  OrderItemStatus,
  OrderStatus,
} from 'src/common/enums/order-status.enum';
import { OrderItemEntity } from './entity/order-item.entity';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private dataSource: DataSource,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async create(basketDto: BasketType, description?: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const { id: userId } = this.request.user;
      const { payment_amount, total_amount, total_discount_amount, food_list } =
        basketDto;
      const order = await queryRunner.manager.create(OrderEntity, {
        userId,
        total_amount,
        description,
        discount_amount: total_discount_amount,
        payment_amount,
        status: OrderStatus.Pending,
      });

      await queryRunner.manager.save(OrderEntity, order);

      const orderItems: DeepPartial<OrderItemEntity>[] = [];

      for (const item of food_list) {
        orderItems.push({
          count: item.count,
          foodId: item.food_id,
          orderId: order.id,
          status: OrderItemStatus.Pending,
          supplierId: item.supplier_id,
        });
      }

      if (orderItems.length > 0) {
        await queryRunner.manager.insert(OrderItemEntity, orderItems);
      } else {
        throw new BadRequestException('your food list is empty');
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new InternalServerErrorException('something went wrong');
    return order;
  }

  async save(order: DeepPartial<OrderEntity>) {
    await this.orderRepository.save(order);
  }
}
