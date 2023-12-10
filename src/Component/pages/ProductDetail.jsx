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
import Loading from './Loading';

const ProductDetail = () => {
  const { dispatch, state: { cart } } = useContext(cartContext);

  const { id1 } = useParams();
  const [loading, setLoading] = useState(true);
  const [filteredProduct, setFilteredProduct] = useState([]);

  const [selectedColorImageIndex, setSelectedColorImageIndex] = useState(0);

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
        const response = await fetch(`http://localhost:8000/productapi/fetchproducts/${id1}`);
        const data = await response.json();
        console.log(data);
        setFilteredProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id1]);

  return (
    <>
      <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>Product Detail</h3>
      <Header />
      {loading ? (
        <Loading />
      ) : filteredProduct.length === 0 ? (
        <p>No product found</p>
      ) : (
        filteredProduct.map((product) => (
          <div className='product-detail_container' key={product.id}>
            <div className="flex01">
              <div className="image-container">
                <img className="product-image" alt={product.name} src={`http://localhost:8000${product.image_urls[selectedColorImageIndex]}`} />
                <button onClick={handlePrevImageClick}>{'<'}</button>
                <button onClick={handleNextImageClick}>{'>'}</button>
              </div>
              <div>
                {product.image_urls.map((imageUrl, index) => (
                  <button key={index} onClick={() => handleColorClick(index)}>{`Color ${index + 1}`}</button>
                ))}
              </div>
            </div>
            <div className="flex02">
              <p><span>Name :</span>{product.name}</p>
              <p><span>Details :</span>{product.description}</p>
              <p><span>Company :</span>{product.company}</p>
              <p><span>Price :</span>{product.price}</p>

              {cart.some((p) => p.id === product.id) ? (
                <button className="product-card__button1"
                  onClick={() => {
                    dispatch({
                      type: "DECREMENT",
                      playload: product
                    });
                  }}
                >Remove from Cart</button>

              ) : (
                <button className="product-card__button1" onClick={() => {
                  dispatch({
                    type: "INCREMENT",
                    playload: product
                  });
                }}
                >Add to Cart</button>
              )}

              <div className="links">
                <Link className='Link1' to='/store'>Explore more </Link>
                <Link className='Link1' to='/cart'> See cart </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default ProductDetail;
