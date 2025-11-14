import { useCallback, useMemo, useState } from "react";
import { message } from "antd";
import type {
  BookModel,
  CreateBookModel,
  UpdateBookModel,
} from "../BookModel";
import { http } from "../../shared/http";

type BookResponse = BookModel & {
  author?: BookModel["author"];
  picture?: string; // Backend uses 'picture' field
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
    pictureUrl: book.picture ?? book.pictureUrl, // Map 'picture' from backend to 'pictureUrl'
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

export const useBookProvider = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await http.get<BookResponse[] | { data: BookResponse[] }>(
        "/books/with-client-count",
      );
      const list = Array.isArray(response) ? response : response?.data ?? [];
      setBooks(list.map(normaliseBook));
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to load books";
      setError(messageText);
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(
    async (book: CreateBookModel) => {
      const hide = message.loading("Creating book…");
      try {
        const created = await http.post<BookResponse>("/books", book);
        setBooks((prev) => [normaliseBook(created), ...prev]);
        hide();
        message.success("Book created");
      } catch (err) {
        hide();
        const messageText = err instanceof Error ? err.message : "Failed to create book";
        message.error(messageText);
        throw err;
      }
    },
    [],
  );

  const updateBook = useCallback(
    async (id: string, input: UpdateBookModel) => {
      const hide = message.loading("Updating book…");
      try {
        const updated = await http.patch<BookResponse>(`/books/${id}`, input);
        setBooks((prev) =>
          prev.map((bookItem) =>
            bookItem.id === id ? { ...bookItem, ...normaliseBook(updated) } : bookItem,
          ),
        );
        hide();
        message.success("Book updated");
      } catch (err) {
        hide();
        const messageText = err instanceof Error ? err.message : "Failed to update book";
        message.error(messageText);
        throw err;
      }
    },
    [],
  );

  const deleteBook = useCallback(async (id: string) => {
    const hide = message.loading("Deleting book…");
    try {
      await http.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
      hide();
      message.success("Book deleted");
    } catch (err) {
      hide();
      const messageText = err instanceof Error ? err.message : "Failed to delete book";
      message.error(messageText);
      throw err;
    }
  }, []);

  const booksMap = useMemo(() => {
    const map = new Map<string, BookModel>();
    books.forEach((book) => map.set(book.id, book));
    return map;
  }, [books]);

  return {
    books,
    booksMap,
    loading,
    error,
    loadBooks,
    createBook,
    updateBook,
    deleteBook,
  };
};
