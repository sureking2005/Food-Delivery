import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OwnerMenu = () => {
  const [activeTab, setActiveTab] = useState('addFood');
  const [foodItem, setFoodItem] = useState({
    name: '',
    price: '',
    stocks:'',
    image: null
  });
  const [existingFoods, setExistingFoods] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFoodItem(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', foodItem.name);
    formData.append('price', foodItem.price);
    formData.append('stocks', foodItem.stocks);


    if (foodItem.image) {
      formData.append('image', foodItem.image);
    }

    try {
      const response = await axios.post('http://localhost:8000/ownermenu/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Food item added successfully');
      setFoodItem({
        name: '',
        price: '',
        stocks:'',
        image: null
      });

      fetchExistingFoods();
    } catch (error) {
      console.error('Error adding food item:', error);
      alert('Failed to add food item');
    }
  };

  const fetchExistingFoods = async () => {
    try {
      const response = await axios.get('http://localhost:8000/ownermenu/');
      setExistingFoods(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'existingFood') {
      fetchExistingFoods();
    }
  }, [activeTab]);

  const renderAddFoodForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Food Name:</label>
        <input
          type="text"
          name="name"
          value={foodItem.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block">Price:</label>
        <input
          type="number"
          name="price"
          value={foodItem.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block">Number of stocks:</label>
        <input
          type="number"
          name="stocks"
          value={foodItem.stocks}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      

      <div>
        <label className="block">Food Image:</label>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Food Item
      </button>
    </form>
  );

  const renderExistingFoods = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {existingFoods.map((food, index) => (
        <div key={index} className="border rounded p-4 shadow-md">
          <h3 className="font-bold">{food.name}</h3>
          <p>Price: ${food.price}</p>
          <p>Number of Stocks:{food.stocks}</p>


          {food.image && (
            <img
              src={`data:image/jpeg;base64,${food.image}`}
              alt={food.name}
              className="w-full h-48 object-cover mt-2"
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('addFood')}
          className={`p-2 mr-2 ${activeTab === 'addFood' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Add Food
        </button>
        <button
          onClick={() => setActiveTab('existingFood')}
          className={`p-2 ${activeTab === 'existingFood' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Existing Foods
        </button>
      </div>

      {activeTab === 'addFood' ? renderAddFoodForm() : renderExistingFoods()}
    </div>
  );
};

export default OwnerMenu;
