import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPhishingSimulation, submitSimulation } from '../services/api';

export default function Simulation() {
  const navigate = useNavigate();
  const [sim, setSim] = useState(null);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    getPhishingSimulation()
      .then(res => { setSim(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleElement = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const res = await submitSimulation({
        moduleType: 'phishing',
        selectedElements: selected,
        timeTaken
      });
      setResult(res.data);
    } catch (err) {
      alert('Submission failed — please try again');
    }
  };

  if (loading) return <div style={styles.loading}>Loading simulation...</div>;

  if (result) return (
    <div style={styles.page}>
      <div style={styles.resultCard}>
        <div style={styles.scoreCircle}>
          <span style={styles.scoreNum}>{result.score}%</span>
        </div>
        <h2 style={styles.resultTitle}>
          {result.passed ? '🎉 Well done!' : '😅 Keep practising!'}
        </h2>
        <p style={styles.feedback}>{result.feedback}</p>
        {result.passed && (
          <div style={styles.badge}>🏅 Badge earned! +{result.score} points</div>
        )}
        <div style={styles.resultBtns}>
          <button style={styles.btnPrimary} onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button style={styles.btnSecondary} onClick={() => { setResult(null); setSelected([]); }}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <h2 style={styles.title}>📧 Phishing Email Simulation</h2>
        <span style={styles.step}>Step 1 of 1</span>
      </div>
      <p style={styles.instruction}>
        Click on all the suspicious elements you can find in this email below.
      </p>

      <div style={styles.content}>
        {/* Email */}
        <div style={styles.emailCard}>
          <div style={styles.emailHeader}>
            <strong>Subject:</strong> {sim?.subject}<br/>
            <strong>From:</strong> <span style={styles.suspicious}>{sim?.from}</span>
          </div>
          <div style={styles.emailBody}>
            <p>{sim?.body}</p>
          </div>
          <div style={styles.elements}>
            <p style={styles.elementsTitle}>Click the suspicious elements:</p>
            {sim?.suspiciousElements.map(el => (
              <div
                key={el.id}
                style={{
                  ...styles.element,
                  background: selected.includes(el.id) ? '#fee2e2' : '#f9fafb',
                  border: selected.includes(el.id) ? '2px solid #a32d2d' : '2px solid #e5e7eb'
                }}
                onClick={() => toggleElement(el.id)}
              >
                {selected.includes(el.id) ? '🚩 ' : '○ '}{el.text}
              </div>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div style={styles.panel}>
          <div style={styles.panelCard}>
            <h4 style={styles.panelTitle}>Your task</h4>
            <p style={styles.panelText}>
              Click on all suspicious elements in this email.
              There are {sim?.suspiciousElements.length} elements to find.
            </p>
            <div style={styles.foundCount}>
              Found: {selected.length} / {sim?.suspiciousElements.length}
            </div>
          </div>
          <button
            style={styles.submitBtn}
            onClick={handleSubmit}
            disabled={selected.length === 0}
          >
            Submit Answers
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', background:'#f0f4f8', padding:'24px' },
  loading: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontSize:'18px' },
  header: { display:'flex', alignItems:'center', gap:'16px', marginBottom:'8px' },
  backBtn: { background:'none', border:'1px solid #ddd', borderRadius:'8px', padding:'8px 12px', cursor:'pointer', fontSize:'13px' },
  title: { fontSize:'20px', fontWeight:'600', color:'#1e3a5f', margin:0, flex:1 },
  step: { fontSize:'12px', background:'#dbeafe', color:'#1d4ed8', padding:'4px 10px', borderRadius:'4px', fontWeight:'500' },
  instruction: { fontSize:'14px', color:'#666', marginBottom:'20px' },
  content: { display:'grid', gridTemplateColumns:'1fr 280px', gap:'20px' },
  emailCard: { background:'#fff', borderRadius:'12px', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  emailHeader: { background:'#f8fafc', padding:'16px', borderBottom:'1px solid #e5e7eb', fontSize:'13px', lineHeight:1.8 },
  suspicious: { color:'#a32d2d', fontWeight:'500' },
  emailBody: { padding:'16px', fontSize:'14px', lineHeight:1.8, color:'#333' },
  elements: { padding:'16px', borderTop:'1px solid #e5e7eb' },
  elementsTitle: { fontSize:'13px', fontWeight:'500', color:'#444', marginBottom:'10px' },
  element: { padding:'10px 14px', borderRadius:'8px', cursor:'pointer', marginBottom:'8px', fontSize:'13px', transition:'all 0.2s' },
  panel: { display:'flex', flexDirection:'column', gap:'16px' },
  panelCard: { background:'#fff', borderRadius:'12px', padding:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  panelTitle: { fontSize:'14px', fontWeight:'600', color:'#1e3a5f', margin:'0 0 8px' },
  panelText: { fontSize:'13px', color:'#666', lineHeight:1.6, margin:'0 0 12px' },
  foundCount: { background:'#dbeafe', color:'#1d4ed8', padding:'8px 12px', borderRadius:'8px', fontSize:'14px', fontWeight:'500', textAlign:'center' },
  submitBtn: { background:'#1e3a5f', color:'#fff', border:'none', borderRadius:'12px', padding:'14px', fontSize:'15px', fontWeight:'500', cursor:'pointer', width:'100%' },
  resultCard: { maxWidth:'480px', margin:'80px auto', background:'#fff', borderRadius:'16px', padding:'40px', textAlign:'center', boxShadow:'0 4px 24px rgba(0,0,0,0.1)' },
  scoreCircle: { width:'100px', height:'100px', borderRadius:'50%', border:'4px solid #1e3a5f', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' },
  scoreNum: { fontSize:'28px', fontWeight:'700', color:'#1e3a5f' },
  resultTitle: { fontSize:'24px', fontWeight:'600', margin:'0 0 12px', color:'#1e3a5f' },
  feedback: { fontSize:'14px', color:'#666', margin:'0 0 20px', lineHeight:1.6 },
  badge: { background:'#fef3c7', color:'#92400e', padding:'12px', borderRadius:'8px', marginBottom:'20px', fontWeight:'500' },
  resultBtns: { display:'flex', gap:'12px', justifyContent:'center' },
  btnPrimary: { background:'#1e3a5f', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', cursor:'pointer', fontWeight:'500' },
  btnSecondary: { background:'#f0f4f8', color:'#1e3a5f', border:'1px solid #ddd', borderRadius:'8px', padding:'10px 20px', cursor:'pointer', fontWeight:'500' }
};