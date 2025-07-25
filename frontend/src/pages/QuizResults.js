import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const bgStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  objectFit: 'cover',
  zIndex: 0,
  filter: 'blur(8px) brightness(0.95)'
};
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(255,255,255,0.7)',
  zIndex: 0,
  pointerEvents: 'none'
};
const cardStyle = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  padding: '38px 32px',
  margin: '40px auto',
  zIndex: 2,
  maxWidth: 700,
  minHeight: 420,
  position: 'relative'
};
const badgeStyle = {
  display: 'inline-block',
  background: '#bbf7d0',
  color: '#166534',
  fontWeight: 700,
  borderRadius: 12,
  padding: '6px 18px',
  fontSize: '1.1rem',
  margin: '0 8px 0 0',
  boxShadow: '0 1px 6px #22c55e22'
};
const buttonStyle = {
  background: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 24px',
  fontWeight: 700,
  fontSize: '1.1rem',
  margin: '0 8px',
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.1s'
};
const questionCard = {
  background: '#f3f4f6',
  borderRadius: 12,
  padding: '18px 18px',
  margin: '18px 0',
  boxShadow: '0 1px 4px #4f46e522',
  fontSize: '1.05rem',
  fontWeight: 500
};
const correctStyle = { color: '#22c55e', fontWeight: 700 };
const incorrectStyle = { color: '#ef4444', fontWeight: 700 };

const mockResultsByAttempt = {
  1: {
    quizId: 1,
    quizTitle: 'Math Quiz',
    score: 2,
    total: 3,
    percentage: 67,
    passed: true,
    attempt: 1,
    attemptsCount: 3, // mock number of attempts
    questions: [
      {
        question: 'What is 2 + 2?',
        yourAnswer: '4',
        correctAnswer: '4',
        isCorrect: true,
        explanation: '2 + 2 = 4.'
      },
      {
        question: 'The square root of 9 is 3.',
        yourAnswer: 'True',
        correctAnswer: 'True',
        isCorrect: true,
        explanation: '√9 = 3.'
      },
      {
        question: 'Which is a prime number?',
        yourAnswer: '6',
        correctAnswer: '7',
        isCorrect: false,
        explanation: '7 is a prime number.'
      }
    ],
    badges: ['Top Scorer', 'Quiz Streak']
  },
  2: {
    quizId: 2,
    quizTitle: 'Science Quiz',
    score: 3,
    total: 3,
    percentage: 100,
    passed: true,
    attempt: 2,
    attemptsCount: 2, // mock number of attempts
    questions: [
      {
        question: 'What planet is known as the Red Planet?',
        yourAnswer: 'Mars',
        correctAnswer: 'Mars',
        isCorrect: true,
        explanation: 'Mars is called the Red Planet.'
      },
      {
        question: 'Water boils at 100°C.',
        yourAnswer: 'True',
        correctAnswer: 'True',
        isCorrect: true,
        explanation: 'Standard boiling point of water.'
      },
      {
        question: 'Which gas do plants absorb?',
        yourAnswer: 'CO2',
        correctAnswer: 'CO2',
        isCorrect: true,
        explanation: 'Plants absorb carbon dioxide.'
      }
    ],
    badges: ['Perfect Score']
  }
};

const QuizResults = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const results = mockResultsByAttempt[attemptId] || mockResultsByAttempt[1];
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      <img src={require('../assets/background.png')} alt="background" style={bgStyle} />
      <div style={overlayStyle} />
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 800, margin: '0 auto' }}>
        <motion.div style={cardStyle} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#4f46e5', marginBottom: 10 }}>{results.quizTitle} - Results</h2>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: results.passed ? '#22c55e' : '#ef4444', marginBottom: 6 }}>{results.score} / {results.total}</div>
            <div style={{ fontSize: '1.2rem', color: '#888', marginBottom: 4 }}>{results.percentage}% {results.passed ? 'Passed' : 'Failed'}</div>
            {/* Show number of attempts instead of time taken */}
            <div style={{ fontSize: '1.1rem', color: '#444', marginBottom: 4 }}>Attempts: {results.attemptsCount} | Attempt #{results.attempt}</div>
            <AnimatePresence>
              {results.passed && (
                <></>
              )}
            </AnimatePresence>
            <div style={{ margin: '10px 0' }}>
              {results.badges.map((badge, i) => (
                <motion.span key={badge} style={badgeStyle} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 300 }}>{badge}</motion.span>
              ))}
            </div>
          </motion.div>
          <div style={{ fontWeight: 700, color: '#4f46e5', margin: '18px 0 8px 0', fontSize: '1.1rem' }}>Question Review</div>
          {results.questions.map((q, i) => (
            <motion.div key={i} style={questionCard} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
              <div style={{ marginBottom: 6, fontWeight: 600 }}>{q.question}</div>
              <div>Your Answer: <span style={q.isCorrect ? correctStyle : incorrectStyle}>{q.yourAnswer}</span></div>
              <div>Correct Answer: <span style={correctStyle}>{q.correctAnswer}</span></div>
              <div style={{ color: '#888', marginTop: 4 }}>{q.explanation}</div>
            </motion.div>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'center' }}>
            <button style={buttonStyle} onClick={() => navigate(`/quiz/${results.quizId}/take`)}>Retake Quiz</button>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default QuizResults; 