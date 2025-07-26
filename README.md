# QuizMaster - Comprehensive Quiz Management System

QuizMaster is a modern React-based quiz management platform that enables instructors to create and manage quizzes while providing students with an intuitive interface to take quizzes and track their progress.

## 🚀 Features

- **Role-based Authentication**: Separate interfaces for students and instructors
- **Dynamic Quiz Creation**: Create quizzes with multiple question types and configurable options
- **Real-time Search**: Search for quizzes, classes, and students with instant results
- **Progress Tracking**: Monitor quiz completion and performance analytics
- **Responsive Design**: Seamlessly works on desktop, tablet, and mobile devices
- **Smooth Animations**: Enhanced user experience with Framer Motion animations
- **Deadline Management**: Set quiz expiration dates and track upcoming deadlines
- **Instant Grading**: Automatic scoring with detailed results and feedback

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0
- **Routing**: React Router DOM 7.7.0
- **Animations**: Framer Motion 12.23.9
- **Testing**: React Testing Library & Jest
- **Storage**: localStorage (mock backend)
- **Styling**: CSS3 with custom styling

## 📚 Documentation

This project includes comprehensive documentation covering all aspects of the application:

### 📖 [API Documentation](./API_DOCUMENTATION.md)
Complete reference for all public APIs, functions, and data models with usage examples:
- Authentication System
- Core Components
- Storage APIs
- Data Models
- Usage Examples

### 🧩 [Component Documentation](./COMPONENT_DOCUMENTATION.md)
Detailed documentation for all React components:
- Component Architecture
- Props and State Management
- Component Testing
- Usage Patterns

### ⚙️ [Setup and Development Guide](./SETUP_AND_DEVELOPMENT_GUIDE.md)
Comprehensive guide for development and deployment:
- Installation Instructions
- Development Environment Setup
- Build and Deployment
- Troubleshooting
- Contributing Guidelines

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm 8.0 or higher

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd quiz_master

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

## 👥 User Roles

### Students
- Take quizzes with intuitive interface
- View quiz results and progress
- Track upcoming deadlines
- Access quiz history

### Instructors
- Create and manage quizzes
- View student analytics
- Handle student inquiries
- Monitor quiz performance

## 🎯 Key Features in Detail

### Quiz Creation
- Dynamic question management
- Multiple choice questions with configurable options
- Form validation and error handling
- Deadline scheduling

### Quiz Taking
- Smooth question navigation with animations
- Progress indicators
- Auto-save functionality
- Instant scoring and results

### User Management
- Role-based authentication
- User profiles and settings
- Registration and login flows
- Protected routes

### Search and Navigation
- Real-time search with debounced input
- Categorized search results
- Responsive navigation menu
- Breadcrumb navigation

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🏗️ Building for Production

```bash
# Create production build
npm run build

# The build folder will contain optimized production files
```

## 📁 Project Structure

```
quiz_master/
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── assets/            # Static assets
│   │   ├── App.js             # Main app component
│   │   ├── AuthContext.js     # Authentication context
│   │   └── Header.js          # Navigation component
│   └── public/                # Public assets
├── API_DOCUMENTATION.md        # API reference
├── COMPONENT_DOCUMENTATION.md  # Component guide
└── SETUP_AND_DEVELOPMENT_GUIDE.md # Development guide
```

## 🤝 Contributing

We welcome contributions! Please see our [Setup and Development Guide](./SETUP_AND_DEVELOPMENT_GUIDE.md) for detailed instructions on:

- Setting up the development environment
- Coding standards and guidelines
- Testing requirements
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
1. Check the [troubleshooting section](./SETUP_AND_DEVELOPMENT_GUIDE.md#troubleshooting) in our development guide
2. Review the [component documentation](./COMPONENT_DOCUMENTATION.md) for implementation details
3. Consult the [API documentation](./API_DOCUMENTATION.md) for usage examples

## 🔮 Future Enhancements

- Backend API integration
- Database persistence
- Advanced question types
- Bulk quiz operations
- Email notifications
- Advanced analytics dashboard
- Mobile app development

---

**QuizMaster** - Making quiz management simple, efficient, and engaging.