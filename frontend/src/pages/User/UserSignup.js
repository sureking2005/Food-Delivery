import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSignup = () => {
    const [formData, setFormData] = useState({
        email: '',
        phonenumber: '',
        password: '',
        otp: '',

    });
    const [emailVerified, setEmailVerified] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Real-time password validation
        if (name === 'password') {
            if (!validatePassword(value)) {
                setPasswordError('Password must be 6 characters with lowercase, uppercase, and numbers');
            } else {
                setPasswordError('');
            }
        }

        // Real-time phone number validation
        if (name === 'phonenumber') {
            if (!validatePhoneNumber(value)) {
                setPhoneError('Phone number must be exactly 10 digits');
            } else {
                setPhoneError('');
            }
        }
    };

    const verifyEmail = async () => {
        try {
            const response = await axios.post('http://localhost:8000/userverifyemail/', {
                email: formData.email
            });
    
            if (response.data.message === 'OTP Sent') {
                alert('OTP sent to your email');
                setEmailVerified(true);
            } else if (response.data.alert === 'Email already exists') {
                alert('Email already exists. Please use a different email.');
            }
        } catch (error) {
            console.error('Email verification error:', error);
            if (error.response && error.response.data.alert) {
                alert(error.response.data.alert);
            } else {
                alert('Failed to send OTP');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailVerified) {
            alert('Please verify your email first');
            return;
        }

        if (!validatePassword(formData.password)) {
            setPasswordError('Invalid password format');
            return;
        }

        if (!validatePhoneNumber(formData.phonenumber)) {
            setPhoneError('Phone number must be exactly 10 digits');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/usersignup/', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.data.message === 'Signup Successful') {
                alert('Signup Successful');
                navigate('/userhome');
            }
        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error.message);
            
            if (error.response && error.response.data.alert) {
                alert(error.response.data.alert);
            } else {
                alert('Signup failed');
            }
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
                        type="tel"
                        name="phonenumber"
                        placeholder="Enter Phone Number"
                        value={formData.phonenumber}
                        onChange={handleChange}
                        required
                    />
                    {phoneError && <p style={{color: 'red'}}>{phoneError}</p>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}

                    <button type="submit" disabled={!!passwordError || !!phoneError}>Sign Up</button>
                </div>
            </form>
        </div>
    );
};

export default UserSignup;