import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserGuest from './pages/UserGuest';
import UserLogin from './pages/User/UserLogin';
import UserSignup from './pages/User/UserSignup';
import UserHome from './pages/User/UserHome';



import DeliveryboyLogin from './pages/Deliveryboy/DeliveryboyLogin';
import DeliveryboySignup from './pages/Deliveryboy/DeliveryboySignup';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserGuest/>}/>
        <Route path="/deliveryboylogin" element={<DeliveryboyLogin/>}/>
        <Route path="/deliveryboysignup" element={<DeliveryboySignup/>}/>


        <Route path="/userlogin" element={<UserLogin/>}/>
        <Route path="/usersignup" element={<UserSignup/>}/>
        <Route path="/userhome" element={<UserHome/>}/>



      </Routes>
    </Router>
    
  );
}

export default App;
