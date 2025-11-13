import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ClientEntity } from '../../clients/entities/client.entity';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('sales')
export class SaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientEntity, { onDelete: 'CASCADE' })
  client: ClientEntity;

  @Column()
  clientId: number;

  @ManyToOne(() => BookEntity, { onDelete: 'CASCADE' })
  book: BookEntity;

  @Column()
  bookId: string;

  @Column({ default: 1 })
  quantity: number;

  // allow saleDate to be set by the client; default to CURRENT_TIMESTAMP when not provided
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  saleDate: Date;
}
