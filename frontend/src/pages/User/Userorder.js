import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag } from 'lucide-react';

function UserOrder() {
    const [email, setEmail] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
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
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * (parseInt(item.count) || 1));
        }, 0);
        setTotalAmount(total);
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        if (!shippingAddress.trim()) {
            alert('Please enter a shipping address');
            return;
        }

        setCheckoutLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    _id: item._id,  
                    name: item.name,
                    quantity: parseInt(item.count) || 1,
                })),
                shippingAddress: shippingAddress,
                totalAmount: parseFloat(totalAmount),
            };

            const response = await axios.post('http://localhost:8000/placeorder/', orderData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert('Order placed successfully!');
                window.location.href = '/userhome';
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setCheckoutLoading(false);
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
                </div>
            </nav>

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Order Summary</h1>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4">Loading order details...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">
                        <p>{error}</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600 mb-4">No items in cart</p>
                        <button
                            onClick={() => window.location.href = '/userhome'}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                                    <div className="w-24 h-24 flex-shrink-0">
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
                                        <h3 className="text-lg font-medium">{item.name}</h3>
                                        <p className="text-gray-600">Quantity: {parseInt(item.count) || 1}</p>
                                        <p className="text-green-600 font-medium">
                                            ${(parseFloat(item.price) * (parseInt(item.count) || 1)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-6 pt-6 border-t">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Shipping Address
                                        </label>
                                        <textarea
                                            value={shippingAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            rows="3"
                                            placeholder="Enter your shipping address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between text-lg font-medium mt-4">
                                    <span>Total Amount</span>
                                    <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={checkoutLoading}
                                    className={`w-full mt-6 py-3 rounded font-medium text-white transition-colors ${
                                        checkoutLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                >
                                    {checkoutLoading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserOrder;
