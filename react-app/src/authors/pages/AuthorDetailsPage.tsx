import { useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Modal,
  Space,
  Spin,
  Statistic,
  Typography,
} from "antd";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAuthorDetailsProvider } from "../providers/useAuthorDetailsProvider";
import { Breadcrumbs } from "../../shared/ui/Breadcrumbs";
import { AvatarImg } from "../../shared/ui/AvatarImg";
import { Route as authorsRoute } from "../../routes/authors/index";
import { useAuthorsProvider } from "../providers/useAuthorsProvider";
import { CreateAuthorModal } from "../components/CreateAuthorModal";

export function AuthorDetailsPage() {
  const { authorId } = useParams({ from: "/authors/authors/$authorId" });
  const { author, loading, refresh } = useAuthorDetailsProvider(authorId);
  const { updateAuthor, deleteAuthor } = useAuthorsProvider();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Space
        direction="vertical"
        style={{ padding: 64, width: "100%", alignItems: "center" }}
      >
        <Spin size="large" />
        <Typography.Text type="secondary">Loading author…</Typography.Text>
      </Space>
    );
  }

  if (!author) {
    return (
      <div style={{ padding: 24 }}>
        <Typography.Text type="danger">Author not found.</Typography.Text>
      </div>
    );
  }

  const handleDelete = () => {
    Modal.confirm({
      title: `Delete ${author.name}?`,
      content: "This will remove the author and related books.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteAuthor(String(author.id));
        navigate({ to: authorsRoute.to });
      },
    });
  };

  const handleEdit = async (values: { name: string; picture?: string }) => {
    await updateAuthor(String(author.id), values);
    await refresh();
    setIsEditing(false);
  };

  return (
    <Space direction="vertical" style={{ width: "100%", padding: 24 }} size="large">
      <Breadcrumbs
        items={[
          { label: "Authors", to: authorsRoute.to },
          { label: author.name },
        ]}
      />

      <Card>
        <Space
          align="start"
          style={{ width: "100%", justifyContent: "space-between" }}
          size="large"
        >
          <Space size="large">
            <AvatarImg name={author.name} src={author.pictureUrl} size={112} />
            <Space direction="vertical" size="small">
              <Typography.Title level={2} style={{ marginBottom: 0 }}>
                {author.name}
              </Typography.Title>
              <Typography.Text type="secondary">
                Books authored: {author.booksCount}
              </Typography.Text>
              <Typography.Text type="secondary">
                Avg sales per book: {author.averageSales.toFixed(1)}
              </Typography.Text>
            </Space>
          </Space>
          <Space>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button danger onClick={handleDelete}>
              Delete
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="Performance">
        <Space size="large">
          <Statistic title="Books published" value={author.booksCount} />
          <Statistic
            title="Average sales per book"
            value={author.averageSales}
            precision={1}
          />
        </Space>
      </Card>

      <Card title="Profile">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">{author.name}</Descriptions.Item>
          <Descriptions.Item label="Avatar URL">
            {author.pictureUrl ? (
              <a href={author.pictureUrl} target="_blank" rel="noreferrer">
                {author.pictureUrl}
              </a>
            ) : (
              "No image available"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Books by this author">
        {author.books && author.books.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {author.books.map((b) => (
              <li key={b.id} style={{ marginBottom: 8 }}>
                <a
                  onClick={() =>
                    navigate({ to: "/books/$bookId", params: { bookId: String(b.id) } })
                  }
                  style={{ cursor: "pointer" }}
                >
                  {b.title} ({b.yearPublished})
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <Typography.Text type="secondary">No books for this author yet.</Typography.Text>
        )}
      </Card>

      <CreateAuthorModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleEdit}
        initialValue={author}
      />
    </Space>
  );
}

