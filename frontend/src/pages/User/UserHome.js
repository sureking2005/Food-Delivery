import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

function UserHome() {
    const [email, setEmail] = useState('');
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
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

    const handleAddToCart = async (food) => {
        try {
            const formData = new FormData();
            formData.append('name', food.name);
            formData.append('price', food.price);
            formData.append('stock', food.stock);
            formData.append('count', 1);
            formData.append('email', email);
    
           
            if (food.image && food.image.content && food.image.content_type) {
               
                const byteCharacters = atob(food.image.content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: food.image.content_type });
                
                
                const file = new File([blob], 'food-image', { type: food.image.content_type });
                formData.append('image', file);
            }
    
            const response = await axios.post('http://localhost:8000/usercart/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.status === 200) {
                alert('Item added to cart successfully!');
            } else {
                throw new Error('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <nav className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow">
                <p className="text-lg font-medium">Welcome, {email}</p>
                <div className="space-x-4">
                    <button 
                        onClick={() => window.location.href = '/userhome'} 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => window.location.href = '/usercart'} 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Cart
                    </button>
                    <button 
                        onClick={() => window.location.href = '/userorder'} 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Orders
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
                                        onClick={() => handleAddToCart(food)}
                                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                                    >
                                        Add to Cart
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
}

export default UserHome;