import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const quickStats = [
  { label: 'Total Quizzes', value: 8 },
  { label: 'Total Students', value: 120 },
  { label: 'Average Score', value: '78%' },
  { label: 'Recent Activity', value: '2 new attempts' },
];
const recentQuizzes = [
  { title: 'Algebra Basics', date: '2025-07-20', id: 1 },
  { title: 'Physics Intro', date: '2025-07-18', id: 2 },
];
const notifications = [
  { msg: 'Student John Doe completed "Algebra Basics"', time: '2h ago' },
  { msg: 'Quiz "Physics Intro" published', time: '1d ago' },
];

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const now = new Date();
    quizzes = quizzes.filter(q => !q.deadline || new Date(q.deadline) >= now);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    setQuizzes(quizzes);
    const msgs = JSON.parse(localStorage.getItem('messages') || '[]');
    setMessages(msgs);
  }, []);

  const handleDelete = idx => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const updated = quizzes.filter((_, i) => i !== idx);
      setQuizzes(updated);
      localStorage.setItem('quizzes', JSON.stringify(updated));
    }
  };

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
        Welcome, <span style={{ color: '#4f46e5', fontWeight: 700 }}>Instructor</span>!
      </motion.div>
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 1100, margin: '0 auto' }}>
        {/* Quick Stats */}
        <motion.div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          {quickStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              style={sectionCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#4f46e5' }}>{stat.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 8 }}>{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>
        {/* Recent Quizzes */}
        <motion.div style={{ ...sectionCard, marginBottom: 32 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 style={sectionTitle}>Recent Quizzes</h2>
          {quizzes.map((q, idx) => (
            <motion.div key={idx} style={quizCard} whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(79,70,229,0.12)' }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{q.title}</div>
              <div style={{ color: '#666', fontSize: '0.97rem' }}>Published: {q.date || 'N/A'}</div>
              <div style={{ color: '#F59E0B', fontWeight: 500, marginTop: 4 }}>Deadline: {q.deadline ? new Date(q.deadline).toLocaleDateString() : 'N/A'}</div>
              <div style={{ color: '#4f46e5', fontWeight: 500, marginTop: 4, cursor: 'pointer', display: 'flex', gap: 16 }}>
                <span onClick={() => navigate(`/edit-quiz/${idx}`)}>Edit</span>
                <span onClick={() => navigate(`/view-quiz/${idx}`)}>View</span>
                <span onClick={() => handleDelete(idx)} style={{ color: '#ef4444' }}>Delete</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Quick Actions */}
        <motion.div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          <motion.button style={actionBtn} whileHover={{ scale: 1.05, background: '#6366f1' }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/create-quiz')}>Create New Quiz</motion.button>
          <motion.button style={actionBtn} whileHover={{ scale: 1.05, background: '#6366f1' }} whileTap={{ scale: 0.97 }}>Import Questions</motion.button>
          <motion.button style={actionBtn} whileHover={{ scale: 1.05, background: '#6366f1' }} whileTap={{ scale: 0.97 }}>View All Results</motion.button>
        </motion.div>
        {/* Analytics Charts (Mock) */}
        <motion.div style={{ ...sectionCard, marginBottom: 32 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 style={sectionTitle}>Analytics (Mock)</h2>
          <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
            [Charts will appear here]
          </div>
        </motion.div>
        {/* Notifications */}
        <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 style={sectionTitle}>Notifications</h2>
          {notifications.map((n, i) => (
            <div key={i} style={{ marginBottom: 10, color: '#444' }}>
              <span style={{ color: '#4f46e5', fontWeight: 600 }}>• </span>{n.msg} <span style={{ color: '#aaa', fontSize: '0.95rem' }}>({n.time})</span>
            </div>
          ))}
        </motion.div>
        {/* Messages from Contact Page */}
        <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 style={sectionTitle}>Messages</h2>
          {messages.length === 0 && <div style={{ color: '#888' }}>No messages yet.</div>}
          {messages.map((msg, i) => (
            <div key={i} style={{ background: '#f3f4f6', borderRadius: 8, padding: 12, marginBottom: 10 }}>
              <div style={{ fontWeight: 600 }}>{msg.name} <span style={{ color: '#888', fontWeight: 400 }}>({msg.email})</span></div>
              <div style={{ color: '#444', marginTop: 4 }}>{msg.message}</div>
            </div>
          ))}
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
  minWidth: 220,
  minHeight: 120,
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
const sectionTitle = {
  fontWeight: 700,
  fontSize: '1.2rem',
  color: '#4f46e5',
  marginBottom: 10
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
const actionBtn = {
  background: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '16px 32px',
  fontWeight: 700,
  fontSize: '1.1rem',
  marginBottom: 10,
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.2s',
  boxShadow: '0 2px 8px rgba(79,70,229,0.07)'
};

export default InstructorDashboard; 