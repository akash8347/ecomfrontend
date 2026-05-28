import React, { useContext } from 'react';
import { cartContext } from '../../context/ContextPro';
import { Row, Col, Typography, Button, Space, Image, Tag } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatPrice, getDiscountPercent, getDiscountedPrice, getMarketPrice, getProductImageUrl, getProductKey } from '../../utils/pricing';

const { Title, Text } = Typography;

const SingleCart = ({ item }) => {
  const { dispatch } = useContext(cartContext);
  const productKey = getProductKey(item);
  const salePrice = getDiscountedPrice(item);
  const marketPrice = getMarketPrice(item);
  const discountPercent = getDiscountPercent(item);
  const itemTotal = formatPrice(salePrice * (item.quantity || 1));

  const getImageUrl = (imageName) => {
    let url = process.env.REACT_APP_BACKENDURL;
    return `${url}${imageName}`;
  };

  const dispatchRemove = () => {
    dispatch({ type: "SINGLE_CART_REMOVE", playload: item });
  };

  return (
    <>
      <Row
        align="middle"
        gutter={16}
        style={{
          padding: '18px',
          marginBottom: '14px',
          borderRadius: '18px',
          border: '1px solid #ececec',
          background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)'
        }}
      >
        <Col xs={24} sm={5} md={4}>
          <div style={{
            width: '100%',
            minHeight: '120px',
            borderRadius: '16px',
            background: 'linear-gradient(180deg, #fbfbfb 0%, #f4f4f4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px'
          }}>
            <Image
              width={96}
              src={getImageUrl(getProductImageUrl(item))}
              fallback="https://via.placeholder.com/96?text=No+Image"
              preview={false}
              style={{ objectFit: 'contain', borderRadius: '10px' }}
            />
          </div>
        </Col>
        
        <Col xs={24} sm={11} md={12}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0, fontSize: '16px', lineHeight: 1.4 }}>{item.name}</Title>
            <Space size={8} wrap>
              <Tag color="default" style={{ borderRadius: '999px', margin: 0 }}>{item.company}</Tag>
              {item.category ? <Tag color="blue" style={{ borderRadius: '999px', margin: 0 }}>{item.category}</Tag> : null}
            </Space>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Ships in 2-4 days, easy returns available.
            </Text>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <Text strong style={{ fontSize: '18px', color: '#111' }}>₹ {formatPrice(salePrice)}</Text>
              {marketPrice > salePrice && <Text delete style={{ color: '#98a2b3', fontSize: '13px' }}>₹ {formatPrice(marketPrice)}</Text>}
              {discountPercent > 0 && <Text style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700 }}>{discountPercent}% OFF</Text>}
            </div>
          </Space>
        </Col>

        <Col xs={18} sm={6} md={5} style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Space size={8} style={{ background: '#f8fafc', borderRadius: '999px', padding: '8px 10px', border: '1px solid #ececec' }}>
            <Button 
              icon={<MinusOutlined />} 
              onClick={() => item.quantity > 1 && dispatch({ type: "DECREASE_QUANTITY", playload: productKey })}
              disabled={item.quantity === 1}
              shape="circle"
            />
            <Text strong style={{ width: '32px', textAlign: 'center', display: 'inline-block', fontSize: '15px' }}>{item.quantity}</Text>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => dispatch({ type: "INCREASE_QUANTITY", playload: productKey })}
              shape="circle"
            />
          </Space>
        </Col>

        <Col xs={24} sm={2} md={3} style={{ textAlign: 'right' }}>
          <Space direction="vertical" size={8} style={{ alignItems: 'flex-end' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>Total</Text>
            <Text strong style={{ fontSize: '16px', color: '#111' }}>₹ {itemTotal}</Text>
            <Button type="text" danger icon={<DeleteOutlined />} onClick={dispatchRemove} style={{ borderRadius: '12px', paddingInline: 0 }}>
            Remove
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}

export default SingleCart;