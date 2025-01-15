import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CategoryService } from '../category/category.service';
import { SupplierOTPEntity } from './entities/supplier-otp.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
    @InjectRepository(SupplierOTPEntity)
    private readonly otpEntity: Repository<SupplierOTPEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async supplierSingup(signupDto: CreateSupplierDto) {
    const {
      manager_family,
      manager_name,
      store_name,
      mobile,
      category_id,
      agent_id,
    } = signupDto;
    const existingSupplierWithMobile = await this.supplierRepository.findOneBy({
      mobile,
    });
    if (existingSupplierWithMobile)
      throw new ConflictException(
        'A supplier with this phone number already exists',
      );
    const category = await this.categoryService
      .findOneById(category_id)
      .then((data) => data)
      .catch(() => {
        throw new NotFoundException('category not found');
      });
    const agent = await this.supplierRepository.findOneBy({ id: agent_id });
    if (!agent) throw new NotFoundException('agent not found');
    const invite_code = parseInt(mobile).toString(32).toUpperCase();
    const supplier = this.supplierRepository.create({
      manager_family,
      manager_name,
      store_name,
      category_id: category.id,
      agentId: agent.id,
      invite_code,
    });
    await this.supplierRepository.save(supplier);
    return {
      data: supplier,
    };
  }
}
