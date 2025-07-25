import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const inputStyle = valid => ({
  padding: '12px 14px',
  borderRadius: 8,
  border: `1.5px solid ${valid === false ? '#ef4444' : valid === true ? '#22c55e' : '#ddd'}`,
  fontSize: '1rem',
  marginBottom: 0,
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
  transition: 'background 0.2s'
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('Student');
  const [touched, setTouched] = React.useState({});

  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setRole('Student');
    setTouched({});
  }, [location.pathname]);

  const validEmail = validateEmail(email);
  const validPassword = password.length >= 4;
  const allValid = validEmail && validPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allValid) return;
    login(email.trim(), password, role);
    if (role === 'Instructor') {
      navigate('/instructor-dashboard');
    } else {
      navigate('/dashboard');
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
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80 }}>
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={formStyle}
          onSubmit={handleSubmit}
        >
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setTouched(t => ({ ...t, email: true })); }}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            required
            style={inputStyle(touched.email ? validEmail : undefined)}
            aria-invalid={touched.email && !validEmail}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setTouched(t => ({ ...t, password: true })); }}
            onBlur={() => setTouched(t => ({ ...t, password: true }))}
            required
            style={inputStyle(touched.password ? validPassword : undefined)}
            aria-invalid={touched.password && !validPassword}
          />
          <select style={inputStyle()} value={role} onChange={e => setRole(e.target.value)}>
            <option>Student</option>
            <option>Instructor</option>
          </select>
          <button type="submit" style={{ ...buttonStyle, opacity: allValid ? 1 : 0.6, cursor: allValid ? 'pointer' : 'not-allowed' }} disabled={!allValid}>Login</button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/register" style={{ color: '#4f46e5', textDecoration: 'underline', fontWeight: 500 }}>Register</a>
          </div>
        </motion.form>
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
const formStyle = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  padding: '38px 32px',
  width: 380,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  margin: '40px auto',
  zIndex: 2
};

export default Login; 