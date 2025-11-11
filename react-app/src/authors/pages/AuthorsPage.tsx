import { useEffect, useState } from "react";
import { Table, Button, Modal, Avatar, Breadcrumb, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthorsProvider } from "../providers/useAuthorsProvider";
import type { Author } from "../AuthorModel";
import { CreateAuthorModal } from "../components/CreateAuthorModal";

export function AuthorsPage() {
  const { authors, loadAuthors, createAuthor, updateAuthor, deleteAuthor } =
    useAuthorsProvider();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  const handleOpenEdit = (author: Author) => {
    setAuthorToEdit(author);
    setEditOpen(true);
  };

  const columns: ColumnsType<Author> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() =>
            navigate({
              to: "/authors/authors/$authorId",
              params: { authorId: String(record.id) },
            })
          }
        >
          <Avatar src={record.pictureUrl} style={{ marginRight: 8 }}>
            {record.name[0]}
          </Avatar>
          {text}
        </Button>
      ),
    },
    {
      title: "Picture URL",
      dataIndex: "pictureUrl",
      key: "pictureUrl",
      render: (url) => (url ? <a href={url}>Open</a> : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleOpenEdit(record)}>
            Edit
          </Button>
          <Button
            danger
            type="link"
            onClick={() =>
              Modal.confirm({
                title: "Delete author?",
                onOk: () => deleteAuthor(String(record.id)),
              })
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Authors</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Authors</h1>

      <Button
        type="primary"
        onClick={() => setCreateOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add Author
      </Button>

      <Table rowKey="id" dataSource={authors} columns={columns} />

      {/* Create */}
      <CreateAuthorModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(values) => createAuthor(values)}
      />

      {/* Edit */}
      <CreateAuthorModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setAuthorToEdit(null);
        }}
        onSubmit={(values) => {
          if (!authorToEdit) return;
          updateAuthor(String(authorToEdit.id), values);
        }}
        initialValue={authorToEdit ?? undefined}
      />
    </div>
  );
}
