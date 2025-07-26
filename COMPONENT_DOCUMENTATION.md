# QuizMaster Component Documentation

## Table of Contents
1. [Component Architecture](#component-architecture)
2. [Core Components](#core-components)
3. [Page Components](#page-components)
4. [Component Props Reference](#component-props-reference)
5. [State Management](#state-management)
6. [Component Testing](#component-testing)

## Component Architecture

The QuizMaster application follows a hierarchical component structure with clear separation of concerns:

```
App
├── AuthProvider (Context)
├── Router
├── Header (Navigation)
└── Routes
    ├── Public Routes (Home, Login, Register, Contact)
    ├── Student Routes (Dashboard, QuizTake, QuizResults)
    ├── Instructor Routes (InstructorDashboard, CreateQuiz, EditQuiz)
    └── Shared Routes (Profile)
```

## Core Components

### App Component

**File**: `frontend/src/App.js`

Main application component that sets up routing and authentication.

#### Structure
```jsx
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Route definitions */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

#### Key Features
- Wraps entire app with authentication context
- Defines all application routes
- Implements route protection with PrivateRoute and PublicRoute
- Handles role-based redirects

#### Route Protection Components

##### PrivateRoute
```jsx
const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role === 'instructor' && user.role !== 'Instructor') 
    return <Navigate to="/dashboard" />;
  if (role === 'student' && user.role !== 'Student') 
    return <Navigate to="/instructor-dashboard" />;
  return children;
};
```

**Props**:
- `children` (ReactNode): Component to render if authorized
- `role` (string, optional): Required role ('student' | 'instructor')

##### PublicRoute
```jsx
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;
  if (user.role === 'Instructor') return <Navigate to="/instructor-dashboard" />;
  return <Navigate to="/dashboard" />;
};
```

**Props**:
- `children` (ReactNode): Component to render if not authenticated

### AuthProvider Component

**File**: `frontend/src/AuthContext.js`

Context provider for authentication state management.

#### State
```jsx
const [user, setUser] = useState(null);
```

#### Methods
```jsx
const login = (email, password, role = 'Student') => {
  console.log('AuthContext login called with:', email, password, role);
  setUser({ email, role });
};

const logout = () => setUser(null);
```

#### Context Value
```jsx
{
  user: User | null,
  login: (email: string, password: string, role?: string) => void,
  logout: () => void
}
```

#### Usage Example
```jsx
import { useAuth } from './AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Header Component

**File**: `frontend/src/Header.js`

Main navigation component with search and user menu functionality.

#### State
```jsx
const [dropdownOpen, setDropdownOpen] = useState(false);
const [search, setSearch] = useState('');
const [searching, setSearching] = useState(false);
const [searchResults, setSearchResults] = useState(null);
const [showDropdown, setShowDropdown] = useState(false);
const [showDropdownSearch, setShowDropdownSearch] = useState(false);
const [filter, setFilter] = useState('all');
```

#### Key Methods
```jsx
const handleSearch = (e) => {
  const value = e.target.value;
  setSearch(value);
  setShowDropdown(!!value);
  setSearching(true);
  
  clearTimeout(searchTimeout.current);
  searchTimeout.current = setTimeout(() => {
    // Mock search results
    setSearchResults(value ? {
      quizzes: [/* quiz results */],
      classes: [/* class results */],
      students: [/* student results */]
    } : null);
    setSearching(false);
  }, 600);
};

const handleResultClick = (result) => {
  setShowDropdown(false);
  setSearch('');
  // Navigate based on result type
  if (result.type === 'quiz') navigate(`/dashboard?quiz=${result.id}`);
  else if (result.type === 'class') navigate(`/dashboard?class=${result.id}`);
  else if (result.type === 'student') navigate(`/dashboard?student=${result.id}`);
};
```

#### Features
- **Responsive Navigation**: Adapts to different screen sizes
- **Real-time Search**: Debounced search with loading states
- **Dropdown Menus**: Quiz actions and search results
- **User Authentication State**: Shows different options based on login status
- **Role-based Navigation**: Different options for students vs instructors

#### Search Results Structure
```jsx
{
  quizzes: [
    { id: number, name: string, type: 'quiz' }
  ],
  classes: [
    { id: number, name: string, type: 'class' }
  ],
  students: [
    { id: number, name: string, type: 'student' }
  ]
}
```

## Page Components

### Home Component

**File**: `frontend/src/pages/Home.js`

Landing page with animated feature showcase.

#### Features
- **Framer Motion Animations**: Smooth page transitions and element animations
- **Feature Cards**: Interactive cards showcasing app capabilities
- **Background Effects**: Blurred background image with overlay
- **Responsive Design**: Mobile-friendly layout

#### Animation Configuration
```jsx
// Page animation
<motion.div
  initial={{ opacity: 0, y: 32 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 32 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>

// Feature card animations
<motion.div
  style={featureCard}
  whileHover={{ scale: 1.05, boxShadow: '0 4px 24px rgba(79,70,229,0.12)' }}
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
>
```

#### Feature Data Structure
```jsx
const features = [
  {
    icon: 'quizicon.png',
    title: 'Easy Quiz Creation',
    desc: 'Build quizzes with multiple question types in just a few clicks.'
  },
  // ... more features
];
```

### Dashboard Component (Student)

**File**: `frontend/src/pages/Dashboard.js`

Student dashboard showing available quizzes and progress tracking.

#### State Management
```jsx
const [quizzes, setQuizzes] = useState([]);
const [progress, setProgress] = useState(0);
const [upcoming, setUpcoming] = useState([]);
```

#### Data Loading
```jsx
useEffect(() => {
  let quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
  const now = new Date();
  
  // Filter expired quizzes
  quizzes = quizzes.filter(q => !q.deadline || new Date(q.deadline) >= now);
  localStorage.setItem('quizzes', JSON.stringify(quizzes));
  setQuizzes(quizzes);
  
  // Calculate progress
  const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
  const attemptedQuizIds = new Set(attempts.map(a => a.quizId));
  const completed = quizzes.filter((q, i) => attemptedQuizIds.has(i.toString())).length;
  setProgress(quizzes.length ? Math.round((completed / quizzes.length) * 100) : 0);
  
  // Get upcoming deadlines (next 7 days)
  const in7days = quizzes.filter(q => {
    if (!q.deadline) return false;
    const daysUntil = (new Date(q.deadline) - now) / (1000*60*60*24);
    return daysUntil <= 7 && daysUntil >= 0;
  }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  
  setUpcoming(in7days);
}, []);
```

#### Key Features
- **Progress Calculation**: Shows completion percentage based on attempted quizzes
- **Deadline Tracking**: Highlights quizzes due within 7 days
- **Quiz Filtering**: Automatically removes expired quizzes
- **Quick Actions**: Direct links to take quizzes or view results

### InstructorDashboard Component

**File**: `frontend/src/pages/InstructorDashboard.js`

Instructor dashboard for quiz management and analytics.

#### State Management
```jsx
const [quizzes, setQuizzes] = useState([]);
const [messages, setMessages] = useState([]);
const [stats, setStats] = useState({ totalQuizzes: 0, totalAttempts: 0 });
```

#### Quiz Management Methods
```jsx
const deleteQuiz = (index) => {
  const updated = quizzes.filter((_, i) => i !== index);
  localStorage.setItem('quizzes', JSON.stringify(updated));
  setQuizzes(updated);
};

const editQuiz = (index) => {
  navigate(`/edit-quiz/${index}`);
};

const viewQuiz = (index) => {
  navigate(`/view-quiz/${index}`);
};
```

#### Analytics Calculation
```jsx
useEffect(() => {
  // Load quizzes and messages
  let quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
  const msgs = JSON.parse(localStorage.getItem('messages') || '[]');
  
  // Calculate statistics
  const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
  setStats({
    totalQuizzes: quizzes.length,
    totalAttempts: attempts.length,
    averageScore: attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0
  });
  
  setQuizzes(quizzes);
  setMessages(msgs);
}, []);
```

### CreateQuiz Component

**File**: `frontend/src/pages/CreateQuiz.js`

Interface for creating new quizzes with dynamic question management.

#### State Management
```jsx
const [title, setTitle] = useState('');
const [description, setDescription] = useState('');
const [category, setCategory] = useState('');
const [questions, setQuestions] = useState([{ ...initialQuestion }]);
const [deadline, setDeadline] = useState(() => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
});
const [error, setError] = useState('');
```

#### Question Management Methods
```jsx
const handleQuestionChange = (idx, field, value) => {
  setQuestions(qs => qs.map((q, i) => 
    i === idx ? { ...q, [field]: value } : q
  ));
};

const handleOptionChange = (qIdx, oIdx, value) => {
  setQuestions(qs => qs.map((q, i) => 
    i === qIdx ? { 
      ...q, 
      options: q.options.map((o, j) => j === oIdx ? value : o) 
    } : q
  ));
};

const addQuestion = () => {
  setQuestions(qs => [...qs, { ...initialQuestion }]);
};

const addOption = (qIdx) => {
  setQuestions(qs => qs.map((q, i) => 
    i === qIdx ? { ...q, options: [...q.options, ''] } : q
  ));
};

const removeOption = (qIdx, oIdx) => {
  setQuestions(qs => qs.map((q, i) => 
    i === qIdx ? { 
      ...q, 
      options: q.options.filter((_, j) => j !== oIdx) 
    } : q
  ));
};
```

#### Form Validation
```jsx
const handleSubmit = e => {
  e.preventDefault();
  
  // Validate that every question has a correct answer selected
  for (let i = 0; i < questions.length; i++) {
    const { correct, options } = questions[i];
    if (typeof correct !== 'number' || correct < 0 || correct >= options.length) {
      setError(`Please select the correct answer for question ${i + 1}.`);
      return;
    }
  }
  
  setError('');
  const quiz = { title, description, category, questions, deadline };
  
  // Save to localStorage
  const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
  localStorage.setItem('quizzes', JSON.stringify([quiz, ...quizzes]));
  navigate('/instructor-dashboard');
};
```

#### Initial Question Structure
```jsx
const initialQuestion = { 
  question: '', 
  options: ['', ''], 
  correct: 0 
};
```

### QuizTake Component

**File**: `frontend/src/pages/QuizTake.js`

Interactive quiz-taking interface with navigation and progress tracking.

#### State Management
```jsx
const [quiz, setQuiz] = useState(null);
const [current, setCurrent] = useState(0);
const [answers, setAnswers] = useState([]);
const [submitted, setSubmitted] = useState(false);
const [animDir, setAnimDir] = useState(1);
```

#### Quiz Loading
```jsx
useEffect(() => {
  const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
  const q = quizzes[parseInt(id)];
  setQuiz(q || null);
  setAnswers(q ? Array(q.questions.length).fill(null) : []);
}, [id]);
```

#### Navigation Methods
```jsx
const handleNext = () => {
  setAnimDir(1);
  setCurrent(c => Math.min(c + 1, total - 1));
};

const handlePrev = () => {
  setAnimDir(-1);
  setCurrent(c => Math.max(c - 1, 0));
};

const handleSelect = idx => {
  setAnswers(ans => {
    const copy = [...ans];
    copy[current] = idx;
    return copy;
  });
};
```

#### Quiz Submission
```jsx
const handleSubmit = () => {
  setSubmitted(true);
  
  // Calculate score
  let correctCount = 0;
  quiz.questions.forEach((q, i) => {
    const correctIdx = typeof q.correct === 'number' ? q.correct : 0;
    if (answers[i] === correctIdx) correctCount++;
  });
  
  const score = Math.round((correctCount / quiz.questions.length) * 100);
  
  // Save attempt
  const attempt = {
    quizId: id,
    answers: answers,
    score: score,
    timestamp: new Date().toISOString(),
    attemptId: Date.now().toString()
  };
  
  const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
  localStorage.setItem('quizAttempts', JSON.stringify([attempt, ...attempts]));
  
  // Navigate to results
  navigate(`/quiz/${id}/results/${attempt.attemptId}`);
};
```

#### Animation Configuration
```jsx
// Question transition animations
<AnimatePresence mode="wait">
  <motion.div
    key={current}
    initial={{ opacity: 0, x: animDir * 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: animDir * -50 }}
    transition={{ duration: 0.3 }}
  >
    {/* Question content */}
  </motion.div>
</AnimatePresence>
```

### Login Component

**File**: `frontend/src/pages/Login.js`

User authentication interface with real-time validation.

#### State Management
```jsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [role, setRole] = useState('Student');
const [touched, setTouched] = useState({});
```

#### Validation Functions
```jsx
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const validEmail = validateEmail(email);
const validPassword = password.length >= 4;
const allValid = validEmail && validPassword;
```

#### Form Submission
```jsx
const handleSubmit = e => {
  e.preventDefault();
  if (!allValid) return;
  
  login(email, password, role);
  
  // Navigate based on role
  if (role === 'Instructor') {
    navigate('/instructor-dashboard');
  } else {
    navigate('/dashboard');
  }
};
```

#### Dynamic Styling
```jsx
const inputStyle = valid => ({
  padding: '12px 14px',
  borderRadius: 8,
  border: `1.5px solid ${
    valid === false ? '#ef4444' : 
    valid === true ? '#22c55e' : 
    '#ddd'
  }`,
  fontSize: '1rem',
  marginBottom: 0,
  outline: 'none',
  transition: 'border 0.18s, box-shadow 0.18s'
});
```

### Register Component

**File**: `frontend/src/pages/Register.js`

User registration with comprehensive validation.

#### State Management
```jsx
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Student'
});
const [touched, setTouched] = useState({});
const [showPassword, setShowPassword] = useState(false);
```

#### Validation Logic
```jsx
const validation = {
  firstName: formData.firstName.length >= 2,
  lastName: formData.lastName.length >= 2,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
  password: formData.password.length >= 6,
  confirmPassword: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
};

const allValid = Object.values(validation).every(Boolean);
```

#### Form Handling
```jsx
const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const handleSubmit = e => {
  e.preventDefault();
  if (!allValid) return;
  
  // Store registration info
  localStorage.setItem('registeredRole', formData.role);
  
  // Auto-login after registration
  login(formData.email, formData.password, formData.role);
  
  // Navigate to appropriate dashboard
  if (formData.role === 'Instructor') {
    navigate('/instructor-dashboard');
  } else {
    navigate('/dashboard');
  }
};
```

## Component Props Reference

### Common Props Patterns

#### Route Components
```jsx
// PrivateRoute
interface PrivateRouteProps {
  children: ReactNode;
  role?: 'student' | 'instructor';
}

// PublicRoute
interface PublicRouteProps {
  children: ReactNode;
}
```

#### Form Components
```jsx
// Input validation states
type ValidationState = boolean | null;

// Common form props
interface FormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  validation?: Record<string, ValidationState>;
}
```

#### Animation Props
```jsx
// Framer Motion common props
interface AnimationProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
}
```

## State Management

### Local State Patterns

#### Form State
```jsx
// Single form field
const [value, setValue] = useState('');

// Form object
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
  // ...
});

// Update form data
const updateField = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

#### List Management
```jsx
// Array state
const [items, setItems] = useState([]);

// Add item
const addItem = (item) => {
  setItems(prev => [...prev, item]);
};

// Update item
const updateItem = (index, newItem) => {
  setItems(prev => prev.map((item, i) => 
    i === index ? newItem : item
  ));
};

// Remove item
const removeItem = (index) => {
  setItems(prev => prev.filter((_, i) => i !== index));
};
```

#### Loading States
```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

// Async operation pattern
const performAsyncOperation = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await someAsyncFunction();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Context State

#### Authentication Context
```jsx
// Context value type
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string, role?: string) => void;
  logout: () => void;
}

// Usage pattern
const { user, login, logout } = useAuth();
```

## Component Testing

### Testing Utilities

#### Basic Component Test
```jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import ComponentToTest from '../ComponentToTest';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

test('renders component correctly', () => {
  renderWithProviders(<ComponentToTest />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

#### Form Testing
```jsx
import { fireEvent, waitFor } from '@testing-library/react';

test('handles form submission', async () => {
  renderWithProviders(<FormComponent />);
  
  const input = screen.getByLabelText('Input Label');
  const submitButton = screen.getByRole('button', { name: 'Submit' });
  
  fireEvent.change(input, { target: { value: 'test value' } });
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(screen.getByText('Success Message')).toBeInTheDocument();
  });
});
```

#### Authentication Testing
```jsx
import { useAuth } from '../AuthContext';

// Mock component for testing auth
const TestComponent = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      {user ? (
        <div>
          <span>Logged in as {user.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login('test@test.com', 'password', 'Student')}>
          Login
        </button>
      )}
    </div>
  );
};

test('handles authentication flow', () => {
  renderWithProviders(<TestComponent />);
  
  // Test login
  fireEvent.click(screen.getByText('Login'));
  expect(screen.getByText('Logged in as test@test.com')).toBeInTheDocument();
  
  // Test logout
  fireEvent.click(screen.getByText('Logout'));
  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

This component documentation provides detailed information about each React component in the QuizMaster application, including their structure, state management, methods, and usage patterns. It serves as a comprehensive reference for developers working with the codebase.