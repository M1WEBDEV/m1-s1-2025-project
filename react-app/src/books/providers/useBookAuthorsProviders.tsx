import { useCallback, useState } from "react";
import type { BookModel } from "../BookModel";
import { message } from "antd";
import { http } from "../../shared/http";

type AuthorResponse = BookModel["author"] & {
  id: string;
  fullName?: string;
};

export const useBookAuthorsProviders = () => {
  const [authors, setAuthors] = useState<BookModel["author"][]>([]);
  const [loading, setLoading] = useState(false);

  const loadAuthors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await http.get<AuthorResponse[] | { data: AuthorResponse[] }>(
        "/authors",
      );
      const list = Array.isArray(response) ? response : response?.data ?? [];
      setAuthors(
        list.map((author) => ({
          id: String(author.id),
          firstName: author.firstName ?? author.fullName?.split(" ")[0] ?? "",
          lastName:
            author.lastName ?? author.fullName?.split(" ").slice(1).join(" ") ?? "",
          fullName:
            author.fullName ??
            [author.firstName, author.lastName].filter(Boolean).join(" "),
          pictureUrl: author.pictureUrl,
        })),
      );
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to load authors";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  return { authors, loadAuthors, loading };
};
