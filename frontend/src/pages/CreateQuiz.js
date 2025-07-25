import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const initialQuestion = { question: '', options: ['', ''], correct: 0 };

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([ { ...initialQuestion } ]);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };
  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, options: q.options.map((o, j) => j === oIdx ? value : o) } : q));
  };
  const addQuestion = () => setQuestions(qs => [...qs, { ...initialQuestion }]);
  const addOption = (qIdx) => setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, options: [...q.options, ''] } : q));
  const removeOption = (qIdx, oIdx) => setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, options: q.options.filter((_, j) => j !== oIdx) } : q));

  const handleSubmit = e => {
    e.preventDefault();
    // Validation: every question must have a correct answer selected
    for (let i = 0; i < questions.length; i++) {
      if (typeof questions[i].correct !== 'number' || questions[i].correct < 0 || questions[i].correct >= questions[i].options.length) {
        setError(`Please select the correct answer for question ${i + 1}.`);
        return;
      }
    }
    setError('');
    const quiz = { title, description, category, questions, deadline };
    // Save to localStorage (mock backend)
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    localStorage.setItem('quizzes', JSON.stringify([quiz, ...quizzes]));
    navigate('/instructor-dashboard');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }} transition={{ duration: 0.6 }} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <img src={require('../assets/background.png')} alt="background" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 0, filter: 'blur(8px) brightness(0.95)' }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.7)', zIndex: 0 }} />
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 700, margin: '0 auto' }}>
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '38px 32px', width: '100%', display: 'flex', flexDirection: 'column', gap: 18, margin: '40px auto', zIndex: 2 }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>Create New Quiz</h2>
          <input type="text" placeholder="Quiz Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1.5px solid #ddd', fontSize: '1rem' }} />
          <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1.5px solid #ddd', fontSize: '1rem' }} />
          <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1.5px solid #ddd', fontSize: '1rem' }} />
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ padding: 12, borderRadius: 8, border: '1.5px solid #ddd', fontSize: '1rem', marginBottom: 8 }} />
          {error && <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>{error}</div>}
          <div style={{ marginTop: 18 }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Questions</h3>
            {questions.map((q, idx) => (
              <div key={idx} style={{ background: '#f3f4f6', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <input type="text" placeholder={`Question ${idx + 1}`} value={q.question} onChange={e => handleQuestionChange(idx, 'question', e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1.5px solid #ddd', fontSize: '1rem', width: '100%', marginBottom: 8 }} />
                <div style={{ marginLeft: 8 }}>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <input
                        type="radio"
                        name={`correct-${idx}`}
                        checked={q.correct === oIdx}
                        onChange={() => handleQuestionChange(idx, 'correct', oIdx)}
                        style={{ marginRight: 6 }}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={e => handleOptionChange(idx, oIdx, e.target.value)}
                        required
                        style={{ padding: 8, borderRadius: 6, border: '1.2px solid #ddd', fontSize: '0.98rem', flex: 1 }}
                      />
                      {q.options.length > 2 && <button type="button" onClick={() => removeOption(idx, oIdx)} style={{ marginLeft: 8, color: '#ef4444', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>✕</button>}
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(idx)} style={{ marginTop: 4, color: '#4f46e5', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>+ Add Option</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addQuestion} style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>+ Add Question</button>
          </div>
          <button type="submit" style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: '1.1rem', marginTop: 10, cursor: 'pointer', transition: 'background 0.2s' }}>Create Quiz</button>
        </motion.form>
      </main>
    </motion.div>
  );
};

export default CreateQuiz; 