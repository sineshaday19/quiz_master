import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [animDir, setAnimDir] = useState(1);

  useEffect(() => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const q = quizzes[parseInt(id)];
    setQuiz(q || null);
    setAnswers(q ? Array(q.questions.length).fill(null) : []);
  }, [id]);

  if (!quiz) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>Quiz not found.</div>;
  }

  const question = quiz.questions[current];
  const total = quiz.questions.length;

  const handleSelect = idx => {
    setAnswers(ans => {
      const copy = [...ans];
      copy[current] = idx;
      return copy;
    });
  };
  const handleNext = () => {
    setAnimDir(1);
    setCurrent(c => Math.min(c + 1, total - 1));
  };
  const handlePrev = () => {
    setAnimDir(-1);
    setCurrent(c => Math.max(c - 1, 0));
  };
  const handleSubmit = () => {
    setSubmitted(true);
    // Save attempt to localStorage
    let correctCount = 0;
    quiz.questions.forEach((q, i) => {
      const correctIdx = typeof q.correct === 'number' ? q.correct : 0;
      if (answers[i] === correctIdx) correctCount++;
    });
    const percent = Math.round((correctCount / total) * 100);
    const attempt = {
      quizId: id,
      quizTitle: quiz.title,
      score: correctCount,
      total,
      percentage: percent,
      date: new Date().toISOString(),
      answers,
    };
    const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    attempts.unshift(attempt);
    localStorage.setItem('quizAttempts', JSON.stringify(attempts));
  };
  const handleRetake = () => {
    setAnswers(Array(total).fill(null));
    setCurrent(0);
    setSubmitted(false);
  };

  if (submitted) {
    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q, i) => {
      // For instructor-created quizzes, correct answer is always index 0 (or you can add a 'correct' field to each question)
      // We'll check if q.correct exists, otherwise default to 0
      const correctIdx = typeof q.correct === 'number' ? q.correct : 0;
      if (answers[i] === correctIdx) correctCount++;
    });
    const percent = Math.round((correctCount / total) * 100);
    const passed = percent >= 50;
    return (
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }} transition={{ duration: 0.6 }} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <img src={require('../assets/background.png')} alt="background" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, filter: 'blur(8px) brightness(0.95)' }} />
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.7)', zIndex: 0 }} />
        <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '38px 32px', width: '100%', margin: '40px auto', zIndex: 2 }}>
            <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 18 }}>Quiz Review</h2>
            <div style={{ textAlign: 'center', fontWeight: 600, fontSize: '1.2rem', color: passed ? '#22c55e' : '#ef4444', marginBottom: 8 }}>
              Score: {correctCount} / {total} ({percent}%) {passed ? '✔️ Passed' : '❌ Failed'}
            </div>
            <div style={{ margin: '24px 0 0 0' }}>
              {quiz.questions.map((q, i) => {
                const correctIdx = typeof q.correct === 'number' ? q.correct : 0;
                const isCorrect = answers[i] === correctIdx;
                return (
                  <div key={i} style={{ background: '#f3f4f6', borderRadius: 10, padding: '16px 18px', margin: '18px 0' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 6 }}>{q.question}</div>
                    <div>Your Answer: <span style={{ color: isCorrect ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{q.options[answers[i]] ?? <span style={{ color: '#888' }}>No answer</span>}</span></div>
                    <div>Correct Answer: <span style={{ color: '#22c55e', fontWeight: 700 }}>{q.options[correctIdx]}</span></div>
                    <div style={{ color: isCorrect ? '#22c55e' : '#ef4444', fontWeight: 600, marginTop: 4 }}>{isCorrect ? 'Correct' : 'Incorrect'}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28, gap: 16 }}>
              <motion.button
                style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                whileHover={{ scale: 1.04, background: '#6366f1' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRetake}
              >
                Retake Quiz
              </motion.button>
              <motion.button
                style={{ background: '#f3f4f6', color: '#4f46e5', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                whileHover={{ scale: 1.04, background: '#e0e7ff' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </motion.button>
            </div>
          </motion.div>
        </main>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }} transition={{ duration: 0.6 }} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <img src={require('../assets/background.png')} alt="background" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, filter: 'blur(8px) brightness(0.95)' }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.7)', zIndex: 0 }} />
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '38px 32px', width: '100%', margin: '40px auto', zIndex: 2 }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>{quiz.title}</h2>
          <div style={{ color: '#666', fontSize: '1rem', marginBottom: 8 }}>{quiz.description}</div>
          <div style={{ color: '#F59E0B', fontWeight: 500, marginBottom: 18 }}>Category: {quiz.category || 'N/A'}</div>
          <div style={{ marginBottom: 18, color: '#4f46e5', fontWeight: 600 }}>Question {current + 1} of {total}</div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ width: '100%', height: 10, background: '#e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #4f46e5 60%, #F59E0B 100%)', borderRadius: 8 }} animate={{ width: `${((current + 1) / total) * 100}%` }} transition={{ duration: 0.7, ease: [0.4, 2, 0.6, 1] }} />
            </div>
          </div>
          <AnimatePresence initial={false} custom={animDir}>
            <motion.div
              key={question.question}
              initial={{ x: animDir > 0 ? 80 : -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: animDir > 0 ? -80 : 80, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: 24 }}
            >
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 12 }}>{question.question}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {question.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    style={{
                      background: answers[current] === idx ? '#F59E0B' : '#f3f4f6',
                      color: answers[current] === idx ? '#fff' : '#222',
                      border: answers[current] === idx ? '2px solid #F59E0B' : '1.5px solid #ddd',
                      borderRadius: 10,
                      padding: '14px 18px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: answers[current] === idx ? '0 2px 8px rgba(245,158,11,0.13)' : '0 1px 4px rgba(79,70,229,0.06)',
                      outline: 'none',
                      transition: 'all 0.18s',
                      opacity: 1
                    }}
                    whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(79,70,229,0.12)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect(idx)}
                    animate={answers[current] === idx ? { scale: [1, 1.08, 1], backgroundColor: ['#F59E0B', '#fbbf24', '#F59E0B'] } : {}}
                    transition={{ duration: 0.18 }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
            <motion.button
              style={{ background: '#f3f4f6', color: '#4f46e5', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: current === 0 ? 0.5 : 1 }}
              whileHover={current > 0 ? { scale: 1.04, background: '#e0e7ff' } : {}}
              whileTap={current > 0 ? { scale: 0.97 } : {}}
              disabled={current === 0}
              onClick={handlePrev}
            >
              Previous
            </motion.button>
            {current < total - 1 ? (
              <motion.button
                style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                whileHover={{ scale: 1.04, background: '#6366f1' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                disabled={answers[current] === null}
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                style={{ background: '#F59E0B', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                whileHover={{ scale: 1.04, background: '#fbbf24' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={answers[current] === null}
              >
                Submit
              </motion.button>
            )}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default QuizTake; 