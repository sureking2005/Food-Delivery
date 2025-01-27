import React from 'react';
import { useNavigate } from 'react-router-dom';


const foodItems = [
  { id: 1, name: 'Pizza', price: 10, image: '/foodimages/pizza.jpg' },
  { id: 2, name: 'Burger', price: 8, image: '/foodimages/burger.jpg' },
  { id: 3, name: 'Sushi', price: 12, image: '/foodimages/sushi.jpg' },
  { id: 4, name: 'Pasta', price: 9, image: '/foodimages/pasta.jpg' },
];

const GuestUserHome = () => {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate('/userlogin');
  };

  const handleDeliveryLogin = () => {
    navigate('/deliveryboylogin');
  };

  const handleAdminLogin = () => {
    navigate('/adminlogin');
  };

  const handleOwnerLogin = () => {
    navigate('/ownerlogin');
  };
  

  return (
    <div>
      <nav>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={handleAdminLogin}>Admin Login</button>
        <button onClick={handleOwnerLogin}>Owner Login/Signup</button>
        <button onClick={handleUserLogin}>Customer Login/Signup</button>
        <button onClick={handleDeliveryLogin}>Deliveryboy Login/Signup</button>

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
            <button onClick={handleUserLogin}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestUserHome;
