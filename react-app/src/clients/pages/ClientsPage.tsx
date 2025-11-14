import { useMemo, useState } from "react";
import { Button, Input, Modal, Popconfirm, Space, Table, Typography, Card, type TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useClientsProvider } from "../useClientsProvider";
import type { ClientModel } from "../ClientModel";
import { useClientForm, ClientForm } from "../components/ClientForm";
import { AvatarImg } from "../../shared/ui/AvatarImg";
import { Route as clientsRoute } from "../../routes/clients";

export const ClientsPage = () => {
  const { clients, loading, createClient, updateClient, removeClient } =
    useClientsProvider();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientModel | null>(null);
  const [form] = useClientForm();
  const [clientUploading, setClientUploading] = useState(false);
  const navigate = useNavigate();

  const filteredClients = useMemo(() => {
    if (!search) return clients;
    const term = search.toLowerCase();
    return clients.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      return fullName.includes(term) || client.email?.toLowerCase().includes(term);
    });
  }, [clients, search]);

  const columns: ColumnsType<ClientModel> = [
    {
      title: "Client",
      dataIndex: "firstName",
      key: "name",
      render: (_val, record) => {
        const fullName = `${record.firstName} ${record.lastName}`.trim();
        return (
          <Space>
            <AvatarImg name={fullName} src={record.pictureUrl} size="large" />
            <div>
              <Typography.Text strong>{fullName}</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }} type="secondary">
                {record.email ?? "No email"}
              </Typography.Paragraph>
            </div>
          </Space>
        );
      },
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: "Sales",
      dataIndex: "salesCount",
      key: "salesCount",
      width: 120,
      sorter: (a, b) => (a.salesCount ?? 0) - (b.salesCount ?? 0),
      render: (value) => value ?? 0,
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => {
        const fullName = `${record.firstName} ${record.lastName}`.trim();
        return (
          <Space size="small">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate({
                  to: "/clients/$clientId",
                  params: { clientId: record.id },
                })
              }
            >
              View
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingClient(record);
                form.setFieldsValue({
                  firstName: record.firstName,
                  lastName: record.lastName,
                  email: record.email,
                  picture: record.pictureUrl,
                });
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete client"
              description={`Are you sure you want to delete "${fullName}"? This will remove the client and any associated sales records.`}
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleCreate = async () => {
    const values = await form.validateFields();
    await createClient(values);
    setIsCreateOpen(false);
    form.resetFields();
  };

  const handleUpdate = async () => {
    if (!editingClient) return;
    const values = await form.validateFields();
    await updateClient(editingClient.id, values);
    setEditingClient(null);
    form.resetFields();
  };

  const handleDelete = async (clientId: string) => {
    await removeClient(clientId);
  };

  const pagination: TablePaginationConfig = {
    pageSize: 8,
    showSizeChanger: false,
  };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
            Clients
          </Typography.Title>
          <Typography.Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 18,
            }}
          >
            Manage your customer relationships and sales history
          </Typography.Text>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            border: "none",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Space
              style={{ width: "100%", justifyContent: "space-between" }}
              wrap
            >
              <Input.Search
                placeholder="Search clients by name or email..."
                allowClear
                onSearch={setSearch}
                onChange={(event) => setSearch(event.target.value)}
                value={search}
                style={{ maxWidth: 400 }}
                size="large"
              />
              <Button
                icon={<PlusOutlined />}
                type="primary"
                size="large"
                onClick={() => {
                  form.resetFields();
                  setIsCreateOpen(true);
                }}
                style={{
                  borderRadius: 12,
                  height: 40,
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  border: "none",
                }}
              >
                New Client
              </Button>
            </Space>

            <Table<ClientModel>
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={filteredClients}
              pagination={pagination}
              style={{
                borderRadius: 12,
                overflow: "hidden",
              }}
              locale={{
                emptyText: (
                  <div style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
                    <Typography.Title level={4} style={{ color: "#86868b" }}>
                      No clients found
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {search
                        ? "Try adjusting your search terms"
                        : "Create your first client to get started"}
                    </Typography.Text>
                  </div>
                ),
              }}
            />
          </Space>
        </Card>
      </div>

      <Modal
        destroyOnClose
        title="Create client"
        open={isCreateOpen}
        okText="Create"
        onCancel={() => {
          setIsCreateOpen(false);
          form.resetFields();
        }}
        onOk={() => void handleCreate()}
        okButtonProps={{ disabled: clientUploading }}
        confirmLoading={clientUploading}
      >
        <ClientForm form={form} onUploadingChange={setClientUploading} />
      </Modal>

      <Modal
        destroyOnClose
        title={`Edit ${editingClient?.firstName ?? "client"}`}
        open={!!editingClient}
        okText="Save changes"
        onCancel={() => {
          setEditingClient(null);
          form.resetFields();
        }}
        onOk={() => void handleUpdate()}
        okButtonProps={{ disabled: clientUploading }}
        confirmLoading={clientUploading}
      >
        <ClientForm
          form={form}
          initialValues={
            editingClient
              ? {
                  firstName: editingClient.firstName,
                  lastName: editingClient.lastName,
                  email: editingClient.email,
                  picture: editingClient.pictureUrl,
                }
              : undefined
          }
          onUploadingChange={setClientUploading}
        />
      </Modal>
    </div>
  );
};


