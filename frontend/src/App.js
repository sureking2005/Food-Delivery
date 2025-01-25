import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserGuest from './pages/UserGuest';
import UserLogin from './pages/User/UserLogin';
import UserSignup from './pages/User/UserSignup';
import UserHome from './pages/User/UserHome';
import UserForgot from './pages/User/UserForgot';
import UserReset from './pages/User/UserReset';



import DeliveryboyLogin from './pages/Deliveryboy/DeliveryboyLogin';
import DeliveryboySignup from './pages/Deliveryboy/DeliveryboySignup';
import DeliveryboyHome from './pages/Deliveryboy/DeliveryboyHome';
import DeliveryboyForgot from './pages/Deliveryboy/DeliveryboyForgot';
import DeliveryboyReset from './pages/Deliveryboy/DeliveryboyReset';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserGuest/>}/>
        <Route path="/deliveryboylogin" element={<DeliveryboyLogin/>}/>
        <Route path="/deliveryboysignup" element={<DeliveryboySignup/>}/>
        <Route path="/deliveryboyhome" element={<DeliveryboyHome/>}/>
        <Route path="/deliveryboyforgot" element={<DeliveryboyForgot/>}/>
        <Route path="/deliveryboyreset" element={<DeliveryboyReset/>}/>


        <Route path="/userlogin" element={<UserLogin/>}/>
        <Route path="/usersignup" element={<UserSignup/>}/>
        <Route path="/userhome" element={<UserHome/>}/>
        <Route path="/userforgot" element={<UserForgot/>}/>
        <Route path="/userreset" element={<UserReset/>}/>




      </Routes>
    </Router>
    
  );
}

export default App;
