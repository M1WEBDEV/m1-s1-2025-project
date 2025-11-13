import { Injectable } from '@nestjs/common';
import { AuthorModel, CreateAuthorModel, AuthorWithStats, AuthorWithBooks } from './author.model';
import { AuthorEntity, AuthorId } from './author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
    private readonly dataSource: DataSource,
  ) {}

  


  public async getAllAuthors(): Promise<AuthorWithStats[]> {
    
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

  public async getAuthorById(id: string): Promise<AuthorWithBooks | null> {
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
    
    const rawBooks = await this.dataSource
      .createQueryBuilder()
      .select('b.id', 'id')
      .addSelect('b.title', 'title')
      .addSelect('b.year_published', 'yearPublished')
      .addSelect('b.picture', 'picture')
      .from('books', 'b')
      .where('b.author_id = :id', { id })
      .getRawMany();

    const books = rawBooks.map((bk: Record<string, unknown>) => ({
      id: String(bk['id']),
      title: String(bk['title'] ?? ''),
      yearPublished: Number(bk['yearPublished'] ?? bk['year_published'] ?? 0),
      picture: (bk['picture'] as string) ?? null,
    }));

    return {
      id: r.id,
      firstName: r.firstName ?? r.first_name,
      lastName: r.lastName ?? r.last_name,
      picture: r.picture ?? null,
      booksCount: Number(r.booksCount ?? 0),
      averageSales: Number(r.averageSales ?? 0),
      books,
    };
  }

  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    return this.authorRepository.save(this.authorRepository.create(author));
  }

  public async updateAuthor(id: string, patch: Partial<CreateAuthorModel>): Promise<AuthorModel | null> {
    await this.authorRepository.update(id, patch);
    return this.authorRepository.findOne({ where: { id: id as unknown as AuthorId } });
  }

  public async deleteAuthor(id: string): Promise<void> {
    await this.authorRepository.delete(id);
  }
}
