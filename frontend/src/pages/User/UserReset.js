import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const UserReset = () => {
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
            const response = await axios.post('http://localhost:8000/userreset/', {
                email: location.state?.email,
                newPassword: passwords.newPassword
            });

            if (response.data.message === 'Password Reset Successful') {
                alert('Password reset successful');
                navigate('/userlogin');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Password reset failed');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
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
            </form>
        </div>
    );
};

export default UserReset;