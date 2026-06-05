
import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "antd";
import { formatPrice, getDiscountPercent, getDiscountedPrice, getMarketPrice, getProductImageUrl, getProductKey } from '../../utils/pricing';

const { Text } = Typography;

const SingleProd = ({ item }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const productKey = getProductKey(item);
  const salePrice = getDiscountedPrice(item);
  const marketPrice = getMarketPrice(item);
  const discountPercent = getDiscountPercent(item);

  const getImageUrl = (imageName) => {
    let url = process.env.REACT_APP_BACKENDURL;
    return `${url}${imageName}`;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 0,
        overflow: 'hidden',
        border: '1px solid #e8e8e8',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.08)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%'
      }}
    >
      <Link to={`/productdetail/${productKey}`} style={{ color: 'inherit' }}>
        <div style={{
          width: '100%',
          height: '280px',
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img
            alt={item.name}
            src={getImageUrl(getProductImageUrl(item))}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.25s ease',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)'
            }}
          />
        </div>
      </Link>

      <div style={{ padding: '10px 0 0', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Link to={`/productdetail/${productKey}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text strong style={{
            fontSize: '14px',
            lineHeight: '1.35',
            color: '#282c3f',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            minHeight: '38px',
            padding: '0 8px'
          }}>
            {item.name}
          </Text>

          <Text style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#535766',
            marginTop: '2px',
            padding: '0 8px'
          }}>
            {item.company || 'Brand'}
          </Text>

          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap', padding: '0 8px 8px' }}>
            <Text strong style={{ fontSize: '14px', color: '#282c3f' }}>
              ₹ {formatPrice(salePrice)}
            </Text>
            {marketPrice > salePrice && (
              <Text delete style={{ color: '#7e818c', fontSize: '12px' }}>
                ₹ {formatPrice(marketPrice)}
              </Text>
            )}
            {discountPercent > 0 && <Text style={{ color: '#ff905a', fontSize: '12px', fontWeight: 700 }}>({discountPercent}% OFF)</Text>}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SingleProd;
