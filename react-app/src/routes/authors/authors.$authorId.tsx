import { createFileRoute } from "@tanstack/react-router";
import { AuthorDetailsPage } from "../../authors/pages/AuthorDetailsPage";

export const Route = createFileRoute("/authors/authors/$authorId")({
  component: AuthorDetailsPage,
});
