import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerForgot = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const navigate = useNavigate();

    const handleVerifyEmail = async () => {
        try {
            const response = await axios.post('http://localhost:8000/ownerverifyforgotemail/', { email });
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
            const response = await axios.post('http://localhost:8000/ownerverifyotp/', { 
                email, 
                otp 
            });
            
            if (response.data.message === 'OTP Verified') {
                navigate('/ownerreset', { state: { email } });
            }
        } catch (error) {
            alert(error.response?.data?.alert || 'OTP verification failed');
        }
    };

    return (
        <div className='forgot-container'>
            <div className='forgot-card'>
                <h1>Forgot Password</h1>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button onClick={handleVerifyEmail}>Verify Email</button>

                {emailVerified && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <button onClick={handleVerifyOtp}>Verify OTP</button>
                    </>
                )}
            </div>

            <style>{`
                .forgot-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Arial', sans-serif;
                }

                .forgot-card {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    padding: 50px;
                    width: 450px;
                    text-align: center;
                }

                .forgot-card h1 {
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 28px;
                }

                .forgot-card input {
                    width: 100%;
                    padding: 14px;
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .forgot-card input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
                }

                .forgot-card button {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(to right, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s;
                    margin-bottom: 20px;
                }

                .forgot-card button:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default OwnerForgot;