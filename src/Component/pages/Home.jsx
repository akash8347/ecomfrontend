import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import Slider from './Slider'

import './style.css'


const Home = () => {

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      console.log(position)
      const section = document.getElementById('my-section');
      console.log(section)

      const sectionTop = section.offsetTop;
      console.log(sectionTop)
      const sectionHeight = section.offsetHeight;
      console.log(sectionHeight)
      if (position >= sectionTop - window.innerHeight + sectionHeight && counter === 0) {
        let i = 0;
        const interval = setInterval(() => {
          i++;
          setCounter(i);
          if (i === 2000) {
            clearInterval(interval);
          }
        }, 1);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [counter]);

  return (
    <>
   
     
      {/* <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>Your Own Shop </h3> */}
      <Header />
      <div className="home-container">
        <div id='home'>
          <div className='home-content'>
            <h1 className='home-heading'> GOHIL ONLINE SHOP</h1>
            <p>
              Here you will find all products at 50% Discount
            </p>
          </div>
        </div>

        <section id="my-section" >
          <div className='responsive' style={{ display: 'flex' }}>
            <div className='res-kid' style={{ flex: 1 }}>
              <h2>Current Customers</h2>
              <div style={{ fontSize: '3em' }}>{counter}</div>
            </div>
            <div className='res-kid' style={{ flex: 1 }}>
              <h2>Our Rating</h2>
              <div style={{ fontSize: '3em' }}>5 Stars</div>
            </div>
            <div className='res-kid' style={{ flex: 1 }}>
              <h2>Contry </h2>
              <div style={{ fontSize: '3em' }}>India,USA</div>
            </div>
          </div>
        </section>
        <div style={{width:"60%",margin:"0 auto 30px auto"}}>
    <Slider/>
      </div>
{/* <img src="images/b68996b0aeb13339740f961ada455a77.jpg" alt="" /> */}
        <Footer  />
        
      </div>
    </>
  )
}

export default Home;
