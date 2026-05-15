import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSimIntro, getQuestion, submitQuestion, completeSimulation } from '../services/api';

const TOTAL_QUESTIONS = 3;

export default function Simulation() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('intro');
  const [intro, setIntro] = useState(null);
  const [question, setQuestion] = useState(null);
  const [currentQ, setCurrentQ] = useState(1);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [scores, setScores] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    getSimIntro()
      .then(res => { setIntro(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const loadQuestion = async (qId) => {
    setLoading(true);
    setSelected([]);
    setFeedback(null);
    try {
      const res = await getQuestion(qId);
      setQuestion(res.data);
      setPhase('question');
    } catch (err) {
      alert('Failed to load question');
    }
    setLoading(false);
  };

  const toggleElement = (id) => {
    if (feedback) return;
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmitQuestion = async () => {
    try {
      const res = await submitQuestion(currentQ, { selectedIds: selected });
      setFeedback(res.data);
      setScores(prev => [...prev, res.data.score]);
    } catch (err) {
      alert('Submission failed');
    }
  };

  const handleNext = async () => {
    if (currentQ < TOTAL_QUESTIONS) {
      const next = currentQ + 1;
      setCurrentQ(next);
      await loadQuestion(next);
    } else {
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      try {
        const res = await completeSimulation({ totalScore: avgScore, timeTaken });
        setFinalResult(res.data);
        setPhase('result');
      } catch (err) {
        alert('Failed to save result');
      }
    }
  };

  if (loading) return (
    <div style={styles.loadingPage}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading simulation...</p>
    </div>
  );

  // ── INTRO SCREEN ──────────────────────────────────────────────
  if (phase === 'intro') return (
    <div style={styles.page}>
      <div style={styles.introCard}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div style={styles.introIcon}>📧</div>
        <h1 style={styles.introTitle}>{intro?.title}</h1>
        <p style={styles.introDesc}>{intro?.description}</p>

        <div style={styles.infoRow}>
          <div style={styles.infoBox}>
            <span style={styles.infoIcon}>⏱</span>
            <span style={styles.infoLabel}>Time</span>
            <span style={styles.infoValue}>{intro?.estimatedTime}</span>
          </div>
          <div style={styles.infoBox}>
            <span style={styles.infoIcon}>📝</span>
            <span style={styles.infoLabel}>Questions</span>
            <span style={styles.infoValue}>{intro?.totalQuestions}</span>
          </div>
          <div style={styles.infoBox}>
            <span style={styles.infoIcon}>⭐</span>
            <span style={styles.infoLabel}>Difficulty</span>
            <span style={styles.infoValue}>{intro?.difficulty}</span>
          </div>
        </div>

        <div style={styles.objectivesBox}>
          <h3 style={styles.objectivesTitle}>What you will learn:</h3>
          {intro?.objectives.map((obj, i) => (
            <div key={i} style={styles.objective}>
              <span style={styles.checkIcon}>✅</span>
              <span>{obj}</span>
            </div>
          ))}
        </div>

        <div style={styles.warningBox}>
          <span>⚠️</span>
          <span>These are simulated phishing emails for training purposes only. No real credentials are collected.</span>
        </div>

        <button style={styles.startBigBtn} onClick={() => loadQuestion(1)}>
          Start Simulation →
        </button>
      </div>
    </div>
  );

  // ── RESULT SCREEN ─────────────────────────────────────────────
  if (phase === 'result') return (
    <div style={styles.page}>
      <div style={styles.resultCard}>
        <div style={{
          ...styles.scoreCircle,
          borderColor: finalResult?.score >= 80 ? '#166534' : finalResult?.score >= 60 ? '#92400e' : '#991b1b'
        }}>
          <span style={{
            ...styles.scoreNum,
            color: finalResult?.score >= 80 ? '#166534' : finalResult?.score >= 60 ? '#92400e' : '#991b1b'
          }}>
            {finalResult?.score}%
          </span>
        </div>

        <h2 style={styles.resultTitle}>
          {finalResult?.score >= 80 ? '🎉 Excellent!' : finalResult?.score >= 60 ? '👍 Good job!' : '😅 Keep practising!'}
        </h2>
        <p style={styles.resultFeedback}>{finalResult?.feedback}</p>

        <div style={styles.resultStats}>
          <div style={styles.resultStat}>
            <span style={styles.resultStatVal}>{finalResult?.score}%</span>
            <span style={styles.resultStatLabel}>Final Score</span>
          </div>
          <div style={styles.resultStat}>
            <span style={styles.resultStatVal}>+{finalResult?.pointsEarned}</span>
            <span style={styles.resultStatLabel}>Points Earned</span>
          </div>
          <div style={styles.resultStat}>
            <span style={styles.resultStatVal}>{TOTAL_QUESTIONS}</span>
            <span style={styles.resultStatLabel}>Emails Analysed</span>
          </div>
        </div>

        {finalResult?.passed && (
          <div style={styles.badgeEarned}>
            🏅 Badge earned: <strong>Phishing Defender</strong>
          </div>
        )}

        <div style={styles.resultBtns}>
          <button style={styles.btnPrimary} onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button style={styles.btnSecondary} onClick={() => {
            setPhase('intro');
            setScores([]);
            setCurrentQ(1);
            setSelected([]);
            setFeedback(null);
            setFinalResult(null);
          }}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  // ── QUESTION SCREEN ───────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Progress header */}
      <div style={styles.progressHeader}>
        <button style={styles.backBtn2} onClick={() => navigate('/dashboard')}>← Exit</button>
        <div style={styles.progressInfo}>
          <span style={styles.progressLabel}>Email {currentQ} of {TOTAL_QUESTIONS}</span>
          <div style={styles.progressBarOuter}>
            {[...Array(TOTAL_QUESTIONS)].map((_, i) => (
              <div key={i} style={{
                ...styles.progressDot,
                background: i < currentQ ? '#185fa5' : '#ddd'
              }} />
            ))}
          </div>
        </div>
        <div style={styles.scorePreview}>
          {scores.length > 0 && `Avg: ${Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}%`}
        </div>
      </div>

      <div style={styles.simContent}>
        {/* Email display */}
        <div style={styles.emailCard}>
          <div style={styles.emailTop}>
            <div style={styles.emailMeta}>
              <div style={styles.emailRow}>
                <span style={styles.emailMetaLabel}>From:</span>
                <span style={styles.emailFrom}>{question?.from}</span>
              </div>
              <div style={styles.emailRow}>
                <span style={styles.emailMetaLabel}>Subject:</span>
                <span style={styles.emailSubject}>{question?.subject}</span>
              </div>
            </div>
          </div>
          <div style={styles.emailBody}>
            {question?.body.split('\n').map((line, i) => (
              <p key={i} style={styles.emailLine}>{line}</p>
            ))}
          </div>

          {/* Suspicious elements to click */}
          {!feedback && (
            <div style={styles.elementsSection}>
              <p style={styles.elementsTitle}>
                🔍 Click all suspicious elements you can identify:
              </p>
              <div style={styles.elementsList}>
                {question?.suspiciousElements.map(el => (
                  <div
                    key={el.id}
                    style={{
                      ...styles.element,
                      background: selected.includes(el.id) ? '#fee2e2' : '#f8fafc',
                      border: selected.includes(el.id) ? '2px solid #a32d2d' : '2px solid #e5e7eb',
                      transform: selected.includes(el.id) ? 'scale(1.01)' : 'scale(1)',
                    }}
                    onClick={() => toggleElement(el.id)}
                  >
                    <span style={{ fontSize: '16px' }}>
                      {selected.includes(el.id) ? '🚩' : '○'}
                    </span>
                    <span style={{ fontSize: '13px', flex: 1 }}>{el.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback after submission */}
          {feedback && (
            <div style={styles.feedbackSection}>
              <h4 style={styles.feedbackTitle}>
                📊 Question Result: {feedback.score}%
              </h4>
              {feedback.feedback.map(f => (
                <div key={f.id} style={{
                  ...styles.feedbackItem,
                  background: f.wasSelected ? '#dcfce7' : '#fee2e2',
                  border: `1px solid ${f.wasSelected ? '#86efac' : '#fca5a5'}`,
                }}>
                  <span style={{ fontSize: '16px' }}>
                    {f.wasSelected ? '✅' : '❌'}
                  </span>
                  <div>
                    <p style={styles.feedbackItemTitle}>{f.text}</p>
                    <p style={styles.feedbackItemDesc}>{f.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div style={styles.sidePanel}>
          <div style={styles.panelCard}>
            <h4 style={styles.panelTitle}>📋 Your task</h4>
            <p style={styles.panelText}>
              Find all <strong>{question?.totalElements} suspicious elements</strong> in this email.
            </p>
            {!feedback && (
              <div style={styles.selectedCount}>
                Selected: {selected.length} / {question?.totalElements}
              </div>
            )}
          </div>

          <div style={styles.tipsCard}>
            <h4 style={styles.tipsTitle}>💡 Tips</h4>
            <p style={styles.tipItem}>🔍 Check the sender email address</p>
            <p style={styles.tipItem}>⏰ Watch for urgency language</p>
            <p style={styles.tipItem}>🔗 Look for suspicious URLs</p>
            <p style={styles.tipItem}>😨 Identify fear or panic tactics</p>
          </div>

          {!feedback ? (
            <button
              style={{
                ...styles.submitBtn,
                opacity: selected.length === 0 ? 0.5 : 1,
              }}
              onClick={handleSubmitQuestion}
              disabled={selected.length === 0}
            >
              Submit Answers
            </button>
          ) : (
            <button style={styles.nextBtn} onClick={handleNext}>
              {currentQ < TOTAL_QUESTIONS ? `Next Email →` : `See Final Results →`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f4f8', padding: '20px' },
  loadingPage: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  spinner: { width: '40px', height: '40px', border: '4px solid #ddd', borderTop: '4px solid #185fa5', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { marginTop: '16px', color: '#666', fontSize: '16px' },
  backBtn: { background: 'none', border: '1px solid #ddd', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', marginBottom: '24px', color: '#444' },
  backBtn2: { background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', color: '#fff' },
  introCard: { maxWidth: '620px', margin: '0 auto', background: '#fff', borderRadius: '20px', padding: 'clamp(24px,5vw,48px)', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  introIcon: { fontSize: '56px', textAlign: 'center', display: 'block', marginBottom: '16px' },
  introTitle: { fontSize: 'clamp(22px,4vw,30px)', fontWeight: '700', color: '#1e3a5f', textAlign: 'center', margin: '0 0 12px' },
  introDesc: { fontSize: '15px', color: '#666', textAlign: 'center', lineHeight: 1.7, margin: '0 0 28px' },
  infoRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '28px' },
  infoBox: { background: '#f0f4f8', borderRadius: '12px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' },
  infoIcon: { fontSize: '24px' },
  infoLabel: { fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: '15px', fontWeight: '700', color: '#1e3a5f' },
  objectivesBox: { background: '#f0f8ff', borderRadius: '12px', padding: '20px', marginBottom: '20px' },
  objectivesTitle: { fontSize: '14px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 12px' },
  objective: { display: 'flex', gap: '10px', alignItems: 'start', marginBottom: '8px', fontSize: '14px', color: '#444' },
  checkIcon: { fontSize: '14px', flexShrink: 0 },
  warningBox: { background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '10px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'start', fontSize: '13px', color: '#92400e', marginBottom: '24px' },
  startBigBtn: { width: '100%', padding: '16px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  progressHeader: { background: '#1e3a5f', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  progressInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  progressLabel: { fontSize: '13px', color: '#fff', fontWeight: '500' },
  progressBarOuter: { display: 'flex', gap: '8px' },
  progressDot: { width: '32px', height: '6px', borderRadius: '3px', transition: 'background 0.3s' },
  scorePreview: { fontSize: '14px', color: '#b5d4f4', fontWeight: '600', minWidth: '80px', textAlign: 'right' },
  simContent: { display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 280px', gap: '20px', alignItems: 'start' },
  emailCard: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  emailTop: { background: '#f8fafc', padding: '16px 20px', borderBottom: '1px solid #e5e7eb' },
  emailMeta: { display: 'flex', flexDirection: 'column', gap: '6px' },
  emailRow: { display: 'flex', gap: '8px', alignItems: 'start', flexWrap: 'wrap' },
  emailMetaLabel: { fontSize: '12px', fontWeight: '700', color: '#888', minWidth: '54px', paddingTop: '1px' },
  emailFrom: { fontSize: '13px', color: '#a32d2d', fontWeight: '600' },
  emailSubject: { fontSize: '14px', color: '#1e3a5f', fontWeight: '600' },
  emailBody: { padding: '20px', borderBottom: '1px solid #f0f0f0' },
  emailLine: { fontSize: '14px', color: '#333', lineHeight: 1.7, margin: '0 0 8px' },
  elementsSection: { padding: '16px 20px' },
  elementsTitle: { fontSize: '13px', fontWeight: '600', color: '#444', margin: '0 0 12px' },
  elementsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  element: { display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' },
  feedbackSection: { padding: '16px 20px' },
  feedbackTitle: { fontSize: '15px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 12px' },
  feedbackItem: { display: 'flex', gap: '12px', alignItems: 'start', padding: '12px', borderRadius: '10px', marginBottom: '8px' },
  feedbackItemTitle: { fontSize: '13px', fontWeight: '600', color: '#333', margin: '0 0 4px' },
  feedbackItemDesc: { fontSize: '12px', color: '#666', margin: 0, lineHeight: 1.5 },
  sidePanel: { display: 'flex', flexDirection: 'column', gap: '12px' },
  panelCard: { background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  panelTitle: { fontSize: '14px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 8px' },
  panelText: { fontSize: '13px', color: '#666', lineHeight: 1.6, margin: '0 0 12px' },
  selectedCount: { background: '#dbeafe', color: '#1d4ed8', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textAlign: 'center' },
  tipsCard: { background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  tipsTitle: { fontSize: '13px', fontWeight: '700', color: '#1e3a5f', margin: '0 0 10px' },
  tipItem: { fontSize: '12px', color: '#555', margin: '0 0 6px', lineHeight: 1.5 },
  submitBtn: { background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', width: '100%', transition: 'opacity 0.2s' },
  nextBtn: { background: '#166534', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', width: '100%' },
  resultCard: { maxWidth: '500px', margin: '40px auto', background: '#fff', borderRadius: '20px', padding: 'clamp(24px,5vw,48px)', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  scoreCircle: { width: '120px', height: '120px', borderRadius: '50%', border: '5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', background: '#f8fafc' },
  scoreNum: { fontSize: '32px', fontWeight: '800' },
  resultTitle: { fontSize: '26px', fontWeight: '700', margin: '0 0 12px', color: '#1e3a5f' },
  resultFeedback: { fontSize: '15px', color: '#666', margin: '0 0 24px', lineHeight: 1.6 },
  resultStats: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' },
  resultStat: { background: '#f0f4f8', borderRadius: '12px', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px' },
  resultStatVal: { fontSize: '22px', fontWeight: '700', color: '#1e3a5f' },
  resultStatLabel: { fontSize: '11px', color: '#888', fontWeight: '600' },
  badgeEarned: { background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', fontSize: '14px', color: '#92400e' },
  resultBtns: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  btnSecondary: { background: '#f0f4f8', color: '#1e3a5f', border: '1px solid #ddd', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
};