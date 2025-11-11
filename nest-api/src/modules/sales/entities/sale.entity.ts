import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ClientEntity } from '../../clients/entities/client.entity';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('sales')
export class SaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientEntity)
  client: ClientEntity;

  @Column()
  clientId: number;

  @ManyToOne(() => BookEntity)
  book: BookEntity;

  @Column()
  bookId: string;

  @Column({ default: 1 })
  quantity: number;

  @CreateDateColumn()
  saleDate: Date;
}
