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
      const response = await http.get<AuthorWithStats | { data: AuthorWithStats }>(
        `/authors/${authorId}`,
      );
      const data = (response as { data?: AuthorWithStats })?.data ?? (response as AuthorWithStats);
      setAuthor({
        ...data,
        averageSales: data.averageSales ?? 0,
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
