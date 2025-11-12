import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Modal,
  Space,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams } from "@tanstack/react-router";
import { useBookDetailsProvider } from "../providers/useBookDetailsProvider";
import { Breadcrumbs } from "../../shared/ui/Breadcrumbs";
import { Route as booksRoute } from "../../routes/books";
import { AvatarImg } from "../../shared/ui/AvatarImg";
import { useSales } from "../../sales/useSales";
import type { SaleModel } from "../../sales/SaleModel";
import { CreateSaleModal } from "../components/CreateSaleModal";
import { http } from "../../shared/http";
import type { ClientModel } from "../../clients/ClientModel";
import { CreateBookModal } from "../components/CreateBookModal";
import { useBookProvider } from "../providers/useBookProvider";
import { useBookAuthorsProviders } from "../providers/useBookAuthorsProviders";
import type { UpdateBookModel } from "../BookModel";

interface BookDetailsContentProps {
  bookId: string;
}

export const BookDetailsContent = ({ bookId }: BookDetailsContentProps) => {
  const { isLoading, book, loadBook } = useBookDetailsProvider(bookId);
  const { updateBook } = useBookProvider();
  const { authors, loadAuthors } = useBookAuthorsProviders();

  const [clientOptions, setClientOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    sales,
    loading: salesLoading,
    addSale,
    removeSale,
    creating: creatingSale,
  } = useSales({ bookId });

  useEffect(() => {
    void loadBook();
  }, [loadBook]);

  useEffect(() => {
    const fetchClients = async () => {
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
    void fetchClients();
  }, []);

  const authorOptions = useMemo(
    () =>
      authors.map((author) => ({
        label: author.fullName ?? `${author.firstName} ${author.lastName}`.trim(),
        value: author.id,
      })),
    [authors],
  );

  const handleRecordSale = async (values: {
    clientId: string;
    bookId: string;
    date: string;
  }) => {
    await addSale({ ...values, bookId });
    setIsSaleOpen(false);
    await loadBook();
  };

  const handleDeleteSale = (saleId: string) => {
    Modal.confirm({
      title: "Remove this sale?",
      okText: "Remove",
      okButtonProps: { danger: true },
      onOk: async () => {
        await removeSale(saleId);
        await loadBook();
      },
    });
  };

  const handleEditBook = async (values: UpdateBookModel) => {
    setIsUpdating(true);
    try {
      await updateBook(bookId, values);
      await loadBook();
      setIsEditOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const salesColumns: ColumnsType<SaleModel> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value: string) => dayjs(value).format("MMM D, YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Client",
      dataIndex: ["client", "fullName"],
      key: "client",
      render: (_val, record) => record.client?.fullName ?? "—",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDeleteSale(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  if (isLoading || !book) {
    return (
      <Space
        direction="vertical"
        style={{ width: "100%", padding: 64, alignItems: "center" }}
      >
        <Spin size="large" />
        <Typography.Text type="secondary">Loading book…</Typography.Text>
      </Space>
    );
  }

  const authorName =
    book.author.fullName ??
    `${book.author.firstName} ${book.author.lastName}`.trim();

  return (
    <Space direction="vertical" style={{ width: "100%", padding: 24 }} size="large">
      <Breadcrumbs
        items={[
          { label: "Books", to: booksRoute.to },
          { label: book.title },
        ]}
      />

      <Card>
        <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
          <Space size="large">
            <AvatarImg name={book.title} src={book.pictureUrl} size={112} />
            <Space direction="vertical" size="small">
              <Typography.Title level={2} style={{ marginBottom: 4 }}>
                {book.title}
              </Typography.Title>
              <Typography.Text>{authorName}</Typography.Text>
              <Typography.Text type="secondary">
                Published in {book.yearPublished}
              </Typography.Text>
              <Typography.Text type="secondary">
                Total sales: {sales.length}
              </Typography.Text>
            </Space>
          </Space>
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              disabled={clientOptions.length === 0}
              onClick={() => {
                setIsSaleOpen(true);
              }}
            >
              Record sale
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                void loadAuthors();
                setIsEditOpen(true);
              }}
            >
              Edit book
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="About this book">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Title">{book.title}</Descriptions.Item>
          <Descriptions.Item label="Author">{authorName}</Descriptions.Item>
          <Descriptions.Item label="Publication year">
            {book.yearPublished}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {book.description ?? "No description available."}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Sales history"
        extra={
          <Button
            type="link"
            onClick={() => setIsSaleOpen(true)}
            icon={<PlusOutlined />}
            disabled={clientOptions.length === 0}
          >
            Record sale
          </Button>
        }
      >
        <Table<SaleModel>
          rowKey="id"
          loading={salesLoading}
          columns={salesColumns}
          dataSource={sales}
          pagination={{ pageSize: 8 }}
          locale={{ emptyText: "No sales recorded for this book yet." }}
        />
      </Card>

      <CreateSaleModal
        open={isSaleOpen}
        onClose={() => setIsSaleOpen(false)}
        onSubmit={(values) => handleRecordSale(values)}
        clientOptions={clientOptions}
        bookOptions={[
          { label: `${book.title} (${book.yearPublished})`, value: book.id },
        ]}
        defaultBookId={book.id}
        submitting={creatingSale}
      />

      <CreateBookModal
        open={isEditOpen}
        mode="edit"
        authors={authorOptions}
        initialValues={{
          title: book.title,
          authorId: book.author.id,
          yearPublished: book.yearPublished,
          pictureUrl: book.pictureUrl,
          description: book.description,
        }}
        onClose={() => setIsEditOpen(false)}
        onSubmit={(values) => handleEditBook(values as UpdateBookModel)}
        loading={isUpdating}
      />
    </Space>
  );
};

export const BookDetailsPage = () => {
  const { bookId } = useParams({ from: "/books/$bookId" });
  return <BookDetailsContent bookId={bookId} />;
};


