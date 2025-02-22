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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Submit Hotel</h1>
        <button
          onClick={() => navigate('/ownersubmissions')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          View Submissions
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block mb-1">Hotel Name:</label>
          <input
            type="text"
            name="hotel_name"
            value={foodItem.hotel_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Owner Name:</label>
          <input
            type="text"
            name="owner_name"
            value={foodItem.owner_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Hotel Address:</label>
          <input
            type="text"
            name="hotel_address"
            value={foodItem.hotel_address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Hotel Email:</label>
          <input
            type="email"
            name="hotel_email"
            value={foodItem.hotel_email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Hotel Number:</label>
          <input
            type="tel"
            name="hotel_number"
            value={foodItem.hotel_number}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Enter 10 digit number"
          />
          {phoneError && (
            <span className="text-red-500 text-sm mt-1">{phoneError}</span>
          )}
        </div>
        <div>
          <label className="block mb-1">Food Menu:</label>
          <input
            type="text"
            name="food_menu"
            value={foodItem.food_menu}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={phoneError !== ''}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OwnerAdd;