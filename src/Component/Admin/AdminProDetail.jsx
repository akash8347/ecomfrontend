import React,{useContext, useEffect,useState} from 'react'
import AdminHed from './AdminHed'
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const AdminProDetail = () => {
    
  const {admin}=useContext(AuthContext)
  const { id} = useParams();
  const [loading, setLoading] = useState(true);
  const [filteredProduct, setFilteredProduct] = useState([]);

  const [selectedColorImageIndex, setSelectedColorImageIndex] = useState(0);
  let url= process.env.REACT_APP_BACKENDURL
  useEffect(() => {
    if (!loading && filteredProduct.length > 0) {
      setSelectedColorImageIndex(0);
    }
  }, [loading, filteredProduct]);

  const handleColorClick = (index) => {
    setSelectedColorImageIndex(index);
  };

  const handleNextImageClick = () => {
    setSelectedColorImageIndex(prevIndex => (prevIndex + 1) % filteredProduct[0][0].image_urls.length);
  };

  const handlePrevImageClick = () => {
    setSelectedColorImageIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? filteredProduct[0][0].image_urls.length - 1 : newIndex;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const {token}=admin
      try {
        
        // `${url}
        const response = await fetch(`${url}/productapi/fetchproducts/${id}`,
        {
          method:'GET',
          headers:{
            'Authorization': `Bearer ${token}`
          }
        }
        );
        const data = await response.json();
        setFilteredProduct([data]);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id,admin]);

  return (
    <>
      <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>Product Detail</h3>
      <AdminHed/>
      {console.log(filteredProduct[0])}
      {loading ? (
        <p>Loading...</p>
      ) : filteredProduct.length === 0 ? (
        <p>No product found</p>
      ) : (
        
        filteredProduct[0].map((product) => (
          <div className='product-detail_container' key={product.id}>
            <div className="flex01">
              <div className="image-container">
              
                <img className="product-image" alt={product.name} src={`${url}${product.image_urls[selectedColorImageIndex]}`}/>          
                <button onClick={handlePrevImageClick}>{'<'}</button>
                <button onClick={handleNextImageClick}>{'>'}</button>
              </div>
              <div>
                {product.image_urls.map((imageUrl, index) => (
                  <button key={index}  onClick={() => handleColorClick(index)}>{`Color ${index + 1}`}</button>
                ))}
              </div>
            </div>
            <div className="flex02">
              <p><span>Name :</span>{product.name}</p>
              <p><span>Details :</span>{product.description}</p>
              <p><span>Company :</span>{product.company}</p>
              <p><span>Price :</span>{product.price}</p>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default AdminProDetail