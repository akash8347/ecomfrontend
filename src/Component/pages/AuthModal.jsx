import React, { useEffect, useState, useContext } from 'react';
import { Modal, Tabs, Form, Input, Button, Alert, Typography } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../../context/AuthProvider';

const { Title, Text } = Typography;

const AuthModal = ({ open, initialTab = 'login', onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      setFeedback(null);
      loginForm.resetFields();
      signupForm.resetFields();
    }
  }, [open, initialTab, loginForm, signupForm]);

  useEffect(() => {
    if (!open) {
      setFeedback(null);
      setSubmitting(false);
    }
  }, [open]);

  const backendUrl = process.env.REACT_APP_BACKENDURL;

  const closeModal = () => {
    setFeedback(null);
    onClose?.();
  };

  const handleLogin = async (values) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const json = await response.json();

      if (!response.ok) {
        setFeedback({ type: 'error', text: json.error || 'Unable to login right now.' });
        return;
      }

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });
      onAuthSuccess?.(json);
      closeModal();
    } catch (error) {
      setFeedback({ type: 'error', text: 'Login failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (values) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`${backendUrl}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const json = await response.json();

      if (!response.ok) {
        setFeedback({ type: 'error', text: json.error || 'Unable to create account right now.' });
        return;
      }

      setFeedback({ type: 'success', text: 'Account created. Please sign in to continue.' });
      signupForm.resetFields();
      setActiveTab('login');
    } catch (error) {
      setFeedback({ type: 'error', text: 'Signup failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const authTabs = [
    {
      key: 'login',
      label: 'Login',
      children: (
        <Form
          form={loginForm}
          layout="vertical"
          onFinish={handleLogin}
          requiredMark={false}
          style={{ marginTop: '10px' }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Enter your email address.' },
              { type: 'email', message: 'Enter a valid email address.' }
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Enter your password.' }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Your password" autoComplete="current-password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={submitting}
            style={{ height: '46px', borderRadius: '12px', background: '#111', borderColor: '#111', marginTop: '8px' }}
          >
            Sign in
          </Button>
        </Form>
      )
    },
    {
      key: 'signup',
      label: 'Register',
      children: (
        <Form
          form={signupForm}
          layout="vertical"
          onFinish={handleSignup}
          requiredMark={false}
          style={{ marginTop: '10px' }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Enter your name.' }]}
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Your name" autoComplete="name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Enter your email address.' },
              { type: 'email', message: 'Enter a valid email address.' }
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Create a password.' }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Create a password" autoComplete="new-password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={submitting}
            style={{ height: '46px', borderRadius: '12px', background: '#111', borderColor: '#111', marginTop: '8px' }}
          >
            Create account
          </Button>
        </Form>
      )
    }
  ];

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      centered
      width={480}
      destroyOnClose
      styles={{ body: { padding: '26px 26px 24px', borderRadius: '20px' } }}
      maskClosable={false}
      title={null}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '11px' }}>
            Account
          </Text>
          <Title level={3} style={{ margin: '4px 0 0' }}>
            {activeTab === 'login' ? 'Login' : 'Register'}
          </Title>
        </div>
        <Button type="text" onClick={closeModal} style={{ paddingInline: 0 }}>
          Close
        </Button>
      </div>

      {feedback ? (
        <Alert style={{ marginBottom: '12px', borderRadius: '12px' }} type={feedback.type} showIcon message={feedback.text} />
      ) : null}

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={authTabs}
        size="large"
      />
    </Modal>
  );
};

export default AuthModal;