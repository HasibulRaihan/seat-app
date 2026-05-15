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
    beginner: { bg: '#0D3321', color: '#00C896', label: 'beginner' },
    intermediate: { bg: '#1F1040', color: '#8B5CF6', label: 'intermediate' },
    advanced: { bg: '#2D0D0D', color: '#EF4444', label: 'advanced' },
  };

  return (
    <div style={s.page}>

      {/* ── SIDEBAR ── */}
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
            { icon: '▦', label: 'Dashboard', path: '/dashboard' },
            { icon: '◎', label: 'Simulations', path: '/simulation' },
            { icon: '⬡', label: 'Leaderboard', path: '/leaderboard' },
            { icon: '▥', label: 'Reports', path: '/reports' },
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

      {/* ── MAIN ── */}
      <div style={s.main}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.welcome}>Welcome back</h1>
            <p style={s.welcomeSub}>Continue your cybersecurity training journey.</p>
          </div>
          <div style={s.headerRight}>
            <div style={s.notifBtn}>🔔</div>
            <div style={s.settingsBtn}>⚙</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          <div style={{ ...s.statCard, background: 'linear-gradient(135deg, #0A2E1F 0%, #0D3D28 100%)', border: '1px solid #1A5C3A' }}>
            <div style={s.statTop}>
              <span style={s.statLabel}>MODULES DONE</span>
              <div style={{ ...s.statIconBox, background: '#0D3D28', border: '1px solid #1A5C3A' }}>
                <span style={{ color: '#00C896', fontSize: '18px' }}>🛡</span>
              </div>
            </div>
            <div style={s.statValue}>{completedModules}</div>
            <div style={s.statSub}>of {modules.length}</div>
          </div>

          <div style={{ ...s.statCard, background: 'linear-gradient(135deg, #1A1040 0%, #220F55 100%)', border: '1px solid #3B1F8C' }}>
            <div style={s.statTop}>
              <span style={s.statLabel}>AVG SCORE</span>
              <div style={{ ...s.statIconBox, background: '#220F55', border: '1px solid #3B1F8C' }}>
                <span style={{ color: '#8B5CF6', fontSize: '18px' }}>◎</span>
              </div>
            </div>
            <div style={{ ...s.statValue, color: '#8B5CF6' }}>{avgScore}%</div>
            <div style={s.statSub}>across attempts</div>
          </div>

          <div style={{ ...s.statCard, background: 'linear-gradient(135deg, #1F1600 0%, #2A1E00 100%)', border: '1px solid #5C3D00' }}>
            <div style={s.statTop}>
              <span style={s.statLabel}>TOTAL POINTS</span>
              <div style={{ ...s.statIconBox, background: '#2A1E00', border: '1px solid #5C3D00' }}>
                <span style={{ color: '#F59E0B', fontSize: '18px' }}>🏆</span>
              </div>
            </div>
            <div style={{ ...s.statValue, color: '#F59E0B' }}>{user.totalPoints || 0}</div>
            <div style={s.statSub}>points earned</div>
          </div>

          <div style={{ ...s.statCard, background: 'linear-gradient(135deg, #200808 0%, #2D0A0A 100%)', border: '1px solid #5C1A1A' }}>
            <div style={s.statTop}>
              <span style={s.statLabel}>STREAK</span>
              <div style={{ ...s.statIconBox, background: '#2D0A0A', border: '1px solid #5C1A1A' }}>
                <span style={{ color: '#EF4444', fontSize: '18px' }}>🔥</span>
              </div>
            </div>
            <div style={{ ...s.statValue, color: '#EF4444' }}>{streak}</div>
            <div style={s.statSub}>attempts</div>
          </div>
        </div>

        {/* Training Modules */}
        <h2 style={s.sectionTitle}>Training Modules</h2>
        <div style={s.modulesList}>
          {modules.map((mod) => (
            <div
              key={mod.id}
              style={{
                ...s.moduleRow,
                cursor: mod.unlocked ? 'pointer' : 'default',
                opacity: mod.unlocked ? 1 : 0.6,
                borderColor: mod.unlocked && window.location.pathname === mod.route ? mod.color : '#1E2D3D',
              }}
              onClick={() => mod.unlocked && navigate(mod.route)}
              onMouseEnter={e => { if (mod.unlocked) e.currentTarget.style.borderColor = mod.color; }}
              onMouseLeave={e => { if (mod.unlocked) e.currentTarget.style.borderColor = '#1E2D3D'; }}
            >
              {/* Icon */}
              <div style={{
                ...s.moduleIcon,
                background: mod.unlocked ? mod.bg : '#111827',
                border: `1px solid ${mod.unlocked ? mod.color + '44' : '#374151'}`,
              }}>
                {mod.unlocked
                  ? <span style={{ fontSize: '22px', filter: `drop-shadow(0 0 6px ${mod.color})` }}>{mod.icon}</span>
                  : <span style={{ fontSize: '20px', color: '#4B5563' }}>🔒</span>
                }
              </div>

              {/* Info */}
              <div style={s.moduleInfo}>
                <div style={s.moduleTitle}>{mod.title}</div>
                <div style={s.moduleDesc}>
                  {mod.unlocked ? mod.desc : 'Complete previous module to unlock'}
                </div>
                {mod.unlocked && (
                  <div style={s.moduleTags}>
                    <span style={{
                      ...s.levelTag,
                      background: levelColor[mod.level].bg,
                      color: levelColor[mod.level].color,
                      border: `1px solid ${levelColor[mod.level].color}44`,
                    }}>
                      {mod.level}
                    </span>
                    <span style={s.ptsTag}>{mod.pts} pts</span>
                  </div>
                )}
              </div>

              {/* Arrow */}
              {mod.unlocked && (
                <div style={{ color: '#4B5563', fontSize: '18px', flexShrink: 0 }}>›</div>
              )}
            </div>
          ))}
        </div>

        {/* Recent activity */}
        {results.length > 0 && (
          <>
            <h2 style={{ ...s.sectionTitle, marginTop: '32px' }}>Recent Activity</h2>
            <div style={s.activityCard}>
              {results.slice(0, 5).map((r, i) => (
                <div key={i} style={{
                  ...s.activityRow,
                  borderBottom: i < Math.min(results.length, 5) - 1 ? '1px solid #1E2D3D' : 'none',
                }}>
                  <div style={{
                    ...s.activityDot,
                    background: r.passed ? '#00C896' : '#EF4444',
                    boxShadow: `0 0 8px ${r.passed ? '#00C89660' : '#EF444460'}`,
                  }} />
                  <div style={s.activityInfo}>
                    <span style={s.activityModule}>
                      {r.moduleType.charAt(0).toUpperCase() + r.moduleType.slice(1)} simulation
                    </span>
                    <span style={s.activityDate}>
                      {new Date(r.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{
                    ...s.activityScore,
                    color: r.score >= 80 ? '#00C896' : r.score >= 60 ? '#F59E0B' : '#EF4444',
                  }}>
                    {r.score}%
                  </div>
                  <div style={{
                    ...s.activityBadge,
                    background: r.passed ? '#0D2E1F' : '#200808',
                    color: r.passed ? '#00C896' : '#EF4444',
                    border: `1px solid ${r.passed ? '#00C89644' : '#EF444444'}`,
                  }}>
                    {r.passed ? 'Passed' : 'Failed'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

const s = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#070D14',
    color: '#E2E8F0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  // Sidebar
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
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 24px 32px',
    borderBottom: '1px solid #1E2D3D',
    marginBottom: '24px',
  },
  logoIcon: { fontSize: '28px' },
  logoTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: '2px',
  },
  logoSub: {
    fontSize: '11px',
    color: '#4B5563',
    letterSpacing: '2px',
  },
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
    padding: '12px 16px',
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
    background: 'linear-gradient(135deg, #00C896, #0088CC)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  userInfo: { flex: 1, overflow: 'hidden' },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#E2E8F0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '11px',
    color: '#4B5563',
    textTransform: 'capitalize',
  },
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

  // Main
  main: {
    marginLeft: '260px',
    padding: '32px 40px',
    flex: 1,
    maxWidth: 'calc(100vw - 260px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  welcome: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#F1F5F9',
    margin: '0 0 6px',
  },
  welcomeSub: {
    fontSize: '15px',
    color: '#4B5563',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '10px',
  },
  notifBtn: {
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
  settingsBtn: {
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
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '36px',
  },
  statCard: {
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: '1px',
  },
  statIconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#00C896',
    lineHeight: 1,
  },
  statSub: {
    fontSize: '12px',
    color: '#4B5563',
  },

  // Modules
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#F1F5F9',
    margin: '0 0 16px',
  },
  modulesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  moduleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: '#0A1628',
    border: '1px solid #1E2D3D',
    borderRadius: '16px',
    padding: '20px 24px',
    transition: 'all 0.2s',
  },
  moduleIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moduleInfo: {
    flex: 1,
    minWidth: 0,
  },
  moduleTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#F1F5F9',
    margin: '0 0 4px',
  },
  moduleDesc: {
    fontSize: '13px',
    color: '#4B5563',
    margin: '0 0 8px',
    lineHeight: 1.5,
  },
  moduleTags: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  levelTag: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  ptsTag: {
    fontSize: '12px',
    color: '#4B5563',
    fontWeight: '500',
  },

  // Activity
  activityCard: {
    background: '#0A1628',
    border: '1px solid #1E2D3D',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  activityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
  },
  activityDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  activityInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  activityModule: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#E2E8F0',
  },
  activityDate: {
    fontSize: '12px',
    color: '#4B5563',
  },
  activityScore: {
    fontSize: '16px',
    fontWeight: '700',
  },
  activityBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
  },
};