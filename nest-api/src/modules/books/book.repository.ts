import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthorEntity } from '../authors/author.entity';
import {
  BookModel,
  BookWithClientCountModel,
  CreateBookModel,
  FilterBooksModel,
  UpdateBookModel,
} from './book.model';
import { BookEntity, BookId } from './entities/book.entity';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    private readonly dataSource: DataSource,
  ) {}

  public async getAllBooks(
    input?: FilterBooksModel,
  ): Promise<[BookModel[], number]> {
    const [books, totalCount] = await this.bookRepository.findAndCount({
      take: input?.limit,
      skip: input?.offset,
      relations: { author: true },
      order: input?.sort,
    });

    return [books, totalCount];
  }

  public async getBookById(id: string): Promise<BookModel | undefined> {
    const book = await this.bookRepository.findOne({
      where: { id: id as BookId },
      relations: ['author'],
    });

    if (!book) return undefined;

    return {
      id: book.id,
      title: book.title,
      yearPublished: book.yearPublished,
      picture: book.picture,
      author: {
        firstName: book.author.firstName,
        lastName: book.author.lastName,
      },
    };
  }

  public async getBooksWithClientCount(): Promise<BookWithClientCountModel[]> {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.author', 'author')
      .leftJoin('sales', 'sale', 'sale.bookId = book.id')
      .select([
        'book.id',
        'book.title',
        'book.yearPublished',
        'book.picture',
        'author.firstName',
        'author.lastName',
      ])
      .addSelect('COUNT(DISTINCT sale.clientId)', 'clientCount')
      .groupBy('book.id')
      .addGroupBy('author.id')
      .getRawAndEntities();

    const rawResults = books.raw as Array<{
      clientCount?: string | number | null;
    }>;

    return books.entities.map((book, index) => {
      const raw = rawResults[index];
      const countValue = raw?.clientCount;
      const clientCount =
        typeof countValue === 'string'
          ? parseInt(countValue, 10) || 0
          : typeof countValue === 'number'
            ? Math.floor(countValue)
            : 0;

      return {
        id: book.id,
        title: book.title,
        yearPublished: book.yearPublished,
        picture: book.picture,
        author: {
          firstName: book.author.firstName,
          lastName: book.author.lastName,
        },
        clientCount,
      };
    });
  }

  public async createBook(book: CreateBookModel): Promise<BookModel> {
    const author = await this.authorRepository.findOne({
      where: { id: book.authorId },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    const created = await this.bookRepository.save(
      this.bookRepository.create(book),
    );

    const result = await this.getBookById(created.id);

    return result as BookModel;
  }

  public async updateBook(
    id: string,
    book: UpdateBookModel,
  ): Promise<BookModel | undefined> {
    const oldBook = await this.bookRepository.findOne({
      where: { id: id as BookId },
    });

    if (!oldBook) {
      return undefined;
    }

    await this.bookRepository.update(id, book);

    return this.getBookById(id);
  }

  public async deleteBook(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }

  public async deleteBooks(ids: string[]): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await Promise.all(
        ids.map((id) => transactionalEntityManager.delete(BookEntity, { id })),
      );
    });
  }
}
