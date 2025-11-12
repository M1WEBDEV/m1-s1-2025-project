import { AuthorId } from './author.entity';

export type AuthorModel = {
  id: AuthorId;
  firstName: string;
  lastName: string;
  picture?: string;
};

export type CreateAuthorModel = {
  firstName: string;
  lastName: string;
  picture?: string;
};

export type AuthorWithStats = AuthorModel & {
  booksCount: number;
  averageSales: number;
};
