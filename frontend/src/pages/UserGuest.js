import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserGuest = () => {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate('/userlogin');
  };

  const handleDeliveryLogin = () => {
    navigate('/deliveryboylogin');
  };

  return (
    <div>
      <nav>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={handleUserLogin}>Customer Login/Signup</button>
        <button onClick={handleDeliveryLogin}>Deliveryboy Login/Signup</button>

      </nav>
      Guest
    </div>
  );
};

export default UserGuest;