// import React from 'react'
// import { useParams } from 'react-router-dom'
// import { useContext } from 'react'
// import { cartContext } from '../context/ContextPro'
// import Header from './Header'
// const ProductDetail = () => {
//     const { state } = useContext(cartContext);
//     const { proData } = state;

//     const {id1}=useParams()
//     console.log(id1)
//     console.log(proData)
// //    // Filter the product based on the id1 parameter
//    const filteredProduct = proData.filter((product) => product._id === id1);
// //    console.log(filteredProduct);



//    return (
//      <>
//      <h3 style={{textAlign:"center",fontSize:"30px",margin:"15px 0"}}>ProductDetail </h3>
//       <Header/>

//        {filteredProduct.map((product) => (
//          <div className='product-detail_container' key={product._id}>
//           <div className="flex01">
//           <img width='300px'  alt='xdf' src={`http://localhost:8000/${product.image.replace(/\\/g, '/')}`}/>
//           </div>
//           <div className="flex02">

//            <p>{product.name}</p>
//            <p>{product.description}</p>
//            <p>{product.company}</p>
//            <p>{product.price}</p>
//            </div>
//          </div>
//        ))} 
//      </>
//    );
//  }

//  export default ProductDetail;
// import React, { useEffect, useState, useContext } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import { cartContext } from '../context/ContextPro'
// import Header from './Header'

// const ProductDetail = () => {
//   // const { state } = useContext(cartContext);
//   const { dispatch, state: { cart } } = useContext(cartContext);

//   // const { proData } = state;
//   const { id1 } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [filteredProduct, setFilteredProduct] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/productapi/fetchproducts/${id1}`);
//         const data = await response.json();
//         setFilteredProduct([data]);
//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchData();
//   }, [id1]);

//   return (
//     <>
//       <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>Product Detail</h3>
//       <Header />
//       {loading ? (
//         <p>Loading...</p>
//       ) : filteredProduct.length === 0 ? (
//         <p>No product found</p>
//       ) : (
//         filteredProduct.map((product) => (
//           <div className='product-detail_container' key={product._id}>
//             <div className="flex01">
//               <img width='300px' alt='xdf' src={`${product.colorImages[0].imageUrl}`} />
//               {console.log(product)}
//               {console.log(product.name)}
//             </div>
//             <div className="flex02">
//               <p><span>Name :</span>{product.name}</p>
//               <p><span>Details :</span>{product.description}</p>
//               <p><span>Company :</span>{product.company}</p>
//               <p><span>Price :</span>{product.price}</p>
              
//               {cart.some((p) => p._id === product._id) ? (
//                 <button className="product-card__button1"
//                   onClick={() => {
//                     dispatch({
//                       type: "DECREMENT",
//                       playload: product
//                     });
//                     // toast('removed from Cart');
//                   }}
//                 >Remove from Cart</button>

//               ) : (
//                 <button className="product-card__button1" onClick={() => {
//                   dispatch({
//                     type: "INCREMENT",
//                     playload: product
//                   });
//                   // toast('Added to Cart');
//                 }}
//                 >Add to Cart</button>
//               )

//               }
//               <div className="links">
//               <Link className='Link1' to='/store'>Explore more </Link>
//               <Link className='Link1'to='/cart'> See cart </Link>

//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </>
//   );
// };

// export default ProductDetail;
import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cartContext } from '../../context/ContextPro';
import Header from './Header';
import { Typography, Button, Space, Image, Divider, Spin, Card, Tag } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { formatPrice, getDiscountPercent, getDiscountedPrice, getMarketPrice } from '../../utils/pricing';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { dispatch, state: { cart } } = useContext(cartContext);
  const { id1 } = useParams();
  const [loading, setLoading] = useState(true);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [selectedColorImageIndex, setSelectedColorImageIndex] = useState(0);

  const url = process.env.REACT_APP_BACKENDURL || '';

  useEffect(() => {
    if (!loading && filteredProduct.length > 0) {
      setSelectedColorImageIndex(0);
    }
  }, [loading, filteredProduct]);

  const handleColorClick = (index) => {
    setSelectedColorImageIndex(index);
  };

  const handleNextImageClick = () => {
    const images = getImageList(filteredProduct[0] || {});
    if (images.length === 0) {
      return;
    }

    setSelectedColorImageIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const handlePrevImageClick = () => {
    const images = getImageList(filteredProduct[0] || {});
    if (images.length === 0) {
      return;
    }

    setSelectedColorImageIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? images.length - 1 : newIndex;
    });
  };

  const getImageList = (product) => {
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      return product.image_urls;
    }

    if (product.image) {
      return [product.image.replace(/\\/g, '/')];
    }

    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/productapi/fetchproducts/${id1}`);
        if (!response.ok) {
           setFilteredProduct([]);
           setLoading(false);
           return;
        }
        const data = await response.json();
        let productData = data.singleproduct || data;
        setFilteredProduct(Array.isArray(productData) ? productData : (productData ? [productData] : []));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setFilteredProduct([]);
        setLoading(false);
      }
    };
    fetchData();
  }, [id1, url]);

  return (
    <div className="product-detail-page">
      <Header />
      
      <div className="product-detail-page__inner">
        {loading ? (
          <div className="product-detail-page__state">
            <Spin size="large" tip="Loading product details..." />
          </div>
        ) : filteredProduct.length === 0 ? (
          <Card className="product-detail-empty" bordered={false}>
            <Title level={3}>No product found</Title>
            <Text type="secondary">The item you requested is not available right now.</Text>
            <div className="product-detail-empty__actions">
              <Link to="/store"><Button type="primary" size="large">Back to Store</Button></Link>
            </div>
          </Card>
        ) : (
          filteredProduct.map((product) => {
            const isInCart = cart.some((p) => (p._id || p.id) === (product._id || product.id));
            const images = getImageList(product);
            const imageCount = images.length;
            const currentImage = images[selectedColorImageIndex] || product.image || '';
            const salePrice = getDiscountedPrice(product);
            const marketPrice = getMarketPrice(product);
            const discountPercent = getDiscountPercent(product);

            return (
              <Card key={product.id || product._id} bordered={false} className="product-detail-shell">
                <div className="product-detail-hero">
                  <div className="product-detail-hero__gallery">
                    <div className="product-detail-media">
                      <div className="product-detail-media__frame">
                        <Image
                          src={`${url}${currentImage}`}
                          alt={product.name}
                          preview={false}
                          className="product-detail-media__image"
                        />
                        {discountPercent > 0 && (
                          <Tag className="product-detail-media__badge" color="red">
                            {discountPercent}% OFF
                          </Tag>
                        )}
                      </div>
                    </div>

                    {imageCount > 1 && (
                      <div className="product-detail-thumbs">
                        <Button
                          type="text"
                          icon={<ArrowLeftOutlined />}
                          onClick={handlePrevImageClick}
                          className="product-detail-thumbs__nav"
                        />

                        <Space size="middle" className="product-detail-thumbs__list">
                          {images.map((imgUrl, index) => (
                            <button
                              key={`${imgUrl}-${index}`}
                              type="button"
                              onClick={() => handleColorClick(index)}
                              className={index === selectedColorImageIndex ? 'product-detail-thumb product-detail-thumb--active' : 'product-detail-thumb'}
                            >
                              <img
                                src={`${url}${imgUrl}`}
                                alt={`View ${index + 1}`}
                                className="product-detail-thumb__image"
                              />
                            </button>
                          ))}
                        </Space>

                        <Button
                          type="text"
                          icon={<ArrowRightOutlined />}
                          onClick={handleNextImageClick}
                          className="product-detail-thumbs__nav"
                        />
                      </div>
                    )}
                  </div>

                  <div className="product-detail-hero__info">
                    <div className="product-detail-sticky">
                      <div className="product-detail-copy">
                        <Tag className="product-detail-copy__brand" color="geekblue">
                          {product.company}
                        </Tag>
                        <Title level={2} className="product-detail-copy__title">
                          {product.name}
                        </Title>
                        <Text className="product-detail-copy__subtitle">
                          Premium product detail view with quick cart actions and gallery navigation.
                        </Text>
                      </div>

                      <div className="product-detail-pricing">
                        <div className="product-detail-pricing__row">
                          <Title level={1} className="product-detail-pricing__sale">
                            ₹ {formatPrice(salePrice)}
                          </Title>
                          {marketPrice > salePrice && (
                            <Text delete className="product-detail-pricing__market">
                              ₹ {formatPrice(marketPrice)}
                            </Text>
                          )}
                        </div>

                        <div className="product-detail-pricing__chips">
                          {discountPercent > 0 && <Tag color="red">{discountPercent}% OFF</Tag>}
                          <Tag color="gold">Free delivery on eligible orders</Tag>
                          <Tag color="green">Easy returns</Tag>
                        </div>
                      </div>

                      <Divider />

                      <div className="product-detail-description">
                        <Title level={5}>Product Description</Title>
                        <Paragraph className="product-detail-description__text">
                          {product.description}
                        </Paragraph>
                      </div>

                      <div className="product-detail-actions">
                        {isInCart ? (
                          <Button
                            type="primary"
                            danger
                            size="large"
                            icon={<DeleteOutlined />}
                            onClick={() => dispatch({ type: 'DECREMENT', playload: product })}
                            className="product-detail-actions__button"
                          >
                            Remove from Cart
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => dispatch({ type: 'INCREMENT', playload: product })}
                            className="product-detail-actions__button"
                          >
                            Add to Cart
                          </Button>
                        )}

                        <Link to="/store">
                          <Button size="large" className="product-detail-actions__secondary">
                            Explore More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
