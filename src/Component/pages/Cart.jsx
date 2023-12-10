import React from 'react'
import Header from './Header';

import { cartContext } from '../../context/ContextPro';
import { useContext } from 'react';
import SingleCart from './SingleCart';
import { Link } from 'react-router-dom';
const Cart = () => {
  const { state: { cart }, state: { cartTotal } } = useContext(cartContext);
  console.log(typeof cartTotal)
  return (
    <>
    <h3 style={{textAlign:"center",fontSize:"30px",margin:"15px 0"}}>Your Cart</h3>
      <Header></Header>
      {cart.length === 0 ? (
        <h2 style={{ display: 'flex', justifyContent: "center", marginTop: "30px" }}>Card is empty</h2>
      ) : (
        <>
          {/* <h1 style={{ textAlign: "center", marginTop: "30px" }}>Your Cart</h1> */}
          <div className='cart-bap-bap'>
            <div className='cart-bap'>
              {
                cart.map((item) => <SingleCart key={item.id} item={item} />)
              }

            </div>
            <div className='cart-total'><span className='span1'>Cart Total : </span> <span className='span2'>{`${cartTotal}`}</span></div>
            <div className='btn-con'>
              <Link to="/shipping" className='comman_button1 Link' > Checkout</Link>
            </div>
          </div>
        </>
      )}

      { }
    </>
  )
}

export default Cart;