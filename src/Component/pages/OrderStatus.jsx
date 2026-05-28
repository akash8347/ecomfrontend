import { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { Button, Card, Empty, Space, Tag, Typography, Alert } from 'antd';
import Header from './Header';
import { AuthContext } from '../../context/AuthProvider.js';
import { cartContext } from '../../context/ContextPro.js';
import { formatPrice, getDiscountedPrice, getMarketPrice, getProductImageUrl } from '../../utils/pricing';
import './style.css';

const { Text, Title } = Typography;

const resolveOrderItems = (order) => {
  const items = order?.orderedProducts || order?.items || [];

  if (items.length > 0) {
    return items;
  }

  if (order?.product_name) {
    return [{
      product: {
        name: order.product_name,
        market_price: order.product_price,
        discounted_price: order.product_price,
        image_urls: order.image_urls || []
      },
      quantity: order.order_quantity || 1
    }];
  }

  return [];
};

const OrderStatus = () => {
  const { user } = useContext(AuthContext);
  const { dispatch, state } = useContext(cartContext);
  const location = useLocation();
  const orders = Array.isArray(state.useOrder) ? state.useOrder : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          return;
        }

        const { token } = user;
        const url = process.env.REACT_APP_BACKENDURL;
        const response = await fetch(`${url}/order/orderstatus`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const json = await response.json();

        if (!response.ok) {
          console.log(json);
          return;
        }

        dispatch({ type: 'ADD_ORDER', payload: json });
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [dispatch, user, location]);

  return (
    <>
      <Header />

      <div style={{ background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 20px 56px' }}>
        {!user ? (
          <Card style={{ borderRadius: '24px', textAlign: 'center', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }} bordered={false}>
            <Alert type="info" showIcon message="Login required" description="You need to sign in first to see your orders." style={{ marginBottom: '18px', borderRadius: '14px' }} />
            <Title level={3} style={{ marginTop: 0 }}>Your orders are waiting</Title>
            <Text type="secondary">Sign in to track what you’ve already purchased.</Text>
            <div style={{ marginTop: '18px' }}>
              <Link to="/login"><Button type="primary" size="large" style={{ borderRadius: '12px' }}>Login Here</Button></Link>
            </div>
          </Card>
        ) : orders.length === 0 ? (
          <Card style={{ borderRadius: '24px', textAlign: 'center', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }} bordered={false}>
            <Empty description={<span>You need to place an order first.</span>} />
            <div style={{ marginTop: '16px' }}>
              <Link to="/store"><Button type="primary" size="large" style={{ borderRadius: '12px' }}>Order Item</Button></Link>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'grid', gap: '18px' }}>
            {orders.map((order) => {
              const orderItems = resolveOrderItems(order);
              const orderId = order.order_id || order.id;
              const orderDate = moment(order.order_created_at || order.created_at).format('D-M-YYYY h:mm A');
              const orderStatus = order.order_status || order.orderStatus || 'Pending';
              const totalCost = order.totalCost || order.total_cost || 0;

              return (
                <Card key={orderId} style={{ borderRadius: '24px', border: '1px solid #ece7df', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }} bordered={false}>
                  <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: '16px' }}>
                    <Space wrap>
                      <Text strong>Order ID:</Text>
                      <Text>{orderId}</Text>
                      <Tag color={orderStatus === 'Delivered' ? 'green' : 'gold'} style={{ borderRadius: '999px', margin: 0 }}>{orderStatus}</Tag>
                    </Space>
                    <Text type="secondary">Placed on {orderDate}</Text>
                  </Space>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {orderItems.map((item, index) => {
                      const product = item.product || item;
                      const productName = product.name || item.name || 'Product';
                      const productImage = getProductImageUrl(product);
                      const salePrice = getDiscountedPrice(product);
                      const marketPrice = getMarketPrice(product);
                      const quantity = item.quantity || item.order_quantity || 1;
                      const itemTotal = salePrice * quantity;

                      return (
                        <div
                          key={`${orderId}-${index}`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '84px 1fr auto',
                            gap: '16px',
                            alignItems: 'center',
                            padding: '14px',
                            borderRadius: '16px',
                            background: '#fafafa',
                            border: '1px solid #f0f0f0'
                          }}
                        >
                          <div style={{ width: '84px', height: '84px', borderRadius: '14px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={`${process.env.REACT_APP_BACKENDURL}${productImage}`} alt={productName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>

                          <div>
                            <Text strong style={{ display: 'block', fontSize: '16px' }}>{productName}</Text>
                            <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>{product.company || item.company || 'Brand'}</Text>
                            <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>Qty: {quantity}</Text>
                            <Space size={10} wrap style={{ marginTop: '8px' }}>
                              <Text strong>₹ {formatPrice(salePrice)}</Text>
                              {marketPrice > salePrice && <Text delete type="secondary">₹ {formatPrice(marketPrice)}</Text>}
                              {marketPrice > salePrice && (
                                <Tag color="red" style={{ borderRadius: '999px', margin: 0 }}>
                                  {Math.round(((marketPrice - salePrice) / marketPrice) * 100)}% OFF
                                </Tag>
                              )}
                            </Space>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <Text type="secondary" style={{ display: 'block' }}>Item total</Text>
                            <Text strong style={{ fontSize: '16px' }}>₹ {formatPrice(itemTotal)}</Text>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <Text type="secondary">Order total</Text>
                    <Text strong style={{ fontSize: '18px' }}>₹ {formatPrice(totalCost)}</Text>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default OrderStatus;