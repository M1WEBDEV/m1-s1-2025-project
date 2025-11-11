import { Breadcrumb, Card, Avatar, Spin } from "antd";
import { Link, useParams } from "@tanstack/react-router";
import { useAuthorDetailsProvider } from "../providers/useAuthorDetailsProvider";

export function AuthorDetailsPage() {
  // match route file: src/routes/authors/authors.$authorId.tsx
  const params = useParams({ from: "/authors/authors/$authorId" });
  const { authorId } = params;

  const { author, loading } = useAuthorDetailsProvider(authorId);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Spin />
      </div>
    );
  }

  if (!author) {
    return (
      <div style={{ padding: 24 }}>
        <p>Author not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/authors">Authors</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{author.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <Card.Meta
          avatar={
            <Avatar
              size={64}
              src={author.pictureUrl}
              style={{ backgroundColor: "#ccc" }}
            >
              {author.name[0]}
            </Avatar>
          }
          title={author.name}
          description={author.pictureUrl || "No picture URL"}
        />
      </Card>
    </div>
  );
}
