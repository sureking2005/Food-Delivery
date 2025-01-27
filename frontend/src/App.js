import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserGuest from './pages/UserGuest';
import UserLogin from './pages/User/UserLogin';
import UserSignup from './pages/User/UserSignup';
import UserHome from './pages/User/UserHome';
import UserForgot from './pages/User/UserForgot';
import UserReset from './pages/User/UserReset';
import UserCart from './pages/User/UserCart';

import AdminLogin from './pages/Admin/AdminLogin';
import AdminSignup from './pages/Admin/AdminSignup';
import AdminHome from './pages/Admin/AdminHome';
import AdminForgot from './pages/Admin/AdminForgot';
import AdminReset from './pages/Admin/AdminReset';


import DeliveryboyLogin from './pages/Deliveryboy/DeliveryboyLogin';
import DeliveryboySignup from './pages/Deliveryboy/DeliveryboySignup';
import DeliveryboyHome from './pages/Deliveryboy/DeliveryboyHome';
import DeliveryboyForgot from './pages/Deliveryboy/DeliveryboyForgot';
import DeliveryboyReset from './pages/Deliveryboy/DeliveryboyReset';

import OwnerLogin from './pages/Owner/OwnerLogin';
import OwnerSignup from './pages/Owner/OwnerSignup';
import OwnerHome from './pages/Owner/OwnerHome';
import OwnerForgot from './pages/Owner/OwnerForgot';
import OwnerReset from './pages/Owner/OwnerReset';




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
        <Route path="/usercart" element={<UserCart/>}/>


        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/adminsignup" element={<AdminSignup/>}/>
        <Route path="/adminhome" element={<AdminHome/>}/>
        <Route path="/adminforgot" element={<AdminForgot/>}/>
        <Route path="/adminreset" element={<AdminReset/>}/>

        <Route path="/ownerlogin" element={<OwnerLogin/>}/>
        <Route path="/ownersignup" element={<OwnerSignup/>}/>
        <Route path="/ownerhome" element={<OwnerHome/>}/>
        <Route path="/ownerforgot" element={<OwnerForgot/>}/>
        <Route path="/ownerreset" element={<OwnerReset/>}/>




      </Routes>
    </Router>
    
  );
}

export default App;
