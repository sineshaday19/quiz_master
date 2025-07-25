import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Register, Login, Dashboard, Profile, QuizTake, QuizResults } from './pages';
import Contact from './pages/Contact';
import Header from './Header';
import { AuthProvider, useAuth } from './AuthContext';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateQuiz from './pages/CreateQuiz';
// import EditQuiz and ViewQuiz (to be created next)
import EditQuiz from './pages/EditQuiz';
import ViewQuiz from './pages/ViewQuiz';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role === 'instructor' && user.role !== 'Instructor') return <Navigate to="/dashboard" />;
  if (role === 'student' && user.role !== 'Student') return <Navigate to="/instructor-dashboard" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;
  // Redirect to correct dashboard based on role
  if (user.role === 'Instructor') return <Navigate to="/instructor-dashboard" />;
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute role="student"><Dashboard /></PrivateRoute>} />
          <Route path="/instructor-dashboard" element={<PrivateRoute role="instructor"><InstructorDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/quiz/:id/take" element={<PrivateRoute><QuizTake /></PrivateRoute>} />
          <Route path="/quiz/:id/results/:attemptId" element={<PrivateRoute><QuizResults /></PrivateRoute>} />
          <Route path="/quiz-results" element={<PrivateRoute><QuizResults /></PrivateRoute>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create-quiz" element={<PrivateRoute role="instructor"><CreateQuiz /></PrivateRoute>} />
          <Route path="/edit-quiz/:id" element={<PrivateRoute role="instructor"><EditQuiz /></PrivateRoute>} />
          <Route path="/view-quiz/:id" element={<PrivateRoute role="instructor"><ViewQuiz /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 