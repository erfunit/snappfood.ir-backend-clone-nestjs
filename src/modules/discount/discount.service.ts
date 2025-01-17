import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entity/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
  ) {}

  async create(discountDto: DiscountDto) {
    const { percent, amount, code, expires_in, limit } = discountDto;
    await this.checkExistsCode(code);
    const discountObject: DeepPartial<DiscountEntity> = { code };
    if ((!percent && !amount) || (percent && amount)) {
      throw new BadRequestException(
        'You must enter percent or amount. (not both)',
      );
    }
    if (amount) {
      discountObject.amount = amount;
    } else {
      discountObject.percent = percent;
    }

    if (expires_in) {
      const time = 1000 * 60 * 60 * 24 * expires_in;
      discountObject.expires_in = new Date(new Date().getTime() + time);
    }

    if (limit) {
      discountObject.limit = limit;
    }

    const discount = this.discountRepository.create(discountObject);
    await this.discountRepository.save(discount);
    return {
      message: 'discount created successfully',
      data: discountObject,
    };
  }

  async checkExistsCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (discount) throw new ConflictException('code already exists');
  }

  async findAll() {
    return this.discountRepository.find();
  }

  async remove(id: number) {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException('discount not found');
    await this.discountRepository.delete({ id });
    return {
      message: 'discount deleted successfully',
    };
  }

  async findByCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code });
    if (!discount) throw new NotFoundException('discount code not found');
    return discount;
  }
}
