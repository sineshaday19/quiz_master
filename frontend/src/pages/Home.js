import React from 'react';
import { motion } from 'framer-motion';
import '../Header.css';

const Home = () => {
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
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>
        {/* Welcome Message */}
        <section style={{ textAlign: 'center', margin: '60px 0 40px 0' }}>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ fontSize: '2.7rem', fontWeight: 700, color: '#4f46e5', marginBottom: 10 }}
          >
            Welcome to QuizMaster!
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ fontSize: '1.5rem', fontWeight: 400, color: '#222', marginBottom: 30 }}
          >
            Create Professional Quizzes in Minutes
          </motion.h2>
        </section>
        {/* Features Section */}
        <section style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 40 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              style={featureCard}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 24px rgba(79,70,229,0.12)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            >
              <img src={require(`../assets/${f.icon}`)} alt={f.title} style={iconStyle} />
              <h3 style={featureTitle}>{f.title}</h3>
              <p style={featureDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </motion.div>
  );
};

const features = [
  {
    icon: 'quizicon.png',
    title: 'Easy Quiz Creation',
    desc: 'Build quizzes with multiple question types in just a few clicks.'
  },
  {
    icon: 'grading.png',
    title: 'Instant Grading',
    desc: 'Get automatic results and feedback as soon as quizzes are submitted.'
  },
  {
    icon: 'analytics.png',
    title: 'Detailed Analytics',
    desc: 'Track performance and progress with clear, visual reports.'
  },
  {
    icon: 'mobile.png',
    title: 'Mobile Friendly',
    desc: 'Take and create quizzes on any device, anywhere.'
  }
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
const featureCard = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  padding: '32px 28px',
  width: 260,
  minHeight: 220,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 20,
  cursor: 'pointer',
  transition: 'box-shadow 0.2s, transform 0.2s'
};
const iconStyle = {
  width: 48,
  height: 48,
  marginBottom: 18
};
const featureTitle = {
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#222',
  marginBottom: 8
};
const featureDesc = {
  fontSize: '1rem',
  color: '#555',
  textAlign: 'center'
};

export default Home; 