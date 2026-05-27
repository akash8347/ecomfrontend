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
import SingleProd from './SingleProd';
import './style.css';
import Header from "./Header";
import { ConfigProvider, Layout, Typography, Input, Row, Col, Spin, Empty, Pagination, Divider } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content, Sider } = Layout;

const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredProData, setFilteredProData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = process.env.REACT_APP_BACKENDURL;
        const response = await fetch(`${url}/productapi/fetchproducts?currentPage=${currentPage}&searchQuery=${searchQuery}`);
        if (!response.ok) {
          setFilteredProData([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        const data = await response.json();
        const { products, totalPages } = data;
        setFilteredProData(products || []);
        setTotalPages(totalPages || 1);
      } catch (error) {
        console.error(error);
        setFilteredProData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
      <Header />
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Sider width={280} theme="light" style={{ padding: '24px', borderRight: '1px solid #f0f0f0' }} breakpoint="lg" collapsedWidth="0">
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}><FilterOutlined /> Filters</Title>
            <Divider style={{ margin: '12px 0' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <Title level={5}>Search Products</Title>
            <Input.Search
              placeholder="Search by name..."
              size="large"
              allowClear
              onSearch={onSearch}
              enterButton={<SearchOutlined />}
            />
          </div>
          {/* Future categories can go here */}
        </Sider>
        
        <Content style={{ padding: '32px 40px', background: '#f5f5f5' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>Discover Products</Title>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Spin size="large" tip="Loading store catalog..." />
            </div>
          ) : filteredProData.length === 0 ? (
            <div style={{ padding: '50px 0', background: '#fff', borderRadius: '8px' }}>
              <Empty description={<span>No products matched your search.</span>} />
            </div>
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {filteredProData.map((item) => (
                  <Col xs={24} sm={12} md={12} lg={8} xl={6} key={item._id || item.id}>
                    <SingleProd item={item} />
                  </Col>
                ))}
              </Row>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  current={currentPage}
                  total={totalPages * 10}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  size="large"
                />
              </div>
            </>
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default AllProducts;



