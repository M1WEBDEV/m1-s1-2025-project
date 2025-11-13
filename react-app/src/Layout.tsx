import { Link, useLocation } from "@tanstack/react-router";
import { Route as indexRoute } from "./routes/index";
import { Route as aboutRoute } from "./routes/about";
import { Route as booksRoute } from "./routes/books";
import { Route as authorsRoute } from "./routes/authors/index";
import { Route as clientsRoute } from "./routes/clients";
import { Route as salesRoute } from "./routes/sales";
import { useState, useEffect } from "react";
import {
  BookOutlined,
  HomeOutlined,
  InfoOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Typography, Space, Button } from "antd";
import { BookIcon } from "./shared/ui/BookIcon";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { key: "home", label: "Home", to: indexRoute.to, icon: <HomeOutlined /> },
    { key: "books", label: "Books", to: booksRoute.to, icon: <BookOutlined /> },
    { key: "authors", label: "Authors", to: authorsRoute.to, icon: <TeamOutlined /> },
    { key: "clients", label: "Clients", to: clientsRoute.to, icon: <UserOutlined /> },
    { key: "sales", label: "Sales", to: salesRoute.to, icon: <ShoppingCartOutlined /> },
    { key: "about", label: "About", to: aboutRoute.to, icon: <InfoOutlined /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      {}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: scrolled
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(0, 0, 0, 0.08)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 20px rgba(0, 0, 0, 0.05)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {}
          <Link
            to={indexRoute.to}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              fontSize: 20,
              fontWeight: 600,
              color: "#1d1d1f",
              letterSpacing: "-0.02em",
            }}
          >
            <BookIcon size={24} style={{ marginRight: 8 }} />
            <span>Babel's Library</span>
          </Link>

          {/* Desktop Navigation */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive(item.to) ? "#0071e3" : "#1d1d1f",
                  background: isActive(item.to) ? "rgba(0, 113, 227, 0.1)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.to)) {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.to)) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              fontSize: 20,
            }}
            className="mobile-menu-btn"
          />
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            style={{
              display: "none",
              flexDirection: "column",
              padding: "16px 24px",
              borderTop: "1px solid rgba(0, 0, 0, 0.08)",
              background: "rgba(255, 255, 255, 0.98)",
            }}
            className="mobile-nav"
          >
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  color: isActive(item.to) ? "#0071e3" : "#1d1d1f",
                  background: isActive(item.to) ? "rgba(0, 113, 227, 0.1)" : "transparent",
                  textDecoration: "none",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ minHeight: "calc(100vh - 64px)" }}>{children}</main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-nav {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
