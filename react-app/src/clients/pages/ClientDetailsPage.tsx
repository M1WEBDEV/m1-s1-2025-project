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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Breadcrumbs } from "../../shared/ui/Breadcrumbs";
import { AvatarImg } from "../../shared/ui/AvatarImg";
import { useClientsProvider } from "../useClientsProvider";
import type { ClientModel } from "../ClientModel";
import { ClientForm, useClientForm } from "../components/ClientForm";
import { useSales } from "../../sales/useSales";
import type { SaleModel } from "../../sales/SaleModel";
import { CreateSaleModal } from "../../books/components/CreateSaleModal";
import { useBookProvider } from "../../books/providers/useBookProvider";
import { Route as clientsRoute } from "../../routes/clients";
import type { CreateSaleModel } from "../../sales/SaleModel";

export const ClientDetailsPage = () => {
  const { clientId } = useParams({ from: "/clients/$clientId" });
  const {
    clientById,
    refresh,
    updateClient,
    removeClient,
  } = useClientsProvider();
  const client = clientById(clientId);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateSaleOpen, setIsCreateSaleOpen] = useState(false);
  const [form] = useClientForm();
  const navigate = useNavigate();

  const {
    sales,
    loading: salesLoading,
    addSale,
    removeSale,
    creating: creatingSale,
  } = useSales({ clientId });
  const {
    books,
    loadBooks,
    loading: booksLoading,
  } = useBookProvider();

  useEffect(() => {
    if (!client) {
      void refresh();
    }
  }, [client, refresh]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const handleEditSave = async () => {
    if (!client) return;
    const values = await form.validateFields();
    await updateClient(client.id, values);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!client) return;
    Modal.confirm({
      title: `Delete ${client.firstName}?`,
      content: "Deleting this client will also remove their sales records.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        await removeClient(client.id);
        navigate({ to: clientsRoute.to });
      },
    });
  };

  const handleRecordSale = async (values: CreateSaleModel) => {
    await addSale(values);
    setIsCreateSaleOpen(false);
  };

  const salesColumns: ColumnsType<SaleModel> = [
    {
      title: "Book",
      dataIndex: ["book", "title"],
      key: "book",
      render: (_val, record) => {
        const title = record.book?.title ?? "Unknown book";
        const bookId = record.book?.id;
        return bookId ? (
          <Typography.Link
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: "/books/$bookId", params: { bookId } });
            }}
          >
            {title}
          </Typography.Link>
        ) : (
          title
        );
      },
    },
    {
      title: "Author",
      dataIndex: ["book", "authorName"],
      key: "author",
      render: (_val, record) => record.book?.authorName ?? "—",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value: string) => dayjs(value).format("MMM D, YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
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
              title: "Remove sale?",
              okText: "Remove",
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

  const bookOptions = useMemo(
    () =>
      books.map((book) => ({
        label: `${book.title} (${book.yearPublished})`,
        value: book.id,
      })),
    [books],
  );

  if (!client) {
    return (
      <Space
        direction="vertical"
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
        }}
      >
        <Spin size="large" />
        <Typography.Text type="secondary">Loading client…</Typography.Text>
      </Space>
    );
  }

  const fullName = `${client.firstName} ${client.lastName}`.trim();

  return (
    <Space direction="vertical" style={{ width: "100%", padding: 24 }}>
      <Breadcrumbs
        items={[
          { label: "Clients", to: clientsRoute.to },
          { label: fullName },
        ]}
      />

      <Card>
        <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
          <Space size="large">
            <AvatarImg name={fullName} src={client.pictureUrl} size={96} />
            <Space direction="vertical">
              <Typography.Title level={2} style={{ marginBottom: 0 }}>
                {fullName}
              </Typography.Title>
              {client.email && (
                <Typography.Link href={`mailto:${client.email}`}>
                  {client.email}
                </Typography.Link>
              )}
              <Typography.Text type="secondary">
                Total sales: {sales.length}
              </Typography.Text>
            </Space>
          </Space>
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              disabled={booksLoading || bookOptions.length === 0}
              onClick={() => setIsCreateSaleOpen(true)}
            >
              Record sale
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                form.setFieldsValue({
                  firstName: client.firstName,
                  lastName: client.lastName,
                  email: client.email,
                  picture: client.pictureUrl,
                });
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
            <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
              Delete
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="Client details">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="First name">{client.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last name">{client.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">
            {client.email ? (
              <Typography.Link href={`mailto:${client.email}`}>
                {client.email}
              </Typography.Link>
            ) : (
              "—"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Sales recorded">{sales.length}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Sales history"
        extra={
          <Button
            type="link"
            onClick={() => setIsCreateSaleOpen(true)}
            icon={<PlusOutlined />}
            disabled={booksLoading || bookOptions.length === 0}
          >
            Record sale
          </Button>
        }
      >
        <Table<SaleModel>
          rowKey="id"
          columns={salesColumns}
          dataSource={sales}
          loading={salesLoading}
          pagination={{ pageSize: 5 }}
          locale={{
            emptyText: "No sales recorded for this client yet.",
          }}
        />
      </Card>

      <Modal
        title={`Edit ${client.firstName}`}
        open={isEditing}
        okText="Save changes"
        onOk={() => void handleEditSave()}
        onCancel={() => setIsEditing(false)}
        destroyOnClose
      >
        <ClientForm
          form={form}
          initialValues={{
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            picture: client.pictureUrl,
          }}
        />
      </Modal>

      <CreateSaleModal
        open={isCreateSaleOpen}
        onClose={() => setIsCreateSaleOpen(false)}
        onSubmit={(values) =>
          handleRecordSale({
            ...values,
            clientId: client.id,
          })
        }
        clientOptions={[
          { label: fullName, value: client.id },
        ]}
        bookOptions={bookOptions}
        defaultClientId={client.id}
        submitting={creatingSale}
      />
    </Space>
  );
};


