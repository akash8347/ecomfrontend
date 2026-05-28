import React, { useEffect, useMemo, useState } from 'react'
import { useContext } from 'react'
import { adminContext } from './AdminProvider'
import { AuthContext } from '../../context/AuthProvider'
import AdminHed from './AdminHed'

import './newstyle.css'
import { useNavigate } from 'react-router-dom'
import Loading from '../pages/Loading'
import { formatPrice, getDiscountedPrice, getMarketPrice } from '../../utils/pricing'
import { Button, Card, Empty, Space, Tag, Typography } from 'antd'

const AdminProducts = () => {

  const { admin } = useContext(AuthContext)
  const { dispatch, allProducts } = useContext(adminContext)
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const navigate = useNavigate();
  let url= process.env.REACT_APP_BACKENDURL

  const hoveredProduct = useMemo(() => {
    return allProducts.find((product) => String(product.id) === String(hoveredProductId) || String(product._id) === String(hoveredProductId));
  }, [allProducts, hoveredProductId]);

  useEffect(() => {
    if (!hoveredProductId || !hoveredProduct) {
      return undefined;
    }

    const images = Array.isArray(hoveredProduct.image_urls) ? hoveredProduct.image_urls : [];
    if (images.length <= 1) {
      setHoveredImageIndex(0);
      return undefined;
    }

    setHoveredImageIndex(0);
    const timer = setInterval(() => {
      setHoveredImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1300);

    return () => clearInterval(timer);
  }, [hoveredProduct, hoveredProductId]);

  const resolveImageSrc = (imagePath) => {
    if (!imagePath) return '';
    if (/^https?:|^data:|^blob:/i.test(imagePath)) return imagePath;
    return `${url}${imagePath}`;
  };
  const handleUpdateClick = (id) => {
    const jotutue = allProducts.find((product) => String(product.id) === String(id) || String(product._id) === String(id))
    console.log(jotutue)
    localStorage.setItem('updateprod', JSON.stringify(jotutue))
    navigate(`/update-product/${id}`);
  };
  const handleDetailClick = (id) => {
    navigate(`/adminprodetail/${id}`)

  }
  useEffect(() => {
    const func = async () => {
      if (admin && admin.token) { // Add a null check for admin and admin.token
        const { token } = admin;
       
        // `${url}
        const res = await fetch(`${url}/admin/adminproducts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        let allproductjson = await res.json();

        if (!res.ok) {
          console.log(allproductjson.error);
          setIsLoading(false);
          return;
        }
        let {adminproducts}=allproductjson;

        dispatch({ type: 'ALL_PRODUCTS', payload: adminproducts || [] });
        setIsLoading(false);
        console.log(adminproducts);
      }
    };

    func();
  }, [dispatch, admin,url]);

  const deleteOrder = async (productId) => {
    const {token}=admin
   
    const res = await fetch( `${url}/admin/deleteproduct/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      console.log(json.error)
    }
    console.log(json.success)
    dispatch({ type: 'DELETE_PRODUCT', payload: productId })
  }

  return (
    <>
      <AdminHed />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', padding: '28px 20px 56px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: '18px' }}>
            <Typography.Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Catalog</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>Products</Typography.Title>
          </Space>

          {isLoading ? (
            <Loading />
          ) : admin && allProducts && allProducts.length > 0 ? (
            <div className="admin-product-list">
              {allProducts.map((product) => (
                <Card
                  key={product.id || product._id}
                  bordered={false}
                  className="admin-product-card"
                  onMouseEnter={() => setHoveredProductId(product.id || product._id)}
                  onMouseLeave={() => {
                    setHoveredProductId(null);
                    setHoveredImageIndex(0);
                  }}
                >
                  <div className="admin-product-media-shell">
                    <div
                      className="admin-product-media-track"
                      style={{ transform: `translateX(-${((hoveredProductId && String(hoveredProductId) === String(product.id || product._id)) ? hoveredImageIndex : 0) * 100}%)` }}
                    >
                      {(Array.isArray(product.image_urls) && product.image_urls.length > 0 ? product.image_urls : [product.image || '']).map((imagePath, index) => (
                        <div className="admin-product-media-slide" key={`${product.id || product._id}-${index}`}>
                          <img className="admin-product-media-image" src={resolveImageSrc(imagePath)} alt={`${product.name}-${index + 1}`} />
                        </div>
                      ))}
                    </div>

                    {(product.image_urls?.length || 0) > 1 && (
                      <div className="admin-product-media-dots">
                        {product.image_urls.map((_, index) => (
                          <span
                            key={index}
                            className={`admin-product-media-dot ${index === ((hoveredProductId && String(hoveredProductId) === String(product.id || product._id)) ? hoveredImageIndex : 0) ? 'is-active' : ''}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admin-product-body">
                    <Space direction="vertical" size={6} style={{ width: '100%', marginBottom: '12px' }}>
                      <Tag color="blue" style={{ width: 'fit-content', borderRadius: '999px', margin: 0 }}>{product.category || 'Product'}</Tag>
                      <h3 className="admin-product-title">{product.name}</h3>
                      <p className="admin-product-meta">{product.company}</p>
                    </Space>

                    <Space direction="vertical" size={2} style={{ width: '100%', marginBottom: '12px' }}>
                      <Typography.Text strong style={{ fontSize: '17px' }}>₹ {formatPrice(getDiscountedPrice(product))}</Typography.Text>
                      {getMarketPrice(product) > getDiscountedPrice(product) && <Typography.Text delete type="secondary">₹ {formatPrice(getMarketPrice(product))}</Typography.Text>}
                    </Space>
                    <div className="admin-product-actions">
                      <Button danger size="small" onClick={() => deleteOrder(product.id)}>Delete</Button>
                      <Button size="small" onClick={() => handleUpdateClick(product.id)}>Update</Button>
                      <Button type="primary" size="small" onClick={() => handleDetailClick(product.id)}>Details</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card bordered={false} style={{ borderRadius: '22px', textAlign: 'center' }}>
              {!admin && <Typography.Title level={4} style={{ marginTop: 0 }}>Admin not logged in</Typography.Title>}
              {admin && <Empty description="No products available" />}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminProducts