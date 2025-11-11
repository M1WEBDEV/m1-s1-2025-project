export interface SaleModel {
  id: number;
  clientId: number;
  bookId: string;
  quantity: number;
  saleDate: Date;
}

export interface CreateSaleModel {
  clientId: number;
  bookId: string;
  quantity: number;
}

export interface UpdateSaleModel {
  clientId?: number;
  bookId: string;
  quantity?: number;
}
