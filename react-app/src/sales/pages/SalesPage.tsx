import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { useSales } from "../useSales";
import type { SaleModel } from "../SaleModel";
import { http } from "../../shared/http";
import type { ClientModel } from "../../clients/ClientModel";
import type { BookModel } from "../../books/BookModel";
import { CreateSaleModal } from "../../books/components/CreateSaleModal";
import { Route as salesRoute } from "../../routes/sales";

interface Option {
  label: string;
  value: string;
}

export const SalesPage = () => {
  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const [bookOptions, setBookOptions] = useState<Option[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | undefined>();
  const [selectedBook, setSelectedBook] = useState<string | undefined>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { sales, loading, addSale, removeSale, creating } = useSales({
    clientId: selectedClient,
    bookId: selectedBook,
  });

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await http.get<ClientModel[] | { data: ClientModel[] }>("/clients");
        const clients = Array.isArray(response) ? response : response?.data ?? [];
        setClientOptions(
          clients.map((client) => ({
            label: `${client.firstName} ${client.lastName}`.trim(),
            value: String(client.id),
          })),
        );
      } catch (err) {
        const messageText = err instanceof Error ? err.message : "Failed to load clients";
        message.error(messageText);
      }
    };

    const loadBooks = async () => {
      try {
        const response = await http.get<BookModel[] | { data: BookModel[] }>("/books");
        const books = Array.isArray(response) ? response : response?.data ?? [];
        setBookOptions(
          books.map((book) => ({
            label: `${book.title} (${book.yearPublished})`,
            value: String(book.id),
          })),
        );
      } catch (err) {
        const messageText = err instanceof Error ? err.message : "Failed to load books";
        message.error(messageText);
      }
    };

    void loadClients();
    void loadBooks();
  }, []);

  const columns: ColumnsType<SaleModel> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      render: (value) => dayjs(value).format("MMM D, YYYY"),
    },
    {
      title: "Client",
      dataIndex: ["client", "fullName"],
      key: "client",
      render: (_val, record) => record.client?.fullName ?? "—",
    },
    {
      title: "Book",
      dataIndex: ["book", "title"],
      key: "book",
      render: (_val, record) => record.book?.title ?? "—",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() =>
            Modal.confirm({
              title: "Delete this sale?",
              okText: "Delete",
              okButtonProps: { danger: true },
              onOk: () => removeSale(record.id),
            })
          }
        >
          Delete
        </Button>
      ),
    },
  ];

  const totalSales = sales.length;

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedClient) {
      const clientLabel = clientOptions.find((option) => option.value === selectedClient)
        ?.label;
      if (clientLabel) parts.push(`Client: ${clientLabel}`);
    }
    if (selectedBook) {
      const bookLabel = bookOptions.find((option) => option.value === selectedBook)?.label;
      if (bookLabel) parts.push(`Book: ${bookLabel}`);
    }
    return parts.join(" • ") || "All sales";
  }, [selectedClient, selectedBook, clientOptions, bookOptions]);

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {}
      <div
        style={{
          background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          color: "white",
          padding: "80px 24px 60px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Typography.Title
            level={1}
            style={{
              color: "white",
              fontSize: "clamp(32px, 4vw, 48px)",
              marginBottom: 12,
              fontWeight: 700,
            }}
          >
            Sales
          </Typography.Title>
          <Typography.Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 18,
            }}
          >
            {filterSummary}
          </Typography.Text>
        </div>
      </div>

      {}
      <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "none",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap="large">
              <Select
                allowClear
                placeholder="Filter by client"
                style={{ minWidth: 200, flex: 1 }}
                size="large"
                options={clientOptions}
                value={selectedClient}
                onChange={(value) => setSelectedClient(value)}
                onClear={() => setSelectedClient(undefined)}
              />
              <Select
                allowClear
                placeholder="Filter by book"
                style={{ minWidth: 200, flex: 1 }}
                size="large"
                options={bookOptions}
                value={selectedBook}
                onChange={(value) => setSelectedBook(value)}
                onClear={() => setSelectedBook(undefined)}
              />
              <Input
                readOnly
                style={{ minWidth: 160, flex: 1 }}
                size="large"
                value={`Total: ${totalSales}`}
              />
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="large"
                onClick={() => setIsCreateOpen(true)}
                disabled={creating}
                style={{
                  borderRadius: 12,
                  height: 40,
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  border: "none",
                }}
              >
                Record Sale
              </Button>
            </Flex>
          </Card>

          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              border: "none",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Table<SaleModel>
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={sales}
              pagination={{ pageSize: 10 }}
              style={{
                borderRadius: 12,
                overflow: "hidden",
              }}
              locale={{
                emptyText: (
                  <div style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                    <Typography.Title level={4} style={{ color: "#86868b" }}>
                      No sales recorded yet
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      Start recording sales to track your business performance
                    </Typography.Text>
                  </div>
                ),
              }}
            />
          </Card>
        </Space>
      </div>

      <CreateSaleModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={addSale}
        clientOptions={clientOptions}
        bookOptions={bookOptions}
        defaultClientId={selectedClient}
        defaultBookId={selectedBook}
        submitting={creating}
      />
    </div>
  );
};


