import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/api';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ leaderboard: [], myRank: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    getLeaderboard()
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>🛡️ SEAT</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>📊 Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/simulation')}>🎯 Training</div>
          <div style={styles.navActive}>🏆 Leaderboard</div>
          <div style={styles.navItem} onClick={() => navigate('/reports')}>📈 Reports</div>
        </nav>
        <div style={styles.logoutBtn} onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}>🚪 Log out</div>
      </div>

      <div style={styles.main}>
        <h2 style={styles.pageTitle}>🏆 Leaderboard</h2>
        <p style={styles.pageSub}>Top performers in security awareness training</p>

        {/* My rank card */}
        <div style={styles.myRankCard}>
          <div style={styles.myRankLeft}>
            <span style={styles.myRankNum}>#{data.myRank}</span>
            <span style={styles.myRankLabel}>Your current rank</span>
          </div>
          <div style={styles.myRankRight}>
            <span style={styles.myRankPoints}>{user.totalPoints || 0}</span>
            <span style={styles.myRankPLabel}>points</span>
          </div>
        </div>

        {/* Leaderboard table */}
        {loading ? (
          <div style={styles.loading}>Loading leaderboard...</div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Rank</span>
              <span>Player</span>
              <span>Points</span>
              <span>Risk Level</span>
            </div>
            {data.leaderboard.map((u, i) => (
              <div key={i} style={{
                ...styles.tableRow,
                background: u.firstName === user.firstName ? '#e6f1fb' : i % 2 === 0 ? '#fff' : '#f8fafc',
                borderLeft: u.firstName === user.firstName ? '4px solid #185fa5' : '4px solid transparent',
              }}>
                <span style={styles.rank}>
                  {i < 3 ? medals[i] : `#${i + 1}`}
                </span>
                <span style={styles.playerName}>
                  {u.firstName} {u.lastName}
                  {u.firstName === user.firstName && (
                    <span style={styles.youBadge}> (You)</span>
                  )}
                </span>
                <span style={styles.points}>{u.totalPoints} pts</span>
                <span style={{
                  ...styles.riskBadge,
                  background: u.riskScore === 'low' ? '#dcfce7' : u.riskScore === 'medium' ? '#fef3c7' : '#fee2e2',
                  color: u.riskScore === 'low' ? '#166534' : u.riskScore === 'medium' ? '#92400e' : '#991b1b',
                }}>
                  {u.riskScore ? u.riskScore.charAt(0).toUpperCase() + u.riskScore.slice(1) : 'High'} Risk
                </span>
              </div>
            ))}
            {data.leaderboard.length === 0 && (
              <div style={styles.empty}>No users yet — complete a module to appear here!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f0f4f8' },
  sidebar: { width: '210px', background: '#0c447c', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px', position: 'fixed', height: '100vh' },
  logo: { color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '32px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navActive: { padding: '10px 12px', background: '#185fa5', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  navItem: { padding: '10px 12px', color: '#b5d4f4', fontSize: '13px', cursor: 'pointer', borderRadius: '8px' },
  logoutBtn: { padding: '10px 12px', color: '#b5d4f4', fontSize: '13px', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '8px' },
  main: { marginLeft: '210px', padding: '32px', flex: 1 },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 4px' },
  pageSub: { fontSize: '14px', color: '#888', margin: '0 0 24px' },
  myRankCard: { background: 'linear-gradient(135deg, #1e3a5f, #185fa5)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', color: '#fff' },
  myRankLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  myRankNum: { fontSize: '40px', fontWeight: '800', lineHeight: 1 },
  myRankLabel: { fontSize: '13px', opacity: 0.8 },
  myRankRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
  myRankPoints: { fontSize: '40px', fontWeight: '800', lineHeight: 1 },
  myRankPLabel: { fontSize: '13px', opacity: 0.8 },
  loading: { textAlign: 'center', padding: '40px', color: '#888' },
  table: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', padding: '14px 20px', background: '#1e3a5f', fontSize: '12px', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' },
  tableRow: { display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', padding: '14px 20px', borderTop: '1px solid #f0f0f0', alignItems: 'center', transition: 'background 0.2s' },
  rank: { fontSize: '18px', fontWeight: '700' },
  playerName: { fontSize: '14px', fontWeight: '600', color: '#1e3a5f' },
  youBadge: { fontSize: '11px', color: '#185fa5', fontWeight: '600' },
  points: { fontSize: '14px', fontWeight: '700', color: '#185fa5' },
  riskBadge: { fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', width: 'fit-content' },
  empty: { padding: '40px', textAlign: 'center', color: '#888', fontSize: '14px' },
};