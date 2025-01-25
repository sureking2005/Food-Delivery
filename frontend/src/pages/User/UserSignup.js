import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSignup = () => {
    const [formData, setFormData] = useState({
        email: '',
        phonenumber:'',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
        <div className='usersignup'>
            <h1>User Signup</h1>
            <form onSubmit={handleSubmit}>
                <div className='signup-column'>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Enter Email" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                    <input 
                        type="phonenumber" 
                        name="phonenumber"
                        placeholder="Enter Phonenumber" 
                        value={formData.name}
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
}

export default UserSignup;