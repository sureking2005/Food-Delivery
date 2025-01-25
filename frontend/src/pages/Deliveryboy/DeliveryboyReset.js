import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const DeliveryboyReset = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/deliveryboyreset/', {
                email: location.state?.email,
                newPassword: passwords.newPassword
            });

            if (response.data.message === 'Password Reset Successful') {
                alert('Password reset successful');
                navigate('/deliveryboylogin');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Password reset failed');
        }
    };

    return (
        <div className='reset-container'>
            <div className='reset-card'>
                <h1>Reset Password</h1>
                <form onSubmit={handleResetPassword}>
                    <div className='reset-column'>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Confirm</button>
                    </div>
                </form>
            </div>
            
            <style>{`
                .reset-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Arial', sans-serif;
                }

                .reset-card {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    padding: 50px;
                    width: 450px;
                    text-align: center;
                }

                .reset-card h1 {
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 28px;
                }

                .reset-column {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .reset-column input {
                    width: 100%;
                    padding: 14px;
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .reset-column input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
                }

                .reset-column button {
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

                .reset-column button:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default DeliveryboyReset;
