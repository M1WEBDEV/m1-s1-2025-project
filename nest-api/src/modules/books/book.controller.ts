import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBookDto, GetBooksDto, UpdateBookDto } from './book.dto';
import { GetBooksModel } from './book.model';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(@Query() input: GetBooksDto): Promise<GetBooksModel> {
    const limit = input.limit ?? 10;
    const offset = input.offset ?? 0;
    const [property, direction] = input.sort
      ? input.sort.split(',')
      : ['title', 'ASC'];

    const [books, totalCount] = await this.bookService.getAllBooks({
      limit,
      offset,
      sort: {
        [property]: direction,
      },
    });

    return { data: books, totalCount };
  }

  @Get(':id')
  public async getBook(@Param('id') id: string) {
    return this.bookService.getBookById(id);
  }

  @Post()
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Patch(':id')
  updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }
}
