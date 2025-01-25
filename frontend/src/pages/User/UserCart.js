import React, { useState, useEffect } from 'react';

function UserCart() {
  const [cartItems, setCartItems] = useState([]); // State to hold cart items
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch cart items from the backend
  useEffect(() => {
    async function fetchCartItems() {
      try {
        const response = await fetch('/cart'); // Replace '/cart' with your backend endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const data = await response.json();
        setCartItems(data); // Update the state with the cart items
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    }

    fetchCartItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ margin: '10px', textAlign: 'center', width: '200px' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h2>{item.name}</h2>
              <p>${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserCart;
