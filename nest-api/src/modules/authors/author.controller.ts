import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto, UpdateAuthorDto } from './author.dto';
import { AuthorModel, AuthorWithStats } from './author.model';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  getAllAuthors(): Promise<AuthorWithStats[]> {
    return this.authorService.getAllAuthors();
  }

  @Post()
  public async createAuthor(
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<AuthorModel> {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Get(':id')
  public async getAuthor(@Param('id') id: string): Promise<AuthorWithStats> {
    return this.authorService.getAuthorById(id);
  }

  @Patch(':id')
  public async updateAuthor(
    @Param('id') id: string,
    @Body() updateDto: UpdateAuthorDto,
  ): Promise<AuthorModel> {
    return this.authorService.updateAuthor(id, updateDto);
  }

  @Delete(':id')
  public async deleteAuthor(@Param('id') id: string): Promise<void> {
    return this.authorService.deleteAuthor(id);
  }
}
