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
  const response = await http.get<SaleModel[] | { data: SaleModel[] }>(
    `/sales${toQueryString(params)}`,
  );
  const list = Array.isArray(response) ? response : response?.data ?? [];
  return list.map(normaliseSale);
};

export const createSale = async (input: CreateSaleModel) => {
  const sale = await http.post<SaleModel>("/sales", input);
  return normaliseSale(sale);
};

export const deleteSale = async (id: string) => {
  await http.delete(`/sales/${id}`);
};


