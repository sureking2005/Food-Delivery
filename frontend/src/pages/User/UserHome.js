import React from 'react';
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
    return (
      <div>
        <nav>
          <button onClick={() => window.location.href = '/'}>Home</button>
          <button onClick={() => window.location.href = '/UserCart'}>Cart (0)</button>
          <button onClick={() => window.location.href = '/Userorder'}>Orders</button>
        </nav>
  
        <h1>Food Delivery App</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {foodItems.map(item => (
            <div key={item.id} style={{ margin: '10px', textAlign: 'center', width: '200px' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h2>{item.name}</h2>
              <p>${item.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default UserHome;