import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OwnerHome = () => {
    const navigate = useNavigate();
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissionStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8000/ownersubmissions/');
                // Assuming the API returns the latest submission
                if (response.data && response.data.length > 0) {
                    setSubmissionStatus(response.data[0].status);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch submission status');
                setLoading(false);
                console.error('Error:', err);
            }
        };

        fetchSubmissionStatus();
    }, []);

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
                {error && <div className="error-message">{error}</div>}
                <div className="button-container">
                    <button onClick={handleAddClick}>
                        Add Submission
                    </button>
                    <button onClick={handleSubmissionsClick}>
                        View Submissions
                    </button>
                    <button 
                        onClick={handleMenuClick}
                        disabled={submissionStatus !== 'accepted'}
                        className={submissionStatus !== 'accepted' ? 'disabled' : ''}
                    >
                        Manage Menu
                        {submissionStatus !== 'accepted' && (
                            <div className="button-tooltip">
                                Your submission must be accepted to manage menu
                            </div>
                        )}
                    </button>
                </div>
                {loading && <div className="loading">Loading...</div>}
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
                    position: relative;
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
                    position: relative;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(0,0,0,0.2);
                }

                button:active {
                    transform: translateY(0);
                }

                button.disabled {
                    background: linear-gradient(to right, #9ca3af, #6b7280);
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                button.disabled:hover {
                    transform: none;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .button-tooltip {
                    position: absolute;
                    bottom: -40px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #333;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                button:hover .button-tooltip {
                    opacity: 1;
                }

                .error-message {
                    color: #ef4444;
                    margin-bottom: 20px;
                }

                .loading {
                    color: #6b7280;
                    margin-top: 20px;
                }
            `}</style>
        </div>
    );
};

export default OwnerHome;