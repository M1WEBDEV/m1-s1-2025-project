import { useCallback, useMemo, useState } from "react";
import { message } from "antd";
import type {
  AuthorWithStats,
  CreateAuthor,
  UpdateAuthor,
} from "../AuthorModel";
import { http } from "../../shared/http";

type AuthorResponse = AuthorWithStats | Omit<AuthorWithStats, "averageSales"> & {
  avgSales?: number;
};

const normaliseAuthor = (author: AuthorResponse): AuthorWithStats => ({
  ...author,
  averageSales:
    "averageSales" in author
      ? author.averageSales
      : author.avgSales ?? 0,
});

export const useAuthorsProvider = () => {
  const [authors, setAuthors] = useState<AuthorWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get<AuthorResponse[] | { data: AuthorResponse[] }>(
        "/authors",
      );
      const list = Array.isArray(response)
        ? response
        : response?.data ?? [];
      setAuthors(list.map(normaliseAuthor));
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to load authors";
      setError(messageText);
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAuthor = useCallback(
    async (author: CreateAuthor) => {
      const hide = message.loading("Creating author…");
      try {
        await http.post<AuthorResponse>("/authors", author);
        hide();
        message.success("Author created");
        loadAuthors();
      } catch (err) {
        hide();
        const messageText = err instanceof Error ? err.message : "Failed to create author";
        message.error(messageText);
      }
    },
    [loadAuthors],
  );

  const updateAuthor = useCallback(
    async (id: string, input: UpdateAuthor) => {
      const hide = message.loading("Updating author…");
      try {
        await http.patch<AuthorResponse>(`/authors/${id}`, input);
        hide();
        message.success("Author updated");
        loadAuthors();
      } catch (err) {
        hide();
        const messageText = err instanceof Error ? err.message : "Failed to update author";
        message.error(messageText);
      }
    },
    [loadAuthors],
  );

  const deleteAuthor = useCallback(
    async (id: string) => {
      const hide = message.loading("Deleting author…");
      try {
        await http.delete(`/authors/${id}`);
        hide();
        message.success("Author deleted");
        setAuthors((prev) => prev.filter((author) => String(author.id) !== String(id)));
      } catch (err) {
        hide();
        const messageText = err instanceof Error ? err.message : "Failed to delete author";
        message.error(messageText);
      }
    },
    [],
  );

  const authorsMap = useMemo(() => {
    const map = new Map<string, AuthorWithStats>();
    authors.forEach((author) => map.set(String(author.id), author));
    return map;
  }, [authors]);

  return {
    authors,
    authorsMap,
    loading,
    error,
    loadAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
  };
};

