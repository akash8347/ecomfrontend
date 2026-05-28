const parseMoney = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatPrice = (value) => {
  const parsed = parseMoney(value);
  return parsed.toLocaleString('en-IN');
};

export const getDiscountedPrice = (item) => {
  return parseMoney(item?.discounted_price ?? item?.discountedPrice ?? item?.price ?? 0);
};

export const getMarketPrice = (item) => {
  const discountedPrice = getDiscountedPrice(item);
  const marketPrice = parseMoney(item?.market_price ?? item?.marketPrice);

  if (marketPrice > 0) {
    return marketPrice;
  }

  if (discountedPrice > 0) {
    return Math.round(discountedPrice * 1.3);
  }

  return 0;
};

export const getDiscountPercent = (item) => {
  const marketPrice = getMarketPrice(item);
  const discountedPrice = getDiscountedPrice(item);

  if (!marketPrice || discountedPrice >= marketPrice) {
    return 0;
  }

  return Math.round(((marketPrice - discountedPrice) / marketPrice) * 100);
};

export const getProductKey = (item) => item?.id || item?._id;

export const getProductImageUrl = (item) => {
  const images = item?.image_urls;
  if (Array.isArray(images) && images.length > 0) {
    return images[0];
  }

  return item?.image || '';
};
