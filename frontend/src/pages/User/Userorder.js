import React, { useState, useEffect } from "react"
import axios from "axios"
import { ShoppingBag } from "lucide-react"


function UserOrder() {
  const [email, setEmail] = useState("")
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    }
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/useraddcart/")
      if (response.status === 200) {
        setCartItems(response.data)
        calculateTotal(response.data)
      } else {
        throw new Error("Failed to fetch cart items")
      }
      setLoading(false)
    } catch (err) {
      console.error("Error fetching cart items:", err)
      setError(err.message)
      setLoading(false)
    }
  }

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + Number.parseFloat(item.price) * (Number.parseInt(item.count) || 1)
    }, 0)
    setTotalAmount(total)
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address")
      return
    }

    setCheckoutLoading(true)
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: Number.parseInt(item.count) || 1,
        })),
        shippingAddress: shippingAddress,
        totalAmount: Number.parseFloat(totalAmount),
      }

      const response = await axios.post("http://localhost:8000/placeorder/", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200) {
        alert("Order placed successfully!")
        window.location.href = "/userhome"
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert(error.response?.data?.message || "Failed to place order. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const renderImage = (imageData) => {
    if (!imageData) return null
    try {
      if (typeof imageData === "string" && imageData.startsWith("data:")) {
        return imageData
      }

      if (imageData.content && imageData.content_type) {
        const base64Content = imageData.content.startsWith("data:")
          ? imageData.content.split(",")[1]
          : imageData.content

        return `data:${imageData.content_type};base64,${base64Content}`
      }

      return null
    } catch (error) {
      console.error("Error rendering image:", error)
      return null
    }
  }

  return (
    <div className="container">
      <nav className="nav-container">
        <p className="welcome-text">Welcome, {email}</p>
        <div className="tab-container">
          <button onClick={() => (window.location.href = "/userhome")} className="tab-button">
            Home
          </button>
          <button onClick={() => (window.location.href = "/usercart")} className="tab-button">
            Cart
          </button>
        </div>
      </nav>

      <div className="content-wrapper">
        <h1 className="page-title">Order Summary</h1>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag className="empty-cart-icon" />
            <p className="empty-cart-text">No items in cart</p>
            <button onClick={() => (window.location.href = "/userhome")} className="continue-shopping-button">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="order-summary">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="order-item">
                <div className="item-image">
                  {item.image ? (
                    <img
                      src={renderImage(item.image) || "/placeholder.svg"}
                      alt={item.name}
                      className="item-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150"
                      }}
                    />
                  ) : (
                    <div className="no-image">
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-quantity">Quantity: {Number.parseInt(item.count) || 1}</p>
                  <p className="item-price">
                    ${(Number.parseFloat(item.price) * (Number.parseInt(item.count) || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="shipping-address">
              <label htmlFor="shippingAddress">Shipping Address</label>
              <textarea
                id="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="3"
                placeholder="Enter your shipping address"
                required
              />
            </div>

            <div className="total-amount">
              <span>Total Amount</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <button onClick={handlePlaceOrder} disabled={checkoutLoading} className="place-order-button">
              {checkoutLoading ? "Processing..." : "Place Order"}
            </button>
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

        .order-summary {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        }

        .order-item {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #e2e8f0;
        }

        .order-item:last-child {
        border-bottom: none;
        }

        .item-image {
        width: 6rem;
        height: 6rem;
        object-fit: cover;
        border-radius: 0.5rem;
        margin-right: 1rem;
        }

        .item-details {
        flex-grow: 1;
        }

        .item-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.25rem;
        }

        .item-quantity {
        font-size: 0.875rem;
        color: #718096;
        }

        .item-price {
        font-size: 1rem;
        font-weight: 600;
        color: #48bb78;
        }

        .shipping-address {
        margin-top: 2rem;
        }

        .shipping-address label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #4a5568;
        margin-bottom: 0.5rem;
        }

        .shipping-address textarea {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
        font-size: 1rem;
        resize: vertical;
        }

        .total-amount {
        display: flex;
        justify-content: space-between;
        font-size: 1.25rem;
        font-weight: 600;
        color: #2d3748;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
        }

        .place-order-button {
        width: 100%;
        padding: 1rem;
        margin-top: 2rem;
        background: linear-gradient(to right, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.3s ease;
        }

        .place-order-button:hover {
        opacity: 0.9;
        }

        .place-order-button:disabled {
        background: #a0aec0;
        cursor: not-allowed;
        }

        .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        animation: spin 1s linear infinite;
        margin: 2rem auto;
        }

        @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
        }

        .error-message {
        text-align: center;
        color: #e53e3e;
        padding: 2rem;
        }

        .empty-cart {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .empty-cart-icon {
        font-size: 4rem;
        color: #a0aec0;
        margin-bottom: 1rem;
        }

        .empty-cart-text {
        font-size: 1.25rem;
        color: #4a5568;
        margin-bottom: 2rem;
        }

        .continue-shopping-button {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(to right, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.3s ease;
        }

        .continue-shopping-button:hover {
        opacity: 0.9;
        }


            `}
        </style>
    </div>
  )
}

export default UserOrder

