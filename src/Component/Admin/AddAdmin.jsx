import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider';
import AdminHed from './AdminHed'

const AddUser = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const {admin} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple input validation
    if (!email || !password) {
   alert('Please enter an email and password');
      return;
    }
    if(password.length<6){
      alert('password must be minimum 6 characters');
      return;
    }
    

    const data = {
      email,
      password
    }
    const { token } = admin;
   let url= process.env.REACT_APP_BACKENDURL
    const resjson = await fetch({url}+'/admin/adadmin',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const responce = await resjson.json();

    if (!resjson.ok) {
      console.log(responce.error);
     alert(responce.error)
    }else{
      alert('admin created successfully')

    }

    console.log(responce);
  };

  return (
    <>
      <h2 className='admin-h1' >Add Admin</h2>
      <AdminHed/>
      <div className="addadmin-container">
        <form onSubmit={handleSubmit} className="addadmin-form">
          <label className='labelad' htmlFor="email">Email:</label>
          <input
            className='adminipt'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className='labelad' htmlFor="password">Password:</label>
          <input
            className='adminipt'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className='myadmin-button' type="submit">Submit</button>
          
        </form>
      </div>
    </>
  );
};

export default AddUser;
