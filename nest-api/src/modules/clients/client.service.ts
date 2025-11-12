import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { CreateClientDto } from './create-client.dto';
import { SaleEntity } from '../sales/entities/sale.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientsRepository: Repository<ClientEntity>,

    @InjectRepository(SaleEntity)
    private readonly saleRepo: Repository<SaleEntity>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  async findAll(): Promise<ClientEntity[]> {
    return this.clientsRepository.find();
  }

  async findOne(id: string): Promise<ClientEntity> {
    const client = await this.clientsRepository.findOneBy({ id: +id });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(
    id: string,
    updateClientDto: CreateClientDto,
  ): Promise<ClientEntity> {
    await this.clientsRepository.update(+id, updateClientDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.clientsRepository.delete(+id);
  }

  async findBooksBoughtByClient(clientId: number) {
    return this.saleRepo.find({
      where: { clientId },
      relations: ['book', 'book.author'],
    });
  }
}
