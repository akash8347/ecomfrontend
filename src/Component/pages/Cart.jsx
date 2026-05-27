import React, { useContext } from 'react';
import Header from './Header';
import { cartContext } from '../../context/ContextPro';
import SingleCart from './SingleCart';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Empty, Button, Card, Row, Col, Divider } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Cart = () => {
  const { state: { cart, cartTotal } } = useContext(cartContext);
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          <ShoppingCartOutlined /> Your Shopping Cart
        </Title>
        
        {cart.length === 0 ? (
          <Card bordered={false} style={{ textAlign: 'center', padding: '60px 0', borderRadius: '12px' }}>
            <Empty
              description={<span style={{ fontSize: '18px', color: '#8c8c8c' }}>Your cart is empty!</span>}
            >
              <Button type="primary" size="large" onClick={() => navigate('/store')} style={{ marginTop: '20px' }}>
                Go to Store
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card bordered={false} style={{ borderRadius: '12px' }}>
                {cart.map((item) => <SingleCart key={item.id} item={item} />)}
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card bordered={false} style={{ borderRadius: '12px', position: 'sticky', top: '80px' }}>
                <Title level={4}>Order Summary</Title>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <Text type="secondary">Subtotal ({cart.length} items)</Text>
                  <Text strong>₹ {cartTotal}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <Text type="secondary">Shipping</Text>
                  <Text type="success">Free</Text>
                </div>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <Title level={3} style={{ margin: 0 }}>Total</Title>
                  <Title level={3} style={{ margin: 0, color: '#f5222d' }}>₹ {cartTotal}</Title>
                </div>
                
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  icon={<CreditCardOutlined />}
                  onClick={() => navigate('/shipping')}
                  style={{ height: '50px', fontSize: '16px' }}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default Cart;