import { useCallback, useState } from "react";
import { message } from "antd";
import type { BookModel } from "../BookModel";
import { http } from "../../shared/http";

type BookResponse = BookModel & {
  author?: BookModel["author"];
};

const normaliseBook = (book: BookResponse): BookModel => {
  const author = book.author ?? {
    id: "",
    firstName: "",
    lastName: "",
    fullName: "",
    pictureUrl: "",
  };

  return {
    ...book,
    id: String(book.id),
    title: book.title ?? "",
    yearPublished: book.yearPublished ?? 0,
    pictureUrl: book.pictureUrl,
    description: book.description,
    author: {
      id: author.id ? String(author.id) : "",
      firstName: author.firstName ?? "",
      lastName: author.lastName ?? "",
      fullName:
        author.fullName ?? [author.firstName, author.lastName].filter(Boolean).join(" "),
      pictureUrl: author.pictureUrl,
    },
    salesCount: book.salesCount ?? 0,
  };
};

export const useBookDetailsProvider = (id: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<BookModel | null>(null);

  const loadBook = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await http.get<BookResponse | { data: BookResponse }>(`/books/${id}`);
      const data = (response as { data?: BookResponse })?.data ?? (response as BookResponse);
      setBook(normaliseBook(data));
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to load book";
      message.error(messageText);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return { isLoading, book, loadBook };
};

