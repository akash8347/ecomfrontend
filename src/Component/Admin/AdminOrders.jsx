import React, { useContext, useEffect } from 'react'
import AdminHed from './AdminHed'
import { adminContext } from './AdminProvider'
import '../pages/style.css'
import { AuthContext } from '../../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
const AdminOrders = () => {
  const { dispatch, allorders } = useContext(adminContext)
  const { admin } = useContext(AuthContext)
  const navigate = useNavigate()

  const detailOrder = (id) => {
    navigate(`/orderdetail/${id}`)
  }
  let url= process.env.REACT_APP_BACKENDURL
  useEffect(() => {

    const func = async () => {
      const { token } = admin
      // let url= process.env.REACT_APP_BACKENDURL
            // `${url}
      const res = await fetch(`${url}/admin/allorders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      let orderjson = await res.json()
      if (!res.ok) {
        console.log(orderjson.error)
      }
      console.log(orderjson.orders1)
      dispatch({ type: 'ALLORDERS', payload: orderjson })
      console.log(orderjson)
    }
    if (admin) {
      func()
    }

  }, [dispatch, admin])

  // -------------------------------PROCESS order----------------------
  const processOrder = async (orderId) => {
    const { token } = admin
    const res = await fetch(`${url}/admin/processorder/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      console.log(json.error)

    }
    console.log(json)
    //  i.orderStatus==='Delivered'&&setbutton(false)

    //  window.location.reload(); 
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: json.crtStatus } });
    console.log(json.success)
    console.log(json.crtStatus)
  }
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
      <h2 className='admin-h1' >AdminOrders</h2>
      <AdminHed />
      <div className="admin-container" style={{ margin: "0 auto", width: "80%", paddingBottom: "50px" }}>

        {
          admin && allorders.length > 0 ? (
            <div className="adminorder-table">
              <table >
                <thead>
                  <tr><th>User id</th><th>order Time</th><th>order status</th><th>total cost</th><th>orderedProducts</th>
                    <th>process order</th><th>Delete</th><th>Details</th>
                  </tr>
                </thead>
                {allorders.map((i) => {
                  const formattedDate = moment(i.order_created_at).format('D-M-YYYY');
                  const createdAt = moment(i.order_created_at).fromNow();
                  return (<tbody >
                    <tr>
                      <td>{i.user_id}</td>
                      <td>{createdAt + ' ' + formattedDate}</td>
                      <td >{i.order_status}</td>
                      <td>{i.totalCost}</td>
                      {/* <td>{i.orderedProducts.map((i1) => i1.name + ",")}</td> */}
                      <tf>{i.product_name}</tf>
                      { }
                      <td><button className='gglbutton' disabled={i.orderStatus === 'Delivered'} onClick={() => processOrder(i.order_id)} >
                        {i.orderStatus === 'Delivered' ? ("delivered") : ("proccess order")}
                      </button></td>
                      <td> <button className='gglbutton' onClick={() => deleteOrder(i.order_id)}>Delete</button></td>
                      <td> <button className='gglbutton' onClick={() => detailOrder(i.order_id)}>Details</button></td>
                    </tr>

                  </tbody>
                  )
                })}

              </table>
            </div>


          ) : (<>
            {!admin && <h2>admin not logged in</h2>}
            {admin && <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>no orders</h1>}
          </>)
        }
      </div>

    </>
  )
}

export default AdminOrders