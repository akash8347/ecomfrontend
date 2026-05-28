import React, { useEffect, useMemo, useState } from 'react'
import AdminHed from './AdminHed'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import moment from 'moment'
import { Card, Empty, Input, Space, Table, Typography } from 'antd'
const AdminContact = () => {
  const { admin } = useContext(AuthContext)
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState('')
  useEffect(() => {

    const func = async () => {
      const { token } = admin
      let url = process.env.REACT_APP_BACKENDURL

      const res = await fetch(`${url}/admin/allcontact`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      let contactjson = await res.json()
      if (!res.ok) {
        console.log(contactjson.error)
        setError(contactjson.error)
        return;
      }
      setContacts(Array.isArray(contactjson) ? contactjson : []);
      console.log(contactjson)
    }
    if (admin) {
      func()
    }

  }, [admin])

  const filteredContacts = useMemo(() => contacts.filter((contact) => {
    const searchable = [contact.name, contact.email, contact.message].join(' ').toLowerCase();
    return !searchText.trim() || searchable.includes(searchText.toLowerCase());
  }), [contacts, searchText]);

  const contactColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true },
    { title: 'Created At', key: 'createdAt', render: (_, record) => `${moment(record.createdAt).fromNow()} ${moment(record.createdAt).format('D-M-YYYY')}` }
  ]
  return (
    <>
      <AdminHed />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', padding: '28px 20px 56px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: '18px' }}>
            <Typography.Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Messages</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>Contact submissions</Typography.Title>
          </Space>

          {error === null ? (
            contacts.length > 0 ? (
              <Card bordered={false} style={{ borderRadius: '22px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Input.Search allowClear placeholder="Search messages" value={searchText} onChange={(e) => setSearchText(e.target.value)} onSearch={(value) => setSearchText(value)} style={{ maxWidth: '360px' }} />
                  <Table rowKey="id" columns={contactColumns} dataSource={filteredContacts} pagination={{ pageSize: 8, showSizeChanger: false }} scroll={{ x: true }} />
                </Space>
              </Card>
            ) : (
              <Card bordered={false} style={{ borderRadius: '22px', textAlign: 'center' }}>
                <Empty description="No contact messages yet" />
              </Card>
            )
          ) : (
            <Card bordered={false} style={{ borderRadius: '22px', textAlign: 'center' }}>
              <Typography.Text type="danger">{error}</Typography.Text>
            </Card>
          )}
        </div>
      </div>
    </>

  )
}

export default AdminContact