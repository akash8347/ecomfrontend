
import React, { useState } from 'react'
import { Link, Outlet } from "react-router-dom";
import './style.css'
import { cartContext } from '../../context/ContextPro';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
const Header = () => {
  const { user, dispatch: authDispatch } = useContext(AuthContext)
  const { state: { cart }, dispatch: contextdis } = useContext(cartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [  showDuplidown,   setshowDuplidown] = useState(false);
 
// const [toggal,seToggal] =useState(false);
  const logoutHandle = () => {
    localStorage.removeItem('user')
    authDispatch({ type: 'LOGOUT' })
    localStorage.removeItem('userOrder')
    contextdis({ type: 'LOGOUT_ORDER' })
    localStorage.removeItem('cart')
    localStorage.removeItem('cartTotal')
    localStorage.removeItem('shippingData')
    window.location.reload()
  }
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    console.log(showDropdown)
  };
  const toggleDropdowndupli = () => {
    setshowDuplidown(!showDuplidown);
    console.log(showDuplidown)
  };
  // let url= process.env.REACT_APP_BACKENDURL;
  // `${url}
  let test= process.env.REACT_APP_TEST
  const togglebutton=()=>{

    
      const flexCont = document.querySelector('.flex-cont');
      if (flexCont.style.display === 'none' || flexCont.style.display === '') {
        flexCont.style.display = 'block';
      } else {
        flexCont.style.display = 'none';
      }
  
   }
  return (
    <>
      <div></div>
      <ul className='nav'>
        <div className="logo">
          <i>GOHIL'S</i>
          <i className='hamburger' onClick={togglebutton} > &#9776;</i>
        </div>
       <div className="flex-cont">
        <div className='flex1'>
          <li className='lit'>
            <Link className='Link' to="/">Home</Link>
          </li>
          <li className='lit'>
            <Link className='Link' to="/Store">Store</Link>
          </li>
         { user&& <li className='lit'>
            <Link className='Link' to="/orderstatus">Orders</Link>
          </li>}
          <li className='lit'>
            <Link className='Link' to="/aboutus">About</Link>
          </li>
          <li className='lit'>
            <Link className='Link' to="/contact">Contact</Link>
          </li>
          <div className="dropdown">
          <button onClick={toggleDropdowndupli} className="dropbtn" >
                 more<i className="arrow down"></i>
                </button>

                {showDuplidown && (
                  <div className="dropdown-content">
                    <Link className='linkdrop' to="/login">mnj</Link>
                    <Link className='linkdrop' to="/signup">abc</Link>
                    <Link className='linkdrop' to="/admin">@</Link>
                  </div>
                  
                )}
                </div>
        </div>
        <div className='flex2'>
          {!user && (
            <>
              <div className="dropdown">
                <button onClick={toggleDropdown} className="dropbtn" >
                  Login/Signup<i className="arrow down"></i>
                </button>
                {showDropdown && (
                  <div className="dropdown-content">
                    <Link className='linkdrop' to="/login">Login</Link>
                    <Link className='linkdrop' to="/signup">Signup</Link>
                    <Link className='linkdrop' to="/admin">Admin</Link>
                  </div>
                  
                )}
                
              
               
              </div>
              
            
            </>
          )}
          {user && (
            <>
              {/* <div>{user.email}</div> */}
              <button onClick={logoutHandle} className='logout btn'>
                Logout
              </button>
            </>
          )}
          <li className='li1'>
            <Link className='Link' to="/Cart">Cart{`(${cart.length})`}</Link>
          </li>
        </div>
        </div>
      
      </ul>
      <Outlet />
    </>
  );
}

export default Header;