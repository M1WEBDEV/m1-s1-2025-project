import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorModel, CreateAuthorModel, AuthorWithStats } from './author.model';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  public async getAllAuthors(): Promise<AuthorWithStats[]> {
    return this.authorRepository.getAllAuthors();
  }

  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    return this.authorRepository.createAuthor(author);
  }

  public async getAuthorById(id: string): Promise<AuthorWithStats> {
    const author = await this.authorRepository.getAuthorById(id);
    if (!author) throw new NotFoundException(`Author with ID ${id} not found`);
    return author;
  }

  public async updateAuthor(id: string, patch: Partial<CreateAuthorModel>): Promise<AuthorModel> {
    const updated = await this.authorRepository.updateAuthor(id, patch);
    if (!updated) throw new NotFoundException(`Author with ID ${id} not found`);
    return updated;
  }

  public async deleteAuthor(id: string): Promise<void> {
    await this.authorRepository.deleteAuthor(id);
  }
}
