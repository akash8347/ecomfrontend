// import React, { useState } from 'react'
// import axios from 'axios';
// import AdminHed from './AdminHed'
// import '../style.css'

// const AddNewProduct = () => {

//   const [formData, setFormData] = useState({
//     productName: '',
//     companyName: '',
//     price: '',
//     description: '',
//     image: null
//   });

//   const handleInputChange = (event) => {
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value
//     });
//   };

//   const handleImageChange = (event) => {
//     setFormData({
//       ...formData,
//       image: event.target.files[0]
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('company', formData.company);
//     data.append('price', formData.price);
//     data.append('description', formData.description);
//     data.append('image', formData.image);

//     try {
//       const response = await axios.post('http://localhost:8000/productapi/createproduct', data);
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//     <h2 className="admin-h1">Add New Product</h2>
//     <AdminHed/>
//     {/* -----------------------form----------------- */}
// <div className="addnewproduct-container">
//     <form className='addProduct-form' onSubmit={handleSubmit}>
//       <label>
//         Product Name:
//         <input className='input1' type="text" name="name" value={formData.name} onChange={handleInputChange} />
//       </label>
//       <label>
//         Company Name:
//         <input className='input1' type="text" name="company" value={formData.company} onChange={handleInputChange} />
//       </label>
//       <label>
//         Price:
//         <input className='input1' type="number" name="price" value={formData.price} onChange={handleInputChange} />
//       </label>
//       <label>
//         Description:
//         <textarea className='textarea1' name="description" value={formData.description} onChange={handleInputChange} />
//       </label>
//       <label>
//         Image:
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//       </label>
//       <button type="submit">Submit</button>
//     </form>
//   </div>{/* -------------------------------form---------------------- */}
//     </>
//   )
// }
// export default AddNewProduct
// ---------------------------------------------------------------ORIGINALLLLLLL
// import React, { useState } from 'react';
// import axios from 'axios';
// import AdminHed from './AdminHed';
// import '../style.css';

// const AddNewProduct = () => {
//   const [formData, setFormData] = useState({
//     category: '',
//     name: '',
//     company: '',
//     price: '',
//     description: '',
//     image: null,
//   });

//   const handleInputChange = (event) => {
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleImageChange = (event) => {
//     setFormData({
//       ...formData,
//       image: event.target.files[0],
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const data = new FormData();
//     data.append('category', formData.category);
//     data.append('name', formData.name);
//     data.append('company', formData.company);
//     data.append('price', formData.price);
//     data.append('description', formData.description);
//     data.append('image', formData.image);

//     try {
//       const response = await axios.post(
//         'http://localhost:8000/productapi/createproduct',
//         data
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <h2 className="admin-h1">Add New Product</h2>
//       <AdminHed />
//       <div className="addnewproduct-container">
//         <form className="addProduct-form" onSubmit={handleSubmit}>
//         <label>
//             Category:
//             <select
//               className="input1"
//               name="category"
//               value={formData.category}
//               onChange={handleInputChange}
//             >
//               <option value="">Select a category</option>
//               <option value="mobiles">Mobiles</option>
//               <option value="fridges">Fridges</option>
//               <option value="ac">ACs</option>
//               <option value="tv">TVs</option>
//               <option value="laptops">Laptops</option>
//             </select>
//           </label>
//           <label>
//             Product Name:
//             <input
//               className="input1"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//             />
//           </label>
//           <label>
//             Company Name:
//             <input
//               className="input1"
//               type="text"
//               name="company"
//               value={formData.company}
//               onChange={handleInputChange}
//             />
//           </label>
//           <label>
//             Price:
//             <input
//               className="input1"
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleInputChange}
//             />
//           </label>
//           <label className='txtlabel'>
//             Description:
//             <textarea
//               className="textarea1"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//             />
//           </label>
//           <label>
//             Image:
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//           </label>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddNewProduct;
// ----------------------------less input-----------------------
// import React, { useState } from 'react';
// import axios from 'axios';
// import AdminHed from './AdminHed';
// import '../style.css';

// const AddNewProduct = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     image: null,
//   });

//   const handleInputChange = (event) => {
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleImageChange = (event) => {
//     setFormData({
//       ...formData,
//       image: event.target.files[0],
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('image', formData.image);
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/productapi/createproduct',
//         data
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <h2 className="admin-h1">Add New Product</h2>
//       <AdminHed />
//       <div className="addnewproduct-container">
//         <form className="addProduct-form" onSubmit={handleSubmit}>
       
//           <label>
//             Product Name:
//             <input  className="input1" type="text"  name="name"  value={formData.name} onChange={handleInputChange}/>
//           </label>
       
//           <label>
//             Image:
//             <input type="file" accept="image/*"   onChange={handleImageChange}/>
//           </label>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddNewProduct;
    
// THIK THAK CODE FOR FORMMM--------------------------------------------------------
// ------------------------------
// import React, { useState } from 'react';
// import axios from 'axios';
// import AdminHed from './AdminHed';
// import '../style.css';

// const AddNewProduct = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     images: [],
//   });

//   const handleInputChange = (event) => {
//     setFormData({
//       ...formData,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleImageChange = (event, color) => {
//     const images = [...formData.images];
//     const colorIndex = images.findIndex((image) => image.color === color);

//     if (colorIndex !== -1) {
//       images[colorIndex].files = Array.from(event.target.files);
//     } else {
//       images.push({
//         color,
//         files: Array.from(event.target.files),
//       });
//     }

//     setFormData({
//       ...formData,
//       images,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const data = new FormData();
//     data.append('name', formData.name);

//     formData.images.forEach((image) => {
//       image.files.forEach((file) => {
//         data.append(`${image.color}[]`, file);
//       });
//     });

//     try {
//       const response = await axios.post(
//         'http://localhost:8000/productapi/createproduct',
//         data
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <h2 className="admin-h1">Add New Product</h2>
//       <AdminHed />
//       <div className="addnewproduct-container">
//         <form className="addProduct-form" onSubmit={handleSubmit}>
       
//           <label>
//             Product Name:
//             <input
//               className="input1"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//             />
//           </label>
       
//           <div>
//             <label>Red:</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageChange(e, 'red')}
//               multiple
//             />
//           </div>
//           <div>
//             <label>Green:</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageChange(e, 'green')}
//               multiple
//             />
//           </div>
//           <div>
//             <label>Blue:</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleImageChange(e, 'blue')}
//               multiple
//             />
//           </div>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddNewProduct;
// ------------------------------------------------------------
// import React, { useState } from 'react';
// import axios from 'axios';
// import AdminHed from './AdminHed';
// import '../style.css';

// const AddNewProduct = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     colors: '',
//     colorImages: [],
//   });
//   console.log(formData)

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
//       const imageName = `${color}_${i + 1}`;
//       const imageUrl = URL.createObjectURL(image);
//       images.push({ color, imageName, imageUrl, image });
//     }

//     setFormData({
//       ...formData,
//       colorImages: images,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('colors', formData.colors);


//     for (let i = 0; i < formData.colorImages.length; i++) {
//       const { color, imageName, image } = formData.colorImages[i];
//       data.append(`${color}_${imageName}`, image);
//     }
//     console.log(data)
//     try {
//       console.log(data)
//       const response = await axios.post(
//         'http://localhost:8000/productapi/createproduct',
//         data
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <h2 className="admin-h1">Add New Product</h2>
//       <AdminHed />
//       <div className="addnewproduct-container">
//         <form className="addProduct-form" onSubmit={handleSubmit}>
//           <label>
//             Product Name:
//             <input
//               className="input1"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//             />
//           </label>
//           <label>
//             Colors:
//             <input
//               className="input1"
//               type="text"
//               name="colors"
//               value={formData.colors}
//               onChange={handleInputChange}
//             />
//           </label>
//           {formData.colors.split(',').map((color, index) => (
//             <div key={index}>
//               <label>
//                 {color} Images:
//                 <input
//                   type="file"
//                   accept="image/*"
//                   name='image'
//                   data-color={color}
//                   onChange={handleImageChange}
//                   multiple
//                 />
//               </label>
//               {formData.colorImages
//                 .filter((obj) => obj.color === color)
//                 .map((obj, index) => (
//                   <div key={index}>
//                     <img src={obj.imageUrl} alt={obj.imageName} />
//                   </div>
//                 ))}
//             </div>
//           ))}
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </>
//   );
// };
 // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const data = {
  //     name: formData.name,
  //     colors: formData.colors,
  //     images: formData.colors
  //       .split(',')
  //       .reduce((acc, color) => {
  //         acc[color] = {};
  //         return acc;
  //       }, {}),
  //   };
  //   console.log(data)
  //   for (let i = 0; i < formData.colorImages.length; i++) {
  //     const { color, imageName, image } = formData.colorImages[i];
  //     data.images[color][`${color}_${imageName}`] = image;
  //   }
    

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:8000/productapi/createproduct',
  //       data
  //     );
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

// export default AddNewProduct;

// import React, { useState } from 'react';
// import axios from 'axios';
// import AdminHed from './AdminHed';
// import '../style.css';

// const AddNewProduct = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     colors: '',
//     colorImages: [],
//   });

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
//       const imageName = `${color}_${i + 1}`;
//       const imageUrl = URL.createObjectURL(image);
//       images.push({ color, imageName, imageUrl, image });
//     }

//     setFormData({
//       ...formData,
//       colorImages: images,
//     });
//   };

 
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const colorImages = formData.colorImages.filter((image) => image.imageName);
    
//     const objToSend = {
//       name: formData.name,
//       colors: formData.colors,
//       colorImages: colorImages.map((image) => ({
//         color: image.color,
//         imageName: image.imageName,
//         imageUrl: image.imageUrl,
//       })),
//     };
//     console.log(objToSend)
    
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/productapi/createproduct',
//         JSON.stringify(objToSend),
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
  
  
//   return (
//     <>
//     <h2 className="admin-h1">Add New Product</h2>
//        <AdminHed />
//       <div className="addnewproduct-container">
//         <form className="addProduct-form" onSubmit={handleSubmit}>
//           <label>
//             Product Name:
//             <input
//               className="input1"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//             />
//           </label>
//           <label>
//             Colors:
//             <input
//               className="input1"
//               type="text"
//               name="colors"
//               value={formData.colors}
//               onChange={handleInputChange}
//             />
//           </label>
//           {formData.colors.split(',').map((color, index) => (
//             <div key={index}>
//               <label>
//                 {color} Images:
//                 <input
//                   type="file"
//                   accept="image/*"
//                   name='image'
//                   data-color={color}
//                   onChange={handleImageChange}
//                   multiple
//                 />
//               </label>
//               {formData.colorImages
//                 .filter((obj) => obj.color === color)
//                 .map((obj, index) => (
//                   <div key={index}>
//                     <img src={obj.imageUrl} alt={obj.imageName} />
//                   </div>
//                 ))}
//             </div>
//           ))}
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddNewProduct;
// --------------------------------------------------CODE BELOVE IS CHAT GPT TEXT ABOVE IS DEFAULT NEW-------
import React, { useContext, useState } from 'react';
import axios from 'axios';
import AdminHed from './AdminHed';
import '../pages/style.css'
import { AuthContext } from '../../context/AuthProvider';

const AddNewProduct = () => {
  const {admin}=useContext(AuthContext)
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    company: '',
    price: '',
    description: '',
    colors: '',
    colorImages: [],
  });

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
  
    // Validate form fields
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
  
    // const colorImages = formData.colorImages.filter((image) => image.base64Image);
  
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

    
    console.log(formDataToSend);
    const { token } = admin;
    try {
      let url= process.env.REACT_APP_BACKENDURL
      
      const response = await axios.post(
        `${url}productapi/createproduct`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
  
  
  return (
    <>
    <h2 className="admin-h1">Add New Product</h2>
       <AdminHed />
     { admin?(<>
      <div className="addnewproduct-container">
      <form className="addProduct-form" onSubmit={handleSubmit}>
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
        <button type="submit" className='btnupdate'>Submit</button>
      </form>
    </div>
      </>):(
      <>
      {!admin&&<h2>admin not logged in 123</h2>}
      </> )} 
    </>
  );
};
export default AddNewProduct;
///////////////////////////test new code------------------------------------
// import React, { useState } from 'react';
// import axios from 'axios';
// import AdminHed from './AdminHed';
// import '../style.css';

// const AddNewProduct = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     colors: '',
//     colorImages: [],
//   });

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
//       const imageName = `${color}_${i + 1}`;
//       images.push({ color, imageName, image });
//     }

//     setFormData({
//       ...formData,
//       colorImages: images,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('colors', formData.colors);

//     for (let i = 0; i < formData.colorImages.length; i++) {
//       const { color, imageName, image } = formData.colorImages[i];
//       data.append(`colorImages[${i}][color]`, color);
//       data.append(`colorImages[${i}][imageName]`, imageName);
//       data.append(`colorImages[${i}][image]`, image);
//     }
   
// console.log(data)
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/productapi/createproduct',
//         data,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <h2 className="admin-h1">Add New Product</h2>
//       <AdminHed />
//       <div className="addnewproduct-container">
//         <form className="addProduct-form" onSubmit={handleSubmit}>
//           <label>
//             Product Name:
//             <input
//               className="input1"
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//             />
//           </label>
//           <label>
//             Colors:
//             <input
//               className="input1"
//               type="text"
//               name="colors"
//               value={formData.colors}
//               onChange={handleInputChange}
//             />
//           </label>
//           {formData.colors.split(',').map((color, index) => (
//             <div key={index}>
//               <label>
//                 {color} Images:
//                 <input
//                   type="file"
//                   accept="image/*"
//                   name={`image[]`}
//                   data-color={color}
//                   onChange={handleImageChange}
//                   multiple
//                 />
//               </label>
//               {formData.colorImages
//                 .filter((obj) => obj.color === color)
//                 .map((obj, index) => (
//                   <div key={index}>
//                     <img src={URL.createObjectURL(obj.image)} alt={obj.imageName} />
//                   </div>
//                 ))}
//             </div>
//           ))}
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddNewProduct;


