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
      <div className="home-container" style={{ background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', minHeight: '100vh', paddingBottom: '40px' }}>
        <div id="home" style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 20px 0' }}>
          <div style={{
            borderRadius: '28px',
            padding: '56px 32px',
            background: 'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 35%), linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #0ea5e9 100%)',
            color: '#fff',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)'
          }}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} lg={14}>
                <Space direction="vertical" size={18} style={{ width: '100%' }}>
                  <ShopOutlined style={{ fontSize: '46px' }} />
                  <Title style={{ color: '#fff', margin: 0, fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', lineHeight: 1.05 }}>
                    GOHIL ONLINE SHOP
                  </Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.84)', fontSize: '18px', maxWidth: '620px', margin: 0 }}>
                    Discover premium products, quick checkout, and clean browsing in one focused storefront.
                  </Paragraph>
                  <Space wrap>
                    <Button size="large" type="primary" shape="round" icon={<ShoppingOutlined />} onClick={() => navigate('/store')}>
                      Start Shopping
                    </Button>
                    <Button size="large" shape="round" ghost icon={<ArrowRightOutlined />} onClick={() => navigate('/aboutus')}>
                      Learn More
                    </Button>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={10}>
                <Card bordered={false} style={{ borderRadius: '22px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', color: '#fff' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Statistic title={<span style={{ color: 'rgba(255,255,255,0.72)' }}>Happy Customers</span>} value={2000} formatter={(value) => <CountUp end={value} duration={2.5} />} valueStyle={{ color: '#fff' }} />
                    </Col>
                    <Col span={12}>
                      <Statistic title={<span style={{ color: 'rgba(255,255,255,0.72)' }}>Store Rating</span>} value={5} suffix="/5" valueStyle={{ color: '#fff' }} />
                    </Col>
                    <Col span={12}>
                      <Statistic title={<span style={{ color: 'rgba(255,255,255,0.72)' }}>Regions</span>} value="Global" valueStyle={{ color: '#fff' }} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 20px 0' }}>
          <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)' }}>
                <SmileOutlined style={{ fontSize: '28px', color: '#2563eb' }} />
                <Statistic title="Happy Customers" value={2000} formatter={(value) => <CountUp end={value} duration={2.5} />} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)' }}>
                <ShopOutlined style={{ fontSize: '28px', color: '#16a34a' }} />
                <Statistic title="Store Rating" value={5} suffix="/5" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)' }}>
                <GlobalOutlined style={{ fontSize: '28px', color: '#7c3aed' }} />
                <Statistic title="Global Reach" value="India, USA" />
              </Card>
            </Col>
          </Row>
        </div>

        <div style={{ maxWidth: '960px', margin: '28px auto 56px', padding: '0 20px' }}>
          <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)' }}>
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              <Title level={3} style={{ marginBottom: 0 }}>Featured Products</Title>
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
