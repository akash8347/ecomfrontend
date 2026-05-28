
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Tag, Typography } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { cartContext } from "../../context/ContextPro";
import { formatPrice, getDiscountPercent, getDiscountedPrice, getMarketPrice, getProductImageUrl, getProductKey } from '../../utils/pricing';

const { Text } = Typography;

const SingleProd = ({ item }) => {
  const { dispatch, state: { cart } } = useContext(cartContext);
  const [isHovered, setIsHovered] = React.useState(false);
  const productKey = getProductKey(item);
  const ratingValue = item.rating || item.avgRating || item.stars;
  const salePrice = getDiscountedPrice(item);
  const marketPrice = getMarketPrice(item);
  const discountPercent = getDiscountPercent(item);

  const getImageUrl = (imageName) => {
    let url = process.env.REACT_APP_BACKENDURL;
    return `${url}${imageName}`;
  };

  const isInCart = cart.some((p) => (p.id || p._id) === productKey);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1px solid #ececec',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 16px 34px rgba(15, 23, 42, 0.12)' : '0 6px 16px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%'
      }}
    >
      <Link to={`/productdetail/${productKey}`} style={{ color: 'inherit' }}>
        <div style={{
          height: '260px',
          background: 'linear-gradient(180deg, #fbfbfc 0%, #f2f3f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '18px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {ratingValue ? (
            <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <Tag color="green" style={{ margin: 0, borderRadius: '999px', fontWeight: 600 }}>
                {ratingValue} ★
              </Tag>
            </div>
          ) : null}

          <div
            style={{
              position: 'absolute',
              inset: 'auto 14px 14px auto',
              background: 'rgba(255,255,255,0.92)',
              borderRadius: '999px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#555',
              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)'
            }}
          >
            {item.category || 'Fashion'}
          </div>

          <img
            alt={item.name}
            src={getImageUrl(getProductImageUrl(item))}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              mixBlendMode: 'multiply'
            }}
          />
        </div>
      </Link>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Link to={`/productdetail/${productKey}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#8a8a8a',
            marginBottom: '6px'
          }}>
            {item.company || 'Brand'}
          </Text>

          <Text strong style={{
            fontSize: '15px',
            lineHeight: '1.45',
            color: '#141414',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            minHeight: '42px'
          }}>
            {item.name}
          </Text>

          <div style={{ marginTop: '8px', marginBottom: '14px' }}>
            <Text style={{ fontSize: '13px', color: '#777' }}>
              {item.category || 'Lifestyle'}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <Text strong style={{ fontSize: '17px', color: '#111' }}>
              ₹ {formatPrice(salePrice)}
            </Text>
            {marketPrice > salePrice && (
              <Text delete style={{ color: '#9a9a9a', fontSize: '13px' }}>
                ₹ {formatPrice(marketPrice)}
              </Text>
            )}
            {discountPercent > 0 && <Text style={{ color: '#ff4d4f', fontSize: '12px', fontWeight: 700 }}>{discountPercent}% OFF</Text>}
          </div>
        </Link>

        <div style={{ marginTop: '16px' }}>
          {isInCart ? (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => dispatch({ type: "DECREMENT", playload: item })}
              style={{ 
                width: '100%', 
                height: '42px', 
                borderRadius: '12px', 
                fontWeight: '600',
                boxShadow: 'none'
              }}
            >
              Remove from Bag
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => dispatch({ type: "INCREMENT", playload: item })}
              style={{ 
                width: '100%', 
                height: '42px', 
                borderRadius: '12px', 
                fontWeight: '600',
                background: '#111',
                borderColor: '#111',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProd;
