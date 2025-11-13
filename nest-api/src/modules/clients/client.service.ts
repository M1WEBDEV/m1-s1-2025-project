import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { CreateClientDto } from './create-client.dto';
import { SaleEntity } from '../sales/entities/sale.entity';
import { ClientModel } from './models/client.model';

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

  async getClientsWithBookCount(): Promise<Array<ClientModel & { booksCount: number }>> {
    const clients = await this.clientsRepository.find();

    const rawCounts = await this.saleRepo
      .createQueryBuilder('s')
      .select('s.clientId', 'clientId')
      .addSelect('COUNT(DISTINCT s.bookId)', 'booksCount')
      .groupBy('s.clientId')
      .getRawMany();

    const map = new Map<number, number>();
    rawCounts.forEach((r) => {
      map.set(Number(r.clientId), Number(r.booksCount));
    });

    return clients.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      picture: c.picture,
      booksCount: map.get(c.id) ?? 0,
    }));
  }
}
