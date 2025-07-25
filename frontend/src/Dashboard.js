import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const studentName = 'Sine Shaday'; // Replace with dynamic name from user data in the future

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
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
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
        Welcome, <span style={{ color: '#4f46e5', fontWeight: 700 }}>{studentName}</span>!
      </motion.div>
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 1100, margin: '0 auto' }}>
        {/* Profile Dropdown Only */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <button
              className="dashboard__profile-btn"
              style={{
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                padding: 0,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(79,70,229,0.06)'
              }}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <img src={require('../assets/profileicon.png')} alt="Profile" style={profileIconStyle} />
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 48,
                background: '#fff',
                borderRadius: 10,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                minWidth: 140,
                zIndex: 100,
                padding: '8px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 0
              }}>
                <Link to="/profile" style={dropdownLink} onClick={() => setDropdownOpen(false)}>Profile</Link>
                <Link to="/settings" style={dropdownLink} onClick={() => setDropdownOpen(false)}>Settings</Link>
                <button style={{ ...dropdownLink, border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }} onClick={() => setDropdownOpen(false)}>Logout</button>
              </div>
            )}
          </div>
        </div>
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

// ... existing styles ...
const profileIconStyle = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #4f46e5',
  background: '#fff',
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
// ... existing styles ... 