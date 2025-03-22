import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OwnerUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    image: null
  });

  useEffect(() => {
    // Get the food data passed through navigation
    const foodData = location.state?.foodData;
    if (foodData) {
      setFormData({
        name: foodData.name,
        price: foodData.price,
        stock: foodData.stock,
        image: foodData.image
      });
    } else {
      // If no data was passed, redirect back to menu
      navigate('/ownermenu');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const foodId = location.state?.foodData?._id;

    if (!foodId) {
      alert('Food ID is missing');
      navigate('/ownermenu');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price.toString());  // Ensure price is string
    submitData.append('stock', formData.stock.toString());  // Ensure stock is string
    if (formData.image instanceof File) {
      submitData.append('image', formData.image);
    }

    try {
      const response = await fetch(`http://localhost:8000/updatefood/${foodId}/`, {
        method: 'PUT',
        body: submitData,
        // Don't set Content-Type header - FormData will set it automatically
      });

      const responseData = await response.json();  // Parse the JSON response

      if (response.ok) {
        alert(responseData.message);
        navigate('/ownermenu');
      } else {
        throw new Error(responseData.message || 'Failed to update food item');
      }
    } catch (error) {
      console.error('Error updating food item:', error);
      alert('Failed to update food item: ' + error.message);
    }
};

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="form-card">
          <h2 className="text-2xl font-bold mb-4">Update Food Item</h2>
          <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
            <div className="form-group">
              <label className="form-label">Food Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Number of Stocks</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Food Image (optional)</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="form-input"
              />
            </div>
            <div className="action-buttons">
              <button type="submit" className="update-button">
                Update Food Item
              </button>
              <button
                type="button"
                onClick={() => navigate('/ownermenu')}
                className="delete-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerUpdate;