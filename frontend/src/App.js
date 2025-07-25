import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Register, Login, Dashboard, Profile, QuizTake, QuizResults } from './pages';
import Contact from './pages/Contact';
import Header from './Header';
import { AuthProvider, useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/quiz/results/:attemptId" element={<PrivateRoute><QuizResults /></PrivateRoute>} />
          <Route path="/quiz/:id/take" element={<PrivateRoute><QuizTake /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 