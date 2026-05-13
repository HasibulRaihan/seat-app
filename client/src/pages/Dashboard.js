import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyResults } from '../services/api';

export default function Dashboard({ setToken }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [results, setResults] = useState([]);

  useEffect(() => {
    getMyResults().then(res => setResults(res.data)).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    navigate('/');
  };

  const completedModules = results.length;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length)
    : 0;

  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024;

  return (
    <div style={styles.page}>

      {/* ── SIDEBAR ── */}
      <div style={{
        ...styles.sidebar,
        width: isMobile ? '100%' : '210px',
        flexDirection: isMobile ? 'row' : 'column',
        position: isMobile ? 'relative' : 'fixed',
        height: isMobile ? 'auto' : '100vh',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        padding: isMobile ? '10px 16px' : '24px 16px',
      }}>
        <div style={{
          ...styles.logo,
          marginBottom: isMobile ? '0' : '32px',
          fontSize: isMobile ? '15px' : '18px',
        }}>
          🛡️ SEAT
        </div>

        <nav style={{
          ...styles.nav,
          flexDirection: isMobile ? 'row' : 'column',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '4px' : '4px',
        }}>
          <div style={styles.navActive}>📊 Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate('/simulation')}>
            🎯 Training
          </div>
          <div style={styles.navItem}>🏆 Leaderboard</div>
          <div style={styles.navItem}>📈 Reports</div>
          {user.role === 'admin' && (
            <div style={styles.navItem} onClick={() => navigate('/admin')}>
              ⚙️ Admin
            </div>
          )}
        </nav>

        {!isMobile && (
          <div style={styles.logoutBtn} onClick={logout}>
            🚪 Log out
          </div>
        )}
        {isMobile && (
          <div style={styles.logoutBtnMobile} onClick={logout}>
            🚪
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{
        ...styles.main,
        marginLeft: isMobile ? '0' : '210px',
        padding: isMobile ? '16px' : isTablet ? '24px' : '32px',
      }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{
              ...styles.welcome,
              fontSize: isMobile ? '18px' : '22px',
            }}>
              Welcome back, {user.firstName}! 👋
            </h2>
            <p style={styles.welcomeSub}>
              Continue your security awareness training
            </p>
          </div>
          <div style={styles.avatar}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          ...styles.statsGrid,
          gridTemplateColumns: isMobile
            ? 'repeat(2, 1fr)'
            : 'repeat(4, 1fr)',
        }}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Modules Done</p>
            <p style={styles.statValue}>{completedModules}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Points</p>
            <p style={{ ...styles.statValue, color: '#1e3a5f' }}>
              {user.totalPoints || 0}
            </p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Avg Score</p>
            <p style={{ ...styles.statValue, color: '#3b6d11' }}>
              {avgScore}%
            </p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Risk Level</p>
            <p style={{ ...styles.statValue, color: '#a32d2d' }}>
              {user.riskScore
                ? user.riskScore.charAt(0).toUpperCase() + user.riskScore.slice(1)
                : 'High'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <span style={styles.progressTitle}>Overall progress</span>
            <span style={styles.progressCount}>
              {completedModules} / 5 modules
            </span>
          </div>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${Math.min((completedModules / 5) * 100, 100)}%`,
            }} />
          </div>
          <p style={styles.progressPercent}>
            {Math.round(Math.min((completedModules / 5) * 100, 100))}% complete
          </p>
        </div>

        {/* Training Modules */}
        <h3 style={styles.sectionTitle}>Training Modules</h3>
        <div style={{
          ...styles.modulesGrid,
          gridTemplateColumns: isMobile
            ? '1fr'
            : isTablet
            ? 'repeat(2, 1fr)'
            : 'repeat(3, 1fr)',
        }}>
          {/* Phishing */}
          <div style={styles.moduleCard} onClick={() => navigate('/simulation')}>
            <div style={styles.moduleCardTop}>
              <span style={styles.moduleTag}>🎣 Phishing</span>
              <span style={styles.moduleDifficulty}>Beginner</span>
            </div>
            <h4 style={styles.moduleName}>Email Phishing Simulation</h4>
            <p style={styles.moduleSub}>
              Learn to identify suspicious emails and phishing attempts
            </p>
            <div style={styles.moduleFooter}>
              <span style={styles.moduleMeta}>⏱ 15 min</span>
              <span style={styles.startBtn}>Start →</span>
            </div>
          </div>

          {/* Chatbot */}
          <div style={{ ...styles.moduleCard, opacity: 0.7 }}>
            <div style={styles.moduleCardTop}>
              <span style={{
                ...styles.moduleTag,
                background: '#ede9fe',
                color: '#5b21b6',
              }}>🤖 Chatbot</span>
              <span style={styles.moduleDifficulty}>Intermediate</span>
            </div>
            <h4 style={styles.moduleName}>AI Social Engineer</h4>
            <p style={styles.moduleSub}>
              Practise responding to AI-driven manipulation attempts
            </p>
            <div style={styles.moduleFooter}>
              <span style={styles.moduleMeta}>⏱ 20 min</span>
              <span style={{ ...styles.startBtn, color: '#999' }}>
                Coming soon
              </span>
            </div>
          </div>

          {/* Pretexting */}
          <div style={{ ...styles.moduleCard, opacity: 0.7 }}>
            <div style={styles.moduleCardTop}>
              <span style={{
                ...styles.moduleTag,
                background: '#dcfce7',
                color: '#166534',
              }}>🎭 Pretexting</span>
              <span style={styles.moduleDifficulty}>Intermediate</span>
            </div>
            <h4 style={styles.moduleName}>Pretexting Scenario</h4>
            <p style={styles.moduleSub}>
              Spot impersonation-based social engineering attacks
            </p>
            <div style={styles.moduleFooter}>
              <span style={styles.moduleMeta}>⏱ 18 min</span>
              <span style={{ ...styles.startBtn, color: '#999' }}>
                Coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Recent Results */}
        {results.length > 0 && (
          <>
            <h3 style={styles.sectionTitle}>Recent Results</h3>
            <div style={styles.resultsTable}>
              <div style={styles.tableHeader}>
                <span>Module</span>
                <span>Score</span>
                <span>Result</span>
                <span>Date</span>
              </div>
              {results.slice(0, 5).map((r, i) => (
                <div key={i} style={{
                  ...styles.tableRow,
                  background: i % 2 === 0 ? '#fff' : '#f8fafc',
                }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                    {r.moduleType}
                  </span>
                  <span style={{
                    fontWeight: '600',
                    color: r.score >= 60 ? '#166534' : '#991b1b',
                  }}>
                    {r.score}%
                  </span>
                  <span style={{ color: r.passed ? '#166534' : '#991b1b' }}>
                    {r.passed ? '✅ Passed' : '❌ Failed'}
                  </span>
                  <span style={{ color: '#888', fontSize: '12px' }}>
                    {new Date(r.completedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {results.length === 0 && (
          <div style={styles.emptyState}>
            <span style={{ fontSize: '48px' }}>🎯</span>
            <h3 style={{ color: '#1e3a5f', margin: '12px 0 8px' }}>
              Start your first module!
            </h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
              Complete training modules to build your security awareness skills.
            </p>
            <button
              style={styles.startFirstBtn}
              onClick={() => navigate('/simulation')}
            >
              Start Phishing Simulation →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f0f4f8',
    flexDirection: 'row',
  },
  sidebar: {
    background: '#0c447c',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    zIndex: 100,
  },
  logo: {
    color: '#fff',
    fontWeight: '700',
  },
  nav: {
    display: 'flex',
    flex: 1,
  },
  navActive: {
    padding: '10px 12px',
    background: '#185fa5',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  navItem: {
    padding: '10px 12px',
    color: '#b5d4f4',
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.2s',
  },
  logoutBtn: {
    padding: '10px 12px',
    color: '#b5d4f4',
    fontSize: '13px',
    cursor: 'pointer',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: '8px',
    paddingTop: '16px',
  },
  logoutBtnMobile: {
    padding: '8px 10px',
    color: '#b5d4f4',
    fontSize: '18px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  welcome: {
    fontWeight: '700',
    margin: '0 0 4px',
    color: '#1e3a5f',
  },
  welcomeSub: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
  },
  avatar: {
    width: '44px',
    height: '44px',
    background: '#185fa5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '15px',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(24,95,165,0.3)',
  },
  statsGrid: {
    display: 'grid',
    gap: '12px',
    marginBottom: '20px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    borderTop: '3px solid #185fa5',
  },
  statLabel: {
    fontSize: '11px',
    color: '#888',
    margin: '0 0 8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#1e3a5f',
    lineHeight: 1,
  },
  progressCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '28px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '4px',
  },
  progressTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e3a5f',
  },
  progressCount: {
    fontSize: '13px',
    color: '#888',
  },
  progressBar: {
    background: '#e5e7eb',
    borderRadius: '6px',
    height: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #185fa5, #3b9eff)',
    height: '10px',
    borderRadius: '6px',
    transition: 'width 0.8s ease',
  },
  progressPercent: {
    fontSize: '12px',
    color: '#888',
    margin: '6px 0 0',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e3a5f',
    margin: '0 0 16px',
  },
  modulesGrid: {
    display: 'grid',
    gap: '16px',
    marginBottom: '32px',
  },
  moduleCard: {
    background: '#fff',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #f0f0f0',
  },
  moduleCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  moduleTag: {
    fontSize: '11px',
    background: '#dbeafe',
    color: '#1d4ed8',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  moduleDifficulty: {
    fontSize: '11px',
    color: '#888',
    fontWeight: '500',
  },
  moduleName: {
    fontSize: '15px',
    fontWeight: '700',
    margin: '0 0 6px',
    color: '#1e3a5f',
  },
  moduleSub: {
    fontSize: '12px',
    color: '#888',
    margin: '0 0 14px',
    lineHeight: 1.5,
  },
  moduleFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f5f5f5',
    paddingTop: '10px',
  },
  moduleMeta: {
    fontSize: '12px',
    color: '#aaa',
  },
  startBtn: {
    fontSize: '13px',
    color: '#185fa5',
    fontWeight: '700',
  },
  resultsTable: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    overflowX: 'auto',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '12px 20px',
    background: '#1e3a5f',
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff',
    minWidth: '380px',
    letterSpacing: '0.3px',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '13px 20px',
    fontSize: '13px',
    borderTop: '1px solid #f0f0f0',
    color: '#333',
    minWidth: '380px',
  },
  emptyState: {
    background: '#fff',
    borderRadius: '14px',
    padding: '48px 24px',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  startFirstBtn: {
    background: '#1e3a5f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};