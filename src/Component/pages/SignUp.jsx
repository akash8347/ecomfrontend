import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
const SignUp = () => {
    const navigate = useNavigate()
    // const [name,setName]=useState('')
    // const [email,setEmail]=useState('')
    // const [password,setPass]=useState('')
    const [form, setForm] = useState({})
    const [error, setError] = useState('')

    const submitHandler = async (e) => {
        console.log(error)

        try {

            e.preventDefault();
            document.getElementById('form').reset()
            const responce = await fetch('http://localhost:8000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)

            })

            const json = await responce.json()
            if (!responce.ok) {

                setError(json.error)
            }
            console.log(json)

            // res.ok && 
            responce.ok && navigate("/login")

        } catch (error) {
            console.log(error)
        }


    }



    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }


    return (

        <>
           <h3 style={{textAlign:"center",fontSize:"30px",margin:"15px 0"}}>Sign Up</h3>
      <Header/>
            <form id="form" onSubmit={submitHandler}>
                <input type="text" style={{ textAlign: "center", margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }}
                    // onChange={(e)=>setName(e.target.value)} value={name} name="name"
                    onChange={handleChange} name="name"
                    id="name" placeholder="Enter name" required autoComplete="name" />
                <br />
                <input type="email" onChange={handleChange}
                    style={{ textAlign: "center", margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }}
                    // value={email}
                    name="email" id="email" placeholder="Enter email" required autoComplete="email" />
                <br />
                <input type="password" onChange={handleChange}
                    style={{ textAlign: "center", margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }}
                    // value={password}
                    name="password" id="password"
                    placeholder="Enter password" required autoComplete="current-password" />
                <br />
                <button style={{ margin: "10px 0px", padding: "10px 10px", fontSize: "20px" }}>submit</button>
                <div> Already registered? <Link to="/login">Login Here</Link></div>
                <span>{error}</span>
            </form>
        </>
    )
}
export default SignUp;