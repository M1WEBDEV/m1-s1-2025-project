export interface SaleModel {
  id: string;
  clientId: string;
  bookId: string;
  date: string;
  client?: { id: string; fullName: string };
  book?: { id: string; title: string; authorName?: string };
}

export interface CreateSaleModel {
  clientId: string;
  bookId: string;
  date: string;
}


