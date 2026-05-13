import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoBox}><span style={styles.logoIcon}>🛡️</span></div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join the SEAT training platform</p>

        <div style={styles.tabs}>
          <Link to="/" style={styles.inactiveTab}>Log in</Link>
          <span style={styles.activeTab}>Register</span>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>First name</label>
              <input style={styles.input} name="firstName" placeholder="Tanisa"
                value={form.firstName} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last name</label>
              <input style={styles.input} name="lastName" placeholder="Vabna"
                value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input style={styles.input} type="email" name="email"
              placeholder="name@organisation.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password (min 8 characters)</label>
            <input style={styles.input} type="password" name="password"
              placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center' },
  card: { background:'#fff', borderRadius:'16px', padding:'40px', width:'100%', maxWidth:'420px', boxShadow:'0 4px 24px rgba(0,0,0,0.1)' },
  logoBox: { textAlign:'center', marginBottom:'12px' },
  logoIcon: { fontSize:'48px' },
  title: { textAlign:'center', fontSize:'22px', fontWeight:'600', margin:'0 0 4px', color:'#1e3a5f' },
  subtitle: { textAlign:'center', fontSize:'13px', color:'#666', margin:'0 0 24px' },
  tabs: { display:'flex', borderRadius:'8px', border:'1px solid #ddd', overflow:'hidden', marginBottom:'20px' },
  activeTab: { flex:1, padding:'10px', textAlign:'center', background:'#1e3a5f', color:'#fff', fontWeight:'500', fontSize:'14px' },
  inactiveTab: { flex:1, padding:'10px', textAlign:'center', color:'#666', fontSize:'14px', textDecoration:'none' },
  error: { background:'#fee2e2', color:'#991b1b', padding:'10px', borderRadius:'8px', marginBottom:'16px', fontSize:'13px' },
  row: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
  field: { marginBottom:'16px' },
  label: { display:'block', fontSize:'13px', fontWeight:'500', color:'#444', marginBottom:'6px' },
  input: { width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box' },
  button: { width:'100%', padding:'12px', background:'#1e3a5f', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'500', cursor:'pointer' },
  link: { textAlign:'center', marginTop:'16px', fontSize:'13px', color:'#666' }
};