import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContextPro } from "./context/ContextPro";
import { AuthProvider } from "./context/AuthProvider"
import { AdminProvider } from './Component/Admin/AdminProvider';
import App from './App';
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <AdminProvider>
  <AuthProvider>
    <ContextPro>
    <App />
    </ContextPro>
    </AuthProvider>
    </AdminProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
