import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAllUsers } from '../services/api';

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAdminStats().then(res => setStats(res.data)).catch(() => {});
    getAllUsers().then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>🛡️ SEAT Admin</div>
        <nav style={styles.nav}>
          <div style={styles.navActive}>📊 Overview</div>
          <div style={styles.navItem}>👥 Users</div>
          <div style={styles.navItem}>📋 Scenarios</div>
          <div style={styles.navItem}>📈 Analytics</div>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>← Learner view</div>
        </nav>
        <div style={styles.logoutBtn} onClick={logout}>🚪 Log out</div>
      </div>

      <div style={styles.main}>
        <h2 style={styles.pageTitle}>Admin Dashboard</h2>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Users</p>
            <p style={styles.statValue}>{stats.totalUsers || 0}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Completion Rate</p>
            <p style={{...styles.statValue, color:'#166534'}}>{stats.completionRate || 0}%</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>High Risk Users</p>
            <p style={{...styles.statValue, color:'#991b1b'}}>{stats.highRiskUsers || 0}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Users</p>
            <p style={{...styles.statValue, color:'#1e3a5f'}}>{stats.activeUsers || 0}</p>
          </div>
        </div>

        {/* Users table */}
        <h3 style={styles.sectionTitle}>All Users</h3>
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Points</span>
            <span>Risk</span>
          </div>
          {users.map((u, i) => (
            <div key={i} style={styles.tableRow}>
              <span>{u.firstName} {u.lastName}</span>
              <span style={{color:'#666'}}>{u.email}</span>
              <span style={styles.roleBadge}>{u.role}</span>
              <span style={{color:'#1e3a5f', fontWeight:'500'}}>{u.totalPoints}</span>
              <span style={{
                color: u.riskScore === 'high' ? '#991b1b' :
                       u.riskScore === 'medium' ? '#92400e' : '#166534',
                fontWeight:'500', textTransform:'capitalize'
              }}>{u.riskScore}</span>
            </div>
          ))}
          {users.length === 0 && (
            <div style={{padding:'20px', textAlign:'center', color:'#666', fontSize:'14px'}}>
              No users registered yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display:'flex', minHeight:'100vh', background:'#f0f4f8' },
  sidebar: { width:'200px', background:'#0c447c', padding:'24px 16px', display:'flex', flexDirection:'column', gap:'8px', position:'fixed', height:'100vh' },
  logo: { color:'#fff', fontSize:'16px', fontWeight:'600', marginBottom:'24px' },
  nav: { display:'flex', flexDirection:'column', gap:'4px', flex:1 },
  navActive: { padding:'10px 12px', background:'#185fa5', borderRadius:'8px', color:'#fff', fontSize:'13px', fontWeight:'500', cursor:'pointer' },
  navItem: { padding:'10px 12px', color:'#b5d4f4', fontSize:'13px', cursor:'pointer', borderRadius:'8px' },
  logoutBtn: { padding:'10px 12px', color:'#b5d4f4', fontSize:'13px', cursor:'pointer' },
  main: { marginLeft:'200px', padding:'32px', flex:1 },
  pageTitle: { fontSize:'22px', fontWeight:'600', color:'#1e3a5f', margin:'0 0 24px' },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'32px' },
  statCard: { background:'#fff', borderRadius:'12px', padding:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  statLabel: { fontSize:'12px', color:'#666', margin:'0 0 6px' },
  statValue: { fontSize:'28px', fontWeight:'600', margin:0, color:'#1e3a5f' },
  sectionTitle: { fontSize:'16px', fontWeight:'600', color:'#1e3a5f', margin:'0 0 16px' },
  table: { background:'#fff', borderRadius:'12px', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  tableHeader: { display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', padding:'12px 16px', background:'#f8fafc', fontSize:'12px', fontWeight:'600', color:'#666' },
  tableRow: { display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', padding:'12px 16px', fontSize:'13px', borderTop:'1px solid #f0f0f0', color:'#333' },
  roleBadge: { background:'#e6f1fb', color:'#0c447c', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'500', textTransform:'capitalize', display:'inline-block', height:'fit-content' }
};