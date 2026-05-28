import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider';
import AdminHed from './AdminHed'
import { Button, Card, Input, Space, Typography } from 'antd';

const AddUser = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const {admin} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple input validation
    if (!email || !password) {
   alert('Please enter an email and password');
      return;
    }
    if(password.length<6){
      alert('password must be minimum 6 characters');
      return;
    }
    

    const data = {
      email,
      password
    }
    const { token } = admin;
   let url= process.env.REACT_APP_BACKENDURL
    const resjson = await fetch(`${url}/admin/adadmin`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const responce = await resjson.json();

    if (!resjson.ok) {
      console.log(responce.error);
     alert(responce.error)
    }else{
      alert('admin created successfully')

    }

    console.log(responce);
  };

  return (
    <>
      <AdminHed/>
      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', padding: '28px 20px 56px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
            <Space direction="vertical" size={10} style={{ width: '100%', marginBottom: '18px' }}>
              <Typography.Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Admin tools</Typography.Text>
              <Typography.Title level={2} style={{ margin: 0 }}>Add Admin</Typography.Title>
              <Typography.Text type="secondary">Create another admin account for internal access.</Typography.Text>
            </Space>
            <form onSubmit={handleSubmit} className="addadmin-form">
              <Space direction="vertical" size={14} style={{ width: '100%' }}>
                <Input size="large" className='adminipt' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <Input.Password size="large" className='adminipt' id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <Button className='myadmin-button' type="primary" htmlType="submit" size="large" block style={{ height: '46px', borderRadius: '12px', background: '#111827', borderColor: '#111827' }}>
                  Create Admin
                </Button>
              </Space>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddUser;
