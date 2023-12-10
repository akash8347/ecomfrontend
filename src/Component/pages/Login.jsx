import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthProvider"
import Header from "./Header"

const Login = () => {
    const [form, setForm] = useState({})
    const [error, setError] = useState('')
    const { dispatch } = useContext(AuthContext)
    // const [loading, setLoading] = useState(false)


    const submitHandler = async (e) => {

        e.preventDefault();
        // setLoading(true)
        setError(null)
        console.log(form)
        let url= process.env.REACT_APP_BACKENDURL
      // `${url}
        const responce = await fetch(`${url}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })

        const json = await responce.json();
        if (!responce.ok) {
            // setLoading(false)
            setError(json.error)
        }
        if (responce.ok) {
            // save the user to local storage
            console.log(json)

            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json })

            // update loading state
            // setLoading(false)

        }





    }



    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }




    return (
        <>


<h3 style={{textAlign:"center",fontSize:"30px",margin:"15px 0"}}>Login</h3>
      <Header/>
            <form onSubmit={submitHandler} id="loginform">
                <input onChange={handleChange} type="email" name="email" placeholder="enter email" style={{ textAlign: "center", margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }} />
                <input onChange={handleChange} type="password" name="password" placeholder="enter password" style={{ textAlign: "center", margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }} />
                <button style={{ margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }}>submit</button>

                <div> not registered? <Link to="/SignUp">Register Here</Link></div>
                <span>{error}</span>
            </form>
            
        </>
    )
}
export default Login