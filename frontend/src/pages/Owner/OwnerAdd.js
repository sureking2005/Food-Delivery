import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerAdd = () => {
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState({
    hotel_name: '',
    owner_name: '',
    hotel_address: '',
    hotel_email: '',
    hotel_number: '',
    food_menu: '',
    status: 'in_review',
    Role: 'Owner'
  });

  const [phoneError, setPhoneError] = useState('');

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'hotel_number') {
      const numericValue = value.replace(/[^\d]/g, '');
      const truncatedValue = numericValue.slice(0, 10);

      if (!validatePhoneNumber(truncatedValue) && truncatedValue.length > 0) {
        setPhoneError('Phone number must be exactly 10 digits');
      } else {
        setPhoneError('');
      }

      setFoodItem(prev => ({
        ...prev,
        [name]: truncatedValue
      }));
    } else {
      setFoodItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(foodItem.hotel_number)) {
      setPhoneError('Phone number must be exactly 10 digits');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/owneradd/', foodItem);
      if (response.status === 200) {
        alert('Review in Progress');
        setFoodItem({
          hotel_name: '',
          owner_name: '',
          hotel_address: '',
          hotel_email: '',
          hotel_number: '',
          food_menu: '',
          status: 'in_review'
        });
        setPhoneError('');
      }
    } catch (error) {
      alert('Failed to submit');
      console.error('Error:', error);
    }
  };

  return (
    <div className="owner-home">
      <div className="home-card">
        <h1>Submit Hotel</h1>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Hotel Name:</label>
            <input
              type="text"
              name="hotel_name"
              value={foodItem.hotel_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Owner Name:</label>
            <input
              type="text"
              name="owner_name"
              value={foodItem.owner_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Hotel Address:</label>
            <input
              type="text"
              name="hotel_address"
              value={foodItem.hotel_address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Hotel Email:</label>
            <input
              type="email"
              name="hotel_email"
              value={foodItem.hotel_email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Hotel Number:</label>
            <input
              type="tel"
              name="hotel_number"
              value={foodItem.hotel_number}
              onChange={handleChange}
              required
              placeholder="Enter 10 digit number"
            />
            {phoneError && <span className="error-message">{phoneError}</span>}
          </div>
          <div className="form-group">
            <label>Food Menu:</label>
            <input
              type="text"
              name="food_menu"
              value={foodItem.food_menu}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="submit-button"
              disabled={phoneError !== ''}
            >
              Submit
            </button>
            <button
              type="button"
              className="view-submissions-button"
              onClick={() => navigate('/ownersubmissions')}
            >
              View Submissions
            </button>
          </div>
        </form>
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
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          padding: 30px;
          width: 450px;
          text-align: center;
        }

        h1 {
          color: #333;
          margin-bottom: 30px;
          font-size: 28px;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .form-group label {
          font-size: 14px;
          color: #555;
        }

        .form-group input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          border-color: #667eea;
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .submit-button,
        .view-submissions-button {
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-button {
          background: linear-gradient(to right, #667eea, #764ba2);
          color: white;
        }

        .submit-button:disabled {
          background: linear-gradient(to right, #9ca3af, #6b7280);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .view-submissions-button {
          background: #10b981;
          color: white;
        }

        .submit-button:hover:not(:disabled),
        .view-submissions-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .submit-button:active:not(:disabled),
        .view-submissions-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default OwnerAdd;