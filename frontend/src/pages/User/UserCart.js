import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

function UserCart() {
    const [email, setEmail] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    const fetchCartItems = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/useraddcart/');
            if (response.status === 200) {
                setCartItems(response.data);
                calculateTotal(response.data);
            } else {
                throw new Error('Failed to fetch cart items');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching cart items:', err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
        fetchCartItems();
    }, [fetchCartItems]);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * (parseInt(item.count) || 1));
        }, 0);
        setTotalAmount(total);
    };

    const handleQuantityChange = async (itemId, newCount) => {
        if (newCount < 1) return;
        
        try {
            const response = await axios.put(`http://localhost:8000/updatecart/${itemId}`, {
                count: newCount,
                email: email
            });

            if (response.status === 200) {
                const updatedItems = cartItems.map(item => 
                    item._id === itemId ? { ...item, count: newCount } : item
                );
                setCartItems(updatedItems);
                calculateTotal(updatedItems);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity');
        }
    };

    const renderImage = (imageData) => {
        if (!imageData) return null;
        try {
            if (typeof imageData === 'string' && imageData.startsWith('data:')) {
                return imageData;
            }
            
            if (imageData.content && imageData.content_type) {
                const base64Content = imageData.content.startsWith('data:') 
                    ? imageData.content.split(',')[1] 
                    : imageData.content;
                
                return `data:${imageData.content_type};base64,${base64Content}`;
            }
            
            return null;
        } catch (error) {
            console.error('Error rendering image:', error);
            return null;
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/removecart/${itemId}`);

            if (response.status === 200) {
                const updatedItems = cartItems.filter(item => item._id !== itemId);
                setCartItems(updatedItems);
                calculateTotal(updatedItems);
                alert('Item removed from cart successfully!');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item from cart');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <nav className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow">
                <p className="text-lg font-medium">Welcome, {email}</p>
                <div className="space-x-4">
                    <button 
                        onClick={() => window.location.href = '/userhome'} 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => window.location.href = '/usercart'} 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Cart
                    </button>
                    <button 
                        onClick={() => window.location.href = '/userorder'} 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Orders
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Your Cart</h1>
                    <div className="text-gray-600">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4">Loading cart items...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">
                        <p>{error}</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                        <button 
                            onClick={() => window.location.href = '/userhome'}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {cartItems.map((item) => (
                                <div key={item._id} className="p-4 border-b last:border-b-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-32 h-32 flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={renderImage(item.image)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/150';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                    <span className="text-gray-500">No image</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                                            <p className="text-gray-600 mb-2">
                                                Stock: {item.stock} available
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <p className="text-lg font-medium text-green-600">
                                                    ${parseFloat(item.price).toFixed(2)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item._id, (parseInt(item.count) || 1) - 1)}
                                                        className="p-1 rounded-full hover:bg-gray-100"
                                                        disabled={(parseInt(item.count) || 1) <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-8 text-center">
                                                        {parseInt(item.count) || 1}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item._id, (parseInt(item.count) || 1) + 1)}
                                                        className="p-1 rounded-full hover:bg-gray-100"
                                                        disabled={(parseInt(item.count) || 1) >= item.stock}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => handleRemoveFromCart(item._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Remove item"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <button 
                                onClick={() => window.location.href = '/userorder'}
                                disabled={cartItems.length === 0}
                                className={`w-full py-3 rounded font-medium text-white transition-colors ${
                                    cartItems.length === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserCart;