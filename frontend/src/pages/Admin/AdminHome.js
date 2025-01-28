import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminHome = () => {
  const [activeView, setActiveView] = useState('hotels');
  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeView === 'hotels') {
      fetchHotelData();
    }
  }, [activeView]);

  const fetchHotelData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/adminhome/');
      setHotelData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (hotelEmail, newStatus) => {
    try {
      await axios.post(`http://localhost:8000/adminhomeupdate/`, {
        hotel_email: hotelEmail,
        status: newStatus
      });
      fetchHotelData();
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

  const renderView = () => {
    switch(activeView) {
      case 'hotels':
        return (
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
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotelData.map((hotel, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.hotel_name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.owner_name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.hotel_address}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.hotel_email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.hotel_number}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.food_menu}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hotel.status}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'users':
        return <div>User Details Content</div>;
      case 'owners':
        return <div>Owner Details Content</div>;
      case 'delivery':
        return <div>Delivery Boy Details Content</div>;
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