import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        navigate('/userhome');
        
        console.log('Login attempted', { email, password });
    };

    const handleSignup = () => {
        navigate('/usersignup');
    };

    return (
        <div className='userlogin'>
            <h1>User Login</h1>
            <form onSubmit={handleLogin}>
                <div className='login-column'>
                    <input 
                        type="email" 
                        placeholder="Enter Email" 
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
        </div>
    );
}

export default UserLogin;