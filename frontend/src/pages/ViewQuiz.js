import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ViewQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    setQuiz(quizzes[parseInt(id)]);
  }, [id]);

  if (!quiz) return <div>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }} transition={{ duration: 0.6 }} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <img src={require('../assets/background.png')} alt="background" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, filter: 'blur(8px) brightness(0.95)' }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.7)', zIndex: 0 }} />
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '38px 32px', width: '100%', margin: '40px auto', zIndex: 2 }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>Quiz Preview</h2>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Title: {quiz.title}</div>
          <div style={{ color: '#666', fontSize: '1rem', marginBottom: 8 }}>Description: {quiz.description}</div>
          <div style={{ color: '#F59E0B', fontWeight: 500, marginBottom: 8 }}>Category: {quiz.category || 'N/A'}</div>
          <div style={{ marginTop: 18 }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Questions</h3>
            {quiz.questions.map((q, idx) => (
              <div key={idx} style={{ background: '#f3f4f6', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Q{idx + 1}: {q.question}</div>
                <div style={{ marginLeft: 8 }}>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ marginRight: 8 }}>{String.fromCharCode(65 + oIdx)}.</span>
                      <span style={{ fontWeight: q.correct === oIdx ? 700 : 400, color: q.correct === oIdx ? '#22c55e' : '#222' }}>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/instructor-dashboard')} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: '1.1rem', marginTop: 10, cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}>Back to Dashboard</button>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default ViewQuiz; 