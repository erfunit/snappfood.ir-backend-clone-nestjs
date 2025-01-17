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
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly menuService: MenuService,
    private readonly discountService: DiscountService,
  ) {}

  async getBasket() {
    const { id: userId } = this.request.user;
    const basketItems = await this.basketRepository.find({
      relations: ['discount', 'food', 'food.supplier'],
      where: {
        userId,
      },
    });

    const foods = basketItems.filter((item) => item.foodId);
    const supplierDiscounts = basketItems.filter(
      (item) => item?.discount?.supplierId,
    );
    const generalDiscount = basketItems.find(
      (item) => item?.discount?.id && !item?.discount?.supplierId,
    );

    let totalAmount = 0;
    let paymentAmount = 0;
    let totalDiscountAmount = 0;
    const foodList = [];

    for (const item of foods) {
      let foodDiscountAmount = 0;
      let discountCode: string = null;
      const { food, count } = item;
      const supplierId = food.supplierId;
      const foodOriginalPrice = food.price;
      let foodFinalPrice = foodOriginalPrice;

      // Apply food-specific discounts to the unit price
      if (food.discount > 0) {
        const specificDiscount = foodOriginalPrice * (food.discount / 100);
        foodDiscountAmount += specificDiscount * count; // Calculate for all items
        foodFinalPrice -= specificDiscount;
      }

      const itemTotalAmount = foodOriginalPrice * count;
      totalAmount += itemTotalAmount;

      // Apply supplier-specific discounts
      const discountItem = supplierDiscounts.find(
        ({ discount }) => discount.supplierId === supplierId,
      );
      if (discountItem) {
        const {
          discount: { active, amount, percent, usage, limit, code },
        } = discountItem;
        if (active && (!limit || limit > usage)) {
          discountCode = code;
          if (percent > 0) {
            const percentDiscount = foodFinalPrice * (percent / 100);
            foodDiscountAmount += percentDiscount * count;
            foodFinalPrice -= percentDiscount;
          } else if (amount > 0) {
            const amountDiscount = Math.min(amount, foodFinalPrice);
            foodDiscountAmount += amountDiscount * count;
            foodFinalPrice -= amountDiscount;
          }
        }
      }

      const itemPaymentAmount = foodFinalPrice * count;
      paymentAmount += itemPaymentAmount;
      totalDiscountAmount += foodDiscountAmount;

      foodList.push({
        name: food.title,
        description: food.description,
        count,
        image: food.image,
        price: foodOriginalPrice,
        total_amount: itemTotalAmount,
        discount_amount: foodDiscountAmount,
        payment_amount: itemPaymentAmount,
        discount_code: discountCode,
        supplier_name: food.supplier.store_name,
      });
    }

    // Apply general discount
    let generalDiscountDetail = {};
    if (generalDiscount?.discount?.active) {
      const {
        discount: { limit, usage, amount, percent, code },
      } = generalDiscount;
      if (!limit || limit > usage) {
        let generalDiscountAmount = 0;
        if (percent > 0) {
          generalDiscountAmount = paymentAmount * (percent / 100);
        } else if (amount > 0) {
          generalDiscountAmount = Math.min(amount, paymentAmount);
        }
        paymentAmount -= generalDiscountAmount;
        totalDiscountAmount += generalDiscountAmount;
        generalDiscountDetail = {
          code,
          amount,
          percent,
          discount_amount: generalDiscountAmount,
        };
      }
    }

    return {
      food_list: foodList,
      total_amount: totalAmount,
      payment_amount: Math.max(0, paymentAmount),
      total_discount_amount: totalDiscountAmount,
      general_discount_detail: generalDiscountDetail,
    };
  }

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
