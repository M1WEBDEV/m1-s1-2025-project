import { http } from "../shared/http";
import type { CreateSaleModel, SaleModel } from "./SaleModel";

interface ListSalesParams {
  clientId?: string;
  bookId?: string;
}

const normaliseSale = (sale: any): SaleModel => {
  // Ensure client has fullName if it exists
  const client = sale.client
    ? {
        id: String(sale.client.id),
        fullName: sale.client.fullName || 
                  `${sale.client.firstName || ''} ${sale.client.lastName || ''}`.trim(),
      }
    : undefined;

  return {
    ...sale,
    id: String(sale.id),
    clientId: String(sale.clientId),
    bookId: String(sale.bookId),
    client,
  };
};

export const listSales = async (params: ListSalesParams = {}) => {
  let response;
  if (params.clientId) {
    response = await http.get<SaleModel[] | { data: SaleModel[] }>(
      `/sales/client/${params.clientId}`,
    );
  } else if (params.bookId) {
    response = await http.get<SaleModel[] | { data: SaleModel[] }>(
      `/sales/book/${params.bookId}`,
    );
  } else {
    response = await http.get<SaleModel[] | { data: SaleModel[] }>(`/sales`);
  }
  const list = Array.isArray(response) ? response : response?.data ?? [];
  return list.map(normaliseSale);
};

export const createSale = async (
  input: CreateSaleModel & { quantity?: number },
) => {
  
  const payload: {
    clientId: string;
    bookId: string;
    saleDate?: string;
    quantity?: number;
  } = {
    clientId: input.clientId,
    bookId: input.bookId,
  };

  if (input.date) payload.saleDate = input.date;
  payload.quantity = input.quantity ?? 1;

  const sale = await http.post<SaleModel>("/sales", payload);
  return normaliseSale(sale);
};

export const deleteSale = async (id: string) => {
  await http.delete(`/sales/${id}`);
};


