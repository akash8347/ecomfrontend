
import React, { useState, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Space, Badge, Drawer } from 'antd';
import { ShoppingCartOutlined, UserOutlined, MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { cartContext } from '../../context/ContextPro';
import { AuthContext } from '../../context/AuthProvider';
import './style.css';

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user, dispatch: authDispatch } = useContext(AuthContext);
  const { state: { cart }, dispatch: contextdis } = useContext(cartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logoutHandle = () => {
    localStorage.removeItem('user');
    authDispatch({ type: 'LOGOUT' });
    localStorage.removeItem('userOrder');
    contextdis({ type: 'LOGOUT_ORDER' });
    localStorage.removeItem('cart');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('shippingData');
    window.location.reload();
  };

  const navItems = [
    { key: 'home', label: <Link to="/">Home</Link> },
    { key: 'store', label: <Link to="/Store">Store</Link> },
    ...(user ? [{ key: 'orders', label: <Link to="/orderstatus">Orders</Link> }] : []),
    { key: 'about', label: <Link to="/aboutus">About</Link> },
    { key: 'contact', label: <Link to="/contact">Contact</Link> }
  ];

  const userMenuItems = [
    { key: 'login', label: <Link to="/login">Login</Link> },
    { key: 'signup', label: <Link to="/signup">Signup</Link> },
    { key: 'admin', label: <Link to="/admin">Admin</Link> }
  ];

  return (
    <Layout>
      <AntHeader style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px #f0f1f2', zIndex: 1, width: '100%', position: 'sticky', top: 0 }}>
        
        <div style={{ fontSize: '24px', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '1px', color: '#1890ff' }}>
          GOHIL'S
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Menu mode="horizontal" items={navItems} style={{ borderBottom: 'none', minWidth: '400px', display: 'flex', justifyContent: 'center' }} />
        </div>

        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {!user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Button type="primary" icon={<UserOutlined />}>Login/Signup</Button>
            </Dropdown>
          ) : (
            <Button danger icon={<LogoutOutlined />} onClick={logoutHandle}>Logout</Button>
          )}

          <Badge count={cart.length} showZero color="#1890ff">
            <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />} onClick={() => navigate('/Cart')} />
          </Badge>
        </div>

        <div className="mobile-menu-btn" style={{ display: 'none' }}>
           <Button type="text" icon={<MenuOutlined style={{ fontSize: '20px' }} />} onClick={() => setMobileMenuOpen(true)} />
        </div>
      </AntHeader>

      <Drawer placement="right" onClose={() => setMobileMenuOpen(false)} open={mobileMenuOpen}>
        <Menu mode="vertical" items={navItems} onClick={() => setMobileMenuOpen(false)} style={{ borderRight: 'none', marginBottom: '20px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!user ? (
            <>
              <Button block type="primary" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login</Button>
              <Button block onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>Signup</Button>
              <Button block type="dashed" onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}>Admin</Button>
            </>
          ) : (
            <Button block danger icon={<LogoutOutlined />} onClick={() => { logoutHandle(); setMobileMenuOpen(false); }}>Logout</Button>
          )}
          <Button block onClick={() => { navigate('/Cart'); setMobileMenuOpen(false); }} icon={<ShoppingCartOutlined />}>Cart ({cart.length})</Button>
        </div>
      </Drawer>

      <Outlet />
    </Layout>
  );
}

export default Header;