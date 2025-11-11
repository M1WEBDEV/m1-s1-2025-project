import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleEntity } from './entities/sale.entity';
import { CreateSaleDto } from './create-sale.dto';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(SaleEntity)
    private salesRepository: Repository<SaleEntity>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<SaleEntity> {
    const sale = this.salesRepository.create(createSaleDto);
    return this.salesRepository.save(sale);
  }

  async findAll(): Promise<SaleEntity[]> {
    return this.salesRepository.find({
      relations: ['client', 'book'],
    });
  }

  async findOne(id: number): Promise<SaleEntity> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['client', 'book'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async findByClient(clientId: number): Promise<SaleEntity[]> {
    return this.salesRepository.find({
      where: { clientId },
      relations: ['book'],
    });
  }

  async findByBook(bookId: string): Promise<SaleEntity[]> {
    return this.salesRepository.find({
      where: { bookId },
      relations: ['client'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.salesRepository.delete(id);
  }
}
