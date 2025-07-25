import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

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

const Register = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [role, setRole] = React.useState('Student');
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [touched, setTouched] = React.useState({});
  const [success, setSuccess] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setRole('Student');
    setAcceptTerms(false);
    setTouched({});
    setSuccess(false);
  }, [location.pathname]);

  const validEmail = validateEmail(email);
  const validPassword = password.length >= 4;
  const validConfirm = confirmPassword === password && password.length >= 4;
  const validFirst = firstName.trim().length > 1;
  const validLast = lastName.trim().length > 1;
  const allValid = validEmail && validPassword && validConfirm && validFirst && validLast && acceptTerms;

  const handleSubmit = e => {
    e.preventDefault();
    if (!allValid) return;
    setSuccess(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setRole('Student');
    setAcceptTerms(false);
    setTouched({});
    setTimeout(() => {
      setSuccess(false);
      navigate('/login');
    }, 1800);
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
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setTouched(t => ({ ...t, email: true })); }}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            style={inputStyle(touched.email ? validEmail : undefined)}
            aria-invalid={touched.email && !validEmail}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setTouched(t => ({ ...t, password: true })); }}
            onBlur={() => setTouched(t => ({ ...t, password: true }))}
            style={inputStyle(touched.password ? validPassword : undefined)}
            aria-invalid={touched.password && !validPassword}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); setTouched(t => ({ ...t, confirm: true })); }}
            onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
            style={inputStyle(touched.confirm ? validConfirm : undefined)}
            aria-invalid={touched.confirm && !validConfirm}
            required
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              placeholder="First Name"
              style={{ ...inputStyle(touched.first ? validFirst : undefined), flex: '1 1 0', minWidth: 0 }}
              value={firstName}
              onChange={e => { setFirstName(e.target.value); setTouched(t => ({ ...t, first: true })); }}
              onBlur={() => setTouched(t => ({ ...t, first: true }))}
              aria-invalid={touched.first && !validFirst}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              style={{ ...inputStyle(touched.last ? validLast : undefined), flex: '1 1 0', minWidth: 0 }}
              value={lastName}
              onChange={e => { setLastName(e.target.value); setTouched(t => ({ ...t, last: true })); }}
              onBlur={() => setTouched(t => ({ ...t, last: true }))}
              aria-invalid={touched.last && !validLast}
              required
            />
          </div>
          <select style={inputStyle()} value={role} onChange={e => setRole(e.target.value)}>
            <option>Student</option>
            <option>Instructor</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0 18px 0' }}>
            <input type="checkbox" id="terms" style={{ marginRight: 8 }} checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
            <label htmlFor="terms" style={{ fontSize: '0.95rem', color: '#444' }}>I accept the terms & privacy policy</label>
          </div>
          <button type="submit" style={{ ...buttonStyle, opacity: allValid ? 1 : 0.6, cursor: allValid ? 'pointer' : 'not-allowed' }} disabled={!allValid}>Register</button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <a href="/login" style={{ color: '#4f46e5', textDecoration: 'underline', fontWeight: 500 }}>Login</a>
          </div>
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                style={{ color: '#22c55e', fontWeight: 600, textAlign: 'center', marginTop: 18 }}
              >
                Registration successful! Redirecting to login…
              </motion.div>
            )}
          </AnimatePresence>
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

export default Register; 