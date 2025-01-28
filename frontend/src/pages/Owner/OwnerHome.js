import React from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerHome = () => {
    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate('/owneradd');
    };

    const handleSubmissionsClick = () => {
        navigate('/ownersubmissions');
    };

    const handleMenuClick = () => {
        navigate('/ownermenu');
    };

    return (
        <div className="owner-home">
            <div className="home-card">
                <h1>Owner Dashboard</h1>
                <div className="button-container">
                    <button onClick={handleAddClick}>
                        Add Submissions
                    </button>
                    <button onClick={handleSubmissionsClick}>
                        View Submissions
                    </button>
                    <button onClick={handleMenuClick}>
                        Manage Menu
                    </button>
                </div>
            </div>

            <style>{`
                .owner-home {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Arial', sans-serif;
                }

                .home-card {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                    padding: 50px;
                    width: 500px;
                    text-align: center;
                }

                h1 {
                    color: #333;
                    margin-bottom: 40px;
                    font-size: 32px;
                }

                .button-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                button {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(to right, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(0,0,0,0.2);
                }

                button:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default OwnerHome;