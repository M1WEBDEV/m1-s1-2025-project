import { Outlet } from "@tanstack/react-router";
import { Space, Typography } from "antd";
import { BookList } from "../components/BookList";
import { Route as booksRoute } from "../../routes/books";

export function BooksPage() {
  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
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
            Books Catalog
          </Typography.Title>
          <Typography.Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 18,
            }}
          >
            Browse, manage, and record sales for your collection
          </Typography.Text>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <BookList />
      </div>
      <Outlet />
    </div>
  );
}
