import { Button, Card, Space, Typography } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { BookModel } from "../BookModel";
import { AvatarImg } from "../../shared/ui/AvatarImg";
import { Link } from "@tanstack/react-router";

interface BookListItemProps {
  book: BookModel;
  onEdit: (book: BookModel) => void;
  onDelete: (id: string) => void;
}

export const BookListItem = ({ book, onEdit, onDelete }: BookListItemProps) => {
  const authorName =
    book.author.fullName ?? `${book.author.firstName} ${book.author.lastName}`.trim();

  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      actions={[
        <Link
          key="view"
          to="/books/$bookId"
          params={{ bookId: book.id }}
          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
        >
          <EyeOutlined /> View
        </Link>,
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={(e) => { e.stopPropagation(); onEdit(book); }}
        >
          Edit
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => { e.stopPropagation(); onDelete(book.id); }}
        >
          Delete
        </Button>,
      ]}
    >
      <Space align="start" size="large">
        <AvatarImg name={book.title} src={book.pictureUrl} size={72} />
        <Space direction="vertical" size={4}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {book.title}
          </Typography.Title>
          <Typography.Text>
            {authorName} • {book.yearPublished}
          </Typography.Text>
          {book.description && (
            <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
              {book.description}
            </Typography.Paragraph>
          )}
          <Typography.Text type="secondary">
            Sales: {book.salesCount ?? 0}
          </Typography.Text>
        </Space>
      </Space>
    </Card>
  );
};
