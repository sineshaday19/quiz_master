import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(0);
  const [upcoming, setUpcoming] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const now = new Date();
    // Remove expired quizzes
    quizzes = quizzes.filter(q => !q.deadline || new Date(q.deadline) >= now);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    setQuizzes(quizzes);
    // Progress calculation
    const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    const attemptedQuizIds = new Set(attempts.map(a => a.quizId));
    const completed = quizzes.filter((q, i) => attemptedQuizIds.has(i.toString())).length;
    setProgress(quizzes.length ? Math.round((completed / quizzes.length) * 100) : 0);
    // Upcoming deadlines (next 7 days)
    const in7days = quizzes.filter(q => q.deadline && ((new Date(q.deadline) - now) / (1000*60*60*24) <= 7) && (new Date(q.deadline) - now) >= 0)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    setUpcoming(in7days);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Blurred Background */}
      <img src={require('../assets/background.png')} alt="background" style={bgStyle} />
      <div style={overlayStyle} />
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={welcomeHeader}
      >
        Welcome, <span style={{ color: '#4f46e5', fontWeight: 700 }}>{user?.name || 'Student'}</span>!
      </motion.div>
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 1100, margin: '0 auto' }}>
        {/* Profile Dropdown Only */}
        {/* Removed profile icon and dropdown from Dashboard header */}
        {/* Dashboard Content */}
        <motion.div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          {/* Available Quizzes */}
          <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 style={sectionTitle}>Available Quizzes</h2>
            {quizzes.length === 0 && <div style={{ color: '#888' }}>No quizzes available yet.</div>}
            {quizzes.map((q, i) => (
              <motion.div key={i} style={quizCard} whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(79,70,229,0.12)' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{q.title}</div>
                <div style={{ color: '#666', fontSize: '0.97rem' }}>{q.description}</div>
                <div style={{ color: '#F59E0B', fontWeight: 500, marginTop: 4 }}>Deadline: {q.deadline ? new Date(q.deadline).toLocaleDateString() : 'N/A'}</div>
                <div style={{ color: '#F59E0B', fontWeight: 500, marginTop: 4 }}>Category: {q.category || 'N/A'}</div>
                <motion.button
                  style={{
                    marginTop: 12,
                    background: '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    boxShadow: '0 2px 8px rgba(79,70,229,0.07)'
                  }}
                  whileHover={{ scale: 1.05, background: '#6366f1' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/quiz/${i}/take`)}
                >
                  Take Quiz
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* Progress Tracking & Upcoming Deadlines */}
        <motion.div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 style={sectionTitle}>Progress Tracking</h2>
            <div style={{ margin: '18px 0' }}>
              <div style={{ color: '#4f46e5', fontWeight: 600 }}>Completion Rate</div>
              <div style={progressBarOuter}><div style={{ ...progressBarInner, width: `${progress}%` }} /></div>
              <div style={{ color: '#F59E0B', fontWeight: 600, marginTop: 8 }}>{progress}% completed</div>
            </div>
            <div style={{ color: '#888', fontSize: '0.97rem' }}>Improvement trend: <span style={{ color: '#22c55e', fontWeight: 600 }}>+12%</span></div>
          </motion.div>
          <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 style={sectionTitle}>Upcoming Deadlines</h2>
            <div style={{ color: '#888', fontSize: '0.97rem', marginBottom: 8 }}>Next 7 days</div>
            <div style={calendarBox}>
              {upcoming.length === 0 && <div style={{ color: '#aaa', fontSize: '1rem' }}>No upcoming deadlines.</div>}
              {upcoming.map((q, i) => (
                <div key={i} style={calendarDay}>
                  <span>{new Date(q.deadline).toLocaleDateString()}</span>
                  <span style={{ color: '#4f46e5', fontWeight: 600 }}>{q.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
};

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
const sectionCard = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  padding: '28px 24px',
  minWidth: 280,
  minHeight: 180,
  flex: 1,
  marginBottom: 12,
  zIndex: 2
};
const quizCard = {
  background: '#f3f4f6',
  borderRadius: 12,
  padding: '16px 14px',
  margin: '10px 0',
  boxShadow: '0 1px 4px rgba(79,70,229,0.06)',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s, transform 0.2s'
};
const attemptRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#f3f4f6',
  borderRadius: 8,
  padding: '10px 12px',
  margin: '8px 0',
  fontSize: '1rem'
};
const badgeRow = {
  display: 'flex',
  alignItems: 'center',
  background: '#f3f4f6',
  borderRadius: 8,
  padding: '10px 12px',
  margin: '8px 0',
  fontSize: '1rem'
};
const badgeIcon = {
  fontSize: '1.3rem',
  marginRight: 8
};
const sectionTitle = {
  fontWeight: 700,
  fontSize: '1.2rem',
  color: '#4f46e5',
  marginBottom: 10
};
const progressBarOuter = {
  width: '100%',
  height: 14,
  background: '#e5e7eb',
  borderRadius: 8,
  overflow: 'hidden',
  marginTop: 8
};
const progressBarInner = {
  height: '100%',
  background: 'linear-gradient(90deg, #4f46e5 60%, #F59E0B 100%)',
  borderRadius: 8,
  transition: 'width 0.7s cubic-bezier(.4,2,.6,1)'
};
const calendarBox = {
  background: '#f3f4f6',
  borderRadius: 10,
  padding: '12px 10px',
  minWidth: 180
};
const calendarDay = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 0',
  fontSize: '1rem',
  borderBottom: '1px solid #e5e7eb'
};
const welcomeHeader = {
  position: 'absolute',
  top: 24,
  left: 40,
  zIndex: 2,
  fontSize: '1.3rem',
  fontWeight: 600,
  color: '#222',
  background: 'rgba(255,255,255,0.85)',
  borderRadius: 10,
  padding: '8px 22px',
  boxShadow: '0 2px 8px rgba(79,70,229,0.07)'
};

export default Dashboard; 