import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
const SignUp = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(true)


    return (

        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f7f8fa 0%, #eef2f6 100%)' }}>
            <AuthModal
                open={open}
                initialTab="signup"
                onClose={() => {
                    setOpen(false);
                    navigate('/');
                }}
                onAuthSuccess={() => navigate('/')}
            />
        </div>
    )
}
export default SignUp;