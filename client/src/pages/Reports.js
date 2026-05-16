import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyResults } from '../services/api';

export default function Reports() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    getMyResults()
      .then(res => { setResults(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const logout = () => { localStorage.clear(); window.location.href = '/'; };

  const totalAttempts = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const avgScore = totalAttempts > 0
    ? Math.round(results.reduce((a, b) => a + b.score, 0) / totalAttempts) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...results.map(r => r.score)) : 0;

  const navItems = [
    { icon: '▦', label: 'Dashboard',   path: '/dashboard'   },
    { icon: '◎', label: 'Simulations', path: '/simulation'  },
    { icon: '⬡', label: 'Leaderboard', path: '/leaderboard' },
    { icon: '▥', label: 'Reports',     path: '/reports'     },
  ];

  return (
    <div style={s.page}>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={s.sidebar}>
          <div style={s.logoWrap}>
            <span style={{ fontSize: '28px' }}>🛡️</span>
            <div>
              <div style={s.logoTitle}>SECURITY</div>
              <div style={s.logoSub}>TRAINING</div>
            </div>
          </div>
          <nav style={s.nav}>
            {navItems.map(item => (
              <div key={item.path}
                style={{ ...s.navItem, ...(window.location.pathname === item.path ? s.navActive : {}) }}
                onClick={() => navigate(item.path)}>
                <span style={s.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
          <div style={s.userSection}>
            <div style={s.userAvatar}>{user.firstName?.[0]}{user.lastName?.[0]}</div>
            <div style={s.userInfo}>
              <div style={s.userName}>{user.firstName} {user.lastName}</div>
              <div style={s.userRole}>{user.role || 'Learner'}</div>
            </div>
          </div>
          <div style={s.signOut} onClick={logout}>
            <span>↪</span><span>Sign Out</span>
          </div>
        </div>
      )}

      {/* Mobile Top Navbar */}
      {isMobile && (
        <div style={s.mobileNav}>
          <div style={s.mobileNavBrand}>
            <span style={{ fontSize: '22px' }}>🛡️</span>
            <span style={s.mobileNavTitle}>SEAT</span>
          </div>
          <div style={s.mobileNavLinks}>
            <div style={s.mobileNavItem} onClick={() => navigate('/dashboard')}>📊</div>
            <div style={s.mobileNavItem} onClick={() => navigate('/simulation')}>🎯</div>
            <div style={s.mobileNavItem} onClick={() => navigate('/leaderboard')}>🏆</div>
            <div style={{ ...s.mobileNavItem, background: '#0F2236' }} onClick={() => navigate('/reports')}>📈</div>
            <div style={s.mobileNavItem} onClick={logout}>🚪</div>
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{
        ...s.main,
        marginLeft: isMobile ? '0' : '260px',
        padding: isMobile ? '16px' : '32px 40px',
        marginTop: isMobile ? '60px' : '0',
      }}>
        <h2 style={s.pageTitle}>📈 My Training Report</h2>
        <p style={s.pageSub}>{user.firstName} {user.lastName} — Personal performance overview</p>

        {/* Stats */}
        <div style={{
          ...s.statsGrid,
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
        }}>
          {[
            { label: 'Total Attempts', value: totalAttempts, color: '#00C896', border: '#1A5C3A', bg: '#0A2E1F' },
            { label: 'Passed',         value: passed,        color: '#00C896', border: '#1A5C3A', bg: '#0A2E1F' },
            { label: 'Failed',         value: failed,        color: '#EF4444', border: '#5C1A1A', bg: '#200808' },
            { label: 'Average Score',  value: `${avgScore}%`,color: '#8B5CF6', border: '#3B1F8C', bg: '#1A1040' },
            { label: 'Best Score',     value: `${bestScore}%`,color: '#F59E0B',border: '#5C3D00', bg: '#1F1600' },
            { label: 'Total Points',   value: user.totalPoints||0, color: '#00C896', border: '#1A5C3A', bg: '#0A2E1F' },
          ].map((st, i) => (
            <div key={i} style={{ ...s.statCard, background: st.bg, border: `1px solid ${st.border}` }}>
              <p style={s.statLabel}>{st.label}</p>
              <p style={{ ...s.statValue, color: st.color }}>{st.value}</p>
            </div>
          ))}
        </div>

        {/* Score trend */}
        {results.length > 0 && (
          <div style={s.trendCard}>
            <h3 style={s.trendTitle}>Score Trend</h3>
            <div style={s.trendBars}>
              {results.slice(0, 10).reverse().map((r, i) => (
                <div key={i} style={s.trendItem}>
                  <div style={s.trendBarOuter}>
                    <div style={{
                      ...s.trendBarFill,
                      height: `${r.score}%`,
                      background: r.score >= 80 ? '#00C896' : r.score >= 60 ? '#F59E0B' : '#EF4444',
                    }}/>
                  </div>
                  <span style={s.trendScore}>{r.score}%</span>
                </div>
              ))}
            </div>
            <p style={s.trendNote}>Last {Math.min(results.length, 10)} attempts</p>
          </div>
        )}

        {/* Full history table */}
        <h3 style={s.sectionTitle}>Full History</h3>
        {loading ? (
          <div style={s.loading}>Loading...</div>
        ) : (
          <div style={{ ...s.table, overflowX: 'auto' }}>
            <div style={s.tableHeader}>
              <span>#</span>
              <span>Module</span>
              <span>Score</span>
              <span>Result</span>
              <span>Time</span>
              <span>Date</span>
            </div>
            {results.length === 0 ? (
              <div style={s.empty}>
                No results yet — complete a training module to see your report!
              </div>
            ) : (
              results.map((r, i) => (
                <div key={i} style={{
                  ...s.tableRow,
                  background: i % 2 === 0 ? '#0A1628' : '#0D1B2A',
                }}>
                  <span style={{ color: '#4B5563', fontSize: '12px' }}>{results.length - i}</span>
                  <span style={{ textTransform: 'capitalize', fontWeight: '500', color: '#E2E8F0' }}>
                    {r.moduleType}
                  </span>
                  <span style={{
                    fontWeight: '700',
                    color: r.score >= 80 ? '#00C896' : r.score >= 60 ? '#F59E0B' : '#EF4444',
                  }}>
                    {r.score}%
                  </span>
                  <span style={{
                    fontSize: '12px', fontWeight: '600',
                    color: r.passed ? '#00C896' : '#EF4444',
                  }}>
                    {r.passed ? '✅ Passed' : '❌ Failed'}
                  </span>
                  <span style={{ color: '#4B5563', fontSize: '12px' }}>
                    {r.timeTaken ? `${Math.round(r.timeTaken/60)}m ${r.timeTaken%60}s` : '—'}
                  </span>
                  <span style={{ color: '#4B5563', fontSize: '12px' }}>
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

const s = {
  page: { display: 'flex', minHeight: '100vh', background: '#070D14', color: '#E2E8F0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  sidebar: { width: '260px', background: '#0A1628', borderRight: '1px solid #1E2D3D', padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100 },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0 24px 28px', borderBottom: '1px solid #1E2D3D', marginBottom: '20px' },
  logoTitle: { fontSize: '13px', fontWeight: '700', color: '#E2E8F0', letterSpacing: '2px' },
  logoSub: { fontSize: '11px', color: '#4B5563', letterSpacing: '2px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', color: '#6B7280' },
  navActive: { background: '#0F2236', color: '#00C896', borderLeft: '3px solid #00C896', paddingLeft: '13px' },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  userSection: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', borderTop: '1px solid #1E2D3D', marginTop: 'auto' },
  userAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#00C896,#0088CC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', flexShrink: 0 },
  userInfo: { flex: 1, overflow: 'hidden' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: '11px', color: '#4B5563', textTransform: 'capitalize' },
  signOut: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontSize: '13px', color: '#4B5563', cursor: 'pointer', borderTop: '1px solid #1E2D3D' },
  mobileNav: { position: 'fixed', top: 0, left: 0, right: 0, height: '56px', background: '#0A1628', borderBottom: '1px solid #1E2D3D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 200 },
  mobileNavBrand: { display: 'flex', alignItems: 'center', gap: '8px' },
  mobileNavTitle: { fontSize: '14px', fontWeight: '700', color: '#E2E8F0', letterSpacing: '2px' },
  mobileNavLinks: { display: 'flex', gap: '4px' },
  mobileNavItem: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', background: '#0F1F30' },
  main: { flex: 1 },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#F1F5F9', margin: '0 0 4px' },
  pageSub: { fontSize: '14px', color: '#4B5563', margin: '0 0 24px' },
  statsGrid: { display: 'grid', gap: '12px', marginBottom: '24px' },
  statCard: { borderRadius: '14px', padding: '16px 20px' },
  statLabel: { fontSize: '11px', color: '#4B5563', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' },
  statValue: { fontSize: '28px', fontWeight: '700', margin: 0, lineHeight: 1 },
  trendCard: { background: '#0A1628', border: '1px solid #1E2D3D', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px' },
  trendTitle: { fontSize: '15px', fontWeight: '700', color: '#F1F5F9', margin: '0 0 16px' },
  trendBars: { display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' },
  trendItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 },
  trendBarOuter: { width: '100%', height: '60px', background: '#1E2D3D', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' },
  trendBarFill: { width: '100%', borderRadius: '4px', transition: 'height 0.5s' },
  trendScore: { fontSize: '10px', color: '#4B5563', fontWeight: '600' },
  trendNote: { fontSize: '12px', color: '#4B5563', margin: '8px 0 0', textAlign: 'center' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#F1F5F9', margin: '0 0 16px' },
  loading: { textAlign: 'center', padding: '40px', color: '#4B5563' },
  table: { background: '#0A1628', border: '1px solid #1E2D3D', borderRadius: '16px', overflow: 'hidden', minWidth: '100%' },
  tableHeader: { display: 'grid', gridTemplateColumns: '40px 1fr 80px 100px 80px 100px', padding: '14px 20px', background: '#0F1F30', fontSize: '12px', fontWeight: '700', color: '#4B5563', minWidth: '500px' },
  tableRow: { display: 'grid', gridTemplateColumns: '40px 1fr 80px 100px 80px 100px', padding: '13px 20px', borderTop: '1px solid #1E2D3D', fontSize: '13px', minWidth: '500px', alignItems: 'center' },
  empty: { padding: '40px', textAlign: 'center', color: '#4B5563', fontSize: '14px' },
};
