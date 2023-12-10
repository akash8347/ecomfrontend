import React from 'react'
import './style.css'
import { useContext } from 'react'
import { cartContext } from '../../context/ContextPro.js'
import { AuthContext } from '../../context/AuthProvider.js'
// import {order} from './Hooks/placeOrder.js'
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom'
import Header from './Header'


const Final = () => {

  // const [error, setError] = useState('')

  const { state: { cart }, state: { cartTotal }, state: { shippingdata } } = useContext(cartContext)
  const { user } = useContext(AuthContext)
  console.log(cart)
  console.log("------")
  console.log(cartTotal)
  console.log("=========")
  console.log(shippingdata)
  const order = {
    orderedProducts: cart,
    totalCost: cartTotal,
    shippingData: shippingdata
  }

  const placeOrder = async () => {

    try {

      if (user === null) {
       console.log('You must be logged in')
        toast('You must be logged in')
        // throw Error('must logged in')
      }
      const { token } = user
      console.log('clicked')

      // console.log(token)
      localStorage.removeItem('cart')
      let url= process.env.REACT_APP_BACKENDURL
      // `${url}
      const res = await fetch(`${url}/order/createorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token} `

        },
        body: JSON.stringify(order)
      })

      const resData = await res.json();
      if (!res.ok) {
        // setError(resData)
        console.log(resData)
      } else {
        // document.getElementById('span').innerHTML="<h3>order placed successfully </h3>"
        document.getElementById('final_button').disabled = true;
        document.getElementById("final_button").style.cursor = "not-allowed";
        toast('Order placed successfully')

      }


    } catch (error) {
      // console.log(error)
    }
  }


  return (
    <>
      <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>Your Own Shop</h3>

      <Header />
      <div className="final-container">
        <h2 className='comman-h1'>product summ</h2>
        <table id='table' >
          <thead>
            <tr>
              <th>product</th>
              <th>Company</th>
              <th>quantity</th>
              <th>price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          {
            cart.map((c) => {
              return (

                <tbody key={c.id}>

                  <tr>
                    <td>{c.name}</td>
                    <td>{c.company}</td>
                    <td>{c.price}</td>
                    <td>{c.price}</td>
                    <td>{c.quantity}</td>
                  </tr>
                </tbody>
              )
            })}


        </table>
        <div className="table2">
          <table>
            <thead>
              <tr>
                <th>cart total</th>
                <th>Payment mode</th>
              </tr>
            </thead>
            <tbody><tr><td>{cartTotal}</td><td>Offline</td></tr></tbody>
          </table>
        </div>
        <button id='final_button' onClick={placeOrder} className='comman_button'>Place order</button>
        {/* {error && <div id='span'>{error}</div>} */}
        <div className='final_links'>
          <Link className='links' to='/store'>Explore more Products</Link>
          <Link className='links' to='/orderstatus'>Check status</Link>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}
export default Final;