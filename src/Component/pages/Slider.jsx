import React from 'react';
import { Carousel, Image } from 'antd';

const contentStyle = {
  height: '400px',
  color: '#fff',
  lineHeight: '400px',
  textAlign: 'center',
  background: '#364d79',
  overflow: 'hidden',
  borderRadius: '8px'
};

const Slider = () => {
  return (
    <Carousel autoplay effect="fade">
      <div>
        <div style={contentStyle}>
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src="images/Source-03-1024x415.webp"
            alt="First slide"
          />
        </div>
      </div>
      <div>
        <div style={contentStyle}>
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src="images/test.png"
            alt="Second slide"
          />
        </div>
      </div>
      <div>
        <div style={contentStyle}>
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src="images/freed.jpg"
            alt="Third slide"
          />
        </div>
      </div>
    </Carousel>
  );
}

export default Slider;