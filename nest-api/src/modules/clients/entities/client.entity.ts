import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SaleEntity } from '../../sales/entities/sale.entity';

@Entity('clients')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  picture?: string;

  @OneToMany(() => SaleEntity, (sale) => sale.client)
  sales?: SaleEntity[];
}
