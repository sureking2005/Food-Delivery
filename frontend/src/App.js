import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Role  from './pages/Role';
import UserGuest from './pages/UserGuest';
import DeliveryboyLogin from './pages/Deliveryboy/DeliveryboyLogin';
import UserHome from './pages/User/UserHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Role/>}/>
        <Route path="/userguest" element={<UserGuest/>}/>
        <Route path="/deliveryboylogin" element={<DeliveryboyLogin/>}/>
        <Route path="/userhome" element={<UserHome/>}/>


      </Routes>
    </Router>
    
  );
}

export default App;
