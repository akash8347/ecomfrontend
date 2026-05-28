import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Divider, Empty, Form, Input, Modal, Radio, Row, Space, Tag, Typography, message } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, PlusOutlined, SafetyCertificateOutlined, ShoppingOutlined, TruckOutlined } from '@ant-design/icons';
import SingleCart from './SingleCart';
import { cartContext } from '../../context/ContextPro';
import { AuthContext } from '../../context/AuthProvider';
import AuthModal from './AuthModal';
import { formatPrice, getDiscountedPrice } from '../../utils/pricing';

const { Title, Text } = Typography;

const formatAddressLine = (address = {}) => [address.street, address.area, address.city, address.state].filter(Boolean).join(', ');
const hasAddressDetails = (address) => Boolean(address && (address._id || address.street || address.area || address.city || address.state || address.pincode || address.address));

const Cart = () => {
  const navigate = useNavigate();
  const [addressForm] = Form.useForm();
  const { state: { cart, cartTotal, shippingdata }, dispatch: cartDispatch } = useContext(cartContext);
  const { user, dispatch: authDispatch } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileResolved, setProfileResolved] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressModalView, setAddressModalView] = useState('list');
  const [savingAddress, setSavingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('bag');
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const url = process.env.REACT_APP_BACKENDURL;

  const subtotal = Number.parseFloat(cartTotal) || 0;
  const shipping = 0;
  const total = subtotal + shipping;
  const addresses = useMemo(() => profile?.addresses || [], [profile?.addresses]);
  const selectedAddress = useMemo(() => {
    const bySelection = addresses.find((address) => String(address._id) === String(selectedAddressId));
    const byDefault = addresses.find((address) => String(address._id) === String(profile?.defaultAddressId));
    const bySavedShipping = hasAddressDetails(shippingdata) ? shippingdata : null;
    return bySelection || byDefault || bySavedShipping || addresses[0] || null;
  }, [addresses, profile?.defaultAddressId, selectedAddressId, shippingdata]);

  const activeStep = checkoutStep === 'payment' ? 2 : checkoutStep === 'address' ? 1 : 0;

  const authToken = user?.token || null;

  const loadProfile = useCallback(async () => {
    if (!authToken) {
      console.log('[Cart address debug] no user token; skipping profile fetch');
      setProfile(null);
      setSelectedAddressId(null);
      setProfileResolved(true);
      return;
    }

    console.log('[Cart address debug] profile fetch start', {
      userEmail: user?.email || null,
      hasToken: Boolean(authToken)
    });

    setProfileLoading(true);
    setProfileResolved(false);
    try {
      const response = await fetch(`${url}/api/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error || 'Unable to load profile');
      }

      setProfile(json);

      if (json.defaultAddressId) {
        setSelectedAddressId(String(json.defaultAddressId));
      } else if (json.addresses?.[0]?._id) {
        setSelectedAddressId(String(json.addresses[0]._id));
      }

      console.log('[Cart address debug] profile fetch success', {
        addressesCount: json.addresses?.length || 0,
        defaultAddressId: json.defaultAddressId || null,
        selectedAddressId: json.defaultAddressId || json.addresses?.[0]?._id || null
      });
    } catch (error) {
      console.error('[Cart address debug] profile fetch failed', error);
    } finally {
      setProfileLoading(false);
      setProfileResolved(true);
      console.log('[Cart address debug] profile fetch finished');
    }
  }, [authToken, url, user?.email]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (selectedAddress) {
      cartDispatch({ type: 'SHIPPING_DETAIL', payload: selectedAddress });
      localStorage.setItem('shippingData', JSON.stringify(selectedAddress));
    }
  }, [cartDispatch, selectedAddress]);

  useEffect(() => {
    console.log('[Cart address debug] banner state', {
      profileResolved,
      profileLoading,
      selectedAddressId,
      selectedAddressExists: Boolean(selectedAddress),
      addressesCount: addresses.length,
      savedShippingExists: hasAddressDetails(shippingdata)
    });
  }, [addresses.length, profileLoading, profileResolved, selectedAddress, selectedAddressId, shippingdata]);

  const openAuth = () => {
    setAuthTab('login');
    setAuthOpen(true);
  };

  const openAddressModal = () => {
    setAddressModalView('list');
    setAddressModalOpen(true);
  };

  const openAddressForm = () => {
    addressForm.setFieldsValue({
      name: profile?.name || user?.name || '',
      mobile: profile?.mobile || user?.mobile || ''
    });
    setAddressModalView('form');
  };

  const saveAddress = async (values) => {
    if (!user?.token) {
      openAuth();
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
      }

      addressForm.resetFields();
      setAddressModalView('list');
      setAddressModalOpen(true);
      message.success('Address saved successfully');
    } catch (error) {
      message.error(error.message || 'Unable to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const placeOrder = async () => {
    if (!user?.token) {
      openAuth();
      return;
    }

    if (!selectedAddress) {
      message.warning('Please select or add an address first.');
      setCheckoutStep('address');
      openAddressModal();
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
      cartDispatch({ type: 'LOGOUT_ORDER' });
      cartDispatch({ type: 'SHIPPING_DETAIL', payload: {} });
      message.success('Order placed successfully');
      navigate('/orderstatus');
    } catch (error) {
      message.error(error.message || 'Unable to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const stepItems = [
    { title: 'Bag' },
    { title: 'Address' },
    { title: 'Payment' }
  ];

  const renderBag = () => (
    <Card bordered={false} style={{ borderRadius: '20px', border: '1px solid #ececec', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
      <Space direction="vertical" size={10} style={{ width: '100%' }}>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space size={10}>
            <div style={{ width: 36, height: 36, borderRadius: '12px', background: '#111', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <ShoppingOutlined />
            </div>
            <div>
              <Text strong style={{ display: 'block' }}>Bag</Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>{cart.length} items selected</Text>
            </div>
          </Space>
          <Tag color="green" style={{ borderRadius: '999px', margin: 0 }}>Ready</Tag>
        </Space>

        <Divider style={{ margin: '8px 0 4px' }} />

        <div style={{ display: 'grid', gap: '14px' }}>
          {cart.map((item) => (
            <SingleCart key={item.id || item._id} item={item} />
          ))}
        </div>

        <Button type="primary" size="large" block onClick={() => setCheckoutStep('address')} style={{ height: '46px', borderRadius: '12px', background: '#111', borderColor: '#111' }}>
          Continue
        </Button>
      </Space>
    </Card>
  );

  const renderAddress = () => (
    <Card bordered={false} style={{ borderRadius: '20px', border: '1px solid #ececec', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space size={10}>
            <div style={{ width: 36, height: 36, borderRadius: '12px', background: '#111', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <HomeOutlined />
            </div>
            <div>
              <Text strong style={{ display: 'block' }}>Address</Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>Select a delivery address</Text>
            </div>
          </Space>
          <Tag color="blue" style={{ borderRadius: '999px', margin: 0 }}>Step 2</Tag>
        </Space>

        {user ? (
          <Card bordered style={{ borderRadius: '16px', background: '#fff8f8', border: '1px solid #f3d7d7' }} bodyStyle={{ padding: '14px' }}>
            {!profileResolved || profileLoading ? (
              <Text type="secondary">Loading address...</Text>
            ) : selectedAddress ? (
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text strong style={{ fontSize: '15px' }}>Deliver to: {selectedAddress.name || user?.name}, {selectedAddress.pincode || ''}</Text>
                <Text type="secondary">{formatAddressLine(selectedAddress)}</Text>
              </Space>
            ) : (
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text strong>No saved address yet</Text>
                <Text type="secondary">Add a delivery address to continue.</Text>
              </Space>
            )}

            <Button danger ghost onClick={openAddressModal} style={{ marginTop: '12px', borderRadius: '12px' }}>
              Change address
            </Button>
          </Card>
        ) : (
          <Alert type="warning" showIcon message="Login required" description="Please sign in to use saved addresses and place the order." />
        )}

        <Card bordered style={{ borderRadius: '16px' }} bodyStyle={{ padding: '12px 14px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>Selected items</Text>
          <div style={{ display: 'grid', gap: '12px' }}>
            {cart.map((item) => (
              <div key={item.id || item._id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: 54, height: 54, borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', flexShrink: 0, border: '1px solid #ececec' }}>
                  <img src={`${process.env.REACT_APP_BACKENDURL}${item.image_urls?.[0] || item.image || ''}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <Text strong style={{ display: 'block', lineHeight: 1.25 }}>{item.name}</Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>{item.company}</Text>
                  <Text style={{ display: 'block', marginTop: '4px' }}>Qty {item.quantity} · ₹ {formatPrice(getDiscountedPrice(item) * Number(item.quantity || 1))}</Text>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button onClick={() => setCheckoutStep('bag')} style={{ borderRadius: '12px' }}>Back</Button>
          <Button type="primary" onClick={() => setCheckoutStep('payment')} disabled={!selectedAddress && !!user} style={{ borderRadius: '12px', background: '#111', borderColor: '#111' }}>
            Continue to payment
          </Button>
        </Space>
      </Space>
    </Card>
  );

  const renderPayment = () => (
    <Card bordered={false} style={{ borderRadius: '20px', border: '1px solid #ececec', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space size={10}>
            <div style={{ width: 36, height: 36, borderRadius: '12px', background: '#111', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <SafetyCertificateOutlined />
            </div>
            <div>
              <Text strong style={{ display: 'block' }}>Payment</Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>Cash on delivery only</Text>
            </div>
          </Space>
          <Tag color="purple" style={{ borderRadius: '999px', margin: 0 }}>Step 3</Tag>
        </Space>

        <Card bordered style={{ borderRadius: '16px', background: '#fbfcfe' }} bodyStyle={{ padding: '14px' }}>
          <Text strong style={{ display: 'block', marginBottom: '6px' }}>Cash on Delivery</Text>
          <Text type="secondary">Pay when your order is delivered. No online payment options are available.</Text>
        </Card>

        {selectedAddress ? (
          <Card bordered style={{ borderRadius: '16px' }} bodyStyle={{ padding: '14px' }}>
            <Text strong style={{ display: 'block' }}>Deliver to: {selectedAddress.name || user?.name}, {selectedAddress.pincode || ''}</Text>
            <Text type="secondary">{formatAddressLine(selectedAddress)}</Text>
          </Card>
        ) : null}

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button onClick={() => setCheckoutStep('address')} style={{ borderRadius: '12px' }}>Back</Button>
          <Button type="primary" loading={placingOrder} disabled={!user || !selectedAddress} onClick={placeOrder} style={{ borderRadius: '12px', background: '#111', borderColor: '#111' }}>
            Place order
          </Button>
        </Space>
      </Space>
    </Card>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fafafa 0%, #f3f4f6 100%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 16px 28px' }}>
        <Card bordered={false} style={{ borderRadius: '20px', border: '1px solid #ececec', boxShadow: '0 8px 22px rgba(15, 23, 42, 0.05)', marginBottom: '14px' }} bodyStyle={{ padding: '14px 16px' }}>
          <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #ff4d6d 0%, #ff8a00 100%)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>M</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center', maxWidth: 360 }}>
              {stepItems.map((item, index) => (
                <React.Fragment key={item.title}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '999px', background: index === activeStep ? '#14b8a6' : index < activeStep ? '#111' : '#cbd5e1', display: 'inline-block' }} />
                    <Text style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: index === activeStep ? '#14b8a6' : '#475569', fontWeight: 700 }}>{item.title}</Text>
                  </div>
                  {index < stepItems.length - 1 ? <span style={{ width: 24, height: 1, background: '#d1d5db', display: 'inline-block' }} /> : null}
                </React.Fragment>
              ))}
            </div>
            <Space size={8} style={{ color: '#0f766e', fontWeight: 700 }}>
              <SafetyCertificateOutlined />
              <span>100% secure</span>
            </Space>
          </Space>
        </Card>

        {cart.length === 0 ? (
          <Card bordered={false} style={{ borderRadius: '20px', border: '1px solid #ececec', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
            <Empty description={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>Your cart is empty</span>}>
              <Button type="primary" size="large" onClick={() => navigate('/store')} style={{ marginTop: '16px', height: '44px', borderRadius: '12px', background: '#111', borderColor: '#111' }}>
                Go to Store
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[16, 16]} align="top">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {checkoutStep === 'bag' ? renderBag() : checkoutStep === 'address' ? renderAddress() : renderPayment()}
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <Card bordered={false} style={{ borderRadius: '20px', position: 'sticky', top: 18, border: '1px solid #ececec', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }} bodyStyle={{ padding: '18px' }}>
                <Title level={4} style={{ margin: 0 }}>Price details</Title>
                <Text type="secondary">Summary of your cart</Text>
                <Divider style={{ margin: '14px 0' }} />

                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Subtotal</Text>
                    <Text strong>₹ {formatPrice(subtotal)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Shipping</Text>
                    <Text strong style={{ color: '#16a34a' }}>Free</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Cash on delivery</Text>
                    <Text strong>₹ 0</Text>
                  </div>
                </Space>

                <Divider style={{ margin: '14px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <Title level={4} style={{ margin: 0 }}>Total</Title>
                  <Title level={3} style={{ margin: 0 }}>₹ {formatPrice(total)}</Title>
                </div>

                <Button type="primary" block loading={placingOrder} disabled={!user || !selectedAddress} onClick={placeOrder} style={{ height: '46px', borderRadius: '12px', background: '#111', borderColor: '#111' }}>
                  {user ? 'PLACE ORDER' : 'LOGIN TO PLACE ORDER'}
                </Button>

                <div style={{ marginTop: '12px', display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#555' }}>
                    <TruckOutlined />
                    <Text type="secondary">Free delivery on all cart orders</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#555' }}>
                    <SafetyCertificateOutlined />
                    <Text type="secondary">Cash on delivery only</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>

      <Modal
        open={addressModalOpen}
        onCancel={() => setAddressModalOpen(false)}
        footer={null}
        width={640}
        centered
        destroyOnClose={false}
        styles={{ body: { padding: '18px' } }}
        title={null}
      >
        {addressModalView === 'form' ? (
          <div>
            <Space align="center" style={{ marginBottom: '14px' }}>
              <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setAddressModalView('list')} style={{ paddingInline: 0 }} />
              <div>
                <Text type="secondary" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Address</Text>
                <Title level={4} style={{ margin: 0 }}>Add new address</Title>
              </div>
            </Space>

            <Form layout="vertical" form={addressForm} onFinish={saveAddress} requiredMark={false}>
              <Row gutter={12}>
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

              <Row gutter={12}>
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

              <Row gutter={12}>
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
          </div>
        ) : (
          <div>
            <Space align="center" style={{ justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Address</Text>
                <Title level={4} style={{ margin: 0 }}>Select delivery address</Title>
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={openAddressForm} style={{ background: '#111', borderColor: '#111' }}>
                Add new address
              </Button>
            </Space>

            {profileLoading || !profileResolved ? (
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Card bordered style={{ borderRadius: '14px' }}>
                  <Text type="secondary">Loading saved addresses...</Text>
                </Card>
                <Card bordered style={{ borderRadius: '14px' }}>
                  <Text type="secondary">Loading saved addresses...</Text>
                </Card>
              </Space>
            ) : addresses.length > 0 ? (
              <Radio.Group value={String(selectedAddressId || selectedAddress?._id || '')} onChange={(event) => setSelectedAddressId(event.target.value)} style={{ width: '100%' }}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  {addresses.map((address) => (
                    <Card
                      key={address._id}
                      bordered
                      onClick={() => setSelectedAddressId(String(address._id))}
                      style={{
                        borderRadius: '14px',
                        cursor: 'pointer',
                        border: String(selectedAddressId || selectedAddress?._id || '') === String(address._id) ? '1px solid #111' : '1px solid #ececec'
                      }}
                    >
                      <Space align="start" size={12}>
                        <Radio value={String(address._id)} />
                        <div>
                          <Space size={8} wrap>
                            <Text strong>{address.name || profile?.name || user?.name}</Text>
                            {address.isDefault ? <Tag color="blue" style={{ margin: 0, borderRadius: '999px' }}>Default</Tag> : null}
                          </Space>
                          <Text type="secondary" style={{ display: 'block' }}>{address.mobile || profile?.mobile || user?.mobile}</Text>
                          <Text type="secondary" style={{ display: 'block', marginTop: '6px' }}>{formatAddressLine(address)}</Text>
                          {address.landmark ? <Text type="secondary" style={{ display: 'block' }}>Landmark: {address.landmark}</Text> : null}
                        </div>
                      </Space>
                    </Card>
                  ))}
                </Space>
              </Radio.Group>
            ) : (
              <Card bordered style={{ borderRadius: '14px' }}>
                <Empty description="No saved address yet" />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={openAddressForm} style={{ background: '#111', borderColor: '#111' }}>
                    Add new address
                  </Button>
                </div>
              </Card>
            )}

            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '14px' }}>
              <Button onClick={() => setAddressModalOpen(false)}>Close</Button>
              <Button type="primary" onClick={() => { setAddressModalOpen(false); setCheckoutStep('payment'); }} disabled={!selectedAddress && !!user} style={{ background: '#111', borderColor: '#111' }}>
                Use selected address
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      <AuthModal
        open={authOpen}
        initialTab={authTab}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={() => {
          setAuthOpen(false);
          loadProfile();
        }}
      />
    </div>
  );
};

export default Cart;
