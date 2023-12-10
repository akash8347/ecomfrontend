import React, { useState } from 'react';
import Header from './Header';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (!message.trim()) {
      errors.message = 'Message is required';
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Send form data to backend
    const data = { name, email, message };
    let url= process.env.REACT_APP_BACKENDURL
        // `${url}
    const resjson = await fetch(`${url}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const responce = await resjson.json();
    console.log(responce);
  };


  return (
    <>
      <h2 style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>Contact Us</h2>
      <Header />
      <div className="form-contact">
        <form className='contact-form' onSubmit={handleSubmit}>
          <label className='label1' htmlFor="name">Name:</label>
          <input className='input01' type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p style={{color:"red"}} className="error-message">{errors.name}</p>}

          <label className='label1' htmlFor="email">Email:</label>
          <input className='input01' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p style={{color:"red"}} className="error-message">{errors.email}</p>}

          <label className='label1' htmlFor="message">Message:</label>
          <textarea className='textarea1' id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
          {errors.message && <p style={{color:"red"}} className="error-message">{errors.message}</p>}
        
          <button className='contact-button' type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Contact;
