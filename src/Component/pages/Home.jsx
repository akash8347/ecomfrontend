import React from 'react';
import { Row, Col, Statistic, Typography, Button, Space, Card, Divider } from 'antd';
import { ShoppingOutlined, GlobalOutlined, SmileOutlined, ShopOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Footer from './Footer';
import Header from './Header';
import Slider from './Slider';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

import './style.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="home-container home-bg">
        <div id="home" className="page-inner">
          <div className="hero-card">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} lg={14} className="hero-content-col">
                <Space direction="vertical" size={18} className="hero-content">
                  <div className="hero-mark"><ShopOutlined /></div>
                  <Title className="hero-title">GOHIL ONLINE SHOP</Title>
                  <Paragraph className="hero-sub">Discover premium products, quick checkout, and clean browsing in one focused storefront.</Paragraph>
                  <Space wrap>
                    <Button size="large" type="primary" className="btn-cta" icon={<ShoppingOutlined />} onClick={() => navigate('/store')}>
                      Start Shopping
                    </Button>
                    <Button size="large" className="btn-ghost" shape="round" ghost icon={<ArrowRightOutlined />} onClick={() => navigate('/aboutus')}>
                      Learn More
                    </Button>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={10}>
                <Card bordered={false} className="hero-stats-card">
                  <Row gutter={[16, 16]} className="hero-stats">
                    <Col span={24}>
                      <Statistic title={<span className="stat-title">Happy Customers</span>} value={2000} formatter={(value) => <CountUp end={value} duration={2.5} />} />
                    </Col>
                    <Col span={12}>
                      <Statistic title={<span className="stat-title">Store Rating</span>} value={5} suffix="/5" />
                    </Col>
                    <Col span={12}>
                      <Statistic title={<span className="stat-title">Regions</span>} value="Global" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        <div className="page-inner">
          <Row gutter={[20, 20]} className="home-stats-grid">
            <Col xs={24} md={8}>
              <Card bordered={false} className="stat-card">
                <SmileOutlined className="stat-icon blue" />
                <Statistic title="Happy Customers" value={2000} formatter={(value) => <CountUp end={value} duration={2.5} />} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} className="stat-card">
                <ShopOutlined className="stat-icon green" />
                <Statistic title="Store Rating" value={5} suffix="/5" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} className="stat-card">
                <GlobalOutlined className="stat-icon purple" />
                <Statistic title="Global Reach" value="India, USA" />
              </Card>
            </Col>
          </Row>
        </div>

        <div className="page-inner featured-section">
          <Card bordered={false} className="featured-card">
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              <Title level={3} className="featured-title">Featured Products</Title>
              <Divider style={{ margin: '8px 0 18px' }} />
              <Slider />
            </Space>
          </Card>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
