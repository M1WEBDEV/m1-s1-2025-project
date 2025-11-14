import { useCallback, useMemo, useState } from "react";
import { message } from "antd";
import type {
  AuthorWithStats,
  CreateAuthor,
  UpdateAuthor,
} from "../AuthorModel";
import { http } from "../../shared/http";

type ServerAuthor = {
  id: number | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  pictureUrl?: string;
  booksCount?: number;
  averageSales?: number;
  avgSales?: number;
  books?: Array<{
    id: number | string;
    title?: string;
    yearPublished?: number;
    picture?: string;
    pictureUrl?: string;
  }>;
};

const normaliseAuthor = (author: ServerAuthor): AuthorWithStats => {
  const fallbackName = `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim();
  const name = (author.name ?? fallbackName).trim() || "Unnamed author";
  const books = (author.books ?? []).map((book) => ({
    id: String(book.id),
    title: book.title ?? "Untitled",
    yearPublished: Number(book.yearPublished ?? 0),
    pictureUrl: book.picture ?? book.pictureUrl ?? undefined,
  }));

  return {
    id: String(author.id),
    name,
    pictureUrl: author.picture ?? author.pictureUrl ?? undefined,
    booksCount: Number(author.booksCount ?? books.length ?? 0),
    averageSales: Number(author.averageSales ?? author.avgSales ?? 0),
    books,
  };
};

const prepareAuthorPayload = <T extends { picture?: string }>(input: T) => {
  const payload = { ...input } as T & { pictureUrl?: string };
  if (!payload.picture && payload.pictureUrl) {
    payload.picture = payload.pictureUrl;
  }
  delete payload.pictureUrl;
  if (payload.picture === "") {
    delete payload.picture;
  }
  return payload;
};

export const useAuthorsProvider = () => {
  const [authors, setAuthors] = useState<AuthorWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get<ServerAuthor[] | { data: ServerAuthor[] }>(
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
        await http.post<ServerAuthor>("/authors", prepareAuthorPayload(author));
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
        await http.patch<ServerAuthor>(`/authors/${id}`, prepareAuthorPayload(input));
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

