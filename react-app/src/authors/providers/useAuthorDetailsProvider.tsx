import { useEffect, useState } from "react";
import axios from "axios";
import type { Author } from "../AuthorModel";

interface UseAuthorDetailsResult {
  author: Author | null;
  loading: boolean;
}

export function useAuthorDetailsProvider(authorId: string): UseAuthorDetailsResult {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/authors/${authorId}`)
      .then((res) => {
        setAuthor(res.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [authorId]);

  return { author, loading };
}
