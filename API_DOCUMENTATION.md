# QuizMaster API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication System](#authentication-system)
3. [Core Components](#core-components)
4. [Page Components](#page-components)
5. [Data Models](#data-models)
6. [Storage APIs](#storage-apis)
7. [Routing System](#routing-system)
8. [Usage Examples](#usage-examples)

## Overview

QuizMaster is a React-based quiz management system that allows instructors to create quizzes and students to take them. The application uses localStorage for data persistence and includes authentication, routing, and responsive design.

### Technology Stack
- **Frontend**: React 19.1.0
- **Routing**: React Router DOM 7.7.0
- **Animations**: Framer Motion 12.23.9
- **Testing**: React Testing Library
- **Storage**: localStorage (mock backend)

## Authentication System

### AuthContext API

The authentication system is built using React Context and provides user management functionality.

#### AuthProvider Component
```jsx
import { AuthProvider } from './AuthContext';

// Usage
<AuthProvider>
  <App />
</AuthProvider>
```

**Props**: 
- `children`: React nodes to wrap with authentication context

#### useAuth Hook
```jsx
import { useAuth } from './AuthContext';

const { user, login, logout } = useAuth();
```

**Returns**:
- `user`: Current user object `{ email: string, role: 'Student' | 'Instructor' }`
- `login(email, password, role)`: Function to authenticate user
- `logout()`: Function to clear user session

**Example**:
```jsx
const LoginComponent = () => {
  const { login, user } = useAuth();
  
  const handleLogin = () => {
    login('user@example.com', 'password', 'Student');
  };
  
  return (
    <div>
      {user ? `Welcome ${user.email}` : 'Please login'}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
```

## Core Components

### Header Component

Main navigation component with search functionality and user menu.

#### Props
None (uses authentication context internally)

#### Features
- **Navigation Links**: Home, Contact, Login/Register (when not authenticated)
- **Search Bar**: Real-time search with dropdown results
- **Quiz Dropdown**: Quick access to quiz-related pages
- **User Menu**: Profile and logout options

#### Usage
```jsx
import Header from './Header';

<Header />
```

#### Search API
The Header component includes a mock search system:

```jsx
// Search results structure
{
  quizzes: [{ id: number, name: string, type: 'quiz' }],
  classes: [{ id: number, name: string, type: 'class' }],
  students: [{ id: number, name: string, type: 'student' }]
}
```

### Route Protection Components

#### PrivateRoute
Protects routes that require authentication and specific roles.

```jsx
<PrivateRoute role="instructor">
  <InstructorDashboard />
</PrivateRoute>
```

**Props**:
- `children`: Component to render if authorized
- `role`: Optional role requirement ('student' | 'instructor')

#### PublicRoute
Redirects authenticated users to appropriate dashboards.

```jsx
<PublicRoute>
  <Login />
</PublicRoute>
```

**Props**:
- `children`: Component to render if not authenticated

## Page Components

### Home Component

Landing page with feature showcase and animations.

#### Features
- Animated hero section
- Feature cards with hover effects
- Responsive design
- Background image with blur effect

#### Usage
```jsx
import Home from './pages/Home';

<Route path="/" element={<Home />} />
```

### Dashboard Component (Student)

Student dashboard showing available quizzes and progress.

#### Features
- **Quiz List**: Shows available quizzes with deadlines
- **Progress Tracking**: Completion percentage
- **Upcoming Deadlines**: Quizzes due within 7 days
- **Quick Actions**: Start quiz, view results

#### Data Dependencies
- `quizzes`: Array of quiz objects from localStorage
- `quizAttempts`: Array of student attempts from localStorage

#### Usage
```jsx
import Dashboard from './pages/Dashboard';

<Route path="/dashboard" element={
  <PrivateRoute role="student">
    <Dashboard />
  </PrivateRoute>
} />
```

### InstructorDashboard Component

Instructor dashboard for managing quizzes and viewing analytics.

#### Features
- **Quiz Management**: Create, edit, delete quizzes
- **Student Analytics**: View quiz performance
- **Message Center**: Handle student inquiries
- **Quick Stats**: Overview of quiz activity

#### API Methods
```jsx
// Delete quiz
const deleteQuiz = (index) => {
  const updated = quizzes.filter((_, i) => i !== index);
  localStorage.setItem('quizzes', JSON.stringify(updated));
  setQuizzes(updated);
};
```

### CreateQuiz Component

Interface for creating new quizzes with dynamic question management.

#### Features
- **Dynamic Questions**: Add/remove questions and options
- **Form Validation**: Ensures all required fields are completed
- **Rich Question Types**: Multiple choice with configurable options
- **Deadline Management**: Set quiz expiration dates

#### API Interface
```jsx
// Quiz creation data structure
const quiz = {
  title: string,
  description: string,
  category: string,
  questions: [
    {
      question: string,
      options: string[],
      correct: number // index of correct option
    }
  ],
  deadline: string // ISO date string
};
```

#### Usage Example
```jsx
import CreateQuiz from './pages/CreateQuiz';

// Form handlers
const handleQuestionChange = (idx, field, value) => {
  setQuestions(qs => qs.map((q, i) => 
    i === idx ? { ...q, [field]: value } : q
  ));
};

const addQuestion = () => {
  setQuestions(qs => [...qs, { 
    question: '', 
    options: ['', ''], 
    correct: 0 
  }]);
};
```

### QuizTake Component

Interactive quiz-taking interface with navigation and progress tracking.

#### Features
- **Question Navigation**: Previous/Next with smooth animations
- **Answer Selection**: Multiple choice with visual feedback
- **Progress Indicator**: Shows current question and total
- **Auto-save**: Saves answers as user progresses
- **Submission**: Calculates score and saves attempt

#### Props (from URL params)
- `id`: Quiz identifier from route parameter

#### API Methods
```jsx
// Answer selection
const handleSelect = (optionIndex) => {
  setAnswers(ans => {
    const copy = [...ans];
    copy[currentQuestion] = optionIndex;
    return copy;
  });
};

// Submit quiz
const handleSubmit = () => {
  const attempt = {
    quizId: id,
    answers: answers,
    score: calculateScore(),
    timestamp: new Date().toISOString(),
    attemptId: Date.now().toString()
  };
  
  const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
  localStorage.setItem('quizAttempts', JSON.stringify([attempt, ...attempts]));
};
```

### Login Component

User authentication interface with role selection.

#### Features
- **Email Validation**: Real-time email format validation
- **Password Validation**: Minimum length requirements
- **Role Selection**: Student or Instructor
- **Form State Management**: Touch states and validation feedback

#### Validation API
```jsx
// Email validation
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Form validation states
const validEmail = validateEmail(email);
const validPassword = password.length >= 4;
const allValid = validEmail && validPassword;
```

### Register Component

User registration with comprehensive form validation.

#### Features
- **Multi-step Validation**: Real-time field validation
- **Password Confirmation**: Matching password verification
- **Role Persistence**: Saves role preference to localStorage
- **Comprehensive Validation**: Name, email, password, role

### Profile Component

User profile management interface.

#### Features
- **Profile Information**: Display and edit user details
- **Quiz History**: View past quiz attempts
- **Settings Management**: Update preferences
- **Activity Tracking**: Recent activity overview

### Contact Component

Contact form for user inquiries and support.

#### Features
- **Message Categories**: Different inquiry types
- **Form Validation**: Required field validation
- **Message Storage**: Saves to localStorage for instructor review
- **Responsive Design**: Mobile-friendly interface

#### Message API
```jsx
// Message structure
const message = {
  name: string,
  email: string,
  subject: string,
  message: string,
  category: 'general' | 'technical' | 'feedback',
  timestamp: string,
  id: string
};

// Save message
const messages = JSON.parse(localStorage.getItem('messages') || '[]');
localStorage.setItem('messages', JSON.stringify([message, ...messages]));
```

## Data Models

### Quiz Model
```typescript
interface Quiz {
  title: string;
  description: string;
  category: string;
  questions: Question[];
  deadline: string; // ISO date string
}
```

### Question Model
```typescript
interface Question {
  question: string;
  options: string[];
  correct: number; // index of correct option
}
```

### User Model
```typescript
interface User {
  email: string;
  role: 'Student' | 'Instructor';
  name?: string;
}
```

### Quiz Attempt Model
```typescript
interface QuizAttempt {
  quizId: string;
  answers: number[]; // indices of selected options
  score: number;
  timestamp: string;
  attemptId: string;
}
```

### Message Model
```typescript
interface Message {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: 'general' | 'technical' | 'feedback';
  timestamp: string;
  id: string;
}
```

## Storage APIs

The application uses localStorage for data persistence. Here are the key storage patterns:

### Quiz Storage
```jsx
// Save quiz
const saveQuiz = (quiz) => {
  const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
  localStorage.setItem('quizzes', JSON.stringify([quiz, ...quizzes]));
};

// Get all quizzes
const getQuizzes = () => {
  return JSON.parse(localStorage.getItem('quizzes') || '[]');
};

// Update quiz
const updateQuiz = (index, updatedQuiz) => {
  const quizzes = getQuizzes();
  quizzes[index] = updatedQuiz;
  localStorage.setItem('quizzes', JSON.stringify(quizzes));
};

// Delete quiz
const deleteQuiz = (index) => {
  const quizzes = getQuizzes();
  const updated = quizzes.filter((_, i) => i !== index);
  localStorage.setItem('quizzes', JSON.stringify(updated));
};
```

### Quiz Attempts Storage
```jsx
// Save attempt
const saveAttempt = (attempt) => {
  const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
  localStorage.setItem('quizAttempts', JSON.stringify([attempt, ...attempts]));
};

// Get user attempts
const getUserAttempts = (userEmail) => {
  const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
  return attempts.filter(attempt => attempt.userEmail === userEmail);
};
```

### Message Storage
```jsx
// Save message
const saveMessage = (message) => {
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  localStorage.setItem('messages', JSON.stringify([message, ...messages]));
};

// Get all messages
const getMessages = () => {
  return JSON.parse(localStorage.getItem('messages') || '[]');
};
```

## Routing System

The application uses React Router for navigation with role-based access control.

### Route Configuration
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router>
  <Header />
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/contact" element={<Contact />} />
    
    {/* Student Routes */}
    <Route path="/dashboard" element={
      <PrivateRoute role="student"><Dashboard /></PrivateRoute>
    } />
    <Route path="/quiz/:id/take" element={
      <PrivateRoute><QuizTake /></PrivateRoute>
    } />
    <Route path="/quiz/:id/results/:attemptId" element={
      <PrivateRoute><QuizResults /></PrivateRoute>
    } />
    
    {/* Instructor Routes */}
    <Route path="/instructor-dashboard" element={
      <PrivateRoute role="instructor"><InstructorDashboard /></PrivateRoute>
    } />
    <Route path="/create-quiz" element={
      <PrivateRoute role="instructor"><CreateQuiz /></PrivateRoute>
    } />
    <Route path="/edit-quiz/:id" element={
      <PrivateRoute role="instructor"><EditQuiz /></PrivateRoute>
    } />
    <Route path="/view-quiz/:id" element={
      <PrivateRoute role="instructor"><ViewQuiz /></PrivateRoute>
    } />
    
    {/* Shared Routes */}
    <Route path="/profile" element={
      <PrivateRoute><Profile /></PrivateRoute>
    } />
  </Routes>
</Router>
```

### Navigation Helpers
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to quiz
const goToQuiz = (quizId) => {
  navigate(`/quiz/${quizId}/take`);
};

// Navigate to results
const goToResults = (quizId, attemptId) => {
  navigate(`/quiz/${quizId}/results/${attemptId}`);
};

// Navigate back
const goBack = () => {
  navigate(-1);
};
```

## Usage Examples

### Complete Quiz Creation Flow
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizCreationExample = () => {
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    category: '',
    questions: [
      {
        question: '',
        options: ['', ''],
        correct: 0
      }
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });
  
  const navigate = useNavigate();
  
  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: '',
        options: ['', ''],
        correct: 0
      }]
    }));
  };
  
  const updateQuestion = (index, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };
  
  const saveQuiz = () => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    localStorage.setItem('quizzes', JSON.stringify([quiz, ...quizzes]));
    navigate('/instructor-dashboard');
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); saveQuiz(); }}>
      {/* Quiz form implementation */}
    </form>
  );
};
```

### Quiz Taking Flow
```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QuizTakingExample = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  useEffect(() => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const selectedQuiz = quizzes[parseInt(id)];
    setQuiz(selectedQuiz);
    setAnswers(new Array(selectedQuiz?.questions.length).fill(null));
  }, [id]);
  
  const selectAnswer = (optionIndex) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = optionIndex;
      return newAnswers;
    });
  };
  
  const submitQuiz = () => {
    const attempt = {
      quizId: id,
      answers: answers,
      score: calculateScore(quiz, answers),
      timestamp: new Date().toISOString(),
      attemptId: Date.now().toString()
    };
    
    const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    localStorage.setItem('quizAttempts', JSON.stringify([attempt, ...attempts]));
    
    navigate(`/quiz/${id}/results/${attempt.attemptId}`);
  };
  
  const calculateScore = (quiz, answers) => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };
  
  if (!quiz) return <div>Loading...</div>;
  
  return (
    <div>
      {/* Quiz taking interface */}
    </div>
  );
};
```

### Authentication Integration
```jsx
import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const AuthenticatedComponent = () => {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const handleLogout = () => {
    logout();
    // User will be redirected to home page by AuthContext
  };
  
  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
      
      {user.role === 'Instructor' && (
        <div>
          <h2>Instructor Actions</h2>
          <button onClick={() => navigate('/create-quiz')}>
            Create New Quiz
          </button>
        </div>
      )}
      
      {user.role === 'Student' && (
        <div>
          <h2>Student Actions</h2>
          <button onClick={() => navigate('/dashboard')}>
            View Available Quizzes
          </button>
        </div>
      )}
    </div>
  );
};
```

### Data Management Utilities
```jsx
// Utility functions for data management
export const QuizUtils = {
  // Get all quizzes
  getAllQuizzes: () => {
    return JSON.parse(localStorage.getItem('quizzes') || '[]');
  },
  
  // Get quiz by ID
  getQuizById: (id) => {
    const quizzes = QuizUtils.getAllQuizzes();
    return quizzes[parseInt(id)];
  },
  
  // Filter active quizzes (not expired)
  getActiveQuizzes: () => {
    const quizzes = QuizUtils.getAllQuizzes();
    const now = new Date();
    return quizzes.filter(quiz => 
      !quiz.deadline || new Date(quiz.deadline) >= now
    );
  },
  
  // Get user's quiz attempts
  getUserAttempts: (userId) => {
    const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    return attempts.filter(attempt => attempt.userId === userId);
  },
  
  // Calculate quiz statistics
  getQuizStats: (quizId) => {
    const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    const quizAttempts = attempts.filter(attempt => attempt.quizId === quizId);
    
    if (quizAttempts.length === 0) {
      return { totalAttempts: 0, averageScore: 0, highestScore: 0 };
    }
    
    const scores = quizAttempts.map(attempt => attempt.score);
    return {
      totalAttempts: quizAttempts.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      highestScore: Math.max(...scores)
    };
  }
};
```

## Error Handling

The application includes basic error handling patterns:

### Form Validation
```jsx
const [errors, setErrors] = useState({});

const validateForm = (data) => {
  const newErrors = {};
  
  if (!data.title.trim()) {
    newErrors.title = 'Title is required';
  }
  
  if (!data.description.trim()) {
    newErrors.description = 'Description is required';
  }
  
  if (data.questions.some(q => !q.question.trim())) {
    newErrors.questions = 'All questions must have text';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Route Protection
```jsx
const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};
```

This documentation provides comprehensive coverage of all public APIs, components, and functionality in the QuizMaster application. Each section includes practical examples and usage instructions to help developers understand and extend the system.