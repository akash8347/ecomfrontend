import React, { useContext, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Space, Tag, Typography } from 'antd';
import { MenuOutlined, LogoutOutlined, ShopOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthProvider';

const { Header } = Layout;
const { Text } = Typography;

const AdminHed = () => {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminJWT');
    setDrawerOpen(false);
    navigate('/admin');
    window.location.reload();
  };

  const navItems = useMemo(() => [
    { label: 'Dashboard', to: '/admindash' },
    { label: 'Orders', to: '/adminorders' },
    { label: 'Add Product', to: '/addproduct' },
    { label: 'Products', to: '/adminproducts' },
    { label: 'Add Admin', to: '/addadmin' },
    { label: 'Contacts', to: '/admincontacts' }
  ], []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <Header style={{ position: 'sticky', top: 0, zIndex: 10, height: 'auto', padding: '16px 20px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', borderBottom: '1px solid #e2e8f0', boxShadow: '0 10px 28px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <Space align="center" size={12}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #111827 0%, #2563eb 100%)', display: 'grid', placeItems: 'center', color: '#fff' }}>
              <ShopOutlined />
            </div>
            <div>
              <Text style={{ color: '#64748b', display: 'block', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Admin panel
              </Text>
              <Text style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700 }}>Gohil Store</Text>
            </div>
          </Space>

          <div className="admin-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {admin ? navItems.map((item) => (
              <Button
                key={item.to}
                type={isActive(item.to) ? 'primary' : 'text'}
                onClick={() => { navigate(item.to); setDrawerOpen(false); }}
                style={{ borderRadius: '999px', background: isActive(item.to) ? '#111827' : 'transparent', color: isActive(item.to) ? '#fff' : '#334155' }}
              >
                {item.label}
              </Button>
            )) : null}
          </div>

          <Space>
            {!admin ? (
              <Button type="primary" onClick={() => navigate('/admin')} style={{ background: '#111827', color: '#fff', borderColor: '#111827', borderRadius: '999px' }}>
                Login
              </Button>
            ) : (
              <>
                <Tag color="blue" style={{ borderRadius: '999px', margin: 0, paddingInline: '10px' }}>Online</Tag>
                <Button danger icon={<LogoutOutlined />} onClick={handleLogout} style={{ borderRadius: '999px' }}>
                  Logout
                </Button>
              </>
            )}
            <Button type="text" className="admin-mobile-toggle" aria-label="Open admin menu" icon={<MenuOutlined style={{ color: '#0f172a' }} />} onClick={() => setDrawerOpen(true)} />
          </Space>
        </div>
      </Header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right" title="Admin menu">
        <Space direction="vertical" style={{ width: '100%' }}>
          {navItems.map((item) => (
            <Button key={item.to} block onClick={() => { navigate(item.to); setDrawerOpen(false); }}>
              {item.label}
            </Button>
          ))}
          {admin ? <Button block danger icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button> : null}
        </Space>
      </Drawer>

      <Outlet />
    </>
  );
};

export default AdminHed;

// export default AdminHed