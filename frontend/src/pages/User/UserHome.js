import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserHome() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="user-home">
            <nav className="navigation">
                <p className="welcome-text">Welcome, {email}</p>
                <div className="nav-buttons">
                    <button onClick={() => handleNavigation('/')}>Home</button>
                    <button onClick={() => handleNavigation('/usercart')}>Cart</button>
                    <button onClick={() => handleNavigation('/userorder')}>Orders</button>
                </div>
            </nav>
            <div className="content">
                <h1>Welcome to Food Delivery</h1>
            </div>

            <style>{`
                .user-home {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                .navigation {
                    background-color: #f8f9fa;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .welcome-text {
                    margin: 0;
                    font-size: 16px;
                    color: #333;
                }

                .nav-buttons {
                    display: flex;
                    gap: 15px;
                }

                button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                button:hover {
                    background-color: #0056b3;
                }

                .content {
                    text-align: center;
                    margin-top: 50px;
                }

                h1 {
                    color: #333;
                    font-size: 2em;
                }
            `}</style>
        </div>
    );
}

export default UserHome;