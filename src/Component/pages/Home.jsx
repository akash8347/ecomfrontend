import React, { useEffect, useState } from 'react';
import { Row, Col, Statistic, Typography, Button, Space } from 'antd';
import { ShoppingOutlined, GlobalOutlined, SmileOutlined, ShopOutlined } from '@ant-design/icons';
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
      <div className="home-container" style={{ background: '#f0f2f5', minHeight: '100vh', paddingBottom: '40px' }}>
        
        {/* Hero Section */}
        <div id='home' style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)',
          color: '#fff',
          padding: '80px 20px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <Space direction="vertical" size="large">
            <ShopOutlined style={{ fontSize: '64px', color: '#fff' }} />
            <Title style={{ color: '#fff', margin: 0 }}>GOHIL ONLINE SHOP</Title>
            <Paragraph style={{ color: '#e6f7ff', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Discover premium products at unmatched prices. Enjoy up to 50% discount on exclusive collections today.
            </Paragraph>
            <Button type="primary" size="large" shape="round" icon={<ShoppingOutlined />} onClick={() => navigate('/store')}>
              Start Shopping
            </Button>
          </Space>
        </div>

        {/* Highlight Section */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8}>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <SmileOutlined style={{ fontSize: '36px', color: '#1890ff', marginBottom: '16px' }} />
                <Statistic title="Happy Customers" value={2000} formatter={(value) => <CountUp end={value} duration={2.5} />} />
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <ShopOutlined style={{ fontSize: '36px', color: '#52c41a', marginBottom: '16px' }} />
                <Statistic title="Store Rating" value={5} suffix=" / 5 Stars" />
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <GlobalOutlined style={{ fontSize: '36px', color: '#722ed1', marginBottom: '16px' }} />
                <Statistic title="Global Reach" value={"India, USA"} />
              </div>
            </Col>
          </Row>
        </div>

        {/* Slider Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px auto', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>Featured Products</Title>
          <Slider />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
