import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Space,
  Input,
  Typography,
  Card,
  type TablePaginationConfig,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useAuthorsProvider } from "../providers/useAuthorsProvider";
import type { Author, AuthorWithStats } from "../AuthorModel";
import { CreateAuthorModal } from "../components/CreateAuthorModal";
import { AvatarImg } from "../../shared/ui/AvatarImg";
import { Route as authorsRoute } from "../../routes/authors/index";
import { Route as authorDetailsRoute } from "../../routes/authors/authors.$authorId";

export function AuthorsPage() {
  const {
    authors,
    loadAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    loading,
  } = useAuthorsProvider();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    void loadAuthors();
  }, [loadAuthors]);

  const handleOpenEdit = (author: Author) => {
    setAuthorToEdit(author);
    setEditOpen(true);
  };

  const handleDelete = async (authorId: string) => {
    await deleteAuthor(authorId);
  };

  const filteredAuthors = useMemo(() => {
    if (!search) return authors;
    const term = search.toLowerCase();
    return authors.filter((author) => author.name.toLowerCase().includes(term));
  }, [authors, search]);

  const columns: ColumnsType<AuthorWithStats> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_text, record) => (
        <Space>
          <AvatarImg name={record.name} src={record.pictureUrl} size="large" />
          <Typography.Link
            onClick={() =>
              navigate({
                to: authorDetailsRoute.to,
                params: { authorId: String(record.id) },
              })
            }
          >
            {record.name}
          </Typography.Link>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Books",
      dataIndex: "booksCount",
      key: "booksCount",
      width: 120,
      sorter: (a, b) => a.booksCount - b.booksCount,
    },
    {
      title: "Avg. sales",
      dataIndex: "averageSales",
      key: "averageSales",
      width: 140,
      sorter: (a, b) => a.averageSales - b.averageSales,
      render: (value) => value.toFixed(1),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() =>
              navigate({
                to: authorDetailsRoute.to,
                params: { authorId: String(record.id) },
              })
            }
          >
            View
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete author"
            description={`Are you sure you want to delete "${record.name}"?`}
            onConfirm={() => handleDelete(String(record.id))}
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
      ),
    },
  ];

  const pagination: TablePaginationConfig = {
    pageSize: 10,
    showSizeChanger: false,
  };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            Authors
          </Typography.Title>
          <Typography.Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 18,
            }}
          >
            Track author performance and manage their profiles
          </Typography.Text>
        </div>
      </div>

      {}
      <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            border: "none",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <Space
            direction="vertical"
            size="large"
            style={{ width: "100%" }}
          >
            <Space
              style={{ width: "100%", justifyContent: "space-between" }}
              wrap
            >
              <Input.Search
                placeholder="Search authors by name..."
                allowClear
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onSearch={setSearch}
                style={{ maxWidth: 400 }}
                size="large"
              />
              <Button
                type="primary"
                size="large"
                onClick={() => setCreateOpen(true)}
                style={{
                  borderRadius: 12,
                  height: 40,
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                + New Author
              </Button>
            </Space>

            <Table<AuthorWithStats>
              rowKey="id"
              loading={loading}
              dataSource={filteredAuthors}
              columns={columns}
              pagination={pagination}
              style={{
                borderRadius: 12,
                overflow: "hidden",
              }}
              locale={{
                emptyText: (
                  <div style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>👤</div>
                    <Typography.Title level={4} style={{ color: "#86868b" }}>
                      No authors found
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {search
                        ? "Try adjusting your search terms"
                        : "Create your first author to get started"}
                    </Typography.Text>
                  </div>
                ),
              }}
            />
          </Space>
        </Card>
      </div>

      <CreateAuthorModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (values) => {
          await createAuthor(values);
          setCreateOpen(false);
        }}
        loading={loading}
      />

      <CreateAuthorModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setAuthorToEdit(null);
        }}
        onSubmit={async (values) => {
          if (!authorToEdit) return;
          await updateAuthor(String(authorToEdit.id), values);
          setEditOpen(false);
          setAuthorToEdit(null);
        }}
        initialValue={authorToEdit ?? undefined}
        loading={loading}
      />
    </div>
  );
}

