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
import { Row, Col, Typography, Button, Space, Image, Divider, Spin, Card, Descriptions, Tag } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { dispatch, state: { cart } } = useContext(cartContext);
  const { id1 } = useParams();
  const [loading, setLoading] = useState(true);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [selectedColorImageIndex, setSelectedColorImageIndex] = useState(0);

  let url = process.env.REACT_APP_BACKENDURL;

  useEffect(() => {
    if (!loading && filteredProduct.length > 0) {
      setSelectedColorImageIndex(0);
    }
  }, [loading, filteredProduct]);

  const handleColorClick = (index) => {
    setSelectedColorImageIndex(index);
  };

  const handleNextImageClick = () => {
    setSelectedColorImageIndex(prevIndex => (prevIndex + 1) % filteredProduct[0].image_urls.length);
  };

  const handlePrevImageClick = () => {
    setSelectedColorImageIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? filteredProduct[0].image_urls.length - 1 : newIndex;
    });
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
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      <Header />
      
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" tip="Loading product details..." />
          </div>
        ) : filteredProduct.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '50px', borderRadius: '12px' }}>
            <Title level={3}>No product found</Title>
            <Link to="/store"><Button type="primary">Back to Store</Button></Link>
          </Card>
        ) : (
          filteredProduct.map((product) => {
            const isInCart = cart.some((p) => p.id === product.id);

            return (
              <Card key={product.id || product._id} bordered={false} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Row gutter={[40, 40]}>
                  {/* Image Gallery Column */}
                  <Col xs={24} md={10}>
                    <div style={{ background: '#fafafa', borderRadius: '12px', padding: '20px', textAlign: 'center', position: 'relative' }}>
                      <Image
                        src={`${url}${product.image_urls[selectedColorImageIndex]}`}
                        alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                      />
                      
                      {product.image_urls.length > 1 && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <Button icon={<ArrowLeftOutlined />} onClick={handlePrevImageClick} />
                          <Space>
                            {product.image_urls.map((_, index) => (
                              <div
                                key={index}
                                onClick={() => handleColorClick(index)}
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: index === selectedColorImageIndex ? '#1890ff' : '#d9d9d9',
                                  cursor: 'pointer'
                                }}
                              />
                            ))}
                          </Space>
                          <Button icon={<ArrowRightOutlined />} onClick={handleNextImageClick} />
                        </div>
                      )}
                    </div>
                  </Col>

                  {/* Product Details Column */}
                  <Col xs={24} md={14}>
                    <Title level={2}>{product.name}</Title>
                    <Tag color="geekblue" style={{ marginBottom: '16px', fontSize: '14px', padding: '4px 12px' }}>
                      {product.company}
                    </Tag>
                    
                    <Title level={1} style={{ color: '#f5222d', marginTop: '10px' }}>₹ {product.price}</Title>
                    <Divider />
                    
                    <Title level={5}>Product Description</Title>
                    <Paragraph style={{ fontSize: '16px', color: '#595959', lineHeight: '1.8' }}>
                      {product.description}
                    </Paragraph>

                    <Divider />

                    <Space size="large" style={{ marginTop: '20px' }}>
                      {isInCart ? (
                        <Button 
                          type="primary" 
                          danger 
                          size="large" 
                          icon={<DeleteOutlined />}
                          onClick={() => dispatch({ type: "DECREMENT", playload: product })}
                          style={{ height: '50px', padding: '0 40px', fontSize: '16px' }}
                        >
                          Remove from Cart
                        </Button>
                      ) : (
                        <Button 
                          type="primary" 
                          size="large" 
                          icon={<ShoppingCartOutlined />}
                          onClick={() => dispatch({ type: "INCREMENT", playload: product })}
                          style={{ height: '50px', padding: '0 40px', fontSize: '16px' }}
                        >
                          Add to Cart
                        </Button>
                      )}
                      
                      <Link to="/store">
                        <Button size="large" style={{ height: '50px', padding: '0 30px', fontSize: '16px' }}>
                          Explore More
                        </Button>
                      </Link>
                    </Space>
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

export default ProductDetail;
