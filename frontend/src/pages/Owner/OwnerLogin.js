import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const OwnerLogin = () => {
    const [primary_key, setPrimary_key] = useState('');

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const response = await axios.post('http://localhost:8000/ownerlogin/', {
                primary_key: primary_key ,
                password: password
            });

            if (response.status === 200) {
                console.log('Login successful', response.data);
                alert('Login Successful');
                navigate('/ownerhome');
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
        navigate('/ownersignup');
    };

    const handleforgot = () => {
        navigate('/ownerforgot');
    };

    return (
        <div className='userlogin'>
            <div className='login-card'>
            <h1>User Login</h1>
            {error && <div className="error-message text-red-500">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className='login-column'>
                    <input 
                        type="text" 
                        placeholder="Enter Email/Phone Number" 
                        value={primary_key}
                        onChange={(e) => setPrimary_key(e.target.value)}
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
            <style>{`
                .userlogin {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Arial', sans-serif;
                }

                .userlogin .login-card {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    padding: 50px;
                    width: 450px;
                    text-align: center;
                }

                .userlogin h1 {
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 28px;
                }

                .userlogin .login-column {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .userlogin input {
                    width: 100%;
                    padding: 14px;
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .userlogin input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
                }

                .userlogin button {
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

                .userlogin button:hover {
                    transform: scale(1.05);
                }

                .forgot-link button {
                    background: none;
                    border: none;
                    color: #667eea;
                    cursor: pointer;
                    font-size: 14px;
                    text-decoration: underline;
                }

                .userlogin .signup-link {
                    margin-top: 15px;
                }

                .userlogin .signup-link button {
                    background: none;
                    border: none;
                    color: #667eea;
                    cursor: pointer;
                    text-decoration: underline;
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
}

export default OwnerLogin;