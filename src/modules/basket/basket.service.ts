import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { AddToBasketDto, DiscountBasketDto } from './dto/basket.dto';
import { MenuService } from '../menu/service/menu.service';
import { DiscountService } from '../discount/discount.service';
import { BasketEntity } from './entity/basket.entity';
import { DiscountEntity } from '../discount/entity/discount.entity';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private readonly basketRepository: Repository<BasketEntity>,
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly menuService: MenuService,
    private readonly discountService: DiscountService,
  ) {}

  async addToBasket({ foodId }: AddToBasketDto) {
    const { id: userId } = this.request.user;

    // Ensure food exists
    await this.menuService.getOne(foodId);

    // Check if item already exists in the basket
    let basketItem = await this.basketRepository.findOne({
      where: { foodId, userId },
    });

    if (basketItem) {
      basketItem.count += 1;
    } else {
      basketItem = this.basketRepository.create({ userId, foodId, count: 1 });
    }

    await this.basketRepository.save(basketItem);

    return { message: 'Food added to your basket' };
  }

  async removeFromBasket({ foodId }: AddToBasketDto) {
    const { id: userId } = this.request.user;

    // Ensure food exists
    await this.menuService.getOne(foodId);

    const basketItem = await this.basketRepository.findOne({
      where: { foodId, userId },
    });

    if (!basketItem) {
      throw new BadRequestException('This food is not in your basket');
    }

    if (basketItem.count > 1) {
      basketItem.count -= 1;
      await this.basketRepository.save(basketItem);
    } else {
      await this.basketRepository.delete({ id: basketItem.id });
    }

    return { message: 'Item removed from your basket' };
  }

  async addDiscount({ code }: DiscountBasketDto) {
    const { id: userId } = this.request.user;

    const discount = await this.discountService.findByCode(code);

    if (!discount.active) {
      throw new BadRequestException('This discount code is inactive');
    }

    if (discount.limit && discount.usage >= discount.limit) {
      throw new BadRequestException(
        'This discount code has reached its usage limit',
      );
    }

    if (discount.expires_in && discount.expires_in.getTime() <= Date.now()) {
      throw new BadRequestException('This discount code has expired');
    }

    // Ensure the discount has not already been used
    const existingDiscount = await this.basketRepository.findOne({
      where: { userId, discountId: discount.id },
    });

    if (existingDiscount) {
      throw new BadRequestException('You have already used this discount code');
    }

    // Supplier-specific discount logic
    if (discount.supplierId) {
      const supplierBasketItem = await this.basketRepository.findOne({
        where: { userId, food: { supplierId: discount.supplierId } },
        relations: ['food'],
      });

      if (!supplierBasketItem) {
        throw new BadRequestException(
          'You do not have items from this supplier in your basket',
        );
      }

      const supplierDiscount = await this.basketRepository.findOne({
        where: { userId, discount: { supplierId: discount.supplierId } },
        relations: ['discount'],
      });

      if (supplierDiscount) {
        throw new BadRequestException(
          'You cannot use multiple discounts from the same supplier',
        );
      }

      await this.updatedBasketWith(discount, discount.supplierId);
    }

    // General discount logic
    const generalDiscount = await this.basketRepository.findOne({
      where: { userId, discount: { supplierId: null, id: discount.id } },
      relations: ['discount'],
    });

    console.log(generalDiscount);
    if (generalDiscount) {
      throw new BadRequestException('You have already used a general discount');
    }

    await this.updatedBasketWith(discount);

    return { message: 'Discount code added successfully' };
  }

  async removeDiscount({ code }: DiscountBasketDto) {
    const { id: userId } = this.request.user;

    const discount = await this.discountService.findByCode(code);

    const basketDiscount = await this.basketRepository.findOne({
      where: { userId, discountId: discount.id },
    });

    if (!basketDiscount) {
      throw new BadRequestException('This discount code is not in your basket');
    }

    await this.basketRepository.update(
      { userId, discountId: discount.id },
      { userId, discountId: null },
    );

    return { message: 'Discount code removed successfully' };
  }

  async updatedBasketWith(discount: DiscountEntity, supplierId?: number) {
    const { id: userId } = this.request.user;
    const where:
      | FindOptionsWhere<BasketEntity>
      | FindOptionsWhere<BasketEntity>[] = {};

    where.userId = userId;

    if (supplierId) {
      where.food = {
        supplierId,
      };
    }

    const basketItems = await this.basketRepository.find({
      where,
      relations: ['food'], // Load the required relation
    });

    if (!basketItems.length) {
      throw new BadRequestException(
        'You do not have items from this supplier in your basket',
      );
    }

    // Update the basket items
    for (const basketItem of basketItems) {
      await this.basketRepository.update(
        { id: basketItem.id }, // Update by the unique identifier
        { discountId: discount.id },
      );
    }
  }
}
