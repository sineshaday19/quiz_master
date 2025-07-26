# QuizMaster Setup and Development Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Development Environment Setup](#development-environment-setup)
5. [Project Structure](#project-structure)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Build and Deployment](#build-and-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)

## Project Overview

QuizMaster is a modern React-based quiz management system that enables instructors to create and manage quizzes while providing students with an intuitive interface to take quizzes and view their results. The application features role-based authentication, real-time search, progress tracking, and responsive design.

### Key Features
- **Role-based Authentication**: Separate interfaces for students and instructors
- **Quiz Management**: Create, edit, and delete quizzes with multiple question types
- **Real-time Search**: Search for quizzes, classes, and students
- **Progress Tracking**: Monitor quiz completion and performance
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Animations**: Smooth transitions using Framer Motion

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- **Node.js**: Version 16.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For version control

### Recommended Tools
- **Visual Studio Code**: With React extensions
- **Chrome DevTools**: For debugging
- **React Developer Tools**: Browser extension for React debugging

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 1GB free space

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quiz_master
```

### 2. Install Dependencies

#### Root Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify React installation
cd frontend
npm list react
```

## Development Environment Setup

### 1. Environment Configuration

Create a `.env` file in the frontend directory:
```bash
cd frontend
touch .env
```

Add the following environment variables:
```env
# Development settings
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0

# API Configuration (if backend is added later)
REACT_APP_API_URL=http://localhost:3001

# Feature flags
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_ANALYTICS=false
```

### 2. IDE Configuration

#### Visual Studio Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.js": "javascriptreact"
  }
}
```

#### Recommended VSCode Extensions
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### 3. Git Configuration

Create `.gitignore` (if not present):
```gitignore
# Dependencies
node_modules/
frontend/node_modules/

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

## Project Structure

```
quiz_master/
├── frontend/                   # React application
│   ├── public/                # Static assets
│   │   ├── index.html         # Main HTML template
│   │   ├── manifest.json      # PWA manifest
│   │   └── favicon.ico        # App icon
│   ├── src/                   # Source code
│   │   ├── assets/            # Images and static files
│   │   ├── pages/             # Page components
│   │   │   ├── Home.js        # Landing page
│   │   │   ├── Login.js       # Authentication
│   │   │   ├── Register.js    # User registration
│   │   │   ├── Dashboard.js   # Student dashboard
│   │   │   ├── InstructorDashboard.js
│   │   │   ├── CreateQuiz.js  # Quiz creation
│   │   │   ├── EditQuiz.js    # Quiz editing
│   │   │   ├── QuizTake.js    # Quiz taking interface
│   │   │   ├── QuizResults.js # Results display
│   │   │   ├── Profile.js     # User profile
│   │   │   ├── Contact.js     # Contact form
│   │   │   └── index.js       # Page exports
│   │   ├── App.js             # Main app component
│   │   ├── AuthContext.js     # Authentication context
│   │   ├── Header.js          # Navigation component
│   │   ├── Header.css         # Header styles
│   │   ├── index.js           # App entry point
│   │   ├── index.css          # Global styles
│   │   └── setupTests.js      # Test configuration
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Create React App documentation
├── package.json               # Root dependencies
├── README.md                  # Project documentation
├── API_DOCUMENTATION.md       # API documentation
├── COMPONENT_DOCUMENTATION.md # Component documentation
└── SETUP_AND_DEVELOPMENT_GUIDE.md # This file
```

### Key Directories Explained

#### `/frontend/src/pages/`
Contains all page-level components organized by functionality:
- **Authentication**: Login.js, Register.js
- **Dashboards**: Dashboard.js (student), InstructorDashboard.js
- **Quiz Management**: CreateQuiz.js, EditQuiz.js, ViewQuiz.js
- **Quiz Taking**: QuizTake.js, QuizResults.js
- **Utility Pages**: Home.js, Profile.js, Contact.js

#### `/frontend/src/assets/`
Static assets including:
- **Images**: Icons, backgrounds, illustrations
- **Fonts**: Custom typography (if any)
- **Icons**: SVG icons and graphics

#### `/frontend/public/`
Public assets served directly:
- **index.html**: Main HTML template
- **manifest.json**: PWA configuration
- **Icons**: Favicon and app icons

## Development Workflow

### 1. Starting Development

#### Start the Development Server
```bash
cd frontend
npm start
```

This will:
- Start the React development server on `http://localhost:3000`
- Enable hot reloading for instant updates
- Open the application in your default browser

#### Available Scripts
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Eject from Create React App (not recommended)
npm run eject
```

### 2. Development Best Practices

#### Code Organization
- Keep components small and focused
- Use functional components with hooks
- Separate concerns (UI, logic, data)
- Follow consistent naming conventions

#### File Naming Conventions
```
Components:     PascalCase.js (e.g., CreateQuiz.js)
Utilities:      camelCase.js (e.g., authUtils.js)
Constants:      UPPER_SNAKE_CASE.js (e.g., API_CONSTANTS.js)
Styles:         camelCase.css or PascalCase.css
```

#### Component Structure
```jsx
// Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Component definition
const MyComponent = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState(initialValue);
  const navigate = useNavigate();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handle event
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### 3. State Management Patterns

#### Local State
Use `useState` for component-specific state:
```jsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});
```

#### Context for Global State
Use React Context for shared state:
```jsx
// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState(initialState);
  
  return (
    <AppContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

#### Data Persistence
Currently using localStorage for data persistence:
```jsx
// Save data
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Load data
const loadData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading data:', error);
    return defaultValue;
  }
};
```

### 4. Styling Guidelines

#### CSS Organization
- Use CSS modules or styled-components for component-specific styles
- Keep global styles minimal
- Use consistent naming conventions
- Organize styles logically

#### Responsive Design
```css
/* Mobile-first approach */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

#### Color Scheme
```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #6b7280;
  --success-color: #22c55e;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --background-color: #f8fafc;
  --text-color: #1f2937;
}
```

## Testing

### 1. Testing Setup

The project uses React Testing Library and Jest for testing.

#### Test File Structure
```
src/
├── __tests__/              # Global tests
├── components/
│   ├── Component.js
│   └── Component.test.js   # Component tests
└── utils/
    ├── utility.js
    └── utility.test.js     # Utility tests
```

### 2. Writing Tests

#### Component Testing
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import MyComponent from '../MyComponent';

// Test wrapper for providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />, { wrapper: TestWrapper });
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  test('handles user interaction', () => {
    render(<MyComponent />, { wrapper: TestWrapper });
    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

#### Testing Hooks
```jsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../AuthContext';

test('useAuth hook works correctly', () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider
  });
  
  act(() => {
    result.current.login('test@test.com', 'password', 'Student');
  });
  
  expect(result.current.user).toEqual({
    email: 'test@test.com',
    role: 'Student'
  });
});
```

### 3. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- MyComponent.test.js
```

### 4. Test Coverage

Aim for:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Build and Deployment

### 1. Production Build

```bash
cd frontend
npm run build
```

This creates a `build/` directory with optimized production files:
- Minified JavaScript and CSS
- Optimized images
- Service worker for caching
- Static files ready for deployment

### 2. Build Analysis

Analyze bundle size:
```bash
# Install analyzer
npm install -g webpack-bundle-analyzer

# Analyze build
npx webpack-bundle-analyzer build/static/js/*.js
```

### 3. Deployment Options

#### Static Hosting (Netlify, Vercel)
1. Connect your Git repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`
4. Deploy automatically on push

#### Traditional Web Server
1. Build the project: `npm run build`
2. Copy `build/` contents to web server
3. Configure server for SPA routing:

**Apache (.htaccess):**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Docker Deployment
Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. Environment-Specific Builds

#### Development
```bash
REACT_APP_ENV=development npm run build
```

#### Staging
```bash
REACT_APP_ENV=staging npm run build
```

#### Production
```bash
REACT_APP_ENV=production npm run build
```

## Troubleshooting

### Common Issues

#### 1. Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or start on different port
PORT=3001 npm start
```

#### 3. Build Errors
```bash
# Clear build cache
rm -rf build/
npm run build
```

#### 4. localStorage Issues
```javascript
// Clear localStorage in browser console
localStorage.clear();

// Or programmatically
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('quiz')) {
    localStorage.removeItem(key);
  }
});
```

### Performance Issues

#### Bundle Size Optimization
1. Use React.lazy for code splitting
2. Optimize images
3. Remove unused dependencies
4. Use production builds

#### Memory Leaks
1. Clean up event listeners in useEffect
2. Cancel pending requests on unmount
3. Clear timeouts and intervals

### Debugging Tips

#### React DevTools
- Install React Developer Tools browser extension
- Use Components tab to inspect component tree
- Use Profiler tab to identify performance issues

#### Console Debugging
```javascript
// Debug component renders
useEffect(() => {
  console.log('Component rendered with props:', props);
});

// Debug state changes
useEffect(() => {
  console.log('State changed:', state);
}, [state]);
```

## Contributing

### 1. Development Setup
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make changes
5. Test your changes
6. Submit a pull request

### 2. Coding Standards

#### JavaScript/React
- Use ESLint configuration
- Follow Airbnb style guide
- Use Prettier for formatting
- Write meaningful commit messages

#### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to your fork
git push origin feature/new-feature

# Create pull request
```

#### Commit Message Format
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
- feat(auth): add login validation
- fix(quiz): resolve scoring calculation
- docs(api): update component documentation
```

### 3. Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met

### 4. Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Tag release
7. Deploy to production

This guide provides comprehensive instructions for setting up, developing, and maintaining the QuizMaster application. Follow these guidelines to ensure consistent development practices and smooth deployment processes.