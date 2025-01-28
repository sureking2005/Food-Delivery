import React, { useState, useEffect } from 'react';
import axios from 'axios';

const foodItems = [
    { id: 1, name: 'Pizza', price: 10, image: '/foodimages/pizza.jpg' },
    { id: 2, name: 'Burger', price: 8, image: '/foodimages/burger.jpg' },
    { id: 3, name: 'Sushi', price: 12, image: '/foodimages/sushi.jpg' },
    { id: 4, name: 'Pasta', price: 9, image: '/foodimages/pasta.jpg' },
  ];

function UserHome() {
    const [email, setEmail] = useState('');
    const [cartItems, setCartItems] = useState(0);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleAddToCart = async (item) => {
        try {
            const response = await axios.post('http://localhost:8000/addcart/', {
                email,
                item: {
                    id: item.id,
                    name: item.name,
                    price: item.price
                }
            });

            if (response.data.message === 'Item Added to Cart') {
                setCartItems(prevCount => prevCount + 1);
            }
        } catch (error) {
            alert('Failed to add item to cart');
        }
    };

    return (
        <div>
            <nav>
                <p>Welcome, {email}</p>
                <button onClick={() => window.location.href = '/'}>Home</button>
                <button onClick={() => window.location.href = '/UserCart'}>Cart ({cartItems})</button>
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
                        <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserHome;