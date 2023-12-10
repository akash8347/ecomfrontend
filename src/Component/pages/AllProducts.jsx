// import { useContext, useEffect } from "react";
// import { cartContext } from "../context/ContextPro";
// import SingleProd from './SingleProd';
// import './style.css'
// import Header from "./Header";

// const AllProducts = () => {



//   const { state,dispatch } = useContext(cartContext);
//   const { proData } = state;

//   useEffect(() => {
//     fetch('http://localhost:8000/productapi/fetchproducts')
//       .then(response => response.json())
//       .then((data )=> {

//         dispatch({type:'SET_PRODUCTS',payload:data})
//       }

//         ).catch(error => console.error(error));
//   }, [dispatch]);

//   return (
//     <>
//     <h3 style={{textAlign:"center",fontSize:"30px",margin:"15px 0"}}>Your Own Shop</h3>

//       <Header />
//       <div className="product-container">

//         {proData.map((item) => {
//           return (
//             <SingleProd key={item._id} item={item} />
//           )

//         })}
//         {/* {console.log(proData)} */}
//       </div>
//     </>
//   )
// }
// export default AllProducts;

// import { useContext, useEffect, useState } from "react";
// import { cartContext } from "../context/ContextPro";
// import SingleProd from './SingleProd';
// import './style.css'
// import Header from "./Header";

// const AllProducts = () => {
//   const { state,dispatch } = useContext(cartContext);
//   const { proData } = state;

//   const [filteredProData, setFilteredProData] = useState(proData);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetch('http://localhost:8000/productapi/fetchproducts')
//       .then(response => response.json())
//       .then((data) => {
//         dispatch({ type:'SET_PRODUCTS', payload: data })
//       })
//       .catch(error => console.error(error));
//   }, [dispatch]);

//   const handleSearchInputChange = (event) => {
//     const input = event.target.value;
//     setSearchTerm(input);
//     if (input !== "") {
//       const filteredData = proData.filter((product) =>
//         product.name.toLowerCase().includes(input.toLowerCase())
//       );
//       setFilteredProData(filteredData);
//     } else {
//       setFilteredProData(proData);
//     }
//   };

//   return (
//     <>
//       <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>
//         Your Own Shop
//       </h3>

//       <Header />

//       <div className="product-container">
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search Products"
//             value={searchTerm}
//             onChange={handleSearchInputChange}
//           />
//         </div>
//         {filteredProData.map((item) => {
//           return <SingleProd key={item._id} item={item} />;
//         })}
//       </div>
//     </>
//   );
// };
// export default AllProducts;
// ----------------------------above is default code-------------------------------------
// import { useContext, useEffect, useState } from "react";
// import { cartContext } from "../context/ContextPro";
// import SingleProd from './SingleProd';
// import './style.css'
// import Header from "./Header";

// const AllProducts = () => {
//   const { state,dispatch } = useContext(cartContext);
//   const { proData } = state;

//   const [filteredProData, setFilteredProData] = useState(proData);
//   const [searchTerm, setSearchTerm] = useState("");
//   console.log(proData)
//   console.log(filteredProData)

//   useEffect(() => {
//     fetch('http://localhost:8000/productapi/fetchproducts')
//       .then(response => response.json())
//       .then((data) => {
//         dispatch({ type:'SET_PRODUCTS', payload: data })
//       })
//       .catch(error => console.error(error));
//   }, [dispatch]);

//   const handleSearchInputChange = (event) => {
//     const input = event.target.value;
//     setSearchTerm(input);
//     if (input !== "") {
//       const filteredData = proData.filter((product) =>
//         product.name.toLowerCase().includes(input.toLowerCase())
//       );
//       setFilteredProData(filteredData);
//     } else {
//       setFilteredProData(proData);
//     }
//   };

//   return (
//     <>
//       <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>
//         Your Own Shop
//       </h3>

//       <Header />

//       <div className="product-container">
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search Products"
//             value={searchTerm}
//             onChange={handleSearchInputChange}
//           />
//         </div>
//         {filteredProData.map((item) => {
//           return <SingleProd key={item._id} item={item} />;
//         })}
//       </div>
//     </>
//   );
// };
// export default AllProducts;
// --------------------------------------testing third code---------------------
import { useEffect, useState } from "react";
// import { cartContext } from "../../context/ContextPro";
import SingleProd from './SingleProd';
import './style.css'
import Header from "./Header";
import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const AllProducts = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredProData, setFilteredProData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/productapi/fetchproducts?currentPage=${currentPage}&searchQuery=${searchQuery}`);
        const data = await response.json();
        const { products, totalPages } = data;
        setFilteredProData(products);
        setTotalPages(totalPages);
        console.log(data);
        console.log(products);
        console.log(totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page, query = '') => {
    setCurrentPage(page);
    setSearchQuery(query);
  };


  return (
    <>
      <h3 style={{ textAlign: "center", fontSize: "30px", margin: "15px 0" }}>
        Your Own Shop
      </h3>

      <Header />
      <div className="store-container">
        <div className="filters">
          <div className="title">
            <h3>Filters</h3>
          </div>
          <div className="search-bar">
  <input
    className="inputfilter"
    type="text"
    placeholder="Search Products"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <button onClick={() => handlePageChange(1, searchQuery)}>Search</button>
</div>
        </div>



        <div className="product-container">

          {filteredProData.map((item) => {
            return <SingleProd key={item.id} item={item} />;
          })}
        </div>
      </div>
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 5 }}>
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} />
            </Pagination>
          </Col>
        </Row>
      </Container>

    </>
  );
};

export default AllProducts;



