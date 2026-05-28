// import React, {  useContext, useState } from 'react';
// import axios from 'axios';
// import AdminHed from './AdminHed';
// import { useParams } from 'react-router-dom';
// import { adminContext } from './AdminProvider';
// import { AuthContext } from '../../context/AuthProvider';

// const UpdateProduct = () => {
//   const {admin}=useContext(AuthContext)
//     const {allProducts}=useContext(adminContext)
//    const{productId} =useParams()
   
//   const jotutue= allProducts.find(product => product._id === productId)
//    console.log(jotutue)
//    const [formData, setFormData] = useState(() => {
//     const storedData = localStorage.getItem("updateprod");
//     return storedData ? JSON.parse(storedData) : {
//       category: "",
//       name: "",
//       company: "",
//       price: "",
//       description: "",
//       colors: "",
//       colorImages: []
//     };
//   });
//     const handleInputChange = (event) => {
//         setFormData({
//           ...formData,
//           [event.target.name]: event.target.value,
//         });
//       };

//       const handleImageChange = (event) => {
//         const color = event.target.getAttribute('data-color');
//         const images = formData.colorImages.filter((obj) => obj.color !== color);
      
//         for (let i = 0; i < event.target.files.length; i++) {
//           const image = event.target.files[i];
//           const imageName = `${color}_${i + 1}`;
//           const reader = new FileReader();
//           reader.readAsDataURL(image);
//           reader.onload = () => {
//             const base64Image = reader.result;
//             images.push({ color, imageName, base64Image });
//             setFormData({
//               ...formData,
//               colorImages: images,
//             });
//           };
//         }
//       };
     
//       const handleSubmit = async (event) => {
//         event.preventDefault();
//         const colorImages = formData.colorImages.filter((image) => image.base64Image);
    
//         if (!formData.category) {
//           alert('Please select a category');
//           return;
//         }
//         if (!formData.name) {
//           alert('Please enter a product name');
//           return;
//         }
//         if (!formData.company) {
//           alert('Please enter a company name');
//           return;
//         }
//         if (!formData.price) {
//           alert('Please enter a price');
//           return;
//         }
//         if (isNaN(parseFloat(formData.price))) {
//           alert('Please enter a valid price');
//           return;
//         }
//         if (!formData.description) {
//           alert('Please enter a description');
//           return;
//         }
//         if (!formData.colors) {
//           alert('Please enter at least one color');
//           return;
//         }
      
//         const objToSend = {
//           name: formData.name,
//           colors: formData.colors,
//           company: formData.company,
//           description: formData.description,
//           category: formData.category,
//           price: formData.price,
    
//           colorImages: colorImages.map((image) => ({
//             color: image.color,
//             imageName: image.imageName,
//             imageUrl: `data:image/png;base64,${image.base64Image.split(',')[1]}`,
//           })),
//         };
//         localStorage.setItem("updateprod", JSON.stringify(objToSend))
//         console.log(objToSend);
//         const {token}=admin
//         try {
//           const response = await axios.put(
//             `http://localhost:8000/productapi/updateproduct/${productId}`,
//             JSON.stringify(objToSend),
//             {
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`  
//               },
//             }
//           );
//           console.log(response.data);
//         } catch (error) {
//           console.error(error);
//         }
//       };    


//       return (
//         <>
//           <h2 className="admin-h1">Update Product</h2>
//           <AdminHed />
//           <div className="update-product-container addnewproduct-container">
//             <form className="update-product-form  addProduct-form" onSubmit={handleSubmit}>
//               {/* same form fields as in AddNewProduct component */}

//               <label>
//             Category:
//           <select
//             className="input1"
//             name="category"
//             value={formData.category}
//             onChange={handleInputChange}
//             >
//               <option value="">Select a category</option>
//             <option value="mobiles">Mobiles</option>
//               <option value="fridges">Fridges</option>
//               <option value="ac">ACs</option>
//               <option value="tv">TVs</option>
//               <option value="laptops">Laptops</option>
//             </select>
//           </label>
//         <label>
//           Product Name:
//           <input
//             className="input1"
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//           />
//           </label>
//           <label>

//           company:
          
//             <input
//             className="input1"
//             type="text"
//             name="company"
//             value={formData.company}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Price:
//           <input
//             className="input1"
//             type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleInputChange}
//             />
//           </label>
//         <label className='txtlabel'>
//             Description:
//             <textarea
//             className="textarea1"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}  />
//           </label>
//         <label>
//           Colors:
//           <input
//             className="input1"
//             type="text"
//             name="colors"
//             value={formData.colors}
//             onChange={handleInputChange}
//           />
//         </label>
//         {formData.colors.split(',').map((color, index) => (
//           <div key={index}>
//             <label>
//               {color} Images:
//               <input
//                 type="file"
//                 accept="image/*"
//                 name='image'
//                 data-color={color}
//                 onChange={handleImageChange}
//                 multiple
//               />
//             </label>
//             {formData.colorImages
//               .filter((obj) => obj.color === color)
//               .map((obj, index) => (
//                 <div key={index}>
//                   <img src={obj.imageUrl} alt={obj.imageName} />
//                 </div>
//               ))}
//           </div>
//         ))}
//               <button className='btnupdate' type="submit">Update</button>
//             </form>
//           </div>
//         </>
//       );
//     };
    
//     export default UpdateProduct;

// import React, { useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import AdminHed from './AdminHed';
// import { useParams } from 'react-router-dom';
// import { adminContext } from './AdminProvider';
// import { AuthContext } from '../../context/AuthProvider';

// const UpdateProduct = () => {
//   const { admin } = useContext(AuthContext);
//   const { allProducts } = useContext(adminContext);
//   const { productId } = useParams();

//   const initialFormData = {
//     category: '',
//     name: '',
//     company: '',
//     price: '',
//     description: '',
//     colors: '',
//     colorImages: [],
//   };

//   const [formData, setFormData] = useState(initialFormData);

//   useEffect(() => {
//     const productToUpdate = allProducts.find((product) => product.id === parseInt(productId));
//     if (productToUpdate) {
//       setFormData({
//         category: productToUpdate.category,
//         name: productToUpdate.name,
//         company: productToUpdate.company,
//         price: productToUpdate.price,
//         description: productToUpdate.description,
//         colors: productToUpdate.colors,
//         colorImages: productToUpdate.image_urls.map((url, index) => ({
//           color: productToUpdate.colors.split(',')[index],
//           imageUrl: url,
//         })),
//       });
//     }
//   }, [allProducts, productId]);

//   const handleInputChange = (event) => {
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleImageChange = (event) => {
//     const color = event.target.getAttribute('data-color');
//     const images = formData.colorImages.filter((obj) => obj.color !== color);

//     for (let i = 0; i < event.target.files.length; i++) {
//       const image = event.target.files[i];
//       images.push({ color, imageUrl: URL.createObjectURL(image) });
//     }

//     setFormData({
//       ...formData,
//       colorImages: images,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     // Validation and submission logic remains the same as in AddNewProduct
//     // ...
//     if (formData.category === '') {
//       alert('Please select a category.');
//       return;
//     }
//     if (formData.name.trim() === '') {
//       alert('Please enter a product name.');
//       return;
//     }
//     if (formData.company.trim() === '') {
//       alert('Please enter a company name.');
//       return;
//     }
//     if (formData.price === '' || isNaN(formData.price)) {
//       alert('Please enter a valid price.');
//       return;
//     }
//     if (formData.colors.trim() === '') {
//       alert('Please enter at least one color.');
//       return;
//     }
  
//     // const colorImages = formData.colorImages.filter((image) => image.base64Image);
  
//     const formDataToSend = new FormData();

//     formDataToSend.append('name', formData.name);
//     formDataToSend.append('colors', formData.colors);
//     formDataToSend.append('company', formData.company);
//     formDataToSend.append('description', formData.description);
//     formDataToSend.append('category', formData.category);
//     formDataToSend.append('price', formData.price);

   
// formData.colorImages.forEach((image) => {
//   formDataToSend.append('colorImages', image.file);
  
// });
    
    

//     // const objToSend = {
//     //   // Same logic as in AddNewProduct to prepare the object for submission
//     //   // ...
//     // };

//     try {
//       console.log(formDataToSend);
//       const response = await axios.put(
//         `http://localhost:8000/productapi/updateproduct/${productId}`,
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${admin.token}`,
//           },
//         }
//       );
//       console.log(response.data);
//       // Reset the form data after successful submission
//       setFormData(initialFormData);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <h2 className="admin-h1">Update Product</h2>
//       <AdminHed />
//       <div className="update-product-container addnewproduct-container">
//         <form className="update-product-form addProduct-form" onSubmit={handleSubmit}>
//           {/* Same form fields as in AddNewProduct component */}
//           {/* ... */}
//           <label>
//             Category:
//           <select
//             className="input1"
//             name="category"
//             value={formData.category}
//             onChange={handleInputChange}
//             >
//               <option value="">Select a category</option>
//             <option value="mobiles">Kurta</option>
//               <option value="fridges">Lehnga choli</option>
//               <option value="ac">kids</option>
//               <option value="tv">shirt</option>
//               <option value="laptops">saree</option>
//             </select>
//           </label>
//         <label>
//           Product Name:
//           <input
//             className="input1"
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//           />
//           </label>
//           <label>

//           company:
          
//             <input
//             className="input1"
//             type="text"
//             name="company"
//             value={formData.company}
//             onChange={handleInputChange}
//           />
//         </label>
//         <label>
//           Price:
//           <input
//             className="input1"
//             type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleInputChange}
//             />
//           </label>
//         <label className='txtlabel'>
//             Description:
//             <textarea
//             className="textarea1"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}             />
//           </label>
//         <label>
//           Colors:
//           <input
//             className="input1"
//             type="text"
//             name="colors"
//             value={formData.colors}
//             onChange={handleInputChange}
//           />
//         </label>
//         {formData.colors.split(',').map((color, index) => (
//           <div key={index}>
//             <label>
//               {color} Images:
//               <input
//                 type="file"
//                 accept="image/*"
//                 name='image'
//                 data-color={color}
//                 onChange={handleImageChange}
//                 multiple
//               />
//             </label>
         
//           </div>
//         ))}
//           <button className="btnupdate" type="submit">
//             Update
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default UpdateProduct;
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AdminHed from './AdminHed';
import { useNavigate, useParams } from 'react-router-dom';
// import { adminContext } from './AdminProvider';
import { AuthContext } from '../../context/AuthProvider';
import { Button, Card, Image, Space, Typography } from 'antd';

const UpdateProduct = () => {
  const { admin } = useContext(AuthContext);
  // const { allProducts } = useContext(adminContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const initialFormData = {
    category: '',
    name: '',
    company: '',
    market_price: '',
    discounted_price: '',
    description: '',
    colors: '',
    colorImages: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [existingPreviewBase, setExistingPreviewBase] = useState('');

  const isAbsolutePreviewUrl = (value) => /^https?:|^data:|^blob:/i.test(String(value || ''));

  const buildPreviewSrc = (value) => {
    if (!value) return '';
    if (isAbsolutePreviewUrl(value)) {
      return value;
    }
    return `${existingPreviewBase}${value}`;
  };

  const normalizeColorList = (colorsText) =>
    String(colorsText || '')
      .split(',')
      .map((color) => color.trim())
      .filter(Boolean);

  useEffect(() => {
    const storedData = localStorage.getItem('updateprod');
    if (!storedData) {
      return;
    }

    try {
      const product = JSON.parse(storedData);
      const colors = product.colors || '';
      const colorsList = normalizeColorList(colors);
      const imageUrls = Array.isArray(product.image_urls) ? product.image_urls : [];
      const colorMapFromImages = {};

      imageUrls.forEach((imageUrl, index) => {
        if (colorsList.length === 0) return;
        const colorName = colorsList[index % colorsList.length];
        if (!colorMapFromImages[colorName]) {
          colorMapFromImages[colorName] = [];
        }
        colorMapFromImages[colorName].push({
          color: colorName,
          imageUrl,
        });
      });

      const mappedFromImageUrls = imageUrls.map((imageUrl, index) => ({
        color: colorsList[index] || colorsList[index % colorsList.length] || `Color ${index + 1}`,
        imageUrl,
      }));
      const mappedFromColorImages = Array.isArray(product.colorImages)
        ? product.colorImages
            .map((img, index) => {
              if (!img) return null;
              return {
                color: img.color || colorsList[index] || `Color ${index + 1}`,
                imageUrl: img.imageUrl || img.url || '',
              };
            })
            .filter(Boolean)
        : [];

      setFormData({
        category: product.category || '',
        name: product.name || '',
        company: product.company || '',
        market_price: product.market_price ?? product.price ?? '',
        discounted_price: product.discounted_price ?? '',
        description: product.description || '',
        colors,
        colorImages: mappedFromColorImages.length > 0
          ? mappedFromColorImages
          : (Object.keys(colorMapFromImages).length > 0 ? Object.values(colorMapFromImages).flat() : mappedFromImageUrls)
      });
      setExistingPreviewBase(process.env.REACT_APP_BACKENDURL || '');
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const color = (event.target.getAttribute('data-color') || '').trim();
    const images = formData.colorImages.filter((obj) => (obj.color || '').trim().toLowerCase() !== color.toLowerCase());
    console.log(event.target.files[0])
    for (let i = 0; i < event.target.files.length; i++) {
      const image = event.target.files[i];
      const imageName = `${color}_${i + 1}`;
      images.push({ color, imageName, file: image, imageUrl: URL.createObjectURL(image), isNew: true });
    }

    setFormData({
      ...formData,
      colorImages: images,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //Validation and submission logic remains the same as in AddNewProduct
    // ...
    if (formData.category === '') {
      alert('Please select a category.');
      return;
    }
    if (formData.name.trim() === '') {
      alert('Please enter a product name.');
      return;
    }
    if (formData.company.trim() === '') {
      alert('Please enter a company name.');
      return;
    }
    if (formData.market_price === '' || isNaN(formData.market_price)) {
      alert('Please enter a valid market price.');
      return;
    }
    if (formData.discounted_price === '' || isNaN(formData.discounted_price)) {
      alert('Please enter a valid discounted price.');
      return;
    }
    if (formData.colors.trim() === '') {
      alert('Please enter at least one color.');
      return;
    }

    // Validation logic here...

    const formDataToSend = new FormData();

    formDataToSend.append('name', formData.name);
    formDataToSend.append('colors', formData.colors);
    formDataToSend.append('company', formData.company);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('market_price', formData.market_price);
    formDataToSend.append('discounted_price', formData.discounted_price);

    formData.colorImages.filter((image) => image?.file).forEach((image) => {
      formDataToSend.append('colorImages', image.file);
    });
    let url= process.env.REACT_APP_BACKENDURL
        // `${url}

    try {
      const response = await axios.put(
        `${url}/productapi/updateproduct/${productId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      console.log(response.data);
      setFormData(initialFormData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AdminHed />
      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', padding: '28px 20px 56px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <Space direction="vertical" size={8} style={{ width: '100%', marginBottom: '18px' }}>
            <Typography.Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Catalog</Typography.Text>
            <Typography.Title level={3} style={{ margin: 0 }}>Update product</Typography.Title>
          </Space>

          <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
            <form className="update-product-form  addProduct-form" onSubmit={handleSubmit}>
              <label>Category</label>
              <select className="input1" name="category" value={formData.category} onChange={handleInputChange}>
                <option value="">Select a category</option>
                <option value="mobiles">Kurta</option>
                <option value="fridges">Lehnga choli</option>
                <option value="ac">kids</option>
                <option value="tv">shirt</option>
                <option value="laptops">saree</option>
              </select>

              <label>Product Name</label>
              <input className="input1" type="text" name="name" value={formData.name} onChange={handleInputChange} />

              <label>Company</label>
              <input className="input1" type="text" name="company" value={formData.company} onChange={handleInputChange} />

              <label>Market Price</label>
              <input className="input1" type="number" name="market_price" value={formData.market_price} onChange={handleInputChange} />

              <label>Discounted Price</label>
              <input className="input1" type="number" name="discounted_price" value={formData.discounted_price} onChange={handleInputChange} />

              <label className='txtlabel'>Description</label>
              <textarea className="textarea1" name="description" value={formData.description} onChange={handleInputChange} />

              <label>Colors</label>
              <input className="input1" type="text" name="colors" value={formData.colors} onChange={handleInputChange} />

              {normalizeColorList(formData.colors).map((color, index) => (
                <div key={index} style={{ marginTop: '10px' }}>
                  <label>
                    {color} Images:
                    <input type="file" accept="image/*" name='image' data-color={color} onChange={handleImageChange} multiple />
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {formData.colorImages
                      .filter((obj) => (obj.color || '').trim().toLowerCase() === color.toLowerCase())
                      .map((obj, previewIndex) => {
                        const previewSrc = buildPreviewSrc(obj?.imageUrl);

                        return (
                          <Image
                            key={`${color}-${previewIndex}`}
                            src={previewSrc}
                            alt={`${color}-${previewIndex}`}
                            preview={false}
                            style={{ width: '84px', height: '84px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #d9d9d9', background: '#fff', padding: '4px' }}
                          />
                        );
                      })}
                  </div>
                </div>
              ))}

              <Space style={{ marginTop: '12px' }}>
                <button className="btnupdate" type="submit">Update</button>
                <Button type="default" onClick={() => navigate('/adminproducts')}>Cancel</Button>
              </Space>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
