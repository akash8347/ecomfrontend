import { useContext, useEffect, useState } from "react"
import {useNavigate } from "react-router-dom"
// import { AuthContext } from "../context/AuthProvider"
import { AuthContext } from "../../context/AuthProvider"
import AdminHed from "./AdminHed"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

const Adminlog = () => {
    // const location=useLocation()
    const location = useLocation()
    const navigate=useNavigate()
    const [form, setForm] = useState({})
    const [error, setError] = useState('')
    const { dispatch,admin } = useContext(AuthContext)
    // const [loading, setLoading] = useState(false)
    // useEffect(()=>{
    // !admin&&navigate('.././admindash')

    // },[location,admin])

    const submitHandler = async (e) => {

        e.preventDefault();
        if (!form.email.trim() || !form.password.trim()) {
            setError('Please enter email and password.')
            alert('Please enter email and password.')
            return
          }
          
        else{
            setError(null)
            let url= process.env.REACT_APP_BACKENDURL
            // `${url}
            const responce = await fetch(`${url}admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
    
            const json = await responce.json();
            if (!responce.ok) {
                console.log(json.error)
                setError(json.error)
            }
            if (responce.ok) {
                //     // save the user to local storage
                setError('')
                console.log(json)
    
                localStorage.setItem('adminJWT', JSON.stringify(json))
    
                //     // update the auth context
                dispatch({ type: 'ADMIN_LOGIN', payload: json })
    navigate('.././admindash')
                //     // update loading state
                //     // setLoading(false)
    
            }
    
        }
        // setLoading(true)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    useEffect(()=>{
        admin&&navigate('/admindash')
    },[navigate,location,admin])


    return (
        <>
{!admin?(
    <>
    
     <h2 className="admin-h1"> Admin Login</h2>
     <AdminHed/>
    <form onSubmit={submitHandler} id="adminform">
        <input required onChange={handleChange} type="email" name="email" placeholder="enter email" style={{ textAlign: "center", margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }} />
        <input required onChange={handleChange} type="password" name="password" placeholder="enter password" style={{ textAlign: "center", margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }} />
        <button style={{ margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }}>submit</button>

        {/* <div> not registered? <Link to="/SignUp">Register Here</Link></div> */}
        <span>{error}</span>
        <Link style={{textAlign:"center"}} to='/home'>Home</Link>
    </form>
    </>
   
):(<><h1>you are already logged in <Link to='/admindash'>dashbord</Link> </h1>
  {/* {admin&&navigate('.././admindash')} */}
  {admin&&navigate('/admindash')}

</>)}


        </>
    )
}
export default Adminlog;