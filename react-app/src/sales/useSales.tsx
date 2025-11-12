import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import type { CreateSaleModel, SaleModel } from "./SaleModel";
import { createSale, deleteSale, listSales } from "./salesApi";

interface UseSalesOptions {
  clientId?: string;
  bookId?: string;
}

export const useSales = ({ clientId, bookId }: UseSalesOptions) => {
  const [sales, setSales] = useState<SaleModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const loadSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSales({ clientId, bookId });
      setSales(data);
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to load sales";
      setError(messageText);
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [clientId, bookId]);

  useEffect(() => {
    void loadSales();
  }, [loadSales]);

  const addSale = useCallback(async (input: CreateSaleModel) => {
    setCreating(true);
    const hide = message.loading("Recording sale…");
    try {
      const sale = await createSale(input);
      setSales((prev) => [sale, ...prev]);
      hide();
      message.success("Sale recorded");
    } catch (err) {
      hide();
      const messageText = err instanceof Error ? err.message : "Failed to record sale";
      message.error(messageText);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  const removeSale = useCallback(async (id: string) => {
    setRemoving(true);
    const hide = message.loading("Deleting sale…");
    try {
      await deleteSale(id);
      setSales((prev) => prev.filter((sale) => sale.id !== id));
      hide();
      message.success("Sale removed");
    } catch (err) {
      hide();
      const messageText = err instanceof Error ? err.message : "Failed to delete sale";
      message.error(messageText);
      throw err;
    } finally {
      setRemoving(false);
    }
  }, []);

  const totalSales = useMemo(() => sales.length, [sales]);

  return {
    sales,
    loading,
    error,
    totalSales,
    loadSales,
    addSale,
    removeSale,
    creating,
    removing,
  };
};


