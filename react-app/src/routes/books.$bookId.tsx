import { createFileRoute } from "@tanstack/react-router";
import { BookDetailsPage } from "../books/pages/BookDetailsPage";

export const Route = createFileRoute("/books/$bookId")({
  component: BookDetailsPage,
});
