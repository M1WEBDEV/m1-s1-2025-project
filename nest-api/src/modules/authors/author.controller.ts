import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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
  public async createAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<AuthorModel> {
    const name = createAuthorDto.name ?? '';
    const parts = name.trim() ? name.trim().split(/\s+/) : [];
    const firstName = createAuthorDto.firstName ?? parts[0] ?? '';
    const lastName = createAuthorDto.lastName ?? parts.slice(1).join(' ') ?? '';
    const picture = createAuthorDto.picture ?? createAuthorDto.pictureUrl;
    return this.authorService.createAuthor({ firstName, lastName, picture });
  }

  @Get(':id')
  public async getAuthor(@Param('id') id: string): Promise<AuthorWithStats> {
    return this.authorService.getAuthorById(id);
  }

  @Patch(':id')
  public async updateAuthor(@Param('id') id: string, @Body() updateDto: UpdateAuthorDto): Promise<AuthorModel> {
    const name = updateDto.name ?? '';
    const parts = name.trim() ? name.trim().split(/\s+/) : [];
    const patch: Partial<AuthorModel> = {};
    if (updateDto.firstName) patch.firstName = updateDto.firstName;
    else if (parts[0]) patch.firstName = parts[0];
    if (updateDto.lastName) patch.lastName = updateDto.lastName;
    else if (parts.length > 1) patch.lastName = parts.slice(1).join(' ');
    if (updateDto.picture) patch.picture = updateDto.picture;
    if (updateDto.pictureUrl) patch.picture = updateDto.pictureUrl;
    return this.authorService.updateAuthor(id, patch);
  }

  @Delete(':id')
  public async deleteAuthor(@Param('id') id: string): Promise<void> {
    return this.authorService.deleteAuthor(id);
  }
}
