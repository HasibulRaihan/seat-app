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
    localStorage.clear();
    window.location.href = '/';
  };

  const completedModules = [...new Set(results.filter(r => r.passed).map(r => r.moduleType))].length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length)
    : 0;
  const streak = results.filter(r => r.passed).length;
  const isMobile = window.innerWidth <= 768;

  const modules = [
    {
      id: 'phishing',
      title: 'Email Phishing Basics',
      desc: 'Learn to identify suspicious emails, fake sender addresses, and common phishing techniques.',
      icon: '⚡',
      color: '#00C896',
      bg: '#0D2E1F',
      level: 'beginner',
      pts: 100,
      unlocked: true,
      route: '/simulation',
    },
    {
      id: 'spear',
      title: 'Spear Phishing Attacks',
      desc: 'Advanced targeted phishing attacks using personal information.',
      icon: '🎯',
      color: '#8B5CF6',
      bg: '#1A1040',
      level: 'intermediate',
      pts: 150,
      unlocked: completedModules >= 1,
      route: '/simulation',
    },
    {
      id: 'social',
      title: 'Social Engineering Tactics',
      desc: 'Pretexting, baiting, and manipulation techniques used by attackers.',
      icon: '🧠',
      color: '#F59E0B',
      bg: '#1F1A00',
      level: 'intermediate',
      pts: 200,
      unlocked: completedModules >= 2,
      route: '/simulation',
    },
    {
      id: 'advanced',
      title: 'Advanced Threat Detection',
      desc: 'Identify sophisticated multi-stage attacks and APT techniques.',
      icon: '🛡️',
      color: '#EF4444',
      bg: '#200D0D',
      level: 'advanced',
      pts: 300,
      unlocked: completedModules >= 3,
      route: '/simulation',
    },
  ];

  const levelColor = {
    beginner:     { bg: '#0D3321', color: '#00C896' },
    intermediate: { bg: '#1F1040', color: '#8B5CF6' },
    advanced:     { bg: '#2D0D0D', color: '#EF4444' },
  };

  return (
    <div style={s.page}>

      {/* ── DESKTOP SIDEBAR ── */}
      {!isMobile && (
        <div style={s.sidebar}>
          <div style={s.logoWrap}>
            <div style={s.logoIcon}>🛡️</div>
            <div>
              <div style={s.logoTitle}>SECURITY</div>
              <div style={s.logoSub}>TRAINING</div>
            </div>
          </div>

          <nav style={s.nav}>
            {[
              { icon: '▦', label: 'Dashboard',   path: '/dashboard'   },
              { icon: '◎', label: 'Simulations', path: '/simulation'  },
              { icon: '⬡', label: 'Leaderboard', path: '/leaderboard' },
              { icon: '▥', label: 'Reports',     path: '/reports'     },
            ].map((item) => (
              <div
                key={item.path}
                style={{
                  ...s.navItem,
                  ...(window.location.pathname === item.path ? s.navActive : {}),
                }}
                onClick={() => navigate(item.path)}
              >
                <span style={s.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          <div style={s.userSection}>
            <div style={s.userAvatar}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div style={s.userInfo}>
              <div style={s.userName}>{user.firstName} {user.lastName}</div>
              <div style={s.userRole}>{user.role || 'Learner'}</div>
            </div>
          </div>

          <div style={s.signOut} onClick={logout}>
            <span>↪</span>
            <span>Sign Out</span>
          </div>
        </div>
      )}

      {/* ── MOBILE TOP NAVBAR ── */}
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
            <div style={s.mobileNavItem} onClick={() => navigate('/reports')}>📈</div>
            <div style={s.mobileNavItem} onClick={logout}>🚪</div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{
        ...s.main,
        marginLeft:  isMobile ? '0'    : '260px',
        padding:     isMobile ? '16px' : '32px 40px',
        marginTop:   isMobile ? '60px' : '0',
      }}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={{ ...s.welcome, fontSize: isMobile ? '22px' : '32px' }}>
              Welcome back
            </h1>
            <p style={s.welcomeSub}>Continue your cybersecurity training journey.</p>
          </div>
          {!isMobile && (
            <div style={s.headerRight}>
              <div style={s.iconBtn}>🔔</div>
              <div style={s.iconBtn}>⚙</div>
            </div>
          )}
        </div>

        {/* ── STATS ── */}
        <div style={{
          ...s.statsRow,
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: isMobile ? '10px' : '16px',
        }}>
          {[
            { label:'MODULES DONE', value: completedModules, sub:`of ${modules.length}`,  icon:'🛡',  color:'#00C896', grad:'#0A2E1F,#0D3D28', border:'#1A5C3A' },
            { label:'AVG SCORE',    value:`${avgScore}%`,    sub:'across attempts',         icon:'◎',   color:'#8B5CF6', grad:'#1A1040,#220F55', border:'#3B1F8C' },
            { label:'TOTAL POINTS', value: user.totalPoints||0, sub:'points earned',        icon:'🏆',  color:'#F59E0B', grad:'#1F1600,#2A1E00', border:'#5C3D00' },
            { label:'STREAK',       value: streak,           sub:'attempts',               icon:'🔥',  color:'#EF4444', grad:'#200808,#2D0A0A', border:'#5C1A1A' },
          ].map((st, i) => (
            <div key={i} style={{
              ...s.statCard,
              background: `linear-gradient(135deg,#${st.grad.split(',')[0]} 0%,#${st.grad.split(',')[1]} 100%)`,
              border: `1px solid ${st.border}`,
            }}>
              <div style={s.statTop}>
                <span style={s.statLabel}>{st.label}</span>
                <div style={{ ...s.statIconBox }}>
                  <span style={{ fontSize: '16px' }}>{st.icon}</span>
                </div>
              </div>
              <div style={{ ...s.statValue, color: st.color, fontSize: isMobile ? '28px' : '36px' }}>
                {st.value}
              </div>
              <div style={s.statSub}>{st.sub}</div>
            </div>
          ))}
        </div>

        {/* ── TRAINING MODULES ── */}
        <h2 style={s.sectionTitle}>Training Modules</h2>
        <div style={s.modulesList}>
          {modules.map((mod) => (
            <div
              key={mod.id}
              style={{
                ...s.moduleRow,
                cursor:  mod.unlocked ? 'pointer' : 'default',
                opacity: mod.unlocked ? 1 : 0.6,
              }}
              onClick={() => mod.unlocked && navigate(mod.route)}
              onMouseEnter={e => { if (mod.unlocked && !isMobile) e.currentTarget.style.borderColor = mod.color; }}
              onMouseLeave={e => { if (mod.unlocked && !isMobile) e.currentTarget.style.borderColor = '#1E2D3D'; }}
            >
              <div style={{
                ...s.moduleIcon,
                width:      isMobile ? '44px' : '56px',
                height:     isMobile ? '44px' : '56px',
                background: mod.unlocked ? mod.bg      : '#111827',
                border:     `1px solid ${mod.unlocked ? mod.color+'44' : '#374151'}`,
              }}>
                {mod.unlocked
                  ? <span style={{ fontSize: isMobile ? '18px' : '22px', filter:`drop-shadow(0 0 6px ${mod.color})` }}>{mod.icon}</span>
                  : <span style={{ fontSize: '18px', color:'#4B5563' }}>🔒</span>
                }
              </div>

              <div style={s.moduleInfo}>
                <div style={{ ...s.moduleTitle, fontSize: isMobile ? '14px' : '15px' }}>
                  {mod.title}
                </div>
                <div style={{ ...s.moduleDesc, fontSize: isMobile ? '12px' : '13px' }}>
                  {mod.unlocked ? mod.desc : 'Complete previous module to unlock'}
                </div>
                {mod.unlocked && (
                  <div style={s.moduleTags}>
                    <span style={{
                      ...s.levelTag,
                      background: levelColor[mod.level].bg,
                      color:      levelColor[mod.level].color,
                      border:     `1px solid ${levelColor[mod.level].color}44`,
                    }}>
                      {mod.level}
                    </span>
                    <span style={s.ptsTag}>{mod.pts} pts</span>
                  </div>
                )}
              </div>

              {mod.unlocked && (
                <div style={{ color:'#4B5563', fontSize:'22px', flexShrink:0 }}>›</div>
              )}
            </div>
          ))}
        </div>

        {/* ── RECENT ACTIVITY ── */}
        {results.length > 0 && (
          <>
            <h2 style={{ ...s.sectionTitle, marginTop:'32px' }}>Recent Activity</h2>
            <div style={s.activityCard}>
              {results.slice(0,5).map((r,i) => (
                <div key={i} style={{
                  ...s.activityRow,
                  borderBottom: i < Math.min(results.length,5)-1 ? '1px solid #1E2D3D' : 'none',
                }}>
                  <div style={{
                    ...s.activityDot,
                    background:  r.passed ? '#00C896' : '#EF4444',
                    boxShadow:  `0 0 8px ${r.passed ? '#00C89660' : '#EF444460'}`,
                  }}/>
                  <div style={s.activityInfo}>
                    <span style={s.activityModule}>
                      {r.moduleType.charAt(0).toUpperCase()+r.moduleType.slice(1)} simulation
                    </span>
                    <span style={s.activityDate}>
                      {new Date(r.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{
                    ...s.activityScore,
                    color: r.score>=80 ? '#00C896' : r.score>=60 ? '#F59E0B' : '#EF4444',
                    fontSize: isMobile ? '14px' : '16px',
                  }}>
                    {r.score}%
                  </div>
                  <div style={{
                    ...s.activityBadge,
                    background: r.passed ? '#0D2E1F' : '#200808',
                    color:      r.passed ? '#00C896' : '#EF4444',
                    border:    `1px solid ${r.passed ? '#00C89644' : '#EF444444'}`,
                  }}>
                    {r.passed ? 'Passed' : 'Failed'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── EMPTY STATE ── */}
        {results.length === 0 && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🎯</div>
            <h3 style={s.emptyTitle}>Start your first module!</h3>
            <p style={s.emptyDesc}>
              Complete training modules to build your security awareness skills and climb the leaderboard.
            </p>
            <button style={s.emptyBtn} onClick={() => navigate('/simulation')}>
              Start Email Phishing Basics →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────
const s = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#070D14',
    color: '#E2E8F0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  // Desktop sidebar
  sidebar: {
    width: '260px',
    background: '#0A1628',
    borderRight: '1px solid #1E2D3D',
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 100,
    overflowY: 'auto',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 24px 28px',
    borderBottom: '1px solid #1E2D3D',
    marginBottom: '20px',
  },
  logoIcon:  { fontSize: '28px' },
  logoTitle: { fontSize: '13px', fontWeight: '700', color: '#E2E8F0', letterSpacing: '2px' },
  logoSub:   { fontSize: '11px', color: '#4B5563', letterSpacing: '2px' },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '0 12px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6B7280',
    transition: 'all 0.2s',
  },
  navActive: {
    background: '#0F2236',
    color: '#00C896',
    borderLeft: '3px solid #00C896',
    paddingLeft: '13px',
  },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid #1E2D3D',
    marginTop: 'auto',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#00C896,#0088CC)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  userInfo:  { flex: 1, overflow: 'hidden' },
  userName:  { fontSize: '13px', fontWeight: '600', color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole:  { fontSize: '11px', color: '#4B5563', textTransform: 'capitalize' },
  signOut: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    fontSize: '13px',
    color: '#4B5563',
    cursor: 'pointer',
    borderTop: '1px solid #1E2D3D',
  },

  // Mobile navbar
  mobileNav: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '56px',
    background: '#0A1628',
    borderBottom: '1px solid #1E2D3D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 200,
  },
  mobileNavBrand: { display: 'flex', alignItems: 'center', gap: '8px' },
  mobileNavTitle: { fontSize: '14px', fontWeight: '700', color: '#E2E8F0', letterSpacing: '2px' },
  mobileNavLinks: { display: 'flex', gap: '4px' },
  mobileNavItem: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    background: '#0F1F30',
  },

  // Main content
  main: { flex: 1 },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
  },
  welcome:    { fontWeight: '700', color: '#F1F5F9', margin: '0 0 6px' },
  welcomeSub: { fontSize: '14px', color: '#4B5563', margin: 0 },
  headerRight: { display: 'flex', gap: '10px' },
  iconBtn: {
    width: '40px',
    height: '40px',
    background: '#0F1F30',
    border: '1px solid #1E2D3D',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
  },

  // Stats
  statsRow: {
    display: 'grid',
    marginBottom: '32px',
  },
  statCard: {
    borderRadius: '16px',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  statLabel: { fontSize: '10px', fontWeight: '700', color: '#4B5563', letterSpacing: '1px' },
  statIconBox: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontWeight: '700', color: '#00C896', lineHeight: 1 },
  statSub:   { fontSize: '11px', color: '#4B5563' },

  // Modules
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#F1F5F9', margin: '0 0 14px' },
  modulesList:  { display: 'flex', flexDirection: 'column', gap: '10px' },
  moduleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: '#0A1628',
    border: '1px solid #1E2D3D',
    borderRadius: '14px',
    padding: '16px 20px',
    transition: 'border-color 0.2s',
  },
  moduleIcon: {
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moduleInfo:  { flex: 1, minWidth: 0 },
  moduleTitle: { fontWeight: '600', color: '#F1F5F9', margin: '0 0 4px' },
  moduleDesc:  { color: '#4B5563', margin: '0 0 8px', lineHeight: 1.5 },
  moduleTags:  { display: 'flex', gap: '8px', alignItems: 'center' },
  levelTag: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  ptsTag: { fontSize: '12px', color: '#4B5563', fontWeight: '500' },

  // Activity
  activityCard: {
    background: '#0A1628',
    border: '1px solid #1E2D3D',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  activityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 20px',
  },
  activityDot:    { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  activityInfo:   { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  activityModule: { fontSize: '14px', fontWeight: '500', color: '#E2E8F0' },
  activityDate:   { fontSize: '12px', color: '#4B5563' },
  activityScore:  { fontWeight: '700' },
  activityBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
    flexShrink: 0,
  },

  // Empty state
  emptyState: {
    marginTop: '32px',
    background: '#0A1628',
    border: '1px solid #1E2D3D',
    borderRadius: '16px',
    padding: '48px 24px',
    textAlign: 'center',
  },
  emptyIcon:  { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '20px', fontWeight: '600', color: '#F1F5F9', margin: '0 0 10px' },
  emptyDesc:  { fontSize: '14px', color: '#4B5563', lineHeight: 1.7, margin: '0 0 24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' },
  emptyBtn: {
    background: 'linear-gradient(135deg,#00C896,#0088CC)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};