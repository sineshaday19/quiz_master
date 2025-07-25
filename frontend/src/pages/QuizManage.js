import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mockQuizzes = [
  { id: 1, title: 'Math Quiz', questions: 10, attempts: 23 },
  { id: 2, title: 'Science Quiz', questions: 8, attempts: 15 },
  { id: 3, title: 'History Quiz', questions: 12, attempts: 9 },
];

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
const quizRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#f3f4f6',
  borderRadius: 10,
  padding: '16px 18px',
  margin: '12px 0',
  fontSize: '1.05rem',
  fontWeight: 500,
  boxShadow: '0 1px 4px #4f46e522',
  transition: 'box-shadow 0.18s, transform 0.18s'
};
const buttonStyle = {
  background: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '8px 18px',
  fontWeight: 600,
  fontSize: '1rem',
  marginLeft: 8,
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.1s'
};
const dangerBtn = {
  ...buttonStyle,
  background: '#ef4444',
};

const QuizManage = () => {
  const [quizzes, setQuizzes] = React.useState(mockQuizzes);
  const [adding, setAdding] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');

  const handleDelete = (id) => {
    setQuizzes(qs => qs.filter(q => q.id !== id));
  };
  const handleAdd = () => {
    if (!newTitle.trim()) return;
    setQuizzes(qs => [...qs, { id: Date.now(), title: newTitle, questions: 0, attempts: 0 }]);
    setNewTitle('');
    setAdding(false);
  };

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
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#4f46e5', marginBottom: 10 }}>Manage Quizzes</h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
            <motion.button
              style={buttonStyle}
              whileHover={{ scale: 1.04, background: '#6366f1' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAdding(a => !a)}
            >
              {adding ? 'Cancel' : 'Add New Quiz'}
            </motion.button>
          </div>
          <AnimatePresence>
            {adding && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                style={{ display: 'flex', gap: 12, marginBottom: 18 }}
              >
                <input
                  type="text"
                  placeholder="Quiz Title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem', flex: 1 }}
                />
                <motion.button
                  style={buttonStyle}
                  whileHover={{ scale: 1.04, background: '#22c55e' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdd}
                >
                  Save
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <div>
            {quizzes.map(q => (
              <motion.div
                key={q.id}
                style={quizRow}
                whileHover={{ scale: 1.03, boxShadow: '0 4px 24px #4f46e522' }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#4f46e5' }}>{q.title}</div>
                  <div style={{ color: '#888', fontSize: '0.97rem' }}>{q.questions} questions | {q.attempts} attempts</div>
                </div>
                <div>
                  <motion.button
                    style={buttonStyle}
                    whileHover={{ scale: 1.04, background: '#F59E0B' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    style={dangerBtn}
                    whileHover={{ scale: 1.04, background: '#dc2626' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDelete(q.id)}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
            {quizzes.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No quizzes found.</div>}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default QuizManage; 