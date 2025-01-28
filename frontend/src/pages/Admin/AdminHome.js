import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminHome = () => {
  const [activeView, setActiveView] = useState('hotels');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      let endpoint;
      switch(activeView) {
        case 'hotels':
          endpoint = 'adminhome';
          break;
        case 'users':
          endpoint = 'adminusers';
          break;
        case 'owners':
          endpoint = 'adminowners';
          break;
        case 'delivery':
          endpoint = 'admindelivery';
          break;
        default:
          endpoint = 'adminhome';
      }
      
      const response = await axios.get(`http://localhost:8000/${endpoint}/`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [activeView]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  const handleStatusUpdate = async (hotelEmail, newStatus) => {
    try {
      await axios.post(`http://localhost:8000/adminhomeupdate/`, {
        hotel_email: hotelEmail,
        status: newStatus
      });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const navigationStyle = {
    display: 'flex',
    gap: '10px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    marginBottom: '20px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#e9ecef',
    color: '#212529'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#0d6efd',
    color: 'white'
  };

  const renderHotelsTable = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f3f4f6' }}>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Hotel Name</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Owner Name</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Address</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Number</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Menu</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((hotel, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.hotel_name}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.owner_name}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.hotel_address}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.hotel_email}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.hotel_number}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.food_menu}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.status}</td>
              {hotel.status === 'in_review' && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate(hotel.hotel_email, 'accepted')}
                    style={{ 
                      marginRight: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(hotel.hotel_email, 'rejected')}
                    style={{ 
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
            
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderUsersTable = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f3f4f6' }}>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Phone</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.phone}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOwnersTable = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f3f4f6' }}>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Owner Name</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Hotel Name</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Phone</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Role</th>

        </tr>
      </thead>
      <tbody>
        {data.map((owner, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{owner.owner_name}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{owner.hotel_name}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{owner.email}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{owner.phone}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{owner.status}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{owner.role}</td>

          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderDeliveryTable = () => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f3f4f6' }}>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Phone</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Vehicle Type</th>
          <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((delivery, index) => (
          <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{delivery.name}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{delivery.email}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{delivery.phone}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{delivery.vehicle_type}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{delivery.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderView = () => {
    switch(activeView) {
      case 'hotels':
        return renderHotelsTable();
      case 'users':
        return renderUsersTable();
      case 'owners':
        return renderOwnersTable();
      case 'delivery':
        return renderDeliveryTable();
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={navigationStyle}>
        <button 
          style={activeView === 'hotels' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveView('hotels')}
        >
          Hotel Registrations
        </button>
        <button 
          style={activeView === 'users' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveView('users')}
        >
          User Details
        </button>
        <button 
          style={activeView === 'owners' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveView('owners')}
        >
          Owner Details
        </button>
        <button 
          style={activeView === 'delivery' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveView('delivery')}
        >
          Delivery Boy Details
        </button>
      </div>
      <div style={{ padding: '20px' }}>
        {renderView()}
      </div>
    </div>
  );
};

export default AdminHome;