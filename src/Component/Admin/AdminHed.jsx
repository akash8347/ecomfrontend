import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useAdmin } from '../Hooks/useAdmin';//

import { AuthContext } from '../../context/AuthProvider';

import React, { useContext } from 'react'
// import { useNavigate } from "react-router-dom";
const AdminHed = () => {
  const {admin}=useContext(AuthContext)
  const navigate=useNavigate()
    // const {logout}=useAdmin()
    // const [showDropdown, setShowDropdown] = useState(false);
    
    const logout1=()=>{
navigate('/admin')
       localStorage.removeItem('adminJWT')
       window.location.reload()

      }
      const togglebutton=()=>{

    
        const flexCont = document.querySelector('.flex-cont');
        if (flexCont.style.display === 'none' || flexCont.style.display === '') {
          flexCont.style.display = 'block';
        } else {
          flexCont.style.display = 'none';
        }
    
     }

//   return (
//     <>
//     <ul className="admin-nav">
      
//         <div className="flex10 admin1"><li>
//             <Link className=" adminLink" to='/admindash'>Home</Link>
//             {admin&&   <Link className=" adminLink" to='/adminorders'>Orders</Link>}
//        {admin&&  <Link className=" adminLink" to='/addproduct'>Add Product</Link>}
//        {admin&& <Link className=" adminLink" to='/adminproducts'> Products</Link>}
//        {!admin&& <Link className=" adminLink" to='/admin'> Login</Link>}


//         </li></div>
//         <div className="flex20 admin2">  <li>
//        {admin&& <button className=" adminlogout" onClick={logout1}>logout</button>} 

//         </li></div>
      
//     </ul>
//     <Outlet/>
//     </>
//   )
// }
// const toggleDropdown = () => {
//   setShowDropdown(!showDropdown);
//   console.log(showDropdown)
// };

return (
  <>
    <div></div>
    {/* <ul className={admin?('nav'):('nav-txt-center')}  > */}
    <ul className="nav-txt-center">
      <div className="logo">
        <i>GOHIL'S</i>
        <i className='hamburger' onClick={togglebutton} > &#9776;</i>
      </div>
     <div className="flex-cont">
      <div className='flex1ad'>
        {/* <li className='lit'>
          <Link className='Link' to='/admindash'>Home</Link>
        </li> */}
        {  admin&&   <li className='lit'>
          <Link className='Link' to='/admindash'>Home</Link>
        </li>}
      {  admin&&   <li className='lit'>
          <Link className='Link' to='/adminorders'>Orders</Link>
        </li>}
       { admin&& <li className='lit'>
          <Link className='Link' to='/addproduct'>AddPro</Link>
        </li>}
        { admin&&<li className='lit'>
          <Link className='Link' to='/adminproducts'> Products</Link>
        </li>}
        { admin&&<li className='lit'>
          <Link className='Link' to='/addadmin'>nadmin</Link>
        </li>}
        { admin&&<li className='lit'>
          <Link className='Link' to='/admincontacts'>contact</Link>
        </li>}
        { !admin&& <li className='lit'>
          <Link className='Link' to='/admin'> Login</Link>
        </li>}
      </div>
      <div className='flex2'>
        
        {admin && (
          
            
            <button onClick={logout1} className=' adminlogout'>
              Logout
            </button>
          
        )}
        
      </div>
      </div>
    
    </ul>
    <Outlet />
  </>
);
}

export default AdminHed;

// export default AdminHed