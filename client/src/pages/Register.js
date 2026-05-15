import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await registerUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.brand}>
          <span style={s.brandIcon}>🛡️</span>
          <div>
            <div style={s.brandName}>SECURITY TRAINING</div>
            <div style={s.brandSub}>Cybersecurity Awareness Platform</div>
          </div>
        </div>
        <div style={s.heroText}>
          <h1 style={s.heroTitle}>Start Your<br/>Security Journey.</h1>
          <p style={s.heroDesc}>Join thousands of professionals building their cybersecurity awareness skills.</p>
        </div>
        <div style={s.features}>
          {['Free to join', 'Interactive simulations', 'Track your progress', 'Earn badges & points'].map(f => (
            <div key={f} style={s.featureItem}>
              <span style={s.featureDot}></span>
              <span style={s.featureText}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Create account</h2>
          <p style={s.cardSub}>Start your cybersecurity training today</p>

          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>First name</label>
                <input style={s.input} name="firstName" placeholder="John"
                  value={form.firstName} onChange={handleChange} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Last name</label>
                <input style={s.input} name="lastName" placeholder="Smith"
                  value={form.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input style={s.input} type="email" name="email"
                placeholder="name@organisation.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" name="password"
                placeholder="Min 8 characters"
                value={form.password} onChange={handleChange} required />
              <div style={s.passHint}>
                <div style={{
                  ...s.passBar,
                  width: form.password.length === 0 ? '0%' : form.password.length < 8 ? '33%' : form.password.length < 12 ? '66%' : '100%',
                  background: form.password.length < 8 ? '#EF4444' : form.password.length < 12 ? '#F59E0B' : '#00C896',
                }} />
              </div>
            </div>
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={s.switchText}>
            Already have an account?{' '}
            <Link to="/" style={s.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display:'flex', minHeight:'100vh', background:'#070D14', fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  left: { flex:1, background:'linear-gradient(160deg, #0A1628 0%, #070D14 60%)', borderRight:'1px solid #1E2D3D', padding:'clamp(32px,5vw,64px)', display:'flex', flexDirection:'column', justifyContent:'space-between' },
  brand: { display:'flex', alignItems:'center', gap:'12px' },
  brandIcon: { fontSize:'32px' },
  brandName: { fontSize:'13px', fontWeight:'700', color:'#E2E8F0', letterSpacing:'2px' },
  brandSub: { fontSize:'11px', color:'#4B5563', letterSpacing:'1px' },
  heroText: { flex:1, display:'flex', flexDirection:'column', justifyContent:'center' },
  heroTitle: { fontSize:'clamp(28px,4vw,48px)', fontWeight:'800', color:'#F1F5F9', lineHeight:1.2, margin:'0 0 20px' },
  heroDesc: { fontSize:'15px', color:'#4B5563', lineHeight:1.7, maxWidth:'400px', margin:0 },
  features: { display:'flex', flexDirection:'column', gap:'12px' },
  featureItem: { display:'flex', alignItems:'center', gap:'12px' },
  featureDot: { width:'8px', height:'8px', borderRadius:'50%', background:'#00C896', boxShadow:'0 0 8px #00C89680', flexShrink:0 },
  featureText: { fontSize:'14px', color:'#6B7280' },
  right: { width:'clamp(340px,40%,500px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 32px' },
  card: { width:'100%', maxWidth:'400px' },
  cardTitle: { fontSize:'28px', fontWeight:'700', color:'#F1F5F9', margin:'0 0 8px' },
  cardSub: { fontSize:'14px', color:'#4B5563', margin:'0 0 28px' },
  error: { background:'#1F0A0A', border:'1px solid #5C1A1A', color:'#EF4444', padding:'12px 16px', borderRadius:'10px', marginBottom:'16px', fontSize:'13px' },
  row: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
  field: { marginBottom:'16px' },
  label: { display:'block', fontSize:'13px', fontWeight:'600', color:'#9CA3AF', marginBottom:'8px', letterSpacing:'0.5px' },
  input: { width:'100%', padding:'13px 16px', background:'#0F1F30', border:'1px solid #1E2D3D', borderRadius:'10px', fontSize:'14px', color:'#F1F5F9', boxSizing:'border-box', outline:'none' },
  passHint: { height:'3px', background:'#1E2D3D', borderRadius:'2px', marginTop:'8px', overflow:'hidden' },
  passBar: { height:'100%', borderRadius:'2px', transition:'all 0.3s' },
  btn: { width:'100%', padding:'14px', background:'linear-gradient(135deg, #00C896, #0088CC)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:'700', cursor:'pointer', marginTop:'4px' },
  switchText: { textAlign:'center', marginTop:'24px', fontSize:'14px', color:'#4B5563' },
  switchLink: { color:'#00C896', fontWeight:'600', textDecoration:'none' },
};