import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/api';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ leaderboard: [], myRank: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    getLeaderboard()
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const logout = () => { localStorage.clear(); window.location.href = '/'; };
  const medals = ['🥇', '🥈', '🥉'];

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
            <div style={{ ...s.mobileNavItem, background: '#0F2236' }} onClick={() => navigate('/leaderboard')}>🏆</div>
            <div style={s.mobileNavItem} onClick={() => navigate('/reports')}>📈</div>
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
        <h2 style={s.pageTitle}>🏆 Leaderboard</h2>
        <p style={s.pageSub}>Top performers in security awareness training</p>

        {/* My rank card */}
        <div style={s.myRankCard}>
          <div>
            <div style={s.myRankNum}>#{data.myRank}</div>
            <div style={s.myRankLabel}>Your current rank</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={s.myRankPoints}>{user.totalPoints || 0}</div>
            <div style={s.myRankLabel}>points</div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={s.loading}>Loading leaderboard...</div>
        ) : (
          <div style={s.table}>
            <div style={s.tableHeader}>
              <span>Rank</span>
              <span>Player</span>
              <span>Points</span>
              <span>Risk Level</span>
            </div>
            {data.leaderboard.map((u, i) => (
              <div key={i} style={{
                ...s.tableRow,
                background: u.firstName === user.firstName ? '#0F2236' : i % 2 === 0 ? '#0A1628' : '#0D1B2A',
                borderLeft: u.firstName === user.firstName ? '3px solid #00C896' : '3px solid transparent',
              }}>
                <span style={s.rank}>{i < 3 ? medals[i] : `#${i + 1}`}</span>
                <span style={s.playerName}>
                  {u.firstName} {u.lastName}
                  {u.firstName === user.firstName && (
                    <span style={s.youBadge}> (You)</span>
                  )}
                </span>
                <span style={s.points}>{u.totalPoints} pts</span>
                <span style={{
                  ...s.riskBadge,
                  background: u.riskScore === 'low' ? '#0D3321' : u.riskScore === 'medium' ? '#2A1E00' : '#200808',
                  color: u.riskScore === 'low' ? '#00C896' : u.riskScore === 'medium' ? '#F59E0B' : '#EF4444',
                  border: `1px solid ${u.riskScore === 'low' ? '#00C89644' : u.riskScore === 'medium' ? '#F59E0B44' : '#EF444444'}`,
                }}>
                  {u.riskScore
                    ? u.riskScore.charAt(0).toUpperCase() + u.riskScore.slice(1)
                    : 'High'} Risk
                </span>
              </div>
            ))}
            {data.leaderboard.length === 0 && (
              <div style={s.empty}>No users yet — complete a module to appear here!</div>
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
  myRankCard: { background: 'linear-gradient(135deg,#0A2E1F,#0D3D28)', border: '1px solid #1A5C3A', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  myRankNum: { fontSize: '40px', fontWeight: '800', color: '#00C896', lineHeight: 1 },
  myRankPoints: { fontSize: '40px', fontWeight: '800', color: '#00C896', lineHeight: 1 },
  myRankLabel: { fontSize: '13px', color: '#4B5563', marginTop: '4px' },
  loading: { textAlign: 'center', padding: '40px', color: '#4B5563' },
  table: { background: '#0A1628', border: '1px solid #1E2D3D', borderRadius: '16px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '60px 1fr 100px 110px', padding: '14px 20px', background: '#0F1F30', fontSize: '12px', fontWeight: '700', color: '#4B5563', letterSpacing: '0.5px' },
  tableRow: { display: 'grid', gridTemplateColumns: '60px 1fr 100px 110px', padding: '14px 20px', borderTop: '1px solid #1E2D3D', alignItems: 'center', transition: 'background 0.2s' },
  rank: { fontSize: '18px', fontWeight: '700' },
  playerName: { fontSize: '14px', fontWeight: '600', color: '#E2E8F0' },
  youBadge: { fontSize: '11px', color: '#00C896', fontWeight: '600' },
  points: { fontSize: '14px', fontWeight: '700', color: '#00C896' },
  riskBadge: { fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', display: 'inline-block', textAlign: 'center' },
  empty: { padding: '40px', textAlign: 'center', color: '#4B5563', fontSize: '14px' },
};