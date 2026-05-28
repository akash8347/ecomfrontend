import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider';
// import { dispatch} from '../../context/AuthProvider';
import AdminHed from './AdminHed';
import { adminContext } from './AdminProvider';
import { Button, Card, Col, Input, Progress, Row, Space, Statistic, Table, Typography, Alert, Tag } from 'antd';
import { formatPrice } from '../../utils/pricing';

const AdminDash = () => {
  // const { dispatch } = useContext(AuthContext)

  const { admin } = useContext(AuthContext)
  const { dispatch, allusers, totalUsers, totalIncome, allorders } = useContext(adminContext)
const [error,setError]=useState()
const [searchText, setSearchText] = useState('')
let url= process.env.REACT_APP_BACKENDURL
const deletehandle = async (id) => {
  const {token}=admin;
 
  // `${url}
  const res = await fetch(`${url}/admin/userdelete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },

  })
  const json = await res.json()
  if (!res.ok) {
    console.log(json.error)
  }
  console.log(json.success)
  // location.reload()
  dispatch({ type: 'DELETE_USER', payload: id })

}


  useEffect(() => {
    console.log(admin)
    const fetch1 = async () => {
      if (!admin) {
        return
      }
     
      try {
        const {token}=admin
        const res = await fetch(`${url}/admin/allusers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const json = await res.json()
        if (!res.ok) {
          setError(json.error || json.errormsg)
          console.log(json.error || json.errormsg)
          return;
        }
        
        console.log(json.users)
        console.log(json.usersCount)
        console.log(json.totalIncome)

        dispatch({ type: 'ALLUSERS', payload: json.users || [] })
        dispatch({ type: 'TOTAL_USER', payload: json.usersCount || 0 })
        dispatch({ type: 'TOTAL_INCOME', payload: json.totalIncome || 0 })


      } catch (error) {
        console.log(error)
      }

    }
    const fetchOrders = async () => {
      try {
        const { token } = admin
        const res = await fetch(`${url}/admin/allorders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        const json = await res.json()
        if (!res.ok) {
          return
        }

        dispatch({ type: 'ALLORDERS', payload: json.orders1 || [] })
      } catch (error) {
        console.log(error)
      }
    }
    if (admin) {
      fetch1()
      fetchOrders()
    }
  }, [dispatch,admin,url])

  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return allusers || [];
    const term = searchText.toLowerCase();
    return (allusers || []).filter((user) => [user.email, user.name, String(user.id)].some((value) => String(value || '').toLowerCase().includes(term)));
  }, [allusers, searchText]);

  const userColumns = [
    { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Action', key: 'action', render: (_, record) => <Button danger size="small" onClick={() => deletehandle(record.id)}>Delete</Button> }
  ]

  const safeOrders = useMemo(() => allorders || [], [allorders]);

  const last7DaysRevenue = useMemo(() => {
    const labels = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      return {
        label: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        key: dayKey,
        revenue: 0,
        orders: 0
      };
    });

    const keyed = labels.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});

    safeOrders.forEach((order) => {
      const dateValue = order.order_created_at || order.created_at;
      if (!dateValue) return;
      const date = new Date(dateValue);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (!keyed[key]) return;
      keyed[key].orders += 1;
      keyed[key].revenue += Number(order.totalCost || order.total_cost || 0);
    });

    return labels;
  }, [safeOrders]);

  const maxRevenue = useMemo(() => {
    const value = Math.max(...last7DaysRevenue.map((item) => item.revenue), 0);
    return value || 1;
  }, [last7DaysRevenue]);

  const statusStats = useMemo(() => {
    const total = safeOrders.length || 1;
    const pending = safeOrders.filter((order) => (order.order_status || order.orderStatus || 'Pending') === 'Pending').length;
    const processing = safeOrders.filter((order) => (order.order_status || order.orderStatus || 'Pending') === 'Processing').length;
    const delivered = safeOrders.filter((order) => (order.order_status || order.orderStatus || 'Pending') === 'Delivered').length;

    return {
      pending,
      processing,
      delivered,
      pendingPercent: Math.round((pending / total) * 100),
      processingPercent: Math.round((processing / total) * 100),
      deliveredPercent: Math.round((delivered / total) * 100)
    };
  }, [safeOrders]);

  const categoryStats = useMemo(() => {
    const map = {};

    safeOrders.forEach((order) => {
      const items = order.orderedProducts || order.items || [];
      items.forEach((item) => {
        const product = item.product || item;
        const category = product.category || 'Uncategorized';
        map[category] = (map[category] || 0) + Number(item.quantity || item.order_quantity || 1);
      });
    });

    return Object.entries(map)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [safeOrders]);



  return (
    <>
      <AdminHed />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', padding: '28px 20px 56px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: '18px' }}>
            <Typography.Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Overview</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>Dashboard</Typography.Title>
            <Typography.Text type="secondary">Track users and revenue from one clean control surface.</Typography.Text>
          </Space>

          {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: '18px', borderRadius: '14px' }} /> : null}

          <Row gutter={[20, 20]} style={{ marginBottom: '20px' }}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
                <Typography.Text type="secondary">Total users</Typography.Text>
                <Typography.Title level={2} style={{ margin: '6px 0 0' }}>{admin ? totalUsers : 0}</Typography.Title>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
                <Typography.Text type="secondary">Earnings</Typography.Text>
                <Typography.Title level={2} style={{ margin: '6px 0 0' }}>₹ {admin ? formatPrice(totalIncome) : 0}</Typography.Title>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
                <Typography.Text type="secondary">Total orders</Typography.Text>
                <Typography.Title level={2} style={{ margin: '6px 0 0' }}>{safeOrders.length}</Typography.Title>
              </Card>
            </Col>
          </Row>

          <Row gutter={[20, 20]} style={{ marginBottom: '20px' }}>
            <Col xs={24} lg={14}>
              <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={10}>
                  <Typography.Title level={5} style={{ margin: 0 }}>Date-wise Revenue (Last 7 days)</Typography.Title>
                  {last7DaysRevenue.map((item) => {
                    const width = `${Math.max(8, Math.round((item.revenue / maxRevenue) * 100))}%`;
                    return (
                      <div key={item.key}>
                        <Row align="middle" justify="space-between">
                          <Typography.Text>{item.label}</Typography.Text>
                          <Space size={10}>
                            <Tag color="blue">{item.orders} orders</Tag>
                            <Typography.Text strong>₹ {formatPrice(item.revenue)}</Typography.Text>
                          </Space>
                        </Row>
                        <div style={{ height: '9px', borderRadius: '999px', background: '#eef2f7', marginTop: '6px', overflow: 'hidden' }}>
                          <div style={{ width, height: '100%', background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)' }} />
                        </div>
                      </div>
                    );
                  })}
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)', height: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <Typography.Title level={5} style={{ margin: 0 }}>Order Status Mix</Typography.Title>
                  <div>
                    <Typography.Text>Pending ({statusStats.pending})</Typography.Text>
                    <Progress percent={statusStats.pendingPercent} strokeColor="#f59e0b" />
                  </div>
                  <div>
                    <Typography.Text>Processing ({statusStats.processing})</Typography.Text>
                    <Progress percent={statusStats.processingPercent} strokeColor="#3b82f6" />
                  </div>
                  <div>
                    <Typography.Text>Delivered ({statusStats.delivered})</Typography.Text>
                    <Progress percent={statusStats.deliveredPercent} strokeColor="#16a34a" />
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Row gutter={[20, 20]} style={{ marginBottom: '20px' }}>
            <Col xs={24} lg={10}>
              <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)', height: '100%' }}>
                <Typography.Title level={5} style={{ marginTop: 0 }}>Top Categories (By Units)</Typography.Title>
                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                  {categoryStats.length > 0 ? categoryStats.map((item) => (
                    <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e5e7eb', paddingBottom: '8px' }}>
                      <Typography.Text>{item.category}</Typography.Text>
                      <Typography.Text strong>{item.count}</Typography.Text>
                    </div>
                  )) : <Typography.Text type="secondary">No order item data yet.</Typography.Text>}
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={14}>
              <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)', height: '100%' }}>
                <Typography.Title level={5} style={{ marginTop: 0 }}>Revenue Snapshot</Typography.Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Statistic title="Last 7 days revenue" value={last7DaysRevenue.reduce((sum, item) => sum + item.revenue, 0)} formatter={(value) => `₹ ${formatPrice(value)}`} />
                  </Col>
                  <Col xs={24} md={12}>
                    <Statistic title="Last 7 days orders" value={last7DaysRevenue.reduce((sum, item) => sum + item.orders, 0)} />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          { !error && admin && allusers && allusers.length > 0 ? (
            <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Input.Search
                  allowClear
                  placeholder="Search users"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={(value) => setSearchText(value)}
                  style={{ maxWidth: '360px' }}
                />
                <Table rowKey="id" columns={userColumns} dataSource={filteredUsers} pagination={{ pageSize: 8, showSizeChanger: false }} scroll={{ x: true }} />
              </Space>
            </Card>
          ) : (
            <Card bordered={false} style={{ borderRadius: '22px', textAlign: 'center', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
              {!admin && <Typography.Title level={4} style={{ marginTop: 0 }}>Admin not logged in</Typography.Title>}
              {admin && <Typography.Title level={4} style={{ marginTop: 0 }}>No users available</Typography.Title>}
            </Card>
          )}
        </div>
      </div>

    </>
  )
}

export default AdminDash