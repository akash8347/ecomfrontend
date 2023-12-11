import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { adminContext } from './AdminProvider'
import { AuthContext } from '../../context/AuthProvider'
import AdminHed from './AdminHed'

import './newstyle.css'
import { useNavigate } from 'react-router-dom'
import Loading from '../pages/Loading'

const AdminProducts = () => {

  const { admin } = useContext(AuthContext)
  const { dispatch, allProducts } = useContext(adminContext)
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  let url= process.env.REACT_APP_BACKENDURL
  const handleUpdateClick = (id) => {
    const jotutue = allProducts.find(product => product.id === id)
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
        }
        let {adminproducts}=allproductjson;

        dispatch({ type: 'ALL_PRODUCTS', payload: adminproducts });
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
      <h2 className='admin-h1'>Admin Products</h2>
      <AdminHed />
      <div className="admin-container" style={{ margin: '0 auto', width: '80%' }}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {admin && allProducts.length > 0 ? (
              <div className="admin-product-list">
                {allProducts.map((product) => (
                  <div className="admin-product-card" key={product.id}>
                    {/* You can customize the card layout based on your requirements */}
                   { console.log(product.image_urls[0])}
                
                    <img style={{width:"15rem",height:"auto",maxHeight:"21rem",objectFit:"cover", borderRadius: "5px"}} src={`${url}${product.image_urls[0]}`} alt={product.name} />
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p>{product.company}</p>
                      <p>${product.price}</p>
                      <div className="button-container">
                        <button className='gglbutton' onClick={() => deleteOrder(product.id)}>Delete</button>
                        <button className='gglbutton' onClick={() => handleUpdateClick(product.id)}>Update</button>
                        <button className='gglbutton' onClick={() => handleDetailClick(product.id)}>Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {!admin && <h2>Admin not logged in</h2>}
                {admin && <h1>No Products</h1>}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AdminProducts