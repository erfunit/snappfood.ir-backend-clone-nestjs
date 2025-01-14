import { Injectable } from '@nestjs/common';
import { CreateStarterDto } from './dto/create-starter.dto';
import { UpdateStarterDto } from './dto/update-starter.dto';

@Injectable()
export class StarterService {
  create(createStarterDto: CreateStarterDto) {
    return 'This action adds a new starter';
  }

  findAll() {
    return `This action returns all starter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} starter`;
  }

  update(id: number, updateStarterDto: UpdateStarterDto) {
    return `This action updates a #${id} starter`;
  }

  remove(id: number) {
    return `This action removes a #${id} starter`;
  }
}
