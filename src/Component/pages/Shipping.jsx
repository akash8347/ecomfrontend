import React, { useEffect, useState } from 'react'
import { cartContext } from "../../context/ContextPro.js"
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthProvider.js'
import Header from './Header.jsx'



const Shipping = () => {

  const [street, setStreet] = useState('')
  const [area, setArea] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const { user } = useContext(AuthContext);

  const { dispatch } = useContext(cartContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Retrieve saved shipping data from localStorage
    const savedShippingData = JSON.parse(localStorage.getItem('shippingData'))
    if (savedShippingData) {
      setStreet(savedShippingData.street || '')
      setArea(savedShippingData.area || '')
      setCity(savedShippingData.city || '')
      setState(savedShippingData.state || '')
    }
   
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!street || !area || !city || !state) {
      document.getElementById('span1').innerText = "enter all field"
      return;
    }
    const shippingData = { street, area, city, state }
    document.getElementById('span1').innerText = ""

    // Save shipping data in localStorage
    localStorage.setItem('shippingData', JSON.stringify(shippingData))
    // ----------------after submit handle state----------------
    dispatch({
      type: 'SHIPPING_DETAIL',
      payload: shippingData
    })

    navigate('../final')

  }

  return (

    !user ? (
      <>
        <p>You need to login First  </p>
        <Link to='/login'> Login here</Link>
      </>
    ) : (
      <>
        {/* <h1 style={{ textAlign: "center", margin: "30px 0px" }}>Enter shipping details</h1> */}
        <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>Your Own Shop</h3>

        <Header />
        <div className="shipping-container">
          <form id='shippingForm' onSubmit={handleSubmit} className='shipping-form' >
            <label htmlFor="street">Street:</label>
            <input value={street} onChange={(e) => setStreet(e.target.value)} type="text" name="street" id="street" required />
            <label htmlFor="area">Area:</label>
            <input  value={area} onChange={(e) => setArea(e.target.value)} type="text" name="area" id="area" required />
            <label htmlFor="city">city</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} type="text" name="city" id="city" required />
            <label htmlFor="state">state</label>
            <input value={state} onChange={(e) => setState(e.target.value)} type="text" name="state" id="state" required />
            <button type='submit' onClick={handleSubmit}>Finalize Order</button>

            {/* <Link to="/final"> finalize order</Link> */}

          </form>
          <span id='span1'></span>
        </div>
      </>
    )
  )
}

export default Shipping