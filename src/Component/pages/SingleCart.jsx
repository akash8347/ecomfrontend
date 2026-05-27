import React, { useContext } from 'react';
import { cartContext } from '../../context/ContextPro';
import { Row, Col, Typography, Button, Space, Image, Divider } from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SingleCart = ({ item }) => {
  const { dispatch } = useContext(cartContext);

  const getImageUrl = (imageName) => {
    let url = process.env.REACT_APP_BACKENDURL;
    return `${url}${imageName}`;
  };

  const dispatchRemove = () => {
    dispatch({ type: "SINGLE_CART_REMOVE", playload: item });
  };

  return (
    <>
      <Row align="middle" gutter={16} style={{ padding: '15px 0' }}>
        <Col span={4}>
          <Image
            width={80}
            src={getImageUrl(item.image_urls && item.image_urls[0] ? item.image_urls[0] : '')}
            fallback="https://via.placeholder.com/80?text=No+Image"
            style={{ objectFit: 'contain', borderRadius: '8px' }}
          />
        </Col>
        
        <Col span={10}>
          <Title level={5} style={{ margin: 0 }}>{item.name}</Title>
          <Text type="secondary">{item.company}</Text>
          <div style={{ marginTop: '5px' }}>
            <Text strong style={{ fontSize: '16px', color: '#f5222d' }}>₹ {item.price}</Text>
          </div>
        </Col>

        <Col span={6}>
          <Space>
            <Button 
              icon={<MinusOutlined />} 
              onClick={() => item.quantity > 1 && dispatch({ type: "DECREASE_QUANTITY", playload: item.id })}
              disabled={item.quantity === 1}
            />
            <Text strong style={{ width: '30px', textAlign: 'center', display: 'inline-block' }}>{item.quantity}</Text>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => dispatch({ type: "INCREASE_QUANTITY", playload: item.id })}
            />
          </Space>
        </Col>

        <Col span={4} style={{ textAlign: 'right' }}>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={dispatchRemove}>
            Remove
          </Button>
        </Col>
      </Row>
      <Divider style={{ margin: '0' }} />
    </>
  );
}

export default SingleCart;