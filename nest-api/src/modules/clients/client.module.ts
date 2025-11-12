import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientEntity } from './entities/client.entity';
import { SaleEntity } from '../sales/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity, SaleEntity])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
