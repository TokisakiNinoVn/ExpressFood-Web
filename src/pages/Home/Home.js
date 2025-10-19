import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Typography, Space } from 'antd';
import {
  RocketOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import './Home.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  const features = [
    {
      icon: <RocketOutlined style={{ fontSize: '48px', color: '#ff6b6b' }} />,
      title: 'Giao hàng nhanh chóng',
      description: 'Giao hàng trong vòng 30 phút',
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: '48px', color: '#ff6b6b' }} />,
      title: 'Đặt hàng 24/7',
      description: 'Phục vụ mọi lúc mọi nơi',
    },
    {
      icon: <AppstoreOutlined style={{ fontSize: '48px', color: '#ff6b6b' }} />,
      title: 'Đa dạng món ăn',
      description: 'Hàng trăm món ăn ngon',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={1} className="hero-title">
                  Đặt món ăn yêu thích
                  <span className="highlight"> chỉ trong vài click</span>
                </Title>
                <Paragraph className="hero-description">
                  Giao hàng nhanh chóng, món ăn ngon, giá cả phải chăng.
                  FoodExpress - Người bạn đồng hành cho mọi bữa ăn.
                </Paragraph>
                <Space size="middle">
                  <Link to="/foods">
                    <Button type="primary" size="large">
                      Xem thực đơn
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="large">Đăng ký ngay</Button>
                  </Link>
                </Space>
              </Space>
            </Col>
            <Col xs={24} lg={12}>
              <div className="hero-image">
                <div className="floating-food">🍕</div>
                <div className="floating-food">🍔</div>
                <div className="floating-food">🍜</div>
                <div className="floating-food">🍱</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <Title level={2} className="section-title">
            Tại sao chọn FoodExpress?
          </Title>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card className="feature-card" hoverable>
                  <Space direction="vertical" size="middle" align="center" style={{ width: '100%' }}>
                    {feature.icon}
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph className="feature-description">
                      {feature.description}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Space direction="vertical" size="large" align="center" style={{ width: '100%' }}>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Đói bụng rồi à?
            </Title>
            <Paragraph style={{ color: 'white', fontSize: '18px', opacity: 0.9, margin: 0 }}>
              Đặt món ngay để nhận ưu đãi hấp dẫn!
            </Paragraph>
            <Link to="/foods">
              <Button type="primary" size="large" ghost>
                Đặt món ngay
              </Button>
            </Link>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default Home;
