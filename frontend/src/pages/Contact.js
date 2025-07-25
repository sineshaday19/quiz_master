import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  maxWidth: 420,
  minHeight: 320,
  position: 'relative'
};
const inputStyle = valid => ({
  padding: '12px 14px',
  borderRadius: 8,
  border: `1.5px solid ${valid === false ? '#ef4444' : valid === true ? '#22c55e' : '#ddd'}`,
  fontSize: '1rem',
  marginBottom: 14,
  width: '100%',
  outline: 'none',
  transition: 'border 0.18s, box-shadow 0.18s'
});
const buttonStyle = {
  background: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 0',
  fontWeight: 700,
  fontSize: '1.1rem',
  marginTop: 10,
  cursor: 'pointer',
  transition: 'background 0.2s, transform 0.1s',
  width: '100%'
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Contact = () => {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = React.useState({});
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const validName = form.name.trim().length > 1;
  const validEmail = validateEmail(form.email);
  const validMessage = form.message.trim().length > 5;
  const allValid = validName && validEmail && validMessage;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };
  const handleBlur = e => {
    setTouched({ ...touched, [e.target.name]: true });
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!allValid) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTouched({});
      setTimeout(() => setSent(false), 3000);
    }, 1200);
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
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>
        <motion.form
          style={cardStyle}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24, color: '#4f46e5' }}>Contact Us</h2>
          <label htmlFor="name" style={{ fontWeight: 600, marginBottom: 4 }}>Name</label>
          <input
            id="name"
            name="name"
            type="text"
            style={inputStyle(touched.name ? validName : undefined)}
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            required
            aria-invalid={touched.name && !validName}
          />
          <label htmlFor="email" style={{ fontWeight: 600, marginBottom: 4 }}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            style={inputStyle(touched.email ? validEmail : undefined)}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            required
            aria-invalid={touched.email && !validEmail}
          />
          <label htmlFor="message" style={{ fontWeight: 600, marginBottom: 4 }}>Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            style={inputStyle(touched.message ? validMessage : undefined)}
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={touched.message && !validMessage}
          />
          <motion.button
            type="submit"
            style={{ ...buttonStyle, opacity: allValid && !sending ? 1 : 0.6, cursor: allValid && !sending ? 'pointer' : 'not-allowed' }}
            whileHover={allValid && !sending ? { scale: 1.04, background: '#6366f1' } : {}}
            whileTap={allValid && !sending ? { scale: 0.97 } : {}}
            disabled={!allValid || sending}
          >
            {sending ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span>Sending</span>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }} style={{ display: 'inline-block' }}>⏳</motion.span>
              </span>
            ) : 'Send'}
          </motion.button>
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                style={{ color: '#22c55e', fontWeight: 600, textAlign: 'center', marginTop: 18 }}
              >
                Message sent! We’ll get back to you soon.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </main>
    </motion.div>
  );
};

export default Contact; 