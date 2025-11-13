import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import type { AuthorWithStats } from "../AuthorModel";
import { http } from "../../shared/http";

interface UseAuthorDetailsResult {
  author: AuthorWithStats | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAuthorDetailsProvider(authorId: string): UseAuthorDetailsResult {
  const [author, setAuthor] = useState<AuthorWithStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAuthor = useCallback(async () => {
    setLoading(true);
    try {
      type ServerAuthor = {
        id: string;
        name?: string;
        firstName?: string;
        lastName?: string;
        picture?: string | null;
        booksCount?: number;
        averageSales?: number;
        books?: Array<{
          id: string;
          title: string;
          yearPublished: number;
          picture?: string | null;
        }>;
      };

      const response = await http.get<ServerAuthor | { data: ServerAuthor }>(
        `/authors/${authorId}`,
      );
      const data = (response as { data?: ServerAuthor })?.data ?? (response as ServerAuthor);

      const name = data.name ?? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
      const books = (data.books ?? []).map((b) => ({
        id: String(b.id),
        title: b.title,
        yearPublished: Number(b.yearPublished),
        pictureUrl: b.picture ?? undefined,
      }));

      setAuthor({
        id: String(data.id),
        name,
        pictureUrl: data.picture ?? undefined,
        booksCount: Number(data.booksCount ?? 0),
        averageSales: Number(data.averageSales ?? 0),
        books,
      });
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to load author";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    void fetchAuthor();
  }, [fetchAuthor]);

  return { author, loading, refresh: fetchAuthor };
}
