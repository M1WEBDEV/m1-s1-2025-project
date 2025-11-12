import { Injectable } from '@nestjs/common';
import { AuthorModel, CreateAuthorModel, AuthorWithStats } from './author.model';
import { AuthorEntity } from './author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Returns authors with aggregated stats: booksCount and averageSales
   */
  public async getAllAuthors(): Promise<AuthorWithStats[]> {
    // Use a query builder with subquery counting sales per book, then aggregate per author
    const sub = this.dataSource
      .createQueryBuilder()
      .select('s.bookId', 'bookId')
      .addSelect('COUNT(s.id)', 'sales_count')
      .from('sales', 's')
      .groupBy('s.bookId');

    const qb = this.dataSource
      .createQueryBuilder()
      .select('author.id', 'id')
      .addSelect('author.first_name', 'firstName')
      .addSelect('author.last_name', 'lastName')
      .addSelect('author.picture', 'picture')
      .addSelect('COUNT(DISTINCT b.id)', 'booksCount')
      .addSelect('COALESCE(AVG(s.sales_count), 0)', 'averageSales')
      .from(AuthorEntity, 'author')
      .leftJoin('books', 'b', 'b.author_id = author.id')
      .leftJoin('(' + sub.getQuery() + ')', 's', 's.bookId = b.id')
      .groupBy('author.id');

    const raw = await qb.getRawMany();
    return raw.map((r) => ({
      id: r.id,
      firstName: r.firstName ?? r.first_name,
      lastName: r.lastName ?? r.last_name,
      picture: r.picture ?? null,
      booksCount: Number(r.booksCount ?? 0),
      averageSales: Number(r.averageSales ?? 0),
    }));
  }

  public async getAuthorById(id: string): Promise<AuthorWithStats | null> {
    const sub = this.dataSource
      .createQueryBuilder()
      .select('s.bookId', 'bookId')
      .addSelect('COUNT(s.id)', 'sales_count')
      .from('sales', 's')
      .groupBy('s.bookId');

    const qb = this.dataSource
      .createQueryBuilder()
      .select('author.id', 'id')
      .addSelect('author.first_name', 'firstName')
      .addSelect('author.last_name', 'lastName')
      .addSelect('author.picture', 'picture')
      .addSelect('COUNT(DISTINCT b.id)', 'booksCount')
      .addSelect('COALESCE(AVG(s.sales_count), 0)', 'averageSales')
      .from(AuthorEntity, 'author')
      .leftJoin('books', 'b', 'b.author_id = author.id')
      .leftJoin('(' + sub.getQuery() + ')', 's', 's.bookId = b.id')
      .where('author.id = :id', { id })
      .groupBy('author.id');

    const r = await qb.getRawOne();
    if (!r) return null;
    return {
      id: r.id,
      firstName: r.firstName ?? r.first_name,
      lastName: r.lastName ?? r.last_name,
      picture: r.picture ?? null,
      booksCount: Number(r.booksCount ?? 0),
      averageSales: Number(r.averageSales ?? 0),
    };
  }

  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    return this.authorRepository.save(this.authorRepository.create(author));
  }

  public async updateAuthor(id: string, patch: Partial<CreateAuthorModel>): Promise<AuthorModel | null> {
    await this.authorRepository.update(id, patch);
    return this.authorRepository.findOneBy({ id } as any);
  }

  public async deleteAuthor(id: string): Promise<void> {
    await this.authorRepository.delete(id);
  }
}
