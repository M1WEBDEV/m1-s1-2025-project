import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { CreateClientModel, UpdateClientModel } from './models/client.model';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repo: Repository<ClientEntity>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['sales'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['sales'],
    });
  }

  create(data: CreateClientModel) {
    const client = this.repo.create(data);
    return this.repo.save(client);
  }

  update(id: number, data: UpdateClientModel) {
    return this.repo.update(id, data);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
