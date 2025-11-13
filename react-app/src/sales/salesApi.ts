import { http } from "../shared/http";
import type { CreateSaleModel, SaleModel } from "./SaleModel";

interface ListSalesParams {
  clientId?: string;
  bookId?: string;
}

const normaliseSale = (sale: SaleModel): SaleModel => ({
  ...sale,
  id: String(sale.id),
  clientId: String(sale.clientId),
  bookId: String(sale.bookId),
});

const toQueryString = (params: ListSalesParams) => {
  const searchParams = new URLSearchParams();
  if (params.clientId) searchParams.append("clientId", params.clientId);
  if (params.bookId) searchParams.append("bookId", params.bookId);
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
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

export const createSale = async (input: CreateSaleModel) => {
  // backend expects saleDate; frontend uses `date` in CreateSaleModel — map it here
  const payload: any = {
    clientId: input.clientId,
    bookId: input.bookId,
  };
  if ((input as any).date) payload.saleDate = (input as any).date;
  // default quantity to 1 if not provided
  if ((input as any).quantity) payload.quantity = (input as any).quantity;
  else payload.quantity = 1;

  const sale = await http.post<SaleModel>("/sales", payload);
  return normaliseSale(sale);
};

export const deleteSale = async (id: string) => {
  await http.delete(`/sales/${id}`);
};


