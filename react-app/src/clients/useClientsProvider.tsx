import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { message } from "antd";
import type {
  ClientModel,
  CreateClientModel,
  UpdateClientModel,
} from "./ClientModel";
import { http } from "../shared/http";

interface ClientsContextValue {
  clients: ClientModel[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createClient: (input: CreateClientModel) => Promise<void>;
  updateClient: (id: string, input: UpdateClientModel) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
  clientById: (id: string) => ClientModel | undefined;
}

const ClientsContext = createContext<ClientsContextValue | undefined>(undefined);

type ServerClient = {
  id: number | string;
  firstName: string;
  lastName: string;
  email?: string;
  picture?: string;
  pictureUrl?: string;
  booksCount?: number;
  salesCount?: number;
};

const normaliseClient = (client: ServerClient): ClientModel => ({
  id: String(client.id),
  firstName: client.firstName,
  lastName: client.lastName,
  email: client.email,
  pictureUrl: client.picture ?? client.pictureUrl,
  salesCount: client.booksCount ?? client.salesCount ?? 0,
});

export const ClientsProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get<ServerClient[] | { data: ServerClient[] }>(
        "/clients/with-client-count",
      );
      const list = Array.isArray(response) ? response : response?.data ?? [];
      setClients(list.map(normaliseClient));
    } catch (err) {
      const messageText =
        err instanceof Error ? err.message : "Failed to load clients";
      setError(messageText);
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createClient = useCallback(
    async (input: CreateClientModel) => {
      const hide = message.loading("Creating client…");
      try {
        const payload: CreateClientModel & { pictureUrl?: string } = {
          ...input,
        };
        if (!payload.picture && payload.pictureUrl) {
          payload.picture = payload.pictureUrl;
        }
        delete payload.pictureUrl;
        if (payload.picture === "") {
          delete payload.picture;
        }

        const created = await http.post<ServerClient>("/clients", payload);
        setClients((prev) => [normaliseClient(created), ...prev]);
        hide();
        message.success("Client created");
      } catch (err) {
        hide();
        const messageText =
          err instanceof Error ? err.message : "Failed to create client";
        message.error(messageText);
        throw err;
      }
    },
    [],
  );

  const updateClient = useCallback(
    async (id: string, input: UpdateClientModel) => {
      const hide = message.loading("Updating client…");
      try {
        const payload: UpdateClientModel & { pictureUrl?: string } = {
          ...input,
        };
        if (!payload.picture && payload.pictureUrl) {
          payload.picture = payload.pictureUrl;
        }
        delete payload.pictureUrl;
        if (payload.picture === "") {
          delete payload.picture;
        }

        const updated = await http.patch<ServerClient>(`/clients/${id}`, payload);
        setClients((prev) =>
          prev.map((client) =>
            client.id === id ? { ...client, ...normaliseClient(updated) } : client,
          ),
        );
        hide();
        message.success("Client updated");
      } catch (err) {
        hide();
        const messageText =
          err instanceof Error ? err.message : "Failed to update client";
        message.error(messageText);
        throw err;
      }
    },
    [],
  );

  const removeClient = useCallback(async (id: string) => {
    const hide = message.loading("Deleting client…");
    try {
      await http.delete(`/clients/${id}`);
      setClients((prev) => prev.filter((client) => client.id !== id));
      hide();
      message.success("Client deleted");
    } catch (err) {
      hide();
      const messageText =
        err instanceof Error ? err.message : "Failed to delete client";
      message.error(messageText);
      throw err;
    }
  }, []);

  const clientsMap = useMemo(() => {
    const map = new Map<string, ClientModel>();
    clients.forEach((client) => map.set(client.id, client));
    return map;
  }, [clients]);

  const clientById = useCallback(
    (id: string) => {
      return clientsMap.get(id);
    },
    [clientsMap],
  );

  const value: ClientsContextValue = {
    clients,
    loading,
    error,
    refresh,
    createClient,
    updateClient,
    removeClient,
    clientById,
  };

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
};

export const useClientsProvider = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClientsProvider must be used within ClientsProvider");
  }
  return context;
};


