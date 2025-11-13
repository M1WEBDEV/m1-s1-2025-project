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

export type AuthorBook = {
  id: string;
  title: string;
  yearPublished: number;
  picture?: string | null;
};

export type AuthorWithBooks = AuthorWithStats & {
  books?: AuthorBook[];
};
