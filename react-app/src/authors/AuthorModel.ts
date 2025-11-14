export interface Author {
  id: string;
  name: string;
  pictureUrl?: string;
}

export interface CreateAuthor {
  name: string;
  picture?: string;
}

export interface UpdateAuthor {
  name?: string;
  picture?: string;
}

export interface AuthorWithStats extends Author {
  booksCount: number;
  averageSales: number;
  books?: { id: string; title: string; yearPublished: number; pictureUrl?: string }[];
}
