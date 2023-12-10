import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.css';


function Slider() {
  return (
    <Carousel  >
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="images/Source-03-1024x415.webp"

          alt="First slide" 
         
        />
        <Carousel.Caption>
         
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="images/test.png"

          alt="Second slide"
         
        />

        <Carousel.Caption>
      
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="images/freed.jpg"

          alt="Third slide"
          
        />

        <Carousel.Caption>
         
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Slider;