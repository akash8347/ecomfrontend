import React, { useContext, useEffect, useMemo, useState } from 'react';
import AdminHed from './AdminHed';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { formatPrice, getDiscountPercent, getDiscountedPrice, getMarketPrice } from '../../utils/pricing';
import { Button, Card, Col, Divider, Image, Row, Space, Spin, Tag, Typography } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AdminProDetail = () => {
  const { admin } = useContext(AuthContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [selectedColorImageIndex, setSelectedColorImageIndex] = useState(0);

  const url = process.env.REACT_APP_BACKENDURL || '';

  const colorsList = useMemo(() => {
    const colors = filteredProduct[0]?.colors || '';
    return String(colors)
      .split(',')
      .map((color) => color.trim())
      .filter(Boolean);
  }, [filteredProduct]);

  const resolveImageSrc = (imagePath) => {
    if (!imagePath) return '';
    if (/^https?:|^data:|^blob:/i.test(imagePath)) {
      return imagePath;
    }
    return `${url}${imagePath}`;
  };

  useEffect(() => {
    if (!loading && filteredProduct.length > 0) {
      setSelectedColorImageIndex(0);
    }
  }, [loading, filteredProduct]);

  const handleColorClick = (index) => {
    setSelectedColorImageIndex(index);
  };

  const handleNextImageClick = () => {
    const imageCount = filteredProduct[0]?.image_urls?.length || 0;
    if (imageCount <= 1) return;
    setSelectedColorImageIndex((prevIndex) => (prevIndex + 1) % imageCount);
  };

  const handlePrevImageClick = () => {
    const imageCount = filteredProduct[0]?.image_urls?.length || 0;
    if (imageCount <= 1) return;
    setSelectedColorImageIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? imageCount - 1 : newIndex;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = admin?.token;
        const response = await fetch(`${url}/productapi/fetchproducts/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: token ? `Bearer ${token}` : ''
            }
          }
        );

        if (!response.ok) {
          setFilteredProduct([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const productData = data.singleproduct || data;
        setFilteredProduct(Array.isArray(productData) ? productData : (productData ? [productData] : []));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setFilteredProduct([]);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, admin, url]);

  return (
    <div style={{ background: '#f5f7fb', minHeight: '100vh', paddingBottom: '40px' }}>
      <AdminHed />

      <div style={{ maxWidth: '1200px', margin: '28px auto', padding: '0 20px' }}>
        <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: '16px' }}>
          <Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Catalog</Text>
          <Title level={3} style={{ margin: 0 }}>Product detail</Title>
        </Space>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Spin size="large" tip="Loading product details..." />
          </div>
        ) : filteredProduct.length === 0 ? (
          <Card bordered={false} style={{ textAlign: 'center', borderRadius: '16px', padding: '36px' }}>
            <Title level={4}>No product found</Title>
          </Card>
        ) : (
          filteredProduct.map((product) => {
            const images = Array.isArray(product.image_urls) ? product.image_urls : [];
            const activeImage = images[selectedColorImageIndex] || product.image || '';

            return (
              <Card key={product.id || product._id} bordered={false} style={{ borderRadius: '18px', boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)' }}>
                <Row gutter={[28, 28]}>
                  <Col xs={24} md={10}>
                    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #eef1f5', padding: '16px', textAlign: 'center' }}>
                      <Image
                        preview={false}
                        src={resolveImageSrc(activeImage)}
                        alt={product.name}
                        style={{ width: '100%', maxHeight: '420px', objectFit: 'contain' }}
                      />
                    </div>

                    {images.length > 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '14px' }}>
                        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handlePrevImageClick} style={{ background: '#f0f3f8', borderRadius: '50%' }} />
                        <Space size={10} style={{ overflowX: 'auto', padding: '6px 0', maxWidth: '100%' }}>
                          {images.map((imgUrl, index) => (
                            <div
                              key={index}
                              onClick={() => handleColorClick(index)}
                              style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '10px',
                                border: index === selectedColorImageIndex ? '2px solid #1677ff' : '1px solid #d9e1ea',
                                background: '#fff',
                                padding: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: index === selectedColorImageIndex ? 1 : 0.72,
                                flexShrink: 0
                              }}
                            >
                              <img src={resolveImageSrc(imgUrl)} alt={`Preview ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                          ))}
                        </Space>
                        <Button type="text" icon={<ArrowRightOutlined />} onClick={handleNextImageClick} style={{ background: '#f0f3f8', borderRadius: '50%' }} />
                      </div>
                    )}

                    {colorsList.length > 0 && (
                      <Space size={8} wrap style={{ marginTop: '12px' }}>
                        {colorsList.map((color, index) => (
                          <Tag key={`${color}-${index}`} color={index === selectedColorImageIndex ? 'blue' : 'default'}>{color}</Tag>
                        ))}
                      </Space>
                    )}
                  </Col>

                  <Col xs={24} md={14}>
                    <Title level={2} style={{ marginBottom: 8 }}>{product.name}</Title>
                    <Tag color="geekblue" style={{ marginBottom: '12px' }}>{product.company}</Tag>

                    <Space align="baseline" size={12} wrap>
                      <Title level={2} style={{ color: '#f5222d', margin: 0 }}>₹ {formatPrice(getDiscountedPrice(product))}</Title>
                      {getMarketPrice(product) > getDiscountedPrice(product) && <Text delete type="secondary">₹ {formatPrice(getMarketPrice(product))}</Text>}
                      {getDiscountPercent(product) > 0 && <Tag color="red">{getDiscountPercent(product)}% OFF</Tag>}
                    </Space>

                    <Divider />
                    <Title level={5}>Product description</Title>
                    <Paragraph style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.75 }}>{product.description || 'No description provided.'}</Paragraph>
                  </Col>
                </Row>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminProDetail;