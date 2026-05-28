import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AdminHed from './AdminHed'
import { adminContext } from './AdminProvider'
import { AuthContext } from '../../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { formatPrice } from '../../utils/pricing'
import { Button, Card, Empty, Input, Select, Space, Tag, Table, Typography, message } from 'antd'

const ORDER_STATUSES = ['Pending', 'Processing', 'Delivered'];

const getDisplayStatus = (order) => order.order_status || order.orderStatus || 'Pending';
const getDisplayUserName = (order) => {
  if (typeof order.user_id === 'object' && order.user_id) {
    return order.user_id.name || order.user_id.email || order.customer_name || 'Unknown';
  }

  return order.customer_name || order.user_name || 'Unknown';
};

const AdminOrders = () => {
  const { dispatch, allorders } = useContext(adminContext)
  const { admin } = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [savingOrderId, setSavingOrderId] = useState(null)
  const url = process.env.REACT_APP_BACKENDURL

  const fetchOrders = useCallback(async () => {
    if (!admin?.token) {
      return;
    }

    const res = await fetch(`${url}/admin/allorders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${admin.token}`
      }
    })
    const orderjson = await res.json()
    if (!res.ok) {
      console.log(orderjson.error)
      return;
    }
    dispatch({ type: 'ALLORDERS', payload: orderjson.orders1 || [] })
  }, [admin, dispatch, url])

  const detailOrder = (id) => {
    navigate(`/orderdetail/${id}`)
  }
  useEffect(() => {

    const func = async () => {
      await fetchOrders()
    }
    if (admin) {
      func()
    }

  }, [admin, fetchOrders])

  const filteredOrders = useMemo(() => {
    return (allorders || []).filter((order) => {
      const currentStatus = getDisplayStatus(order);
      const matchesStatus = statusFilter === 'all' || String(currentStatus).toLowerCase() === statusFilter.toLowerCase();
      const searchable = [order.user_id, order.order_id, currentStatus, order.product_name, (order.orderedProducts || []).map((item) => item?.product?.name || item?.name).join(' ')].join(' ').toLowerCase();
      const matchesSearch = !searchText.trim() || searchable.includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [allorders, searchText, statusFilter]);

  const updateStatusInBackend = async (orderId, nextStatus, token) => {
    try {
      const response = await fetch(`${url}/admin/processorder/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: nextStatus,
          order_status: nextStatus,
          orderStatus: nextStatus,
          desiredStatus: nextStatus
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Order status update failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const changeOrderStatus = async (order, nextStatus) => {
    if (!admin?.token) {
      message.error('Admin token missing. Please login again.');
      return;
    }

    const orderId = order.order_id || order.id;
    const currentStatus = getDisplayStatus(order);
    if (nextStatus === currentStatus) {
      return;
    }

    setSavingOrderId(orderId);

    try {
      const json = await updateStatusInBackend(orderId, nextStatus, admin.token);
      if (!json) {
        throw new Error('No status update endpoint accepted the request');
      }
      const resolvedStatus = json?.order_status || json?.status || json?.crtStatus || nextStatus;

      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: resolvedStatus } });
      await fetchOrders();
      message.success(`Order ${orderId} updated to ${resolvedStatus}`);
    } catch (error) {
      console.error(error);
      message.error('Could not update order status right now.');
    } finally {
      setSavingOrderId(null);
    }
  };

  const orderColumns = [
    { title: 'User Name', key: 'user_name', render: (_, record) => getDisplayUserName(record) },
    { title: 'Order ID', key: 'order_id', render: (_, record) => record.order_id || record.id },
    {
      title: 'Order time',
      key: 'order_time',
      render: (_, record) => `${moment(record.order_created_at).fromNow()} ${moment(record.order_created_at).format('D-M-YYYY')}`
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = getDisplayStatus(record);
        return <Tag color={status === 'Delivered' ? 'green' : (status === 'Processing' ? 'blue' : 'gold')}>{status}</Tag>;
      }
    },
    { title: 'Total', key: 'total', render: (_, record) => `₹ ${formatPrice(record.totalCost || record.total_cost)}` },
    {
      title: 'Process',
      key: 'process',
      render: (_, record) => {
        const orderId = record.order_id || record.id;
        return (
          <Select
            size="small"
            style={{ minWidth: 130 }}
            value={getDisplayStatus(record)}
            loading={savingOrderId === orderId}
            onChange={(value) => changeOrderStatus(record, value)}
            options={ORDER_STATUSES.map((status) => ({ value: status, label: status }))}
          />
        );
      }
    },
    { title: 'Delete', key: 'delete', render: (_, record) => <Button danger size="small" onClick={() => deleteOrder(record.order_id || record.id)}>Delete</Button> },
    { title: 'Details', key: 'details', render: (_, record) => <Button size="small" onClick={() => detailOrder(record.order_id || record.id)}>Details</Button> }
  ]
  // -------------------------------DELETE order----------------------

  const deleteOrder = async (orderId) => {
    console.log('deleteOrder called' )
    console.log(orderId)
    const { token } = admin
    const res = await fetch(`${url}/admin/deleteorder/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      console.log(json.error)
    }
    console.log(json.success)
    // location.reload()
    dispatch({ type: 'DELETE_ORDER', payload: orderId })

  }
  return (
    <>
      <AdminHed />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', padding: '28px 20px 56px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: '18px' }}>
            <Typography.Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Operations</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>Orders</Typography.Title>
            <Typography.Text type="secondary">Review, process, and delete orders from a single list.</Typography.Text>
          </Space>

          {admin && allorders && allorders.length > 0 ? (
            <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space wrap>
                  <Input.Search allowClear placeholder="Search orders" value={searchText} onChange={(e) => setSearchText(e.target.value)} onSearch={(value) => setSearchText(value)} style={{ maxWidth: '360px' }} />
                  <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 180 }} options={[{ value: 'all', label: 'All statuses' }, { value: 'Pending', label: 'Pending' }, { value: 'Processing', label: 'Processing' }, { value: 'Delivered', label: 'Delivered' }]} />
                </Space>
                <Table rowKey="order_id" columns={orderColumns} dataSource={filteredOrders} pagination={{ pageSize: 6, showSizeChanger: false }} scroll={{ x: true }} />
              </Space>
            </Card>
          ) : (
            <Card bordered={false} style={{ borderRadius: '22px', textAlign: 'center', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
              {!admin && <Typography.Title level={4} style={{ marginTop: 0 }}>Admin not logged in</Typography.Title>}
              {admin && <Empty description="No orders available" />}
            </Card>
          )}
        </div>
      </div>

    </>
  )
}

export default AdminOrders