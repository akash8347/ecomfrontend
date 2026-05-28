import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthModal from "./AuthModal"

const Login = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f7f8fa 0%, #eef2f6 100%)' }}>
            <AuthModal
                open={open}
                initialTab="login"
                onClose={() => {
                    setOpen(false);
                    navigate('/');
                }}
                onAuthSuccess={() => navigate('/')}
            />
        </div>
    );
}

export default Login;