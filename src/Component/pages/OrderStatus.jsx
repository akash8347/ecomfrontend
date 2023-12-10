import { AuthContext } from '../../context/AuthProvider.js';
import { cartContext } from '../../context/ContextPro.js';
import { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import './style.css';

const OrderStatus = () => {
  const { user } = useContext(AuthContext);
  const { dispatch, state } = useContext(cartContext);
  let location = useLocation();

  const { useOrder } = state;

  useEffect(() => {
    async function fetchData() {
      try {
        if (user === null) {
          throw new Error('User not logged in');
        }

        const { token } = user;
        let url= process.env.REACT_APP_BACKENDURL
      // `${url}
        const userOrders = await fetch(`${url}/order/orderstatus`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const json = await userOrders.json();
        if (!userOrders.ok) {
          console.log(json);
        }

        dispatch({
          type: 'ADD_ORDER',
          payload: json
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [dispatch, user, location]);

  return (
    <>
      {/* Your existing JSX code here */}
      {user && useOrder && useOrder.length > 0 ? (
        <>
          {/* Updated JSX code to display order details */}
          <div className="orderStatus_container">
            <div className="orders-status-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Time</th>
                    <th>Order Status</th>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Order Quantity</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                {useOrder.map((order) => {
                  const formattedDate = moment(order.order_created_at).format('D-M-YYYY');
                  const createdAt = moment(order.order_created_at).fromNow();

                  return (
                    <tbody key={order.order_id}>
                      <tr>
                        <td>{order.order_id}</td>
                        <td>{createdAt + ' ' + formattedDate}</td>
                        <td>{order.order_status}</td>
                        <td>{order.product_name}</td>
                        <td>{order.product_price}</td>
                        <td>{order.order_quantity}</td>
                        <td>{order.totalCost}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: "80%", margin: "auto" }}>
            {user && <p>You need to order first <Link to='/store'>Order Item</Link></p>}
            {!user && <p>You need to login first <Link to='/login'>Login Here</Link></p>}
          </div>
        </>
      )}
    </>
  );
};

export default OrderStatus;