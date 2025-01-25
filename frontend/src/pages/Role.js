import React from 'react';
import { useNavigate } from 'react-router-dom';

const Role = () => {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    navigate('/userguest');
  };

  const handleDeliveryBoyClick = () => {
    navigate('/deliveryboylogin');
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <button onClick={handleCustomerClick}>Customer</button>
      <button onClick={handleDeliveryBoyClick}>Delivery Boy</button>
    </div>
  );
};

export default Role;