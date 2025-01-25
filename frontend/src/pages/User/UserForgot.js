import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserForgot = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const navigate = useNavigate();

    const handleVerifyEmail = async () => {
        try {
            const response = await axios.post('http://localhost:8000/userverifyforgotemail/', { email });
            if (response.data.message === 'OTP Sent') {
                setEmailVerified(true);
                alert('OTP sent to your email');
            }
        } catch (error) {
            alert(error.response?.data?.alert || 'Email verification failed');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:8000/userverifyotp/', { 
                email, 
                otp 
            });
            
            if (response.data.message === 'OTP Verified') {
                navigate('/userreset', { state: { email } });
            }
        } catch (error) {
            alert(error.response?.data?.alert || 'OTP verification failed');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleVerifyEmail}>Verify Email</button>

            {emailVerified && (
                <>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={handleVerifyOtp}>Verify OTP</button>
                </>
            )}
        </div>
    );
};

export default UserForgot;