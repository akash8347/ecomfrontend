
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
  const rating = item.rating || '4.4';
  const reviewCount = item.reviewCount || '1.2k';

  return (
    <Link
      to={`/productdetail/${productKey}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="store-card store-card--enhanced"
      aria-label={`${brandName} ${item.name}`}
      style={{
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 22px 36px rgba(15, 23, 42, 0.14)' : '0 10px 24px rgba(15, 23, 42, 0.08)'
      }}
    >
      <div className="store-card__image store-card__image--enhanced">
        <img alt={item.name} src={imageUrl} style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} />

        <div className="store-card__overlay" />

        <div className="store-card__badges">
          {hasDiscount && <span className="store-card__badge store-card__badge--discount">{discountPercent}% OFF</span>}
          <span className="store-card__badge store-card__badge--rating">{rating} ★ {reviewCount}</span>
        </div>
      </div>
      <div className="store-card__body">
        <div className="store-card__copy">
          <Text className="store-card__brand">{brandName}</Text>
          <Text className="store-card__name">{item.name}</Text>
        </div>

        <div className="store-card__pricing">
          <div className="store-card__price-row">
            <Text strong className="store-card__price">
              Rs. {formatPrice(salePrice)}
            </Text>

            {marketPrice > salePrice && (
              <Text delete className="store-card__mrp">
                Rs. {formatPrice(marketPrice)}
              </Text>
            )}
          </div>

          {hasDiscount && (
            <Text className="store-card__saving">
              Save Rs. {formatPrice(marketPrice - salePrice)}
            </Text>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SingleProd;
