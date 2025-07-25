import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const QuizResults = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    setAttempts(data);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }} transition={{ duration: 0.6 }} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <img src={require('../assets/background.png')} alt="background" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, filter: 'blur(8px) brightness(0.95)' }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.7)', zIndex: 0 }} />
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '38px 32px', width: '100%', margin: '40px auto', zIndex: 2 }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>Quiz Results</h2>
          {attempts.length === 0 && <div style={{ color: '#888', textAlign: 'center', fontSize: '1.1rem' }}>No quiz attempts yet. Take a quiz to see your results here!</div>}
          {attempts.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 18 }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={thStyle}>Quiz Title</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td style={tdStyle}>{a.quizTitle}</td>
                    <td style={tdStyle}>{new Date(a.date).toLocaleString()}</td>
                    <td style={tdStyle}>{a.score} / {a.total}</td>
                    <td style={tdStyle}>{a.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
};

const thStyle = { padding: '12px 8px', fontWeight: 700, color: '#4f46e5', fontSize: '1.08rem', borderBottom: '2px solid #e5e7eb' };
const tdStyle = { padding: '10px 8px', fontSize: '1.05rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb' };

export default QuizResults; 