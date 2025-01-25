import React, { useState } from 'react';
import pizzaImage from '../foodimages/pizza.jpg';
import burgerImage from '../foodimages/burger.jpg';
import sushiImage from '../foodimages/sushi.jpg';
import pastaImage from '../foodimages/pasta.jpg';

const foodItems = [
  { id: 1, name: 'Pizza', price: 10, image: pizzaImage },
  { id: 2, name: 'Burger', price: 8, image: burgerImage },
  { id: 3, name: 'Sushi', price: 12, image: sushiImage },
  { id: 4, name: 'Pasta', price: 9, image: pastaImage },
];

function UserHome() {
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div>
            <h1>Food Delivery App</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              {foodItems.map(item => (
                <div key={item.id} style={{margin: '10px', textAlign: 'center', width: '200px'}}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{width: '150px', height: '150px', objectFit: 'cover'}}
                  />
                  <h2>{item.name}</h2>
                  <p>${item.price}</p>
                  <button onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'cart':
        return (
          <div>
            <h1>Cart</h1>
            {cart.map(item => (
              <div key={item.id}>
                {item.name} - ${item.price}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
            <p>Total: ${cart.reduce((sum, item) => sum + item.price, 0)}</p>
          </div>
        );
      case 'orders':
        return <div><h1>Orders</h1></div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('cart')}>Cart ({cart.length})</button>
        <button onClick={() => setCurrentPage('orders')}>Orders</button>
      </nav>
      {renderContent()}
    </div>
  );
}

export default UserHome;