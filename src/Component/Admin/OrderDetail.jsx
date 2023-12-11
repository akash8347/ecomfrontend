import React, { useState, useEffect } from 'react';
import AdminHed from './AdminHed';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../pages/Loading';

const OrderDetail = () => {
  const { id } = useParams();
  let navigate= useNavigate()
let admin=JSON.parse(localStorage.getItem('adminJWT'))
let {token}=admin
  const [order, setOrder] = useState(null);
  let url= process.env.REACT_APP_BACKENDURL
  console.log(id)
  useEffect(() => {
  
    const fetchData = async () => {
      
      try {
        // const {token}=admin;
        
        // `${url}
        const response = await fetch(`${url}/admin/singleorder/${id}`, 
    {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        
        );
        const data = await response.json();
        console.log(data)
        setOrder(data);
      } catch (error) {
        console.error(error);
      }
    };
    

     fetchData();
  }, [id,token,url,admin]);

  const viewProductDetails = (product) => {
    
    navigate(`/adminprodetail/${product}`);
     // Add logic to navigate to the product details page using react-router or your navigation method
     console.log('View Details clicked for product:', product);
   };
  return (
    <>
      <h2 className='admin-h1'>Order Detail</h2>
      <AdminHed />
      <div className='order-details'  style={{ width: '80%', margin: '15px auto', border: '1px solid black'}}>
        {order ? (
          <>
            
            <div className="order-details-container">
      <h2>Order Details</h2>
      <div className="order-info">
        <p>
          Order ID: {order.id} | Date: {new Date(order.created_at).toLocaleString()}
        </p>
        <p>Total Cost: ${order.totalCost}</p>
        <p>Order Status: {order.order_status}</p>
      </div>

      <div className="items-container">
        <h3>Ordered Items</h3>
        {
        
        order.items.map((item, index) => (
          <div key={index} className="item">
             {/* let url= process.env.REACT_APP_BACKENDURL */}
        {/* // `${url} */}
            <img src={`${url}/image/${item.product.image_filenames[0]}`} alt={item.product.name} />
            <div className="item-details">
              <p>{item.product.name}</p>
              {console.log(item.product.image_filenames[0])}
              <p>Category: {item.product.category}</p>
              <p>Company: {item.product.company}</p>
              <p>Price: ${item.product.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            {/* console.log(item.product.id) */}
            <button onClick={() => viewProductDetails(item.product.proid)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
          </>
        ) : (
          <>
           <Loading/>
          </>
        
        )}
      </div>
    </>
  );
};

export default OrderDetail;





  

    // const fetchData=()=>{

    //   var responseClone; // 1
    //   const {token}=admin;
    //   fetch(`${url}/admin/singleorder/${id}`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`
    //     }
    //   })
    //   .then(function (response) {
    //       responseClone = response.clone(); // 2
    //       return response.json();
    //   })
    //   .then(function (data) {
    //       // Do something with data
    //       setOrder(data)
    //   }, function (rejectionReason) { // 3
    //       console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
    //       responseClone.text() // 5
    //       .then(function (bodyText) {
    //           console.log('Received the following instead of valid JSON:', bodyText); // 6
    //       });
    //   });
    // }