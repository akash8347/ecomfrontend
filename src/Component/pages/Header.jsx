
import React, { useState, useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Badge, Drawer, Input } from 'antd';
import { HeartOutlined, MenuOutlined, LogoutOutlined, SearchOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { cartContext } from '../../context/ContextPro';
import { AuthContext } from '../../context/AuthProvider';
import AuthModal from './AuthModal';
import './style.css';

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user, dispatch: authDispatch } = useContext(AuthContext);
  const { state: { cart }, dispatch: contextdis } = useContext(cartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandle = () => {
    localStorage.removeItem('user');
    authDispatch({ type: 'LOGOUT' });
    localStorage.removeItem('userOrder');
    contextdis({ type: 'LOGOUT_ORDER' });
    localStorage.removeItem('cart');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('shippingData');
    localStorage.removeItem('checkoutSelectedAddress');
    window.location.reload();
  };

  const navItems = [
    { key: '/', label: <Link to="/">MEN</Link> },
    { key: '/women', label: <Link to="/store">WOMEN</Link> },
    { key: '/kids', label: <Link to="/store">KIDS</Link> },
    { key: '/home', label: <Link to="/store">HOME</Link> },
    { key: '/beauty', label: <Link to="/store">BEAUTY</Link> },
    { key: '/genz', label: <Link to="/store">GENZ</Link> },
    { key: '/studio', label: <Link to="/store">STUDIO <span className="header-new-pill">NEW</span></Link> }
  ];

  const openAuthModal = (tab = 'login') => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleSearchSubmit = () => {
    navigate('/store', { state: { query: searchValue.trim() } });
  };

  return (
    <Layout>
      <AntHeader className="header-shell">
        <div className="header-shell__inner">
          <div className="header-brand" onClick={() => navigate('/store')} role="button" tabIndex={0}>
            <span className="header-brand__mark">M</span>
          </div>

          <div className="header-nav">
            {navItems.map((item) => (
              <div key={item.key} className="header-nav__item">
                {item.label}
              </div>
            ))}
          </div>

          <div className="header-search">
            <Input
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onPressEnter={handleSearchSubmit}
              placeholder="Search for products, brands and more"
              bordered={false}
            />
          </div>

          <div className="header-actions">
            <button type="button" className="header-action" onClick={() => (user ? navigate('/orderstatus') : openAuthModal('login'))}>
              <UserOutlined />
              <span>Profile</span>
            </button>

            <button type="button" className="header-action header-action--soft">
              <HeartOutlined />
              <span>Wishlist</span>
            </button>

            <button type="button" className="header-action header-action--bag" onClick={() => navigate('/cart')}>
              <Badge count={cart.length} size="small" color="#ff3f6c" offset={[0, 2]}>
                <ShoppingOutlined />
              </Badge>
              <span>Bag</span>
            </button>

            {user ? (
              <Button type="text" className="header-logout" icon={<LogoutOutlined />} onClick={logoutHandle} />
            ) : null}
          </div>

          <div className="header-mobile-menu">
            <Button type="text" icon={<MenuOutlined />} onClick={() => setMobileMenuOpen(true)} />
          </div>
        </div>
      </AntHeader>

      <Drawer placement="right" onClose={() => setMobileMenuOpen(false)} open={mobileMenuOpen}>
        <div className="header-drawer">
          <div className="header-drawer__search">
            <Input
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onPressEnter={handleSearchSubmit}
              placeholder="Search products"
              bordered={false}
            />
          </div>

          <div className="header-drawer__links">
            {navItems.map((item) => (
              <Link key={item.key} to={item.key === '/' ? '/' : '/store'} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="header-drawer__actions">
            {!user ? (
              <>
                <Button block type="primary" onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}>Login</Button>
                <Button block onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}>Signup</Button>
              </>
            ) : (
              <Button block danger icon={<LogoutOutlined />} onClick={() => { logoutHandle(); setMobileMenuOpen(false); }}>Logout</Button>
            )}
            <Button block onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }} icon={<ShoppingOutlined />}>Cart ({cart.length})</Button>
          </div>
        </div>
      </Drawer>

      <AuthModal
        open={authOpen}
        initialTab={authTab}
        onClose={() => setAuthOpen(false)}
      />

      <Outlet />
    </Layout>
  );
}

export default Header;