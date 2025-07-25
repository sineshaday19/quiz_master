import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';

const quizzes = [
  { title: 'Math Quiz', due: '2025-07-30', description: 'Algebra & Geometry', id: 1 },
  { title: 'Science Quiz', due: '2025-08-02', description: 'Physics Basics', id: 2 },
];
const attempts = [
  { quiz: 'Math Quiz', score: 85, date: '2025-07-20' },
  { quiz: 'Science Quiz', score: 92, date: '2025-07-18' },
];
const achievements = [
  { badge: 'Top Scorer', desc: 'Scored 90%+ in a quiz' },
  { badge: 'Quiz Streak', desc: 'Completed 5 quizzes in a row' },
];

const Dashboard = () => {
  const { user } = useAuth();

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
            {quizzes.map(q => (
              <motion.div key={q.id} style={quizCard} whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(79,70,229,0.12)' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{q.title}</div>
                <div style={{ color: '#666', fontSize: '0.97rem' }}>{q.description}</div>
                <div style={{ color: '#F59E0B', fontWeight: 500, marginTop: 4 }}>Due: {q.due}</div>
              </motion.div>
            ))}
          </motion.div>
          {/* Recent Attempts */}
          <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={sectionTitle}>Recent Attempts</h2>
            {attempts.map((a, i) => (
              <div key={i} style={attemptRow}>
                <span>{a.quiz}</span>
                <span style={{ color: a.score >= 90 ? '#22c55e' : '#4f46e5', fontWeight: 600 }}>{a.score}%</span>
                <span style={{ color: '#888' }}>{a.date}</span>
              </div>
            ))}
          </motion.div>
          {/* Achievements */}
          <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 style={sectionTitle}>Achievements</h2>
            {achievements.map((ach, i) => (
              <div key={i} style={badgeRow}>
                <span style={badgeIcon}>🏅</span>
                <span style={{ fontWeight: 600 }}>{ach.badge}</span>
                <span style={{ color: '#888', fontSize: '0.97rem', marginLeft: 8 }}>{ach.desc}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
        {/* Progress Tracking & Upcoming Deadlines */}
        <motion.div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 style={sectionTitle}>Progress Tracking</h2>
            <div style={{ margin: '18px 0' }}>
              <div style={{ color: '#4f46e5', fontWeight: 600 }}>Completion Rate</div>
              <div style={progressBarOuter}><div style={{ ...progressBarInner, width: '80%' }} /></div>
              <div style={{ color: '#F59E0B', fontWeight: 600, marginTop: 8 }}>80% completed</div>
            </div>
            <div style={{ color: '#888', fontSize: '0.97rem' }}>Improvement trend: <span style={{ color: '#22c55e', fontWeight: 600 }}>+12%</span></div>
          </motion.div>
          <motion.div style={sectionCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 style={sectionTitle}>Upcoming Deadlines</h2>
            <div style={{ color: '#888', fontSize: '0.97rem', marginBottom: 8 }}>Next 7 days</div>
            <div style={calendarBox}>
              <div style={calendarDay}><span>Jul 28</span><span style={{ color: '#4f46e5', fontWeight: 600 }}>Math Quiz</span></div>
              <div style={calendarDay}><span>Aug 2</span><span style={{ color: '#4f46e5', fontWeight: 600 }}>Science Quiz</span></div>
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