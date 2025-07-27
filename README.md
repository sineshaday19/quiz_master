# Quiz Management System

A full-stack application for managing quizzes, with Express.js backend and React (Vite) frontend.

## Objective

The objective of this project is to provide hands-on experience in developing a full-stack web application using modern technologies and software development principles. The Online Quiz Platform allows users to create, take, and manage quizzes with instant feedback, supporting multiple question types and user accounts.

## System Architecture

- **Frontend:** React (Vite), communicates with backend via REST API.
- **Backend:** Node.js (Express.js), handles API requests, authentication, and quiz logic.
- **Database:** MySQL, stores users, quizzes, questions, and submissions.
- **Queue System:** (Planned) For managing quiz submissions and feedback.

## UML Diagrams

- **Class Diagram:** User, Quiz, Question, Submission entities.
- **Use Case Diagram:** Register/Login, Create Quiz, Take Quiz, Submit Answers, View Results.

## API Documentation

| Method | Endpoint                | Description                       |
|--------|-------------------------|-----------------------------------|
| POST   | /users/register         | Register a new user               |
| POST   | /users/login            | Authenticate user                 |
| GET    | /quizzes                | List all quizzes                  |
| POST   | /quizzes                | Create a new quiz                 |
| GET    | /quizzes/:id            | Get quiz details                  |
| POST   | /submissions/:quizId    | Submit answers for a quiz         |
| GET    | /submissions/:id        | Get results for a submission      |

## Database Schema

**Users Table**
- id (INT, PK)
- username (VARCHAR)
- email (VARCHAR)
- password_hash (VARCHAR)

**Quizzes Table**
- id (INT, PK)
- title (VARCHAR)
- description (TEXT)
- creator_id (INT, FK)

**Questions Table**
- id (INT, PK)
- quiz_id (INT, FK)
- type (VARCHAR)
- content (TEXT)
- options (JSON)
- correct_answer (VARCHAR/JSON)

**Submissions Table**
- id (INT, PK)
- user_id (INT, FK)
- quiz_id (INT, FK)
- answers (JSON)
- score (INT)
- submitted_at (DATETIME)

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/sineshaday19/quiz_master
    cd quiz_master
    ```

2. Set up the backend:
    ```bash
    cd backend2
    npm install
    npm run dev
    ```
    - Configure MySQL credentials in `connection/connection.js`.

3. Set up the frontend:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
    - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

### Backend (Express.js)
- `npm run dev` - Start in development mode with nodemon

### Frontend (React Vite)
- `npm run dev` - Start the development server
- `npm run build` - Build for production

## Features

- Quiz management (create, read, update, delete)
- Multiple question types (MCQ, True/False, etc.)
- User registration and authentication
- Instant feedback on quiz submissions
- Responsive UI for quiz operations

## Dependencies

- **Backend:** Express, MySQL, CORS, Swagger, Nodemon
- **Frontend:** React, Vite, Axios, Lucide React, Tailwind CSS, React Toastify

## 📄 Documentation

- [Project Proposal](./docs/Project%20proposal.docx)
- [Software Documentation (Google Doc)](https://docs.google.com/document/d/1wIH2Xp5GY-EyQpWoqxAUmTW-6OHu4D8mIMpMJsu93HE/edit?tab=t.0)
- [Individual Contribution Report](./docs/Individual%20Contribution%20Report.docx)

## Instructions for Setting Up and Running

1. Ensure MySQL is running and accessible.
2. Update backend database credentials.
3. Start backend and frontend servers as described above.
4. Access API documentation at [http://localhost:5000/api-docs](http://localhost:5000/api-docs).

---
