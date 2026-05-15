import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyResults } from '../services/api';

export default function Reports() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    getMyResults()
      .then(res => { setResults(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalAttempts = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const avgScore = totalAttempts > 0
    ? Math.round(results.reduce((a, b) => a + b.score, 0) / totalAttempts)
    : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...results.map(r => r.score)) : 0;

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>🛡️ SEAT</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate('/dashboard')}>📊 Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/simulation')}>🎯 Training</div>
          <div style={styles.navItem} onClick={() => navigate('/leaderboard')}>🏆 Leaderboard</div>
          <div style={styles.navActive}>📈 Reports</div>
        </nav>
        <div style={styles.logoutBtn} onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}>🚪 Log out</div>
      </div>

      <div style={styles.main}>
        <h2 style={styles.pageTitle}>📈 My Training Report</h2>
        <p style={styles.pageSub}>
          {user.firstName} {user.lastName} — Personal performance overview
        </p>

        {/* Summary cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Attempts</p>
            <p style={styles.statValue}>{totalAttempts}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Passed</p>
            <p style={{ ...styles.statValue, color: '#166534' }}>{passed}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Failed</p>
            <p style={{ ...styles.statValue, color: '#991b1b' }}>{failed}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Average Score</p>
            <p style={{ ...styles.statValue, color: '#185fa5' }}>{avgScore}%</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Best Score</p>
            <p style={{ ...styles.statValue, color: '#166534' }}>{bestScore}%</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Points</p>
            <p style={{ ...styles.statValue, color: '#1e3a5f' }}>{user.totalPoints || 0}</p>
          </div>
        </div>

        {/* Score trend */}
        {results.length > 0 && (
          <div style={styles.trendCard}>
            <h3 style={styles.trendTitle}>Score Trend</h3>
            <div style={styles.trendBars}>
              {results.slice(0, 10).reverse().map((r, i) => (
                <div key={i} style={styles.trendItem}>
                  <div style={styles.trendBarOuter}>
                    <div style={{
                      ...styles.trendBarFill,
                      height: `${r.score}%`,
                      background: r.score >= 80 ? '#166534' : r.score >= 60 ? '#92400e' : '#991b1b',
                    }} />
                  </div>
                  <span style={styles.trendScore}>{r.score}%</span>
                </div>
              ))}
            </div>
            <p style={styles.trendNote}>Last {Math.min(results.length, 10)} attempts</p>
          </div>
        )}

        {/* Detailed history */}
        <h3 style={styles.sectionTitle}>Full History</h3>
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>#</span>
              <span>Module</span>
              <span>Score</span>
              <span>Result</span>
              <span>Time</span>
              <span>Date</span>
            </div>
            {results.length === 0 ? (
              <div style={styles.empty}>
                No results yet — complete a training module to see your report!
              </div>
            ) : (
              results.map((r, i) => (
                <div key={i} style={{
                  ...styles.tableRow,
                  background: i % 2 === 0 ? '#fff' : '#f8fafc',
                }}>
                  <span style={{ color: '#888', fontSize: '12px' }}>{results.length - i}</span>
                  <span style={{ textTransform: 'capitalize', fontWeight: '500', color: '#1e3a5f' }}>
                    {r.moduleType}
                  </span>
                  <span style={{
                    fontWeight: '700',
                    color: r.score >= 80 ? '#166534' : r.score >= 60 ? '#92400e' : '#991b1b',
                  }}>
                    {r.score}%
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: r.passed ? '#166534' : '#991b1b',
                  }}>
                    {r.passed ? '✅ Passed' : '❌ Failed'}
                  </span>
                  <span style={{ color: '#888', fontSize: '12px' }}>
                    {r.timeTaken ? `${Math.round(r.timeTaken / 60)}m ${r.timeTaken % 60}s` : '—'}
                  </span>
                  <span style={{ color: '#888', fontSize: '12px' }}>
                    {new Date(r.completedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' },
  statCard: { background: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: '3px solid #185fa5' },
  statLabel: { fontSize: '11px', color: '#888', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' },
  statValue: { fontSize: '28px', fontWeight: '700', margin: 0, color: '#1e3a5f', lineHeight: 1 },
  trendCard: { background: '#fff', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  trendTitle: { fontSize: '15px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 16px' },
  trendBars: { display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' },
  trendItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 },
  trendBarOuter: { width: '100%', height: '60px', background: '#f0f4f8', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' },
  trendBarFill: { width: '100%', borderRadius: '4px', transition: 'height 0.5s' },
  trendScore: { fontSize: '10px', color: '#888', fontWeight: '600' },
  trendNote: { fontSize: '12px', color: '#888', margin: '8px 0 0', textAlign: 'center' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 16px' },
  loading: { textAlign: 'center', padding: '40px', color: '#888' },
  table: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflowX: 'auto' },
  tableHeader: { display: 'grid', gridTemplateColumns: '40px 1fr 80px 100px 80px 100px', padding: '14px 20px', background: '#1e3a5f', fontSize: '12px', fontWeight: '700', color: '#fff', minWidth: '500px' },
  tableRow: { display: 'grid', gridTemplateColumns: '40px 1fr 80px 100px 80px 100px', padding: '13px 20px', borderTop: '1px solid #f0f0f0', fontSize: '13px', minWidth: '500px', alignItems: 'center' },
  empty: { padding: '40px', textAlign: 'center', color: '#888', fontSize: '14px' },
};