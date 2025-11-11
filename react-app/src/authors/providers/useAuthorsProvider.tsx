import { useState } from "react";
import axios from "axios";
import type { Author, AuthorWithStats } from "../AuthorModel";

export const useAuthorsProvider = () => {
  const [authors, setAuthors] = useState<AuthorWithStats[]>([]);

  // Load all authors
  const loadAuthors = () => {
    axios
      .get("http://localhost:3000/authors")
      .then((res) => {
        // handle both data.data and direct data depending on backend format
        setAuthors(res.data.data ?? res.data);
      })
      .catch((err) => console.error("Error loading authors:", err));
  };

  // Create a new author
  const createAuthor = (author: Omit<Author, "id">) => {
    axios
      .post("http://localhost:3000/authors", author)
      .then(() => {
        loadAuthors();
      })
      .catch((err) => console.error("Error creating author:", err));
  };

  // Update author info
  const updateAuthor = (id: string, input: Partial<Author>) => {
    axios
      .patch(`http://localhost:3000/authors/${id}`, input)
      .then(() => {
        loadAuthors();
      })
      .catch((err) => console.error("Error updating author:", err));
  };

  // Delete author
  const deleteAuthor = (id: string) => {
    axios
      .delete(`http://localhost:3000/authors/${id}`)
      .then(() => {
        loadAuthors();
      })
      .catch((err) => console.error("Error deleting author:", err));
  };

  return {
    authors,
    loadAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
  };
};
