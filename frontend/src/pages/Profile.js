import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

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
const profileCard = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  padding: '38px 32px',
  margin: '40px auto',
  zIndex: 2
};
const sectionStyle = {
  marginBottom: 28
};
const sectionTitle = {
  fontWeight: 700,
  fontSize: '1.1rem',
  color: '#4f46e5',
  marginBottom: 10
};
const inputStyle = {
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #ddd',
  fontSize: '1rem',
  marginBottom: 10,
  width: '100%',
  transition: 'box-shadow 0.18s, border 0.18s'
};
const dangerBtn = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 18px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: 8,
  transition: 'background 0.2s, color 0.2s, transform 0.1s'
};
const saveBtn = {
  background: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 18px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: 8,
  transition: 'background 0.2s, color 0.2s, transform 0.1s'
};
const editBtn = {
  background: '#f3f4f6',
  color: '#4f46e5',
  border: '1px solid #4f46e5',
  borderRadius: 8,
  padding: '10px 18px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: 8,
  transition: 'background 0.2s, color 0.2s, transform 0.1s'
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  const [error, setError] = React.useState('');
  React.useEffect(() => {
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    });
    setError('');
    setEditMode(false);
  }, [user]);
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      navigate('/');
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };
  const handleSave = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.bio) {
      setError('All fields are required.');
      return;
    }
    setEditMode(false);
    setError('');
    alert('Profile information saved!');
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
        Welcome, <span style={{ color: '#4f46e5', fontWeight: 700 }}>{user?.firstName || user?.name || 'Student'}</span>!
      </motion.div>
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 80, maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={profileCard}
        >
          <h1 style={{ fontWeight: 700, fontSize: '2rem', color: '#4f46e5', marginBottom: 24 }}>Settings</h1>
          {/* Personal Information */}
          <section style={sectionStyle}>
            <h2 style={sectionTitle}>Personal Information</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <motion.input type="text" name="firstName" placeholder="First Name" style={inputStyle} value={form.firstName} onChange={handleChange} disabled={!editMode}
                  whileFocus={{ boxShadow: '0 0 0 2px #4f46e5', border: '1.5px solid #4f46e5' }}
                />
                <motion.input type="text" name="lastName" placeholder="Last Name" style={inputStyle} value={form.lastName} onChange={handleChange} disabled={!editMode}
                  whileFocus={{ boxShadow: '0 0 0 2px #4f46e5', border: '1.5px solid #4f46e5' }}
                />
                <motion.input type="email" name="email" placeholder="Email" style={inputStyle} value={form.email} onChange={handleChange} disabled={!editMode}
                  whileFocus={{ boxShadow: '0 0 0 2px #4f46e5', border: '1.5px solid #4f46e5' }}
                />
                <motion.input type="tel" name="phone" placeholder="Phone Number" style={inputStyle} value={form.phone} onChange={handleChange} disabled={!editMode}
                  whileFocus={{ boxShadow: '0 0 0 2px #4f46e5', border: '1.5px solid #4f46e5' }}
                />
                <motion.textarea name="bio" placeholder="Bio/Description" style={inputStyle} rows={2} value={form.bio} onChange={handleChange} disabled={!editMode}
                  whileFocus={{ boxShadow: '0 0 0 2px #4f46e5', border: '1.5px solid #4f46e5' }}
                />
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <motion.button
                    style={{ ...saveBtn, opacity: editMode ? 1 : 0.6, cursor: editMode ? 'pointer' : 'not-allowed' }}
                    whileHover={editMode ? { scale: 1.04, background: '#6366f1' } : {}}
                    whileTap={editMode ? { scale: 0.97 } : {}}
                    onClick={handleSave}
                    disabled={!editMode}
                  >
                    Save
                  </motion.button>
                  <motion.button
                    style={editBtn}
                    whileHover={{ scale: 1.04, background: '#e0e7ff' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setEditMode((e) => !e); setError(''); }}
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ x: -16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 16, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      style={{ color: '#ef4444', marginTop: 10, fontWeight: 500 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <motion.button
              style={dangerBtn}
              whileHover={{ scale: 1.04, background: '#dc2626' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDelete}
            >
              Delete Account
            </motion.button>
          </section>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Profile; 