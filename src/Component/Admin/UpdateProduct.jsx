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
import React, { useContext, useState } from 'react';
import axios from 'axios';
import AdminHed from './AdminHed';
import { useParams } from 'react-router-dom';
// import { adminContext } from './AdminProvider';
import { AuthContext } from '../../context/AuthProvider';

const UpdateProduct = () => {
  const { admin } = useContext(AuthContext);
  // const { allProducts } = useContext(adminContext);
  const { productId } = useParams();

  const initialFormData = {
    category: '',
    name: '',
    company: '',
    price: '',
    description: '',
    colors: '',
    colorImages: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const color = event.target.getAttribute('data-color');
    const images = formData.colorImages.filter((obj) => obj.color !== color);

    for (let i = 0; i < event.target.files.length; i++) {
      const image = event.target.files[i];
      const imageName = `${color}_${i + 1}`;
      images.push({ color, imageName, file: image });
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
    if (formData.price === '' || isNaN(formData.price)) {
      alert('Please enter a valid price.');
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
    formDataToSend.append('price', formData.price);

    formData.colorImages.forEach((image) => {
      formDataToSend.append('colorImages', image.file);
    });

    try {
      const response = await axios.put(
        `http://localhost:8000/productapi/updateproduct/${productId}`,
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
      <h2 className="admin-h1">Update Product</h2>
      <AdminHed />
      <div className="update-product-container addnewproduct-container">
        <form className="update-product-form  addProduct-form" onSubmit={handleSubmit}>
          {/* Form fields here... */}
          {/* Same form fields as in AddNewProduct component */}
          <label>
            Category:
          <select
            className="input1"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            >
              <option value="">Select a category</option>
            <option value="mobiles">Kurta</option>
              <option value="fridges">Lehnga choli</option>
              <option value="ac">kids</option>
              <option value="tv">shirt</option>
              <option value="laptops">saree</option>
            </select>
          </label>
        <label>
          Product Name:
          <input
            className="input1"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          </label>
          <label>

          company:
          
            <input
            className="input1"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Price:
          <input
            className="input1"
            type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </label>
        <label className='txtlabel'>
            Description:
            <textarea
            className="textarea1"
            name="description"
            value={formData.description}
            onChange={handleInputChange}             />
          </label>
        <label>
          Colors:
          <input
            className="input1"
            type="text"
            name="colors"
            value={formData.colors}
            onChange={handleInputChange}
          />
        </label>
        {formData.colors.split(',').map((color, index) => (
          <div key={index}>
            <label>
              {color} Images:
              <input
                type="file"
                accept="image/*"
                name='image'
                data-color={color}
                onChange={handleImageChange}
                multiple
              />
            </label>
         
          </div>
        ))}
          <button className="btnupdate" type="submit">
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;
