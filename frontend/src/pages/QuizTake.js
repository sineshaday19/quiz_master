import React from 'react';
import { useParams } from 'react-router-dom';
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
  maxWidth: 600,
  minHeight: 420,
  position: 'relative'
};
const progressBarOuter = {
  width: '100%',
  height: 12,
  background: '#e5e7eb',
  borderRadius: 8,
  overflow: 'hidden',
  margin: '18px 0 24px 0'
};
const progressBarInner = percent => ({
  height: '100%',
  background: 'linear-gradient(90deg, #4f46e5 60%, #F59E0B 100%)',
  borderRadius: 8,
  width: percent + '%',
  transition: 'width 0.7s cubic-bezier(.4,2,.6,1)'
});
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
const optionStyle = (selected, correct, showFeedback) => ({
  background: selected ? (showFeedback ? (correct ? '#bbf7d0' : '#fecaca') : '#e0e7ff') : '#f3f4f6',
  color: '#222',
  border: selected ? '2px solid #4f46e5' : '1px solid #e5e7eb',
  borderRadius: 10,
  padding: '14px 18px',
  margin: '10px 0',
  fontWeight: 600,
  fontSize: '1.05rem',
  cursor: showFeedback ? 'default' : 'pointer',
  boxShadow: selected ? '0 2px 12px rgba(79,70,229,0.10)' : 'none',
  transition: 'all 0.18s',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 10
});

const mockQuizzes = {
  1: {
    title: 'Math Quiz',
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: 'What is 2 + 2?',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
          { text: '22', isCorrect: false }
        ],
        explanation: '2 + 2 = 4.'
      },
      {
        id: 2,
        type: 'true_false',
        question: 'The square root of 9 is 3.',
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false }
        ],
        explanation: '√9 = 3.'
      },
      {
        id: 3,
        type: 'multiple_choice',
        question: 'Which is a prime number?',
        options: [
          { text: '6', isCorrect: false },
          { text: '7', isCorrect: true },
          { text: '8', isCorrect: false },
          { text: '9', isCorrect: false }
        ],
        explanation: '7 is a prime number.'
      }
    ]
  },
  2: {
    title: 'Science Quiz',
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: 'What planet is known as the Red Planet?',
        options: [
          { text: 'Earth', isCorrect: false },
          { text: 'Mars', isCorrect: true },
          { text: 'Jupiter', isCorrect: false },
          { text: 'Venus', isCorrect: false }
        ],
        explanation: 'Mars is called the Red Planet.'
      },
      {
        id: 2,
        type: 'true_false',
        question: 'Water boils at 100°C.',
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false }
        ],
        explanation: 'Standard boiling point of water.'
      },
      {
        id: 3,
        type: 'multiple_choice',
        question: 'Which gas do plants absorb?',
        options: [
          { text: 'O2', isCorrect: false },
          { text: 'CO2', isCorrect: true },
          { text: 'N2', isCorrect: false },
          { text: 'H2', isCorrect: false }
        ],
        explanation: 'Plants absorb carbon dioxide.'
      }
    ]
  }
};

const QuizTake = () => {
  const { id } = useParams();
  const quiz = mockQuizzes[id] || mockQuizzes[1];
  const [current, setCurrent] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [animDir, setAnimDir] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const [showReview, setShowReview] = React.useState(false);
  const question = quiz.questions[current];
  const percent = ((current) / quiz.questions.length) * 100;

  // Reset quiz state for retake
  const handleRetake = () => {
    setCurrent(0);
    setSelected(null);
    setShowFeedback(false);
    setAnswers([]);
    setAnimDir(0);
    setCompleted(false);
    setShowReview(false);
  };

  const handleOption = idx => {
    if (showFeedback || completed) return;
    setSelected(idx);
  };
  const handleNext = () => {
    if (selected === null) return;
    setAnswers([...answers, selected]);
    setSelected(null);
    if (current < quiz.questions.length - 1) {
      setAnimDir(1);
      setCurrent(current + 1);
    } else {
      setCompleted(true);
      setShowReview(true);
    }
  };
  const handlePrev = () => {
    if (current === 0 || completed) return;
    setAnimDir(-1);
    setCurrent(current - 1);
    setSelected(answers[current - 1]);
    setAnswers(answers.slice(0, -1));
    setShowFeedback(false);
  };

  // Only show correct answers after quiz is completed
  if (completed && showReview) {
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
        <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 700, margin: '0 auto' }}>
          <motion.div style={cardStyle} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#4f46e5', marginBottom: 10 }}>{quiz.title} - Review</h2>
            <div style={{ fontSize: '1.2rem', marginBottom: 12 }}>
              You answered {answers.filter((a, i) => quiz.questions[i].options[a]?.isCorrect).length} out of {quiz.questions.length} correctly.
            </div>
            <div style={{ margin: '24px 0 0 0' }}>
              {quiz.questions.map((q, i) => (
                <div key={q.id} style={{ background: '#f3f4f6', borderRadius: 10, padding: '16px 18px', margin: '18px 0' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 6 }}>{q.question}</div>
                  <div>Your Answer: <span style={{ color: q.options[answers[i]]?.isCorrect ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{q.options[answers[i]]?.text || '—'}</span></div>
                  <div>Correct Answer: <span style={{ color: '#22c55e', fontWeight: 700 }}>{q.options.find(opt => opt.isCorrect)?.text}</span></div>
                  <div style={{ color: '#888', marginTop: 4 }}>{q.explanation}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
              <button style={buttonStyle} onClick={handleRetake}>Retake Quiz</button>
            </div>
          </motion.div>
        </main>
      </motion.div>
    );
  }

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
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 700, margin: '0 auto' }}>
        <motion.div style={cardStyle} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#4f46e5', marginBottom: 10 }}>{quiz.title}</h2>
          <div style={{ color: '#888', marginBottom: 8 }}>Question {current + 1} of {quiz.questions.length}</div>
          <div style={progressBarOuter}>
            <div style={progressBarInner(percent + 100 / quiz.questions.length)} />
          </div>
          <AnimatePresence initial={false} custom={animDir}>
            <motion.div
              key={question.id}
              initial={{ x: animDir > 0 ? 80 : -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: animDir > 0 ? -80 : 80, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: 18 }}>{question.question}</div>
              {question.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  style={optionStyle(selected === idx, false, false)}
                  whileHover={!completed && !showFeedback && !selected ? { scale: 1.04, boxShadow: '0 4px 24px #4f46e522' } : {}}
                  whileTap={!completed && !showFeedback && !selected ? { scale: 0.97 } : {}}
                  onClick={() => handleOption(idx)}
                  disabled={completed}
                >
                  {opt.text}
                </motion.button>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                <button style={{ ...buttonStyle, background: '#f3f4f6', color: '#4f46e5', border: '1px solid #4f46e5' }} onClick={handlePrev} disabled={current === 0}>Previous</button>
                <button style={buttonStyle} onClick={handleNext} disabled={selected === null}>{current === quiz.questions.length - 1 ? 'Submit' : 'Next'}</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default QuizTake; 