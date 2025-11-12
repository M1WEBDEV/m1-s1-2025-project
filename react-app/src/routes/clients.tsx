import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ClientsProvider } from "../clients/useClientsProvider";

const ClientsLayout = () => (
  <ClientsProvider>
    <Outlet />
  </ClientsProvider>
);

export const Route = createFileRoute("/clients")({
  component: ClientsLayout,
});

