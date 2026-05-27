
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Typography } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { cartContext } from "../../context/ContextPro";

const { Title, Text } = Typography;

const SingleProd = ({ item }) => {
  const {
    dispatch,
    state: { cart },
  } = useContext(cartContext);

  const getImageUrl = (imageName) => {
    let url = process.env.REACT_APP_BACKENDURL;
    return `${url}${imageName}`;
  };

  const isInCart = cart.some((p) => p.id === item.id);

  return (
    <Card
      hoverable
      style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}
      bodyStyle={{ padding: '16px' }}
      cover={
        <Link to={`/productdetail/${item.id}`}>
          <div
            style={{
              height: 260,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f7f9ff 0%, #ffffff 60%)'
            }}
          >
            <img
              alt="Product"
              src={getImageUrl(item.image_urls && item.image_urls[0] ? item.image_urls[0] : '')}
              style={{ maxWidth: '88%', maxHeight: '88%', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.08))' }}
            />
          </div>
        </Link>
      }
      actions={[
        isInCart ? (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => dispatch({ type: "DECREMENT", playload: item })}
            style={{ width: '100%', borderRadius: '999px' }}
          >
            Remove
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => dispatch({ type: "INCREMENT", playload: item })}
            style={{ width: '100%', borderRadius: '999px' }}
          >
            Add to Cart
          </Button>
        )
      ]}
    >
      <Link to={`/productdetail/${item.id}`}>
        <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          {item.company}
        </Text>
        <Card.Meta
          title={
            <span style={{ fontSize: '16px', whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '44px' }}>
              {item.name}
            </span>
          }
          description={
            <Title level={4} style={{ color: '#fa8c16', margin: '10px 0 0 0' }}>
              ₹ {item.price}
            </Title>
          }
        />
      </Link>
    </Card>
  );
};

export default SingleProd;
