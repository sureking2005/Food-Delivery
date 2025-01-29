import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GuestUserHome = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/userhome/');
      if (!response.ok) {
        throw new Error('Failed to fetch food items');
      }
      const data = await response.json();
      setFoodItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const renderImage = (imageData) => {
    if (!imageData) return null;
    return `data:${imageData.content_type};base64,${imageData.content}`;
  };

  const handleUserLogin = () => {
    navigate('/userlogin');
  };

  const handleDeliveryLogin = () => {
    navigate('/deliveryboylogin');
  };

  const handleOwnerLogin = () => {
    navigate('/ownerlogin');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <nav className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold">Food Delivery App</h1>
        <div className="space-x-4">
          <button 
            onClick={() => navigate('/')} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Home
          </button>
          <button 
            onClick={handleOwnerLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Owner Login/Signup
          </button>
          <button 
            onClick={handleUserLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Customer Login/Signup
          </button>
          <button 
            onClick={handleDeliveryLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Deliveryboy Login/Signup
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Available Food Items</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Loading food items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodItems.map((food) => (
              <div key={food._id} className="bg-white rounded-lg shadow overflow-hidden">
                {food.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={renderImage(food.image)}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{food.name}</h2>
                  <p className="text-gray-600 mb-2">Number of stocks: {food.stock}</p>
                  <p className="text-lg font-medium text-green-600">
                    ${food.price}
                  </p>
                  {food.category && (
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mt-2">
                      {food.category}
                    </span>
                  )}
                  <button 
                    onClick={handleUserLogin}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Login to Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && foodItems.length === 0 && (
          <div className="text-center py-8">
            <p>No food items available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestUserHome;