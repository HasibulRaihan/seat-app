import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyResults } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [results, setResults] = useState([]);

  useEffect(() => {
    getMyResults().then(res => setResults(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const completedModules = results.length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length)
    : 0;

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>🛡️ SEAT</div>
        <nav style={styles.nav}>
          <div style={styles.navActive}>📊 Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/simulation')}>🎯 Training</div>
          <div style={styles.navItem}>🏆 Leaderboard</div>
          <div style={styles.navItem}>📈 Reports</div>
          {user.role === 'admin' && (
            <div style={styles.navItem} onClick={() => navigate('/admin')}>⚙️ Admin</div>
          )}
        </nav>
        <div style={styles.logoutBtn} onClick={logout}>🚪 Log out</div>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.welcome}>Welcome back, {user.firstName}! 👋</h2>
            <p style={styles.welcomeSub}>Continue your security awareness training</p>
          </div>
          <div style={styles.avatar}>{user.firstName?.[0]}{user.lastName?.[0]}</div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Modules Done</p>
            <p style={styles.statValue}>{completedModules}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Points</p>
            <p style={{...styles.statValue, color:'#1e3a5f'}}>{user.totalPoints || 0}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Avg Score</p>
            <p style={{...styles.statValue, color:'#3b6d11'}}>{avgScore}%</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Risk Level</p>
            <p style={{...styles.statValue, color:'#a32d2d'}}>{user.riskScore || 'High'}</p>
          </div>
        </div>

        {/* Progress */}
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <span style={styles.progressTitle}>Overall progress</span>
            <span style={styles.progressCount}>{completedModules} / 5 modules</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width:`${(completedModules/5)*100}%`}}/>
          </div>
        </div>

        {/* Modules */}
        <h3 style={styles.sectionTitle}>Training Modules</h3>
        <div style={styles.modulesGrid}>
          <div style={styles.moduleCard} onClick={() => navigate('/simulation')}>
            <span style={styles.moduleTag}>Phishing</span>
            <h4 style={styles.moduleName}>Email Phishing Simulation</h4>
            <p style={styles.moduleSub}>Learn to identify suspicious emails</p>
            <div style={styles.startBtn}>Start →</div>
          </div>
          <div style={styles.moduleCard}>
            <span style={{...styles.moduleTag, background:'#ede9fe', color:'#5b21b6'}}>Chatbot</span>
            <h4 style={styles.moduleName}>AI Social Engineer</h4>
            <p style={styles.moduleSub}>Practise responding to manipulation</p>
            <div style={styles.startBtn}>Coming soon</div>
          </div>
          <div style={styles.moduleCard}>
            <span style={{...styles.moduleTag, background:'#dcfce7', color:'#166534'}}>Pretexting</span>
            <h4 style={styles.moduleName}>Pretexting Scenario</h4>
            <p style={styles.moduleSub}>Spot impersonation attacks</p>
            <div style={styles.startBtn}>Coming soon</div>
          </div>
        </div>

        {/* Recent results */}
        {results.length > 0 && (
          <>
            <h3 style={styles.sectionTitle}>Recent Results</h3>
            <div style={styles.resultsTable}>
              <div style={styles.tableHeader}>
                <span>Module</span><span>Score</span><span>Result</span><span>Date</span>
              </div>
              {results.slice(0,5).map((r, i) => (
                <div key={i} style={styles.tableRow}>
                  <span style={{textTransform:'capitalize'}}>{r.moduleType}</span>
                  <span>{r.score}%</span>
                  <span style={{color: r.passed ? '#166534' : '#991b1b'}}>
                    {r.passed ? '✅ Passed' : '❌ Failed'}
                  </span>
                  <span>{new Date(r.completedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display:'flex', minHeight:'100vh', background:'#f0f4f8' },
  sidebar: { width:'200px', background:'#0c447c', padding:'24px 16px', display:'flex', flexDirection:'column', gap:'8px', position:'fixed', height:'100vh' },
  logo: { color:'#fff', fontSize:'18px', fontWeight:'600', marginBottom:'24px' },
  nav: { display:'flex', flexDirection:'column', gap:'4px', flex:1 },
  navActive: { padding:'10px 12px', background:'#185fa5', borderRadius:'8px', color:'#fff', fontSize:'13px', fontWeight:'500', cursor:'pointer' },
  navItem: { padding:'10px 12px', color:'#b5d4f4', fontSize:'13px', cursor:'pointer', borderRadius:'8px' },
  logoutBtn: { padding:'10px 12px', color:'#b5d4f4', fontSize:'13px', cursor:'pointer' },
  main: { marginLeft:'200px', padding:'32px', flex:1 },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' },
  welcome: { fontSize:'22px', fontWeight:'600', margin:'0 0 4px', color:'#1e3a5f' },
  welcomeSub: { fontSize:'13px', color:'#666', margin:0 },
  avatar: { width:'40px', height:'40px', background:'#185fa5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'600', fontSize:'14px' },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'20px' },
  statCard: { background:'#fff', borderRadius:'12px', padding:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  statLabel: { fontSize:'12px', color:'#666', margin:'0 0 6px' },
  statValue: { fontSize:'28px', fontWeight:'600', margin:0, color:'#1e3a5f' },
  progressCard: { background:'#fff', borderRadius:'12px', padding:'16px', marginBottom:'24px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  progressHeader: { display:'flex', justifyContent:'space-between', marginBottom:'8px' },
  progressTitle: { fontSize:'14px', fontWeight:'500', color:'#1e3a5f' },
  progressCount: { fontSize:'13px', color:'#666' },
  progressBar: { background:'#e5e7eb', borderRadius:'4px', height:'10px' },
  progressFill: { background:'#185fa5', height:'10px', borderRadius:'4px', transition:'width 0.5s' },
  sectionTitle: { fontSize:'16px', fontWeight:'600', color:'#1e3a5f', margin:'0 0 16px' },
  modulesGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'32px' },
  moduleCard: { background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', cursor:'pointer' },
  moduleTag: { fontSize:'11px', background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:'4px', fontWeight:'500' },
  moduleName: { fontSize:'15px', fontWeight:'600', margin:'10px 0 4px', color:'#1e3a5f' },
  moduleSub: { fontSize:'12px', color:'#666', margin:'0 0 12px' },
  startBtn: { fontSize:'13px', color:'#185fa5', fontWeight:'500' },
  resultsTable: { background:'#fff', borderRadius:'12px', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  tableHeader: { display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'12px 16px', background:'#f8fafc', fontSize:'12px', fontWeight:'600', color:'#666' },
  tableRow: { display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'12px 16px', fontSize:'13px', borderTop:'1px solid #f0f0f0', color:'#333' }
};