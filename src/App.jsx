import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { setAuthToken } from './services/api';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = searchParams.get('token');
    const userFromUrl = searchParams.get('user');

    if (tokenFromUrl && userFromUrl) {
      try {
        const userData = JSON.parse(userFromUrl);
        localStorage.setItem('jwtToken', tokenFromUrl);
        localStorage.setItem('user', userFromUrl);
        setAuthToken(tokenFromUrl);
        setToken(tokenFromUrl);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data from URL:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const savedToken = localStorage.getItem('jwtToken');
      const savedUserString = localStorage.getItem('user');

      if (savedToken && savedUserString) {
        try {
          const savedUser = JSON.parse(savedUserString);
          setToken(savedToken);
          setUser(savedUser);
          setAuthToken(savedToken);
        } catch (error) {
          console.error("Error parsing saved user data:", error);
          localStorage.removeItem('user');
          localStorage.removeItem('jwtToken');
        }
      }
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {token && user ? (
            <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
          ) : (
            <Route path="/dashboard" element={<Navigate to="/login" />} />
          )}

          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
