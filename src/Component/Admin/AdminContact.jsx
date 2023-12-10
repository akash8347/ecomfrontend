import React, { useEffect, useState } from 'react'
import AdminHed from './AdminHed'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import moment from 'moment'
const AdminContact = () => {
  const { admin } = useContext(AuthContext)
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null)
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
      }
      //   dispatch({ type: 'ALLORDERS', payload: orderjson.orders1 })
      setContacts(contactjson.contacts);
      console.log(contactjson.contacts)
    }
    if (admin) {
      func()
    }

  }, [admin])
  return (
    <>
      <h2 className='admin-h1' >contact</h2>
      <AdminHed />
      {console.log(contacts)}
      {
        error === null ? (
          <div className="admin-container" style={{ margin: "0 auto", width: "80%", paddingBottom: "50px" }}>
            <div className="adminorder-table">

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => {
                    const formattedDate = moment(contact.createdAt).format('D-M-YYYY');
                    const createdAt = moment(contact.createdAt).fromNow();

                    return (
                      <tr key={contact.id}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.message}</td>
                        <td>{createdAt + ' ' + formattedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>

          </div>
        ) : (
          <>
            <div className="error">{error}</div>
          </>
        )
      }
    </>

  )
}

export default AdminContact