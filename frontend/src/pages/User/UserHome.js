import React, { useState, useEffect } from "react"
import axios from "axios"

function UserHome() {
  const [email, setEmail] = useState("")
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    }
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/userhome/")
      if (!response.ok) {
        throw new Error("Failed to fetch food items")
      }
      const data = await response.json()
      setFoodItems(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const renderImage = (imageData) => {
    if (!imageData) return null
    return `data:${imageData.content_type};base64,${imageData.content}`
  }

  const handleAddToCart = async (food) => {
    try {
      const formData = new FormData()
      formData.append("name", food.name)
      formData.append("price", food.price)
      formData.append("stock", food.stock)
      formData.append("count", 1)
      formData.append("email", email)

      if (food.image && food.image.content && food.image.content_type) {
        const byteCharacters = atob(food.image.content)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: food.image.content_type })

        const file = new File([blob], "food-image", { type: food.image.content_type })
        formData.append("image", file)
      }

      const response = await axios.post("http://localhost:8000/usercart/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        alert("Item added to cart successfully!")
      } else {
        throw new Error("Failed to add item to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add item to cart")
    }
  }

  return (
    <div className="container">
      <nav className="nav-container">
        <p className="welcome-text">Welcome, {email}</p>
        <div className="tab-container">
          <button onClick={() => (window.location.href = "/userhome")} className="tab-button active-tab">
            Home
          </button>
          <button onClick={() => (window.location.href = "/usercart")} className="tab-button">
            Cart
          </button>
          <button onClick={() => (window.location.href = "/userorder")} className="tab-button">
            Orders
          </button>
        </div>
      </nav>

      <div className="content-wrapper">
        <h1 className="page-title">Available Food Items</h1>

        {loading ? (
          <div className="loading-message">
            <p>Loading food items...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="food-grid">
            {foodItems.map((food) => (
              <div key={food._id} className="food-card">
                <div className="image-container">
                  {food.image ? (
                    <img src={renderImage(food.image) || "/placeholder.svg"} alt={food.name} className="food-image" />
                  ) : (
                    <div className="no-image">No image available</div>
                  )}
                </div>
                <div className="food-info">
                  <h2 className="food-name">{food.name}</h2>
                  <div className="food-details">
                    <p className="food-stock">Number of stocks: {food.stock}</p>
                    <p className="food-price">${food.price}</p>
                    {food.category && <span className="food-category">{food.category}</span>}
                    <button onClick={() => handleAddToCart(food)} className="add-to-cart-button">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && foodItems.length === 0 && (
          <div className="no-items-message">
            <p>No food items available</p>
          </div>
        )}
      </div>
        <style>{`
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

                .food-category {
                display: inline-block;
                background-color: #e2e8f0;
                color: #4a5568;
                padding: 0.25rem 0.5rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 600;
                margin-top: 0.5rem;
                }

                .add-to-cart-button {
                width: 100%;
                padding: 0.75rem;
                background: linear-gradient(to right, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                margin-top: 1rem;
                }

                .add-to-cart-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
                }

                .loading-message,
                .error-message,
                .no-items-message {
                text-align: center;
                padding: 2rem;
                font-size: 1.125rem;
                color: white;
                }

                .error-message {
                color: #fc8181;
                }
                  `}</style>

        </div>
    );
};

export default UserHome;

