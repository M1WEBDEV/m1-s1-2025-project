import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
} from "antd";
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  HeartOutlined,
  GlobalOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function About() {
  const stats = [
    { title: "Books Cataloged", value: "10,000+", icon: <BookOutlined />, color: "#667eea" },
    { title: "Authors", value: "2,500+", icon: <TeamOutlined />, color: "#764ba2" },
    { title: "Active Clients", value: "5,000+", icon: <UserOutlined />, color: "#f093fb" },
    { title: "Sales Recorded", value: "50,000+", icon: <ShoppingCartOutlined />, color: "#4facfe" },
  ];

  const features = [
    {
      icon: <BookOutlined style={{ fontSize: 32, color: "#667eea" }} />,
      title: "Comprehensive Catalog",
      description:
        "Manage your entire book collection with detailed metadata, cover images, and publication information. Track every book in your library with ease.",
    },
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: "#764ba2" }} />,
      title: "Author Management",
      description:
        "Build rich author profiles with biographical information, track their publications, and analyze sales performance across their works.",
    },
    {
      icon: <UserOutlined style={{ fontSize: 32, color: "#f093fb" }} />,
      title: "Client Relationships",
      description:
        "Maintain detailed client profiles, track purchase history, and build lasting relationships with your customers through personalized service.",
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: "#4facfe" }} />,
      title: "Sales Analytics",
      description:
        "Record every sale, analyze trends, and gain insights into which books and authors are performing best in your market.",
    },
  ];

  const values = [
    {
      icon: <TrophyOutlined style={{ fontSize: 28, color: "#ff6b6b" }} />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of library management.",
    },
    {
      icon: <HeartOutlined style={{ fontSize: 28, color: "#ee5a6f" }} />,
      title: "Passion",
      description: "Our passion for books drives everything we do.",
    },
    {
      icon: <GlobalOutlined style={{ fontSize: 28, color: "#4facfe" }} />,
      title: "Accessibility",
      description: "Making library management accessible to everyone, everywhere.",
    },
    {
      icon: <RocketOutlined style={{ fontSize: 28, color: "#43e97b" }} />,
      title: "Innovation",
      description: "Continuously innovating to improve your experience.",
    },
  ];

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "120px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Title
            level={1}
            style={{
              color: "white",
              fontSize: "clamp(36px, 5vw, 64px)",
              marginBottom: 24,
              fontWeight: 700,
            }}
          >
            About Babel's Library
          </Title>
          <Paragraph
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.6,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            A modern, comprehensive library management system designed to help you
            organize, track, and grow your book collection with ease and elegance.
          </Paragraph>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "80px 24px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={12} sm={12} md={6} key={index}>
                <Card
                  style={{
                    textAlign: "center",
                    border: "none",
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                  className="card-hover"
                  bodyStyle={{ padding: "32px 24px" }}
                >
                  <div
                    style={{
                      fontSize: 40,
                      color: stat.color,
                      marginBottom: 16,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <Statistic
                    value={stat.value}
                    valueStyle={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#1d1d1f",
                    }}
                  />
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 14,
                      color: "#86868b",
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 24px", background: "#ffffff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Title level={2} style={{ fontSize: "clamp(28px, 4vw, 40px)", marginBottom: 16 }}>
              Powerful Features
            </Title>
            <Paragraph
              style={{
                fontSize: 18,
                color: "#86868b",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Everything you need to manage your library efficiently and beautifully
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={12} lg={6} key={index}>
                <Card
                  style={{
                    height: "100%",
                    border: "none",
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                  className="card-hover"
                  bodyStyle={{ padding: "32px" }}
                >
                  <div style={{ marginBottom: 20 }}>{feature.icon}</div>
                  <Title level={4} style={{ marginBottom: 12, fontSize: 20 }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: "#86868b", margin: 0, lineHeight: 1.6 }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: "80px 24px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Title level={2} style={{ fontSize: "clamp(28px, 4vw, 40px)", marginBottom: 16 }}>
              Our Values
            </Title>
            <Paragraph
              style={{
                fontSize: 18,
                color: "#86868b",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              The principles that guide everything we do
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    background: "white",
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    height: "100%",
                  }}
                  className="card-hover"
                >
                  <div style={{ marginBottom: 20 }}>{value.icon}</div>
                  <Title level={4} style={{ marginBottom: 12, fontSize: 18 }}>
                    {value.title}
                  </Title>
                  <Paragraph style={{ color: "#86868b", margin: 0 }}>
                    {value.description}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: "80px 24px", background: "#ffffff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Title level={2} style={{ fontSize: "clamp(28px, 4vw, 40px)", marginBottom: 24 }}>
            Our Mission
          </Title>
          <Paragraph
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#1d1d1f",
              lineHeight: 1.8,
              marginBottom: 32,
            }}
          >
            At Babel's Library, we believe that managing a book collection should be
            as beautiful and intuitive as the books themselves. Our platform combines
            powerful functionality with elegant design to create an experience that
            both librarians and book lovers will appreciate.
          </Paragraph>
          <Paragraph
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              color: "#86868b",
              lineHeight: 1.8,
            }}
          >
            Whether you're running a small independent bookstore, managing a community
            library, or simply organizing your personal collection, Babel's Library
            provides the tools you need to succeed. We're committed to continuous
            improvement and innovation, always listening to our users to make the
            platform better.
          </Paragraph>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Title
            level={2}
            style={{
              color: "white",
              fontSize: "clamp(28px, 4vw, 40px)",
              marginBottom: 24,
            }}
          >
            Ready to Get Started?
          </Title>
          <Paragraph
            style={{
              fontSize: 18,
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: 32,
            }}
          >
            Join thousands of librarians and book enthusiasts who trust Babel's Library
            to manage their collections.
          </Paragraph>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/about")({
  component: About,
});
