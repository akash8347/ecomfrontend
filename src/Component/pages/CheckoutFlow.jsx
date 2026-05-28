import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Divider, Empty, Form, Input, Modal, Radio, Row, Space, Steps, Tag, Typography, message } from 'antd';
import { HomeOutlined, PlusOutlined, SafetyCertificateOutlined, ShopOutlined, TruckOutlined } from '@ant-design/icons';
import Header from './Header';
import AuthModal from './AuthModal';
import { AuthContext } from '../../context/AuthProvider';
import { cartContext } from '../../context/ContextPro';
import { formatPrice } from '../../utils/pricing';

const { Title, Text } = Typography;

const formatAddressLine = (address = {}) => {
  const parts = [address.street, address.area, address.city, address.state, address.pincode].filter(Boolean);
  return parts.join(', ');
};

const hasAddressDetails = (address) => {
  if (!address) {
    return false;
  }

  return Boolean(address._id || address.street || address.area || address.city || address.state || address.pincode || address.address);
};

const CheckoutFlow = ({ step = 'address' }) => {
  const navigate = useNavigate();
  const [addressForm] = Form.useForm();
  const { user, dispatch: authDispatch } = useContext(AuthContext);
  const { state: { cart, cartTotal, shippingdata }, dispatch: cartDispatch } = useContext(cartContext);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const url = process.env.REACT_APP_BACKENDURL;

  const subtotal = Number(cartTotal) || 0;
  const shippingFee = 0;
  const total = subtotal + shippingFee;
  const currentStep = step === 'payment' ? 2 : 1;
  const addresses = useMemo(() => profile?.addresses || [], [profile?.addresses]);

  const selectedAddress = useMemo(() => {
    return addresses.find((address) => String(address._id) === String(selectedAddressId))
      || (hasAddressDetails(shippingdata) ? shippingdata : null)
      || addresses.find((address) => String(address._id) === String(profile?.defaultAddressId))
      || addresses[0]
      || null;
  }, [addresses, profile?.defaultAddressId, selectedAddressId, shippingdata]);

  const syncProfile = useCallback(async () => {
    if (!user?.token) {
      setProfile(null);
      return;
    }

    setLoadingProfile(true);
    try {
      const response = await fetch(`${url}/api/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error || 'Unable to load profile');
      }

      setProfile(json);
      const mergedUser = { ...user, ...json };
      localStorage.setItem('user', JSON.stringify(mergedUser));
      authDispatch({ type: 'LOGIN', payload: mergedUser });

      if (json.defaultAddressId) {
        setSelectedAddressId(String(json.defaultAddressId));
      } else if (json.addresses?.[0]?._id) {
        setSelectedAddressId(String(json.addresses[0]._id));
      }
    } catch (error) {
      console.error(error);
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }, [authDispatch, url, user]);

  useEffect(() => {
    syncProfile();
  }, [syncProfile]);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/Cart');
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (selectedAddress) {
      cartDispatch({ type: 'SHIPPING_DETAIL', payload: selectedAddress });
      localStorage.setItem('shippingData', JSON.stringify(selectedAddress));
    }
  }, [cartDispatch, selectedAddress]);

  const openLogin = () => {
    setAuthTab('login');
    setAuthOpen(true);
  };

  const openAddressModal = () => {
    addressForm.setFieldsValue({
      name: profile?.name || user?.name || '',
      mobile: profile?.mobile || user?.mobile || ''
    });
    setAddressModalOpen(true);
  };

  const saveAddress = async (values) => {
    if (!user?.token) {
      openLogin();
      return;
    }

    setSavingAddress(true);
    try {
      const response = await fetch(`${url}/api/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(values)
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error || 'Unable to save address');
      }

      const mergedUser = { ...user, ...json };
      localStorage.setItem('user', JSON.stringify(mergedUser));
      authDispatch({ type: 'LOGIN', payload: mergedUser });
      setProfile(json);

      const latestAddress = json.addresses?.[json.addresses.length - 1];
      if (latestAddress?._id) {
        setSelectedAddressId(String(latestAddress._id));
        cartDispatch({ type: 'SHIPPING_DETAIL', payload: latestAddress });
        localStorage.setItem('shippingData', JSON.stringify(latestAddress));
      }

      setAddressModalOpen(false);
      addressForm.resetFields();
      message.success('Address saved successfully');
    } catch (error) {
      message.error(error.message || 'Unable to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const continueToPayment = () => {
    if (!selectedAddress) {
      message.warning('Please select or add an address first.');
      return;
    }

    navigate('/payment');
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      message.warning('Please select or add an address first.');
      navigate('/address');
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await fetch(`${url}/order/createorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          orderedProducts: cart,
          shippingdata: selectedAddress,
          name: selectedAddress.name || user?.name || null,
          mobile: selectedAddress.mobile || user?.mobile || null
        })
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error || 'Unable to place order');
      }

      localStorage.removeItem('cart');
      localStorage.removeItem('cartTotal');
      localStorage.removeItem('shippingData');
      localStorage.removeItem('checkoutSelectedAddress');
      cartDispatch({ type: 'LOGOUT_ORDER' });
      cartDispatch({ type: 'SHIPPING_DETAIL', payload: {} });
      navigate('/orderstatus');
      message.success('Order placed successfully');
    } catch (error) {
      message.error(error.message || 'Unable to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const stepItems = [
    { title: 'Bag', description: 'Cart items' },
    { title: 'Address', description: 'Select delivery address' },
    { title: 'Payment', description: 'Cash on delivery' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f7f8fa 0%, #eef2f6 100%)', paddingBottom: '56px' }}>
      <Header />

      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px 20px 0' }}>
        <Card
          bordered={false}
          style={{
            borderRadius: '24px',
            marginBottom: '18px',
            background: 'linear-gradient(135deg, #ffffff 0%, #fbfbfc 100%)',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
            border: '1px solid #ebedf0'
          }}
        >
          <Space direction="vertical" size={6} style={{ width: '100%' }}>
            <Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Checkout</Text>
            <Title level={2} style={{ margin: 0, fontSize: '28px' }}>Secure your order in two steps</Title>
            <Text type="secondary">Select an address, then complete the order with cash on delivery.</Text>
          </Space>
          <Divider style={{ margin: '18px 0' }} />
          <Steps current={currentStep} items={stepItems} responsive={false} />
        </Card>

        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={16}>
            {step === 'payment' ? (
              <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)', border: '1px solid #ececec' }}>
                <Space direction="vertical" size={14} style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '12px' }}>Step 2</Text>
                    <Title level={4} style={{ margin: '6px 0 0' }}>Payment</Title>
                  </div>

                  {!user ? (
                    <Card bordered style={{ borderRadius: '18px', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
                      <Space direction="vertical" size={12} style={{ width: '100%', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '18px', display: 'grid', placeItems: 'center', background: '#f4f4f5' }}>
                          <ShopOutlined style={{ fontSize: '22px' }} />
                        </div>
                        <Title level={4} style={{ margin: 0 }}>Login to pay</Title>
                        <Text type="secondary">Sign in to confirm the address and place the COD order.</Text>
                        <Button type="primary" onClick={openLogin} style={{ height: '44px', borderRadius: '12px', background: '#111', borderColor: '#111' }}>
                          Login / Signup
                        </Button>
                      </Space>
                    </Card>
                  ) : (
                  <Card bordered style={{ borderRadius: '18px', background: 'linear-gradient(135deg, #fcfcfc 0%, #f7fafc 100%)' }}>
                    <Space align="start" size={12}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: '#111', color: '#fff' }}>
                        <SafetyCertificateOutlined />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ display: 'block', fontSize: '16px' }}>Cash on Delivery</Text>
                        <Text type="secondary">Only COD is available right now. Pay when the order is delivered.</Text>
                      </div>
                      <Tag color="green" style={{ marginInlineEnd: 0, borderRadius: '999px' }}>Recommended</Tag>
                    </Space>
                  </Card>
                  )}

                  <Card bordered style={{ borderRadius: '18px' }}>
                    <Space direction="vertical" size={10} style={{ width: '100%' }}>
                      <Text strong>Delivery address</Text>
                      {selectedAddress ? (
                        <>
                          <Text>{selectedAddress.name || profile?.name || user?.name}</Text>
                          <Text type="secondary">{selectedAddress.mobile || profile?.mobile || user?.mobile}</Text>
                          <Text type="secondary">{formatAddressLine(selectedAddress)}</Text>
                          {selectedAddress.landmark ? <Text type="secondary">Landmark: {selectedAddress.landmark}</Text> : null}
                        </>
                      ) : (
                        <Alert type="warning" showIcon message="No address selected" description="Go back and select or add a delivery address." />
                      )}
                    </Space>
                  </Card>

                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={placingOrder}
                    disabled={!user || !selectedAddress}
                    onClick={placeOrder}
                    style={{ height: '52px', fontSize: '16px', borderRadius: '14px', background: '#111', borderColor: '#111' }}
                  >
                    Place order with COD
                  </Button>
                </Space>
              </Card>
            ) : (
              <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)', border: '1px solid #ececec' }}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '12px' }}>Step 1</Text>
                    <Title level={4} style={{ margin: '6px 0 0' }}>Select delivery address</Title>
                  </div>

                  {!user ? (
                    <Card bordered style={{ borderRadius: '18px', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
                      <Space direction="vertical" size={12} style={{ width: '100%', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '18px', display: 'grid', placeItems: 'center', background: '#f4f4f5' }}>
                          <ShopOutlined style={{ fontSize: '22px' }} />
                        </div>
                        <Title level={4} style={{ margin: 0 }}>Login to continue</Title>
                        <Text type="secondary">Sign in to use saved addresses and place the order.</Text>
                        <Button type="primary" onClick={openLogin} style={{ height: '44px', borderRadius: '12px', background: '#111', borderColor: '#111' }}>
                          Login / Signup
                        </Button>
                      </Space>
                    </Card>
                  ) : loadingProfile ? (
                    <Card bordered style={{ borderRadius: '18px' }}>
                      <Text type="secondary">Loading your saved addresses...</Text>
                    </Card>
                  ) : (
                    <>
                      {addresses.length > 0 ? (
                        <Radio.Group value={String(selectedAddressId || selectedAddress?._id || '')} onChange={(event) => setSelectedAddressId(event.target.value)} style={{ width: '100%' }}>
                          <Space direction="vertical" size={12} style={{ width: '100%' }}>
                            {addresses.map((address) => (
                              <Card
                                key={address._id}
                                bordered
                                style={{
                                  borderRadius: '18px',
                                  border: String(selectedAddressId || selectedAddress?._id || '') === String(address._id) ? '1px solid #111' : '1px solid #ececec',
                                  boxShadow: String(selectedAddressId || selectedAddress?._id || '') === String(address._id) ? '0 14px 30px rgba(17, 17, 17, 0.08)' : 'none',
                                  cursor: 'pointer'
                                }}
                                onClick={() => setSelectedAddressId(String(address._id))}
                              >
                                <Space align="start" size={14} style={{ width: '100%' }}>
                                  <Radio value={String(address._id)} />
                                  <div style={{ flex: 1 }}>
                                    <Space align="center" size={8} wrap>
                                      <Text strong style={{ fontSize: '15px' }}>{address.name || profile?.name || user?.name}</Text>
                                      {address.isDefault ? <Tag color="blue" style={{ borderRadius: '999px', margin: 0 }}>Default</Tag> : null}
                                    </Space>
                                    <Text type="secondary" style={{ display: 'block', marginTop: '2px' }}>{address.mobile || profile?.mobile || user?.mobile}</Text>
                                    <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>{formatAddressLine(address)}</Text>
                                    {address.landmark ? <Text type="secondary" style={{ display: 'block', marginTop: '2px' }}>Landmark: {address.landmark}</Text> : null}
                                  </div>
                                </Space>
                              </Card>
                            ))}
                          </Space>
                        </Radio.Group>
                      ) : (
                        <Card bordered style={{ borderRadius: '18px' }}>
                          <Empty description="No saved address found" />
                        </Card>
                      )}

                      <Space wrap>
                        <Button icon={<PlusOutlined />} onClick={openAddressModal} style={{ height: '44px', borderRadius: '12px' }}>
                          Add new address
                        </Button>
                        <Button type="primary" onClick={continueToPayment} style={{ height: '44px', borderRadius: '12px', background: '#111', borderColor: '#111' }}>
                          Continue to payment
                        </Button>
                      </Space>
                    </>
                  )}
                </Space>
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: '24px',
                position: 'sticky',
                top: '88px',
                border: '1px solid #ececec',
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)'
              }}
              bodyStyle={{ padding: '22px' }}
            >
              <Title level={4} style={{ marginTop: 0, marginBottom: '8px' }}>Amount Summary</Title>
              <Text type="secondary">All prices are shown in INR.</Text>
              <Divider style={{ margin: '18px 0' }} />

              <Space direction="vertical" size={14} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Subtotal ({cart.length} items)</Text>
                  <Text strong>₹ {formatPrice(subtotal)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Shipping</Text>
                  <Text strong style={{ color: '#16a34a' }}>Free</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Cash handling</Text>
                  <Text strong>₹ 0</Text>
                </div>
              </Space>

              <Divider style={{ margin: '18px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '22px' }}>
                <Title level={4} style={{ margin: 0 }}>Total</Title>
                <Title level={3} style={{ margin: 0, color: '#111' }}>₹ {formatPrice(total)}</Title>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #ececec', borderRadius: '16px', padding: '14px 16px' }}>
                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#555' }}>
                    <TruckOutlined />
                    <Text type="secondary">Free delivery on all cart orders</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#555' }}>
                    <SafetyCertificateOutlined />
                    <Text type="secondary">Only cash on delivery is enabled</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#555' }}>
                    <HomeOutlined />
                    <Text type="secondary">Saved addresses stay linked to your account</Text>
                  </div>
                </Space>
              </div>

              {selectedAddress ? (
                <Card bordered style={{ borderRadius: '16px', marginTop: '16px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '6px' }}>Selected address</Text>
                  <Text strong style={{ display: 'block' }}>{selectedAddress.name || profile?.name || user?.name}</Text>
                  <Text type="secondary" style={{ display: 'block' }}>{formatAddressLine(selectedAddress)}</Text>
                </Card>
              ) : null}
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        open={addressModalOpen}
        onCancel={() => setAddressModalOpen(false)}
        footer={null}
        centered
        width={620}
        destroyOnClose
        title={null}
      >
        <div style={{ marginBottom: '18px' }}>
          <Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '11px' }}>New address</Text>
          <Title level={3} style={{ margin: '4px 0 0' }}>Add delivery address</Title>
        </div>

        <Form layout="vertical" form={addressForm} onFinish={saveAddress} requiredMark={false}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Full name" rules={[{ required: true, message: 'Enter full name' }]}>
                <Input size="large" placeholder="Name on address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="mobile" label="Mobile number" rules={[{ required: true, message: 'Enter mobile number' }]}>
                <Input size="large" placeholder="10 digit mobile number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="pincode" label="Pincode" rules={[{ required: true, message: 'Enter pincode' }]}>
                <Input size="large" placeholder="Pincode" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="landmark" label="Landmark">
                <Input size="large" placeholder="Nearby landmark" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="street" label="House no., building, street" rules={[{ required: true, message: 'Enter street details' }]}>
            <Input size="large" placeholder="Flat / house / street" />
          </Form.Item>

          <Form.Item name="area" label="Area / locality" rules={[{ required: true, message: 'Enter area' }]}>
            <Input size="large" placeholder="Area / locality" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="city" label="City" rules={[{ required: true, message: 'Enter city' }]}>
                <Input size="large" placeholder="City" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="state" label="State" rules={[{ required: true, message: 'Enter state' }]}>
                <Input size="large" placeholder="State" />
              </Form.Item>
            </Col>
          </Row>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setAddressModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={savingAddress} style={{ background: '#111', borderColor: '#111' }}>
              Save address
            </Button>
          </Space>
        </Form>
      </Modal>

      <AuthModal
        open={authOpen}
        initialTab={authTab}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={() => {
          setAuthOpen(false);
          syncProfile();
        }}
      />
    </div>
  );
};

export default CheckoutFlow;
