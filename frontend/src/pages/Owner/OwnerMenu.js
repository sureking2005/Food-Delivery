import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 1rem',
    fontFamily: 'Arial, sans-serif'
  },
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  tabContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  tabButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  activeTab: {
    background: 'white',
    color: '#667eea'
  },
  inactiveTab: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white'
  },
  foodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    padding: '1rem'
  },
  foodCard: {
    background: 'white',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '400px', 
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15)'
    }
  },
  imageContainer: {
    width: '100%',
    height: '250px', 
    position: 'relative',
    backgroundColor: '#f7fafc',
    overflow: 'hidden'
  },
  foodImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.3s ease'
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fafc',
    color: '#a0aec0',
    fontSize: '0.875rem'
  },
  foodInfo: {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  foodName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '0.5rem',
    
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  foodDetails: {
    marginTop: 'auto'
  },
  foodPrice: {
    color: '#48bb78',
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  foodStock: {
    color: '#718096',
    fontSize: '0.875rem'
  },

  formCard: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    color: '#4a5568'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease'
  },
  submitButton: {
    width: '100%',
    padding: '0.75rem',
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  }
};

const OwnerMenu = () => {
  const [activeTab, setActiveTab] = useState('addFood');
  const [foodItem, setFoodItem] = useState({
    name: '',
    price: '',
    stock: '',
    image: null
  });
  const [existingFoods, setExistingFoods] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFoodItem(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', foodItem.name);
    formData.append('price', foodItem.price);
    formData.append('stock', foodItem.stock);
    if (foodItem.image) {
      formData.append('image', foodItem.image);
    }

    try {
      const response = await fetch('http://localhost:8000/ownermenu/', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Food item added successfully');
        setFoodItem({
          name: '',
          price: '',
          stock: '',
          image: null
        });
        fetchExistingFoods();
      } else {
        throw new Error('Failed to add food item');
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      alert('Failed to add food item');
    }
  };

  const fetchExistingFoods = async () => {
    try {
      const response = await fetch('http://localhost:8000/ownermenu/');
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      setExistingFoods(data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'existingFood') {
      fetchExistingFoods();
    }
  }, [activeTab]);

  const renderAddFoodForm = () => (
    <div style={styles.formCard}>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Food Name</label>
          <input
            type="text"
            name="name"
            value={foodItem.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Price ($)</label>
          <input
            type="number"
            name="price"
            value={foodItem.price}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Stocks</label>
          <input
            type="number"
            name="stock"
            value={foodItem.stock}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Food Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Add Food Item
        </button>
      </form>
    </div>
  );

  const renderExistingFoods = () => (
    <div style={styles.foodGrid}>
      {existingFoods.map((food, index) => (
        <div key={index} style={styles.foodCard}>
          <div style={styles.imageContainer}>
            {food.image && food.image.content ? (
              <img
                src={`data:${food.image.content_type};base64,${food.image.content}`}
                alt={food.name}
                style={styles.foodImage}
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.target.parentNode.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f7fafc; color: #a0aec0;">Image not available</div>';
                }}
              />
            ) : (
              <div style={styles.noImage}>No image available</div>
            )}
          </div>
          <div style={styles.foodInfo}>
            <h3 style={styles.foodName}>{food.name}</h3>
            <div style={styles.foodDetails}>
              <p style={styles.foodPrice}>${food.price}</p>
              <p style={styles.foodStock}>Stock: {food.stock} units</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('addFood')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'addFood' ? styles.activeTab : styles.inactiveTab)
            }}
          >
            Add Food
          </button>
          <button
            onClick={() => setActiveTab('existingFood')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'existingFood' ? styles.activeTab : styles.inactiveTab)
            }}
          >
            Existing Foods
          </button>
        </div>

        {activeTab === 'addFood' ? renderAddFoodForm() : renderExistingFoods()}
      </div>
    </div>
  );
};

export default OwnerMenu;