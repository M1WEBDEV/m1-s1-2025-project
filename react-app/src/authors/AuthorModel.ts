export interface Author {
  id: string;
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
  books?: { id: string; title: string; yearPublished: number; pictureUrl?: string }[];
}
