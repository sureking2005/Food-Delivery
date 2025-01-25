import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSignup = () => {
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
            const response = await axios.post('http://localhost:8000/verifyemail/', { 
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
            const response = await axios.post('http://localhost:8000/usersignup/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.message === 'Signup Successful') {
                alert('Signup Successful');
                navigate('/userlogin');
            }
        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error.message);
            alert('User already exists');
        }
    };

    return (
        <div>
            <h1>User Signup</h1>
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
                    <button type="button" onClick={verifyEmail}>
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
    );
};

export default UserSignup;