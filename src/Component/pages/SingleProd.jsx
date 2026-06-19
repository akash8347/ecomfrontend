
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'antd';
import { formatPrice, getDiscountPercent, getDiscountedPrice, getMarketPrice, getProductImageUrl, getProductKey } from '../../utils/pricing';

const { Text } = Typography;

const SingleProd = ({ item }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const productKey = getProductKey(item);
  const salePrice = getDiscountedPrice(item);
  const marketPrice = getMarketPrice(item);
  const discountPercent = getDiscountPercent(item);
  const imageUrl = `${process.env.REACT_APP_BACKENDURL || ''}${getProductImageUrl(item)}`;
  const hasDiscount = discountPercent > 0;
  const brandName = item.company || 'Brand';

  return (
    <Link
      to={`/productdetail/${productKey}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="store-card"
      style={{
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 18px 28px rgba(15, 23, 42, 0.12)' : '0 6px 18px rgba(15, 23, 42, 0.06)'
      }}
    >
      <div className="store-card__image">
        <img alt={item.name} src={imageUrl} style={{ transform: isHovered ? 'scale(1.04)' : 'scale(1)' }} />

        {hasDiscount && <span className="store-card__badge store-card__badge--discount">{discountPercent}% OFF</span>}

        <span className="store-card__rating">4.4 <span>★</span> 1.2k</span>
      </div>
      <div className="store-card__body">
        <Text className="store-card__brand">{brandName}</Text>
        <Text className="store-card__name">{item.name}</Text>

        <div className="store-card__price-row">
          <Text strong className="store-card__price">
            Rs. {formatPrice(salePrice)}
          </Text>

          {marketPrice > salePrice && (
            <Text delete className="store-card__mrp">
              Rs. {formatPrice(marketPrice)}
            </Text>
          )}

          {hasDiscount && (
            <Text className="store-card__saving">
              (Rs. {formatPrice(marketPrice - salePrice)} OFF)
            </Text>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SingleProd;
