import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import './App.css';

function AppRoutes() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('chat_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('chat_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="dashboard"
          element={
            user ? (
              <Dashboard user={user} />
            ) : (
              <Login
                onLoginSuccess={(u) => {
                  setUser(u);
                  navigate('/dashboard');
                }}
              />
            )
          }
        />
        <Route
          path="login"
          element={
            user ? (
              <Dashboard user={user} />
            ) : (
              <Login
                onLoginSuccess={(u) => {
                  setUser(u);
                  navigate('/dashboard');
                }}
              />
            )
          }
        />
        <Route path="register" element={user ? <Dashboard user={user} /> : <Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
