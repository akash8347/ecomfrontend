import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider';
// import { dispatch} from '../../context/AuthProvider';
import '../pages/style.css'
import AdminHed from './AdminHed';
import { adminContext } from './AdminProvider';

const AdminDash = () => {
  // const { dispatch } = useContext(AuthContext)

  const { admin } = useContext(AuthContext)
  const { dispatch, allusers, totalUsers, totalIncome } = useContext(adminContext)
const [error,setError]=useState()
const deletehandle = async (id) => {
  const {token}=admin;
  let url= process.env.REACT_APP_BACKENDURL
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
      if (admin === null) {
        throw new Error('admin not logged in')
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
          setError(json.errormsg)
          console.log(json.errormsg)
        }
        console.log(json.users)
        console.log(json.usersCount)
        
        console.log(json.totalIncome)

        dispatch({ type: 'ALLUSERS', payload: json.users })
        dispatch({ type: 'TOTAL_USER', payload: json.usersCount })
        dispatch({ type: 'TOTAL_INCOME', payload: json.totalIncome })


      } catch (error) {
        console.log(error)
      }

    }
    fetch1()
  }, [dispatch,admin])



  return (
    <>

      <h2 className='admin-h1' >admin dashboard</h2>
      <AdminHed />
      <div className="admindash-container">

        {<table className='earning-table'>
          <thead><th>total users</th><th>Earnings</th></thead>
          <tbody>

            <tr>
              {admin ? (<><td>{totalUsers}</td><td>{totalIncome}</td></>) : (<></>)}
            </tr>
          </tbody>
        </table>}
        {

       !error&& admin && allusers.length > 0 ? (
            <div className="admindash-containertable">
              <table>
                <thead>
                  <tr><th>Email</th><th>name</th><th>id</th> <th>delete</th></tr>
                </thead>
                {allusers.map((i) => {
                  return (<tbody key={i.id}>
                    <tr><td>{i.email}</td><td>{i.name}</td><td>{i.id}</td>
                    <td><button onClick={ () => deletehandle(i.id)}> Delete1</button></td>
                    </tr>
                  </tbody>)
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

export default AdminDash