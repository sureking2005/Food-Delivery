import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"


function UserCart() {
  const [email, setEmail] = useState("") // Added state for email
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('http://localhost:8000/useraddcart/') 
      setCartItems(response.data)
    } catch (err) {
      setError("Failed to fetch cart items")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCartItems()
  }, [fetchCartItems])
  const handleQuantityChange = useCallback(
    async (itemId, newQuantity) => {
      try {
        if (newQuantity <= 0) {
          await handleRemoveFromCart(itemId);
          return;
        }
        // Fixed the URL by removing the extra space before ${itemId}
        await axios.put(`http://localhost:8000/updatecart/${itemId}`, { count: newQuantity });
        fetchCartItems();
      } catch (err) {
        setError("Failed to update quantity");
      }
    },
    [fetchCartItems],
  );
  
  const handleRemoveFromCart = useCallback(
    async (itemId) => {
      try {
      
        await axios.delete(`http://localhost:8000/removecart/${itemId}`);
        fetchCartItems();
      } catch (err) {
        setError("Failed to remove item from cart");
      }
    },
    [fetchCartItems],
  );

  const renderImage = (image) => {
    if (typeof image === "string") {
      return image
    } else if (image && image.url) {
      return image.url
    }
    return null
  }

  return (
    <div className="container">
      <nav className="nav-container">
        <p className="welcome-text">Welcome, {email}</p>
        <div className="tab-container">
          <button onClick={() => (window.location.href = "/userhome")} className="tab-button">
            Home
          </button>
          <button onClick={() => (window.location.href = "/usercart")} className="tab-button active-tab">
            Cart
          </button>
          <button onClick={() => (window.location.href = "/userorder")} className="tab-button">
            Orders
          </button>
        </div>
      </nav>

      <div className="content-wrapper">
        <div className="flex items-center justify-between mb-6">
          <h1 className="page-title">Your Cart</h1>
          <div className="text-white">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white">Loading cart items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-300">
            <p>{error}</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button onClick={() => (window.location.href = "/userhome")} className="submit-button">
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
                          src={renderImage(item.image) || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150"
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
                      <p className="text-gray-600 mb-2">Stock: {item.stock} available</p>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-medium text-green-600">
                          ${Number.parseFloat(item.price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, (Number.parseInt(item.count) || 1) - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={(Number.parseInt(item.count) || 1) <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{Number.parseInt(item.count) || 1}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, (Number.parseInt(item.count) || 1) + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={(Number.parseInt(item.count) || 1) >= item.stock}
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
                onClick={() => (window.location.href = "/userorder")}
                disabled={cartItems.length === 0}
                className={`submit-button ${cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
        <style>
            {`
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

            .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            }

            .welcome-text {
            font-size: 1.125rem;
            color: white;
            }

            .tab-container {
            display: flex;
            gap: 1rem;
            }

            .tab-button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            }

            .tab-button.active-tab {
            background: white;
            color: #667eea;
            }

            .page-title {
            font-size: 2rem;
            font-weight: bold;
            color: white;
            margin-bottom: 2rem;
            }

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

            .label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            color: #4a5568;
            }

            .input {
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid #e2e8f0;
            margin-bottom: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.3s ease;
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
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            }


            `}
        </style>
    </div>
  )
}

export default UserCart;

