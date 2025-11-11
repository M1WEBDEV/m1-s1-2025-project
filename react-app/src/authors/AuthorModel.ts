export interface Author {
  id: number;
  name: string;
  pictureUrl?: string;
}

export interface CreateAuthor {
  name: string;
  pictureUrl?: string;
}

export interface UpdateAuthor {
  name?: string;
  pictureUrl?: string;
}

export interface AuthorWithStats extends Author {
  booksCount: number;
  averageSales: number;
}
