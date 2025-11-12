import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  Typography,
  Card,
  type TablePaginationConfig,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useBookProvider } from "../providers/useBookProvider";
import { BookListItem } from "./BookListItem";
import { CreateBookModal } from "./CreateBookModal";
import { useBookAuthorsProviders } from "../providers/useBookAuthorsProviders";
import type { BookModel, CreateBookModel, UpdateBookModel } from "../BookModel";
import { AvatarImg } from "../../shared/ui/AvatarImg";
import { BookIcon } from "../../shared/ui/BookIcon";

export function BookList() {
  const { books, loadBooks, deleteBook, updateBook, createBook, loading } =
    useBookProvider();
  const { authors, loadAuthors } = useBookAuthorsProviders();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBook, setSelectedBook] = useState<BookModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const handleOpenCreate = () => {
    setSelectedBook(null);
    setModalMode("create");
    setIsModalOpen(true);
    void loadAuthors();
  };

  const handleOpenEdit = (book: BookModel) => {
    setSelectedBook(book);
    setModalMode("edit");
    setIsModalOpen(true);
    void loadAuthors();
  };

  const handleDelete = (bookId: string, title: string) => {
    Modal.confirm({
      title: `Delete "${title}"?`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => deleteBook(bookId),
    });
  };

  const authorOptions = useMemo(
    () =>
      authors.map((author) => ({
        label: author.fullName ?? `${author.firstName} ${author.lastName}`.trim(),
        value: author.id,
      })),
    [authors],
  );

  const filteredBooks = useMemo(() => {
    if (!search) return books;
    const term = search.toLowerCase();
    return books.filter((book) => {
      const authorName =
        book.author.fullName ?? `${book.author.firstName} ${book.author.lastName}`;
      return (
        book.title.toLowerCase().includes(term) ||
        authorName.toLowerCase().includes(term)
      );
    });
  }, [books, search]);

  const columns: ColumnsType<BookModel> = [
    {
      title: "",
      dataIndex: "pictureUrl",
      key: "pictureUrl",
      width: 72,
      render: (value, record) => (
        <AvatarImg name={record.title} src={value} size="large" />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (value, record) => (
        <Typography.Link
          onClick={(event) => {
            event.stopPropagation();
            navigate({ to: "/books/$bookId", params: { bookId: record.id } });
          }}
        >
          {value}
        </Typography.Link>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Author",
      dataIndex: ["author", "fullName"],
      key: "author",
      render: (_value, record) =>
        record.author.fullName ??
        `${record.author.firstName} ${record.author.lastName}`,
      sorter: (a, b) =>
        (a.author.fullName ?? "").localeCompare(b.author.fullName ?? "", undefined, {
          sensitivity: "base",
        }),
    },
    {
      title: "Year",
      dataIndex: "yearPublished",
      key: "yearPublished",
      width: 120,
      sorter: (a, b) => a.yearPublished - b.yearPublished,
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
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleOpenEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id, record.title)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const pagination: TablePaginationConfig = {
    pageSize: 8,
    showSizeChanger: false,
  };

  const handleSubmit = async (values: CreateBookModel | UpdateBookModel) => {
    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        await createBook(values as CreateBookModel);
      } else if (selectedBook) {
        await updateBook(selectedBook.id, values as UpdateBookModel);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              placeholder="Search books or authors..."
              allowClear
              onSearch={setSearch}
              onChange={(event) => setSearch(event.target.value)}
              value={search}
              style={{ maxWidth: 400 }}
              size="large"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleOpenCreate}
              style={{
                borderRadius: 12,
                height: 40,
                fontWeight: 600,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                border: "none",
              }}
            >
              New Book
            </Button>
          </Space>

          <Table<BookModel>
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredBooks}
            pagination={pagination}
            onRow={(record) => ({
              onClick: () =>
                navigate({
                  to: "/books/$bookId",
                  params: { bookId: record.id },
                }),
              style: { cursor: "pointer" },
            })}
            expandable={{
              expandedRowRender: (record) => (
                <BookListItem
                  book={record}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => handleDelete(id, record.title)}
                />
              ),
              expandRowByClick: true,
            }}
            style={{
              borderRadius: 12,
              overflow: "hidden",
            }}
            locale={{
              emptyText: (
                <div style={{ padding: "60px 20px", textAlign: "center" }}>
                  <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
                    <BookIcon size={64} />
                  </div>
                  <Typography.Title level={4} style={{ color: "#86868b" }}>
                    No books found
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {search
                      ? "Try adjusting your search terms"
                      : "Create your first book to get started"}
                  </Typography.Text>
                </div>
              ),
            }}
          />
        </Space>
      </Card>

      <CreateBookModal
        open={isModalOpen}
        mode={modalMode}
        authors={authorOptions}
        initialValues={
          selectedBook
            ? {
                title: selectedBook.title,
                authorId: selectedBook.author.id,
                yearPublished: selectedBook.yearPublished,
                pictureUrl: selectedBook.pictureUrl,
                description: selectedBook.description,
              }
            : undefined
        }
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={isSubmitting}
      />
    </>
  );
}
