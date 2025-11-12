import { createFileRoute } from "@tanstack/react-router";
import { ClientDetailsPage } from "../clients/pages/ClientDetailsPage";

export const Route = createFileRoute("/clients/$clientId")({
  component: ClientDetailsPage,
});

