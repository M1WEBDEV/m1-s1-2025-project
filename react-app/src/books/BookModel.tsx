export interface BookModel {
  id: string;
  title: string;
  yearPublished: number;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    pictureUrl?: string;
  };
  pictureUrl?: string;
  description?: string;
  salesCount?: number;
}

export interface CreateBookModel {
  authorId: string;
  title: string;
  yearPublished: number;
  pictureUrl?: string;
  description?: string;
}

export type UpdateBookModel = Partial<CreateBookModel>;

