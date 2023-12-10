import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import {Link ,Outlet} from "react-router-dom";
import Cart from "./Component/pages/Cart";
import AllProducts from "./Component/pages/AllProducts";
// import Header from "./Component/Header";
import Home from "./Component/pages/Home";
import Aboutus from "./Component/pages/Aboutus.jsx";

import SignUp from "./Component/pages/SignUp.jsx";
import Login from "./Component/pages/Login";
import { AuthContext } from "./context/AuthProvider";
import { useContext } from "react";
import Shipping from "./Component/pages/Shipping";
import Final from "./Component/pages/Final";
import OrderStatus from './Component/pages/OrderStatus'
import NotFound from "./Component/pages/NotFound";
import Adminlog from "../src/Component/Admin/Adminlog.jsx"
import AdminDash from "./Component/Admin/AdminDash.jsx"
import AdminOrders from "./Component/Admin/AdminOrders.jsx"
import ProductDetail from "./Component/pages/ProductDetail"
import AddProduct from "./Component/Admin/AddNewProduct.jsx"
import AdminProducts from "./Component/Admin/AdminProducts.jsx"
import UpdateProduct from "./Component/Admin/UpdateProduct";
import AdminProDetail from "./Component/Admin/AdminProDetail";
import Contact from "./Component/pages/Contact";
import OrderDetail from "./Component/Admin/OrderDetail.jsx"
import AddAdmin from "./Component/Admin/AddAdmin.jsx"
import AdminContact from "./Component/Admin/AdminContact.jsx"
function App() {
  const { user, admin } = useContext(AuthContext);

  console.log(admin)
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/store" element={<AllProducts />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/login" element={user === null ? (<Login />) : (<Navigate to="/" />)} />
          <Route path="/signup" element={user === null ? (<SignUp />) : (<Navigate to="/" />)} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/final" element={<Final />} />
          <Route path="/orderstatus" element={<OrderStatus />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/productdetail/:id1" element={<ProductDetail />} />
          <Route path="/aboutus" element={<Aboutus />} />


          {/* <Route path='/admin' element={admin===null?(<Adminlog/>):(<Navigate to="/admindash"/>)}/> 
<Route path='/admindash' element={admin?(<AdminDash/>):(<Navigate to="/admin"/>)}/>
<Route path='/adminorders' element={admin?(<AdminOrders/>):(<Navigate to="/admin"/>)}/>  */}
          {/* <Route path='/addproduct' element={admin?(<AddProduct/>):(<Navigate to="/admin"/>)}/>   */}
          <Route path='/addproduct' element={<AddProduct />} />
          <Route path='/addadmin' element={<AddAdmin />} />


          <Route path='/admin' element={<Adminlog />} />
          <Route path='/admindash' element={<AdminDash />} />
          <Route path='/adminorders' element={<AdminOrders />} />
          <Route path='/admincontacts' element={<AdminContact />} />

          <Route path='/adminproducts' element={<AdminProducts />} />
          <Route path='/update-product/:productId' element={<UpdateProduct />} />
          <Route path="/adminprodetail/:id" element={<AdminProDetail />} />
          <Route path="/orderdetail/:id" element={<OrderDetail />} />

        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
