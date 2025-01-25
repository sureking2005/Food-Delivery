import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeliveryboySignup = () => {
    const [formData, setFormData] = useState({
        email: '',
        phonenumber: '',
        password: '',
        otp: ''
    });
    const [emailVerified, setEmailVerified] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const verifyEmail = async () => {
        try {
            const response = await axios.post('http://localhost:8000/deliveryboyverifyemail/', { 
                email: formData.email 
            });
            
            if (response.data.message === 'OTP Sent') {
                alert('OTP sent to your email');
                setEmailVerified(true);
            }
        } catch (error) {
            console.error('Email verification error:', error);
            alert('Failed to send OTP');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/deliveryboysignup/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.message === 'Signup Successful') {
                alert('Signup Successful');
                navigate('/deliveryboylogin');
            }
        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error.message);
            alert('email already exists');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h1>Deliveryboy Signup</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <button type="button" className="verify-button" onClick={verifyEmail}>
                            Verify Email
                        </button>

                        {emailVerified && (
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                            />
                        )}

                        <input
                            type="text"
                            name="phonenumber"
                            placeholder="Enter Phone Number"
                            value={formData.phonenumber}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
            <style>{`
                .signup-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Arial', sans-serif;
                }

                .signup-form {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    padding: 40px;
                    width: 400px;
                    text-align: center;
                }

                .signup-form h1 {
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 24px;
                }

                .signup-form input {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .signup-form input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
                }

                .signup-form button {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(to right, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .signup-form button:hover {
                    transform: scale(1.05);
                }

                .verify-button {
                    background: #4CAF50;
                    margin-left: 10px;
                    width: auto;
                }
            `}</style>
        </div>
    );
};

export default DeliveryboySignup;