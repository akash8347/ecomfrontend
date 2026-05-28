import React, { useState } from 'react';
import Header from './Header';
import { Card, Col, Row, Typography, Input, Button, Space, Alert } from 'antd';

const { Title, Text } = Typography;

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (!message.trim()) {
      errors.message = 'Message is required';
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Send form data to backend
    const data = { name, email, message };
    let url= process.env.REACT_APP_BACKENDURL
        // `${url}
    const resjson = await fetch(`${url}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const responce = await resjson.json();
    console.log(responce);
  };


  return (
    <>
      <Header />
      <div style={{ background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', minHeight: '100vh', padding: '28px 20px 56px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[24, 24]} align="stretch">
            <Col xs={24} lg={9}>
              <Card bordered={false} style={{ height: '100%', borderRadius: '24px', background: 'linear-gradient(135deg, #111827 0%, #334155 100%)', color: '#fff', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)' }}>
                <Space direction="vertical" size={16}>
                  <Text style={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Support</Text>
                  <Title level={2} style={{ color: '#fff', margin: 0 }}>Contact Us</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.82)' }}>
                    Send a message and we’ll get back to you as soon as possible.
                  </Text>
                  <Alert type="info" showIcon message="We usually reply within one business day." style={{ borderRadius: '14px', border: 'none' }} />
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={15}>
              <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
                <form onSubmit={handleSubmit}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <label className='label1' htmlFor="name">Name</label>
                      <Input size="large" className='input01' id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                      {errors.name && <div style={{ color: '#dc2626', marginTop: 6 }}>{errors.name}</div>}
                    </Col>
                    <Col xs={24} md={12}>
                      <label className='label1' htmlFor="email">Email</label>
                      <Input size="large" className='input01' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
                      {errors.email && <div style={{ color: '#dc2626', marginTop: 6 }}>{errors.email}</div>}
                    </Col>
                    <Col span={24}>
                      <label className='label1' htmlFor="message">Message</label>
                      <Input.TextArea rows={7} className='textarea1' id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
                      {errors.message && <div style={{ color: '#dc2626', marginTop: 6 }}>{errors.message}</div>}
                    </Col>
                    <Col span={24}>
                      <Button type="primary" htmlType="submit" size="large" style={{ height: '46px', borderRadius: '12px', background: '#111827', borderColor: '#111827' }}>
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </form>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Contact;
