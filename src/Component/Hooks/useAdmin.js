
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export const useAdmin=()=>{

const{dispatch,admin} =useContext(AuthContext)
    const logout = async () => {
      const {token}=admin
        try {
          const response = await fetch('http://localhost:8000/admin/logout', { 
            method: 'POST',
            'Authorization': `Bearer ${token}`
          
          });
          if (response.ok) {
            localStorage.removeItem('adminJWT'); // remove session ID from local storage
            dispatch({ type: 'ADMIN_LOGOUT', payload: null })
          } else {
            const data = await response.json();
            console.error(data.error);
          }
        } catch (error) {
          console.error(error);
        }
    
    
      }


   return {logout}
}