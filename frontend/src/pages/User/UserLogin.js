import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const response = await axios.post('http://localhost:8000/userlogin/', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                console.log('Login successful', response.data);
                alert('Login Successful');
                navigate('/userhome');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Login failed');
            } else if (err.request) {
                setError('No response from server');
            } else {
                setError('Error logging in');
            }
            console.error('Login error:', err);
        }
    };

    const handleSignup = () => {
        navigate('/usersignup');
    };

    const handleforgot = () => {
        navigate('/userforgot');
    };

    return (
        <div className='userlogin'>
            <h1>User Login</h1>
            {error && <div className="error-message text-red-500">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className='login-column'>
                    <input
                        type="text"
                        placeholder="Enter Email/Phone Number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </div>
            </form>
            <div className='signup-link'>
                <p>Don't have an account?
                    <button onClick={handleSignup}>Sign Up</button>
                </p>
            </div>
            <div className='forgot-link'>
                <p>Forgot your password?
                    <button onClick={handleforgot}>Forgot password</button>
                </p>
            </div>
            
            
        </div>
    );
}

export default UserLogin;