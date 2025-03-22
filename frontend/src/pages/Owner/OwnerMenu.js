import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerMenu = () => {
  const [activeTab, setActiveTab] = useState('addFood');
  const [existingFoods, setExistingFoods] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        const response = await fetch(`http://localhost:8000/deletefood/${foodId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          alert('Food item deleted successfully');
          fetchExistingFoods(); // Refresh the list after deletion
        } else {
          const errorData = await response.text();
          throw new Error(errorData || 'Failed to delete food item');
        }
      } catch (error) {
        console.error('Error deleting food item:', error);
        alert('Failed to delete food item: ' + error.message);
      }
    }
  };

  const handleUpdate = (food) => {
    // Navigate to OwnerUpdate page with food data
    navigate('/ownerupdate', { state: { foodData: food } });
  };

  const fetchExistingFoods = async () => {
    try {
      const response = await fetch('http://localhost:8000/ownermenu/');
      if (!response.ok) {
        throw new Error('Failed to fetch food items');
      }
      const data = await response.json();
      setExistingFoods(data);
    } catch (error) {
      console.error('Error fetching food items:', error);
      alert('Failed to fetch food items');
    }
  };

  useEffect(() => {
    fetchExistingFoods();
  }, [activeTab]);

  const AddFoodForm = () => {
    const [formInputs, setFormInputs] = useState({
      name: '',
      price: '',
      stock: '',
      image: null
    });

    const handleLocalChange = (e) => {
      const { name, value } = e.target;
      setFormInputs(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleLocalSubmit = async (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      formData.append('name', formInputs.name);
      formData.append('price', formInputs.price);
      formData.append('stock', formInputs.stock);
      if (formInputs.image) {
        formData.append('image', formInputs.image);
      }

      try {
        const response = await fetch('http://localhost:8000/ownermenu/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Food item added successfully');
          setFormInputs({
            name: '',
            price: '',
            stock: '',
            image: null
          });
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = '';
          fetchExistingFoods();
        } else {
          const errorData = await response.text();
          throw new Error(errorData || 'Failed to add food item');
        }
      } catch (error) {
        console.error('Error adding food item:', error);
        alert('Failed to add food item: ' + error.message);
      }
    };

    const handleLocalImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormInputs(prev => ({
          ...prev,
          image: file
        }));
      }
    };

    return (
      <div className="form-card">
        <form onSubmit={handleLocalSubmit} className="form" encType="multipart/form-data">
          <div className="form-group">
            <label className="form-label">Food Name</label>
            <input
              type="text"
              name="name"
              value={formInputs.name}
              onChange={handleLocalChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formInputs.price}
              onChange={handleLocalChange}
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
              value={formInputs.stock}
              onChange={handleLocalChange}
              required
              min="0"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Food Image</label>
            <input
              type="file"
              name="image"
              onChange={handleLocalImageChange}
              accept="image/*"
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-button">
            Add Food Item
          </button>
        </form>
      </div>
    );
  };

  const ExistingFoods = () => (
    <div className="food-grid">
      {existingFoods.map((food) => (
        <div key={food.id} className="food-card">
          <div className="image-container">
            {food.image ? (
              <img
                src={`data:${food.image.content_type};base64,${food.image.content}`}
                alt={food.name}
                className="food-image"
              />
            ) : (
              <div className="no-image">No image available</div>
            )}
          </div>
          <div className="food-info">
            <h3 className="food-name">{food.name}</h3>
            <div className="food-details">
              <p className="food-price">${food.price}</p>
              <p className="food-stock">Stock: {food.stock} units</p>
              <div className="action-buttons">
                <button
                  onClick={() => handleUpdate(food)}
                  className="update-button"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(food.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="tab-container">
          <button
            onClick={() => setActiveTab('addFood')}
            className={`tab-button ${activeTab === 'addFood' ? 'active' : ''}`}
          >
            Add Food
          </button>
          <button
            onClick={() => setActiveTab('existingFood')}
            className={`tab-button ${activeTab === 'existingFood' ? 'active' : ''}`}
          >
            Existing Foods
          </button>
        </div>

        {activeTab === 'addFood' ? <AddFoodForm /> : <ExistingFoods />}
      </div>
      <style>{`
      /* OwnerMenu.css */
      .container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem 1rem;
        font-family: Arial, sans-serif;
      }
      
      .content-wrapper {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      /* Tab styles */
      .tab-container {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .tab-button {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.875rem;
        font-weight: 600;
      }
      
      .tab-button.active {
        background: white;
        color: #667eea;
      }
      
      .tab-button.inactive {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
      
      /* Food grid styles */
      .food-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        padding: 1rem;
      }
      
      .food-card {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        height: 400px;
      }
      
      .food-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15);
      }
      
      .image-container {
        width: 100%;
        height: 250px;
        position: relative;
        background-color: #f7fafc;
        overflow: hidden;
      }
      
      .food-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.3s ease;
      }
      
      .no-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f7fafc;
        color: #a0aec0;
        font-size: 0.875rem;
      }
      
      .food-info {
        padding: 1.5rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: white;
      }
      
      .food-name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .food-details {
        margin-top: auto;
      }
      
      .food-price {
        color: #48bb78;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      
      .food-stock {
        color: #718096;
        font-size: 0.875rem;
      }
      
      /* Form styles */
      .form-card {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: #4a5568;
      }
      
      .form-input {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }
      
      .form-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
      
      .submit-button {
        width: 100%;
        padding: 0.75rem;
        background: linear-gradient(to right, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .submit-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
      }
      
      /* Action button styles */
      .action-buttons {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      
      .update-button {
        flex: 1;
        padding: 0.5rem;
        background: #4299e1;
        color: white;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background 0.3s ease;
      }

      .update-button:hover {
        background: #3182ce;
      }

      .delete-button {
        flex: 1;
        padding: 0.5rem;
        background: #f56565;
        color: white;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background 0.3s ease;
      }

      .delete-button:hover {
        background: #e53e3e;
      }

      /* Modal styles */
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow: auto;
      }
      `}</style>
    </div>
  );
};

export default OwnerMenu;