import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { AuthorEntity } from './author.entity';
import { BookEntity } from '../books/entities/book.entity';
import { SaleEntity } from '../sales/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity, BookEntity, SaleEntity])],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
