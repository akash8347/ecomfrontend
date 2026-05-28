import React, { useState, useEffect } from 'react';
import AdminHed from './AdminHed';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../pages/Loading';
import { Button, Card, Col, Descriptions, Empty, Row, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { formatPrice, getDiscountedPrice, getMarketPrice } from '../../utils/pricing';

const buildAddress = (shippingdata = {}) => {
  if (shippingdata.address) return shippingdata.address;
  return [shippingdata.street, shippingdata.area, shippingdata.city, shippingdata.state].filter(Boolean).join(', ');
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('adminJWT') || 'null');
  const token = admin?.token || '';
  const [order, setOrder] = useState(null);
  const url = process.env.REACT_APP_BACKENDURL || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/admin/singleorder/${id}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        );

        const data = await response.json();
        setOrder(data.singleorder || data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [id, token, url]);

  const viewProductDetails = (product) => {
    
    navigate(`/adminprodetail/${product}`);
  };

  const orderItems = order ? (order.items || order.orderedProducts || []) : [];
  const shippingDetails = order?.shippingdata || {};
  const customerName = shippingDetails.name || order?.customer_name || order?.user_id?.name || '-';
  const customerMobile = shippingDetails.mobile || order?.customer_mobile || order?.user_id?.mobile || '-';
  const customerAddress = buildAddress(shippingDetails) || order?.delivery_address || '-';

  return (
    <>
      <AdminHed />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', padding: '24px 16px 44px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: '18px' }}>
            <Button type="text" icon={<ArrowLeftOutlined />} style={{ width: 'fit-content', paddingLeft: 0 }} onClick={() => navigate('/adminorders')}>
              Back to orders
            </Button>
            <Typography.Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Operations</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>Order details</Typography.Title>
          </Space>

          {order ? (
            <Card bordered={false} style={{ borderRadius: '20px', boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)' }}>
              <Row gutter={[16, 16]} align="top">
                <Col xs={24}>
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Order ID">{order.id || order.order_id}</Descriptions.Item>
                    <Descriptions.Item label="Date">{new Date(order.created_at || order.order_created_at).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Total Cost">₹ {formatPrice(order.totalCost || order.total_cost)}</Descriptions.Item>
                    <Descriptions.Item label="Status"><Tag color={(order.order_status || order.orderStatus) === 'Delivered' ? 'green' : 'gold'}>{order.order_status || order.orderStatus}</Tag></Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>

              <Card bordered={false} style={{ marginTop: '16px', borderRadius: '16px', background: '#f8fafc' }} bodyStyle={{ padding: '16px' }}>
                <Typography.Title level={5} style={{ marginTop: 0 }}>Customer details</Typography.Title>
                <Row gutter={[16, 12]}>
                  <Col xs={24} md={8}>
                    <Typography.Text type="secondary" style={{ display: 'block' }}>Customer name</Typography.Text>
                    <Typography.Text strong>{customerName}</Typography.Text>
                  </Col>
                  <Col xs={24} md={8}>
                    <Typography.Text type="secondary" style={{ display: 'block' }}>Mobile</Typography.Text>
                    <Typography.Text strong>{customerMobile}</Typography.Text>
                  </Col>
                  <Col xs={24} md={8}>
                    <Typography.Text type="secondary" style={{ display: 'block' }}>Delivery address</Typography.Text>
                    <Typography.Text strong>{customerAddress || '-'}</Typography.Text>
                  </Col>
                </Row>
              </Card>

              <div style={{ marginTop: '18px' }}>
                <Typography.Title level={4} style={{ marginBottom: 12 }}>Ordered items</Typography.Title>
                {orderItems.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {orderItems.map((item, index) => {
                      const product = item.product || item;
                      const productId = product.id || product._id || product.proid;

                      return (
                        <Card key={index} bordered={false} style={{ borderRadius: '14px', border: '1px solid #edf1f5' }} bodyStyle={{ padding: '12px 14px' }}>
                          <Row gutter={[12, 12]} align="middle">
                            <Col xs={24} md={16}>
                              <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 6 }}>{product.name}</Typography.Title>
                              <Typography.Text type="secondary" style={{ display: 'block' }}>Category: {product.category}</Typography.Text>
                              <Typography.Text type="secondary" style={{ display: 'block' }}>Company: {product.company}</Typography.Text>
                              <Typography.Text type="secondary" style={{ display: 'block' }}>Quantity: {item.quantity || item.order_quantity || 1}</Typography.Text>
                            </Col>
                            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                              <Typography.Text type="secondary" style={{ display: 'block' }}>Market</Typography.Text>
                              <Typography.Text strong style={{ display: 'block' }}>₹ {formatPrice(getMarketPrice(product))}</Typography.Text>
                              <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>Discounted</Typography.Text>
                              <Typography.Text strong style={{ display: 'block' }}>₹ {formatPrice(getDiscountedPrice(product))}</Typography.Text>
                              <Button size="small" style={{ marginTop: '10px' }} onClick={() => viewProductDetails(productId)}>View Details</Button>
                            </Col>
                          </Row>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Empty description="No items found" />
                )}
              </div>
            </Card>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetail;





  

    // const fetchData=()=>{

    //   var responseClone; // 1
    //   const {token}=admin;
    //   fetch(`${url}/admin/singleorder/${id}`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`
    //     }
    //   })
    //   .then(function (response) {
    //       responseClone = response.clone(); // 2
    //       return response.json();
    //   })
    //   .then(function (data) {
    //       // Do something with data
    //       setOrder(data)
    //   }, function (rejectionReason) { // 3
    //       console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
    //       responseClone.text() // 5
    //       .then(function (bodyText) {
    //           console.log('Received the following instead of valid JSON:', bodyText); // 6
    //       });
    //   });
    // }