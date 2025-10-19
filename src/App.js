import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Components
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Foods from './pages/Foods/Foods';
import Cart from './pages/Cart/Cart';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Orders from './pages/Orders/Orders';
import Dashboard from './pages/Admin/Dashboard';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import './assets/css/App.css';
import Profile from './pages/Profile/Profile';

// Configure message globally
message.config({
  top: 80,
  duration: 3,
  maxCount: 3,
});

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#ff6b6b',
          borderRadius: 8,
          fontFamily: 'Poppins, sans-serif',
        },
      }}
    >
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/foods" element={<Foods />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;


