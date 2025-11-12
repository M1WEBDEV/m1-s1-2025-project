import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Card,
  Typography,
  Space,
  Row,
  Col,
  Button,
  Statistic,
  Carousel,
} from "antd";
import type { CarouselRef } from "antd/es/carousel";
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  RocketOutlined,
  TrophyOutlined,
  HeartOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { Route as booksRoute } from "./books";
import { Route as authorsRoute } from "./authors/index";
import { Route as clientsRoute } from "./clients";
import { Route as salesRoute } from "./sales";
import { Route as aboutRoute } from "./about";
import { BookIcon } from "../shared/ui/BookIcon";

const { Title, Paragraph } = Typography;

// Slide images - using high-quality colorful book images
const slides = [
  {
    image: "https://images.pexels.com/photos/3760323/pexels-photo-3760323.jpeg",
    title: "Welcome to Babel's Library",
    description: "The most beautiful and powerful library management system.",
  },
  {
    image: "https://images.pexels.com/photos/2952871/pexels-photo-2952871.jpeg",
    title: "Organize Your Collection",
    description: "Track your books, authors, and sales with elegance and ease.",
  },
  {
    image: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg",
    title: "Grow Your Business",
    description: "Manage customer relationships and analyze sales performance.",
  },
  {
    image: "https://images.unsplash.com/photo-1670523781755-8185f71c2285?w=1920&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29sb3JmdWwlMjBib29rc3xlbnwwfHwwfHx8MA%3D%3D",
    title: "Modern Library Management",
    description: "Built for the digital age with beautiful design and powerful features.",
  },
];

function Home() {
  const carouselRef = useRef<CarouselRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const booksCarouselRef = useRef<CarouselRef>(null);

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  const handleSlideChange = (current: number) => {
    setCurrentSlide(current);
  };

  // Featured books carousel data - 10 books with HD images
  const featuredBooks = [
    {
      image: "https://images.pexels.com/photos/3760323/pexels-photo-3760323.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "The Theory of Everything",
      author: "Stephen Hawking",
      description: "A groundbreaking exploration of the universe and the laws that govern it.",
      genre: "Science",
    },
    {
      image: "https://images.pexels.com/photos/2952871/pexels-photo-2952871.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description: "A timeless classic about love, society, and personal growth in 19th century England.",
      genre: "Novel",
    },
    {
      image: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      description: "An accessible guide to cosmology and the nature of time and space.",
      genre: "Science",
    },
    {
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "1984",
      author: "George Orwell",
      description: "A dystopian masterpiece warning about the dangers of totalitarianism.",
      genre: "Novel",
    },
    {
      image: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "The Origin of Species",
      author: "Charles Darwin",
      description: "The foundational work of evolutionary biology that changed science forever.",
      genre: "Science",
    },
    {
      image: "https://images.pexels.com/photos/159866/books-bookstore-book-reading-159866.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "A powerful story of racial injustice and childhood innocence in the American South.",
      genre: "Novel",
    },
    {
      image: "https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Cosmos",
      author: "Carl Sagan",
      description: "A journey through space and time exploring the universe and our place in it.",
      genre: "Science",
    },
    {
      image: "https://images.pexels.com/photos/159832/book-reading-reading-book-159832.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A tale of decadence and excess in Jazz Age America.",
      genre: "Novel",
    },
    {
      image: "https://images.pexels.com/photos/3760323/pexels-photo-3760323.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "The Selfish Gene",
      author: "Richard Dawkins",
      description: "A revolutionary perspective on evolution and the gene-centered view of life.",
      genre: "Science",
    },
    {
      image: "https://images.pexels.com/photos/2952871/pexels-photo-2952871.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      description: "A coming-of-age story that captures the essence of teenage rebellion and alienation.",
      genre: "Novel",
    },
  ];

  const quickLinks = [
    {
      title: "Books",
      description: "Browse and manage your book collection",
      icon: <BookOutlined style={{ fontSize: 48, color: "#667eea" }} />,
      route: booksRoute.to,
      color: "#667eea",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Authors",
      description: "Explore author profiles and statistics",
      icon: <TeamOutlined style={{ fontSize: 48, color: "#764ba2" }} />,
      route: authorsRoute.to,
      color: "#764ba2",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Clients",
      description: "Manage customer relationships",
      icon: <UserOutlined style={{ fontSize: 48, color: "#f093fb" }} />,
      route: clientsRoute.to,
      color: "#f093fb",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Sales",
      description: "Track sales and analyze performance",
      icon: <ShoppingCartOutlined style={{ fontSize: 48, color: "#4facfe" }} />,
      route: salesRoute.to,
      color: "#4facfe",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  const features = [
    {
      icon: <RocketOutlined style={{ fontSize: 32, color: "#667eea" }} />,
      title: "Lightning Fast",
      description: "Built for speed and performance",
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 32, color: "#764ba2" }} />,
      title: "Award Winning",
      description: "Recognized for excellence in design",
    },
    {
      icon: <HeartOutlined style={{ fontSize: 32, color: "#f093fb" }} />,
      title: "User Centered",
      description: "Designed with you in mind",
    },
  ];

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* Hero Section with Slideshow */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 600,
          overflow: "hidden",
        }}
      >
        {/* Previous Arrow Button */}
        {currentSlide > 0 && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: 24,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            }}
          />
        )}

        {/* Next Arrow Button */}
        {currentSlide < slides.length - 1 && (
          <Button
            type="text"
            icon={<ArrowRightOutlined />}
            onClick={handleNext}
            style={{
              position: "absolute",
              right: 24,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            }}
          />
        )}

        <Carousel
          ref={carouselRef}
          autoplay={{ delay: 1000 }}
          effect="fade"
          afterChange={handleSlideChange}
          style={{
            height: "100%",
          }}
          dots={{
            style: {
              bottom: 40,
            },
          }}
        >
          {slides.map((slide, index) => (
            <div key={index}>
              <div
                style={{
                  height: "100vh",
                  minHeight: 600,
                  position: "relative",
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Subtle overlay for better text readability */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)",
                  }}
                />
                {/* Content */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "140px 24px 100px",
                    textAlign: "center",
                    zIndex: 1,
                  }}
                >
                  <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
                    <Title
                      level={1}
                      style={{
                        color: "white",
                        fontSize: "clamp(40px, 6vw, 72px)",
                        marginBottom: 24,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {slide.title}
                    </Title>
                    <Paragraph
                      style={{
                        fontSize: "clamp(18px, 2.5vw, 24px)",
                        color: "rgba(255, 255, 255, 0.95)",
                        lineHeight: 1.6,
                        marginBottom: 40,
                        maxWidth: 700,
                        margin: "0 auto 40px",
                        textShadow: "0 1px 10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {slide.description}
                    </Paragraph>
                    <Space size="large" wrap>
                      <Link to={booksRoute.to}>
                        <Button
                          type="primary"
                          size="large"
                          style={{
                            height: 56,
                            padding: "0 32px",
                            fontSize: 16,
                            fontWeight: 600,
                            borderRadius: 12,
                            background: "white",
                            color: "#667eea",
                            border: "none",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                          }}
                          icon={<BookOutlined />}
                          iconPosition="end"
                        >
                          Explore Books
                        </Button>
                      </Link>
                      <Link to={salesRoute.to}>
                        <Button
                          size="large"
                          style={{
                            height: 56,
                            padding: "0 32px",
                            fontSize: 16,
                            fontWeight: 600,
                            borderRadius: 12,
                            background: "rgba(255, 255, 255, 0.2)",
                            color: "white",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          View Sales
                        </Button>
                      </Link>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Quick Links Section */}
      <section style={{ padding: "80px 24px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Title level={2} style={{ fontSize: "clamp(32px, 4vw, 48px)", marginBottom: 16 }}>
              Get Started
            </Title>
            <Paragraph
              style={{
                fontSize: 18,
                color: "#86868b",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Explore our powerful features and start managing your library today
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {quickLinks.map((link, index) => (
              <Col xs={24} sm={12} md={12} lg={6} key={index}>
                <Link to={link.route} style={{ textDecoration: "none" }}>
                  <Card
                    style={{
                      height: "100%",
                      border: "none",
                      borderRadius: 20,
                      background: "white",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      overflow: "hidden",
                      position: "relative",
                    }}
                    className="card-hover"
                    bodyStyle={{ padding: "40px 32px" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: link.gradient,
                      }}
                    />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ marginBottom: 24 }}>{link.icon}</div>
                      <Title
                        level={4}
                        style={{
                          marginBottom: 12,
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#1d1d1f",
                        }}
                      >
                        {link.title}
                      </Title>
                      <Paragraph
                        style={{
                          color: "#86868b",
                          margin: 0,
                          marginBottom: 16,
                          fontSize: 14,
                        }}
                      >
                        {link.description}
                      </Paragraph>
                      <div
                        style={{
                          color: link.color,
                          fontWeight: 600,
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        Explore <ArrowRightOutlined />
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 24px", background: "#ffffff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={12}>
              <Title level={2} style={{ fontSize: "clamp(32px, 4vw, 48px)", marginBottom: 24 }}>
                Built for Modern Libraries
              </Title>
              <Paragraph
                style={{
                  fontSize: 18,
                  color: "#86868b",
                  lineHeight: 1.8,
                  marginBottom: 32,
                }}
              >
                Our platform combines beautiful design with powerful functionality to
                help you manage your library efficiently. From cataloging books to
                tracking sales, everything you need is at your fingertips.
              </Paragraph>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {features.map((feature, index) => (
                  <div key={index} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        background: "rgba(102, 126, 234, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <Title level={4} style={{ marginBottom: 8, fontSize: 18 }}>
                        {feature.title}
                      </Title>
                      <Paragraph style={{ color: "#86868b", margin: 0 }}>
                        {feature.description}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <div
                style={{
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
                  height: "100%",
                }}
              >
                <Carousel
                  ref={booksCarouselRef}
                  autoplay={{ delay: 500 }}
                  effect="fade"
                  dots={false}
                  style={{ height: "100%" }}
                >
                  {featuredBooks.map((book, index) => (
                    <div key={index}>
                      <div
                        style={{
                          position: "relative",
                          height: "100%",
                          minHeight: 400,
                          backgroundImage: `url(${book.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {/* Overlay */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)",
                          }}
                        />
                        {/* Content */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "40px",
                            textAlign: "center",
                            color: "white",
                          }}
                        >
                          <div
                            style={{
                              background: "rgba(255, 255, 255, 0.1)",
                              backdropFilter: "blur(10px)",
                              borderRadius: 16,
                              padding: "24px",
                              maxWidth: 500,
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: 2,
                                marginBottom: 12,
                                color: "rgba(255, 255, 255, 0.8)",
                              }}
                            >
                              {book.genre}
                            </div>
                            <Title
                              level={3}
                              style={{
                                color: "white",
                                marginBottom: 12,
                                fontSize: "clamp(20px, 3vw, 28px)",
                                fontWeight: 700,
                                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                              }}
                            >
                              {book.title}
                            </Title>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                                marginBottom: 16,
                                color: "rgba(255, 255, 255, 0.95)",
                                textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              by {book.author}
                            </div>
                            <Paragraph
                              style={{
                                color: "rgba(255, 255, 255, 0.9)",
                                fontSize: 14,
                                lineHeight: 1.6,
                                margin: 0,
                                textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              {book.description}
                            </Paragraph>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Stats Preview */}
      <section style={{ padding: "80px 24px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: "center" }}>
                <Statistic
                  value={10000}
                  suffix="+"
                  valueStyle={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: "#667eea",
                  }}
                />
                <div style={{ marginTop: 8, color: "#86868b", fontSize: 14 }}>
                  Books Managed
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: "center" }}>
                <Statistic
                  value={2500}
                  suffix="+"
                  valueStyle={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: "#764ba2",
                  }}
                />
                <div style={{ marginTop: 8, color: "#86868b", fontSize: 14 }}>
                  Authors Tracked
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: "center" }}>
                <Statistic
                  value={5000}
                  suffix="+"
                  valueStyle={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: "#f093fb",
                  }}
                />
                <div style={{ marginTop: 8, color: "#86868b", fontSize: 14 }}>
                  Active Clients
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: "center" }}>
                <Statistic
                  value={50000}
                  suffix="+"
                  valueStyle={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: "#4facfe",
                  }}
                />
                <div style={{ marginTop: 8, color: "#86868b", fontSize: 14 }}>
                  Sales Recorded
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#1a1a1a",
          color: "#ffffff",
          padding: "60px 24px 30px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[48, 32]}>
            {/* Library Section */}
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 24 }}>
                <BookIcon size={40} style={{ marginBottom: 16 }} />
                <Title
                  level={4}
                  style={{
                    color: "#ffffff",
                    marginBottom: 16,
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  Babel's Library
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  The most beautiful and powerful library management system.
                </Paragraph>
              </div>
            </Col>

            {/* Features Section */}
            <Col xs={24} sm={12} md={6}>
              <Title
                level={5}
                style={{
                  color: "#ffffff",
                  marginBottom: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Features
              </Title>
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Link
                  to={booksRoute.to}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  Books
                </Link>
                <Link
                  to={authorsRoute.to}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  Authors
                </Link>
                <Link
                  to={clientsRoute.to}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  Clients
                </Link>
                <Link
                  to={salesRoute.to}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  Sales
                </Link>
              </Space>
            </Col>

            {/* Company Section */}
            <Col xs={24} sm={12} md={6}>
              <Title
                level={5}
                style={{
                  color: "#ffffff",
                  marginBottom: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Company
              </Title>
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Link
                  to={aboutRoute.to}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  About
                </Link>
              </Space>
            </Col>
          </Row>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255, 255, 255, 0.1)",
              margin: "40px 0 30px",
            }}
          />

          {/* Team Section */}
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={12}>
              <div>
                <Title
                  level={5}
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Development Team
                </Title>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: 15,
                        fontWeight: 500,
                      }}
                    >
                      Chiemerie Ekweanua
                    </div>
                    <a
                      href="https://www.instagram.com/david_ekwe?igsh=MThzYjkzZ2F4MWd6aA=="
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: 16,
                        transition: "color 0.2s",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#E4405F";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                      }}
                    >
                      <InstagramOutlined />
                    </a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: 14,
                      }}
                    >
                      Borshon Alfred Gomes
                    </div>
                    <a
                      href="https://www.instagram.com/xic0re?igsh=ZGFxM3h0Mmh1bGxt"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: 16,
                        transition: "color 0.2s",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#E4405F";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                      }}
                    >
                      <InstagramOutlined />
                    </a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: 14,
                      }}
                    >
                      Delassie Efua Brempong
                    </div>
                    <a
                      href="https://wa.me/233598777225"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: 16,
                        transition: "color 0.2s",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#25D366";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  </div>
                </Space>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div
                style={{
                  textAlign: "right",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: 13,
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  Copyright © {new Date().getFullYear()} Babel's Library. All rights reserved.
                </div>
                <Space size="middle">
                  <span style={{ cursor: "pointer" }}>Terms & Conditions</span>
                  <span style={{ cursor: "pointer" }}>Privacy Policy</span>
                  <span style={{ cursor: "pointer" }}>Cookies</span>
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </footer>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});
