import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthProvider"
import AdminHed from "./AdminHed"
import { Link, useLocation } from "react-router-dom"
import { Button, Card, Input, Space, Typography, Alert } from "antd"

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
            const responce = await fetch(`${url}/admin/login`, {
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
     
     <AdminHed/>
        <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)', padding: '28px 20px 56px' }}>
            <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
                    <Space direction="vertical" size={10} style={{ width: '100%', marginBottom: '18px' }}>
                        <Typography.Text type="secondary" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px' }}>Admin access</Typography.Text>
                        <Typography.Title level={2} style={{ margin: 0 }}>Admin Login</Typography.Title>
                        <Typography.Text type="secondary">Use your admin credentials to continue.</Typography.Text>
                    </Space>
                    {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: '16px', borderRadius: '12px' }} /> : null}
                    <form onSubmit={submitHandler} id="adminform">
                        <Space direction="vertical" size={14} style={{ width: '100%' }}>
                            <Input size="large" required onChange={handleChange} type="email" name="email" placeholder="Email" />
                            <Input.Password size="large" required onChange={handleChange} name="password" placeholder="Password" />
                            <Button type="primary" htmlType="submit" size="large" block style={{ height: '46px', borderRadius: '12px', background: '#111827', borderColor: '#111827' }}>
                                Sign in
                            </Button>
                        </Space>
                    </form>
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <Link to='/home'>Home</Link>
                    </div>
                </Card>
            </div>
        </div>
    </>
   
):(<><h1>you are already logged in <Link to='/admindash'>dashbord</Link> </h1>
  {/* {admin&&navigate('.././admindash')} */}
  {admin&&navigate('/admindash')}

</>)}


        </>
    )
}
export default Adminlog;