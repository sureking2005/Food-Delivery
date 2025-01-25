import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryboyLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/deliveryboyhome');
        console.log('Login attempted', { email, password });
    };

    const handleSignup = () => {
        navigate('/deliveryboysignup');
    };

    const handleforgot = () => {
        navigate('/deliveryboyforgot');
    };

    return (
        <div className='deliveryboylogin'>
            <div className='login-card'>
                <h1>Deliveryboy Login</h1>
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

                        <div className='forgot-link'>
                            <button type="button" onClick={handleforgot}>Forgot Password?</button>
                        </div>
                    </div>
                </form>
                <div className='signup-link'>
                    <p>Don't have an account? 
                        <button onClick={handleSignup}>Sign Up</button>
                    </p>
                </div>
            </div>

            <style>{`
                .deliveryboylogin {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Arial', sans-serif;
                }

                .deliveryboylogin .login-card {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    padding: 50px;
                    width: 450px;
                    text-align: center;
                }

                .deliveryboylogin h1 {
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 28px;
                }

                .deliveryboylogin .login-column {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .deliveryboylogin input {
                    width: 100%;
                    padding: 14px;
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .deliveryboylogin input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
                }

                .deliveryboylogin button {
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

                .deliveryboylogin button:hover {
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

                .deliveryboylogin .signup-link {
                    margin-top: 15px;
                }

                .deliveryboylogin .signup-link button {
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

export default DeliveryboyLogin;

