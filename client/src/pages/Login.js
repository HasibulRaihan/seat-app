import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <span style={styles.logoIcon}>🛡️</span>
        </div>
        <h2 style={styles.title}>SEAT Platform</h2>
        <p style={styles.subtitle}>Social Engineering Awareness Training</p>

        <div style={styles.tabs}>
          <span style={styles.activeTab}>Log in</span>
          <Link to="/register" style={styles.inactiveTab}>Register</Link>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="name@organisation.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in to SEAT'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.linkText}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #185fa5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: 'clamp(24px, 5vw, 40px)',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  logoBox: { textAlign: 'center', marginBottom: '12px' },
  logoIcon: { fontSize: 'clamp(36px, 8vw, 52px)' },
  title: {
    textAlign: 'center',
    fontSize: 'clamp(18px, 4vw, 24px)',
    fontWeight: '700',
    margin: '0 0 4px',
    color: '#1e3a5f',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 'clamp(11px, 2.5vw, 13px)',
    color: '#888',
    margin: '0 0 24px',
  },
  tabs: {
    display: 'flex',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  activeTab: {
    flex: 1,
    padding: 'clamp(8px, 2vw, 11px)',
    textAlign: 'center',
    background: '#1e3a5f',
    color: '#fff',
    fontWeight: '600',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    cursor: 'default',
  },
  inactiveTab: {
    flex: 1,
    padding: 'clamp(8px, 2vw, 11px)',
    textAlign: 'center',
    color: '#888',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    textDecoration: 'none',
    background: '#f9f9f9',
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    border: '1px solid #fca5a5',
  },
  field: { marginBottom: '16px' },
  label: {
    display: 'block',
    fontSize: 'clamp(11px, 2.5vw, 13px)',
    fontWeight: '600',
    color: '#444',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: 'clamp(9px, 2vw, 11px) 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: 'clamp(13px, 3vw, 15px)',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: 'clamp(11px, 2.5vw, 13px)',
    background: '#1e3a5f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: 'clamp(14px, 3vw, 16px)',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'background 0.2s',
  },
  link: {
    textAlign: 'center',
    marginTop: '18px',
    fontSize: 'clamp(11px, 2.5vw, 13px)',
    color: '#888',
  },
  linkText: { color: '#185fa5', fontWeight: '600', textDecoration: 'none' },
};