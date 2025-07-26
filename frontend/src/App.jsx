import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import RegistrationForm from './comps/Register';
import LoginForm from './comps/Login';
import NotFound from './comps/NotFound';
import Dashboard from './comps/Dashboard';
import 'react-toastify/dist/ReactToastify.css';
import QuizLandingPage from './page/HomePage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when component mounts
    const user = JSON.parse(localStorage.getItem('user'));
    const authStatus = localStorage.getItem('isAuthenticated');

    if (user && authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<QuizLandingPage/>}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <RegistrationForm />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;