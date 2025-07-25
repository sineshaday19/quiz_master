import React, { useState, useRef } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownSearch, setShowDropdownSearch] = useState(false);
  const [filter, setFilter] = useState('all');
  const searchTimeout = useRef();
  const navigate = useNavigate();

  // Mock search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(!!value);
    setSearching(true);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      // Mock results
      setSearchResults(value ? {
        quizzes: value ? [
          { id: 1, name: 'Math Quiz', type: 'quiz' },
          { id: 2, name: 'Science Quiz', type: 'quiz' }
        ] : [],
        classes: value ? [
          { id: 1, name: 'Algebra Class', type: 'class' }
        ] : [],
        students: value ? [
          { id: 1, name: 'Sine Shaday', type: 'student' }
        ] : []
      } : null);
      setSearching(false);
    }, 600);
  };

  const handleResultClick = (result) => {
    setShowDropdown(false);
    setSearch('');
    // Navigate to the result page (mock)
    if (result.type === 'quiz') navigate(`/dashboard?quiz=${result.id}`);
    else if (result.type === 'class') navigate(`/dashboard?class=${result.id}`);
    else if (result.type === 'student') navigate(`/dashboard?student=${result.id}`);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <span className="logo-text">QuizMaster</span>
      </div>
      <nav className="header__nav">
        <Link to="/" className="header__link">Home</Link>
        <Link to="/contact" className="header__link">Contact</Link>
        {!user && <Link to="/login" className="header__link">Login</Link>}
        {!user && <Link to="/register" className="header__register-btn">Register</Link>}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {/* Quiz Dropdown */}
            <div
              style={{ position: 'relative', marginRight: 10 }}
              onMouseEnter={() => { setShowDropdown(true); setShowDropdownSearch(false); }}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: 8,
                  padding: '7px 18px 7px 14px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(79,70,229,0.06)',
                  transition: 'background 0.18s',
                  gap: 7
                }}
                type="button"
              >
                Quiz
                <span style={{ display: 'inline-block', marginLeft: 4, transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </button>
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 38,
                  left: 0,
                  background: '#fff',
                  borderRadius: 10,
                  boxShadow: '0 4px 24px rgba(79,70,229,0.13)',
                  minWidth: 170,
                  zIndex: 200,
                  padding: '8px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0
                }}>
                  <Link to="/quiz-results" style={dropdownLink}>Quiz Results</Link>
                  <Link to="/quiz/1/take" style={dropdownLink}>Quiz Take</Link>
                </div>
              )}
            </div>
            {/* Search Bar */}
            <div style={{ position: 'relative', marginLeft: 10 }}>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search quizzes, classes, topics…"
                style={{
                  padding: '8px 36px 8px 38px',
                  borderRadius: 20,
                  border: '1px solid #e5e7eb',
                  fontSize: '1rem',
                  width: 220,
                  background: '#f3f4f6',
                  outline: 'none',
                  transition: 'box-shadow 0.2s',
                  boxShadow: showDropdownSearch ? '0 2px 8px rgba(79,70,229,0.08)' : 'none'
                }}
                onFocus={() => { setShowDropdownSearch(true); setShowDropdown(false); }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {/* Magnifying glass icon */}
              <span style={{ position: 'absolute', left: 12, top: 8, color: '#888', fontSize: 18 }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              {/* Spinner */}
              {searching && (
                <span style={{ position: 'absolute', right: 12, top: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#4f46e5" strokeWidth="4" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.7s" repeatCount="indefinite"/></circle></svg>
                </span>
              )}
              {/* Dropdown results */}
              {showDropdownSearch && searchResults && (
                <div style={{
                  position: 'absolute',
                  top: 38,
                  left: 0,
                  width: 320,
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 4px 24px rgba(79,70,229,0.13)',
                  zIndex: 100,
                  padding: '10px 0',
                  marginTop: 2
                }}>
                  {/* Quick Filters */}
                  <div style={{ display: 'flex', gap: 8, padding: '0 16px 8px 16px' }}>
                    <button onClick={() => setFilter('all')} style={{ background: filter==='all' ? '#4f46e5' : '#f3f4f6', color: filter==='all' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>All</button>
                    <button onClick={() => setFilter('my')} style={{ background: filter==='my' ? '#4f46e5' : '#f3f4f6', color: filter==='my' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>My quizzes only</button>
                  </div>
                  {/* Categorized Results */}
                  {filter !== 'my' && (
                    <>
                      <div style={{ padding: '4px 16px', fontWeight: 700, color: '#4f46e5', fontSize: 13 }}>Quizzes</div>
                      {searchResults.quizzes.map(q => (
                        <div key={q.id} style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 15, color: '#222', display: 'flex', alignItems: 'center' }} onClick={() => handleResultClick(q)}>
                          {q.name}
                        </div>
                      ))}
                      <div style={{ padding: '4px 16px', fontWeight: 700, color: '#4f46e5', fontSize: 13 }}>Classes</div>
                      {searchResults.classes.map(c => (
                        <div key={c.id} style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 15, color: '#222', display: 'flex', alignItems: 'center' }} onClick={() => handleResultClick(c)}>
                          {c.name}
                        </div>
                      ))}
                      <div style={{ padding: '4px 16px', fontWeight: 700, color: '#4f46e5', fontSize: 13 }}>Students</div>
                      {searchResults.students.map(s => (
                        <div key={s.id} style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 15, color: '#222', display: 'flex', alignItems: 'center' }} onClick={() => handleResultClick(s)}>
                          {s.name}
                        </div>
                      ))}
                    </>
                  )}
                  {filter === 'my' && (
                    <>
                      <div style={{ padding: '4px 16px', fontWeight: 700, color: '#4f46e5', fontSize: 13 }}>My Quizzes</div>
                      {/* Mock: Only show quizzes with 'My' in name */}
                      {searchResults.quizzes.filter(q => q.name.includes('Math')).map(q => (
                        <div key={q.id} style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 15, color: '#222', display: 'flex', alignItems: 'center' }} onClick={() => handleResultClick(q)}>
                          {q.name}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Profile Icon and Dropdown */}
            <button
              className="header__profile-btn"
              style={{
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                padding: 0,
                width: 36,
                height: 36,
                marginLeft: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(79,70,229,0.06)'
              }}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <img src={require('./assets/profileicon.png')} alt="Profile" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #4f46e5', background: '#fff' }} />
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 44,
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
                {/* Only Settings and Logout */}
                <Link to="/profile" style={dropdownLink} onClick={() => setDropdownOpen(false)}>Settings</Link>
                <button
                  style={{ ...dropdownLink, border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

const dropdownLink = {
  padding: '10px 18px',
  color: '#222',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '1rem',
  borderBottom: '1px solid #f3f4f6',
  transition: 'background 0.2s',
  background: 'none',
  display: 'block',
};

export default Header; 