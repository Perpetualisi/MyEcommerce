import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Loader2, CheckCircle2, Globe, Clock3, Terminal, ShieldCheck } from 'lucide-react';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ct-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
    display: grid;
    grid-template-columns: 5fr 7fr;
    min-height: 100vh;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  @media (max-width: 900px) { .ct-root { grid-template-columns: 1fr; } }

  /* ══ LEFT PANEL ══ */
  .ct-left {
    background: #0c0a09;
    border-right: 1px solid rgba(255,255,255,0.05);
    padding: clamp(60px,8vw,110px) clamp(32px,5vw,80px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    opacity: 0; transform: translateX(-20px);
  }
  .ct-left.revealed {
    animation: ctSlideL 0.9s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes ctSlideL { to { opacity:1; transform:translateX(0); } }

  /* Noise overlay */
  .ct-noise {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
    opacity: 0.12; pointer-events: none;
  }

  .ct-left-content { position: relative; z-index: 1; }

  /* Terminal header */
  .ct-terminal-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 32px;
  }
  .ct-terminal-label {
    font-size: 8.5px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }

  /* Eyebrow */
  .ct-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .ct-eyebrow-line { width: 28px; height: 1px; background: #C9A96E; flex-shrink: 0; }
  .ct-eyebrow-text { font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255,255,255,0.28); }

  .ct-title {
    font-size: clamp(36px,4vw,64px); font-weight: 300;
    letter-spacing: -0.025em; line-height: 1.05; color: #fff;
    margin-bottom: 40px;
  }
  .ct-title em {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    color: rgba(255,255,255,0.4);
  }

  .ct-quote {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    font-size: clamp(13px,1.2vw,16px); line-height: 1.85;
    color: rgba(255,255,255,0.38); letter-spacing: 0.01em;
    border-left: 1px solid rgba(201,169,110,0.3);
    padding-left: 18px; margin-bottom: 24px;
  }
  .ct-body {
    font-size: 9.5px; line-height: 2; letter-spacing: 0.04em;
    color: rgba(255,255,255,0.28); max-width: 340px; margin-bottom: 40px;
  }

  /* Status items */
  .ct-status-list { display: flex; flex-direction: column; gap: 14px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.05); }
  .ct-status-item { display: flex; align-items: center; gap: 12px; }
  .ct-status-dot { width: 5px; height: 5px; background: #7EBF7A; border-radius: 50%; flex-shrink: 0; }
  .ct-status-text { font-size: 8.5px; letter-spacing: 0.42em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
  .ct-status-icon { color: rgba(255,255,255,0.2); }

  /* Footer metadata */
  .ct-left-footer { position: relative; z-index: 1; padding-top: 48px; }
  .ct-version { font-size: 7.5px; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.12); }

  /* ══ RIGHT PANEL ══ */
  .ct-right {
    background: #080705;
    padding: clamp(60px,8vw,110px) clamp(32px,5vw,80px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    opacity: 0; transform: translateX(20px);
  }
  .ct-right.revealed {
    animation: ctSlideR 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both;
  }
  @keyframes ctSlideR { to { opacity:1; transform:translateX(0); } }

  .ct-form-wrap { width: 100%; max-width: 520px; }

  /* ── FORM ── */
  .ct-form { display: flex; flex-direction: column; gap: 44px; }

  .ct-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  @media (max-width: 540px) { .ct-row-2 { grid-template-columns: 1fr; } }

  .ct-field { position: relative; padding-bottom: 12px; }
  .ct-field::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 1px; background: rgba(255,255,255,0.1);
    transform: scaleX(1);
    transition: background 0.4s;
  }
  .ct-field:focus-within::after { background: #C9A96E; }

  .ct-label {
    display: block; font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); margin-bottom: 14px;
  }
  .ct-input {
    width: 100%; background: transparent;
    font-family: 'Overpass Mono', monospace; font-size: 10px;
    letter-spacing: 0.15em; text-transform: uppercase; color: #e8e4dd;
    border: none; outline: none;
    transition: color 0.3s;
  }
  .ct-input::placeholder { color: rgba(255,255,255,0.1); }
  .ct-input:focus::placeholder { color: rgba(255,255,255,0.06); }
  .ct-textarea {
    width: 100%; background: transparent;
    font-family: 'Overpass Mono', monospace; font-size: 10px;
    letter-spacing: 0.1em; color: #e8e4dd;
    border: none; outline: none; resize: none; min-height: 130px;
    line-height: 2;
  }
  .ct-textarea::placeholder { color: rgba(255,255,255,0.1); }

  /* Autofill override */
  .ct-input:-webkit-autofill,
  .ct-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #080705 inset !important;
    -webkit-text-fill-color: #e8e4dd !important;
  }

  /* ── CATEGORY SELECTOR ── */
  .ct-cat-label {
    font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); display: block; margin-bottom: 16px;
  }
  .ct-cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  .ct-cat-btn {
    padding: 12px 14px;
    font-family: 'Overpass Mono', monospace;
    font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.35); cursor: pointer;
    display: flex; align-items: center; justify-content: space-between;
    transition: background 0.25s, border-color 0.25s, color 0.25s;
    text-align: left;
  }
  .ct-cat-btn:hover { border-color: rgba(255,255,255,0.18); color: rgba(255,255,255,0.75); }
  .ct-cat-btn.selected {
    background: #C9A96E; border-color: #C9A96E; color: #080705;
  }

  /* ── SUBMIT BTN ── */
  .ct-submit {
    width: 100%; padding: 20px 24px;
    background: #e8e4dd; border: none; color: #080705;
    font-family: 'Overpass Mono', monospace;
    font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; justify-content: space-between;
    transition: background 0.3s, opacity 0.3s;
  }
  .ct-submit:hover { background: #fff; }
  .ct-submit:disabled { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.2); cursor: not-allowed; }
  .ct-submit-arrow { transition: transform 0.35s ease; }
  .ct-submit:not(:disabled):hover .ct-submit-arrow { transform: translateX(5px); }

  /* ── SUCCESS STATE ── */
  .ct-success {
    text-align: center;
    padding: 72px 32px;
    border: 1px solid rgba(255,255,255,0.06);
    background: #0c0a09;
    animation: ctFadeIn 0.5s ease;
  }
  @keyframes ctFadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
  .ct-success-icon { color: #7EBF7A; margin-bottom: 28px; }
  .ct-success-title {
    font-size: 10px; letter-spacing: 0.6em; text-transform: uppercase;
    color: #fff; margin-bottom: 10px;
  }
  .ct-success-id {
    font-size: 8.5px; letter-spacing: 0.5em; text-transform: uppercase;
    color: #C9A96E; margin-bottom: 18px;
  }
  .ct-success-body {
    font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); line-height: 1.9; max-width: 280px; margin: 0 auto 36px;
  }
  .ct-success-reset {
    font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); background: none; border: none;
    font-family: 'Overpass Mono', monospace; cursor: pointer;
    border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 4px;
    transition: color 0.3s, border-color 0.3s;
  }
  .ct-success-reset:hover { color: #fff; border-color: rgba(255,255,255,0.4); }

  /* ── FOOTER META ── */
  .ct-footer-meta {
    margin-top: 60px; padding-top: 32px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .ct-meta-head {
    font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.35); margin-bottom: 12px; display: block;
  }
  .ct-meta-line {
    font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.18); line-height: 2; display: block;
  }
  .ct-meta-link {
    font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.18); cursor: pointer;
    transition: color 0.3s; display: block; line-height: 2;
  }
  .ct-meta-link:hover { color: rgba(255,255,255,0.65); }
  .ct-meta-right { text-align: right; }
`;

const CATEGORIES = ['General', 'Technical Support', 'Archive Acquisitions', 'Pantry Logistics'];

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const Contact = () => {
  const [formData, setFormData]     = useState({ name: '', email: '', category: 'General', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent]         = useState(false);
  const [packetId, setPacketId]     = useState('');

  const leftRef  = useRef(null);
  const rightRef = useRef(null);

  /* Scroll reveal */
  useEffect(() => {
    const els = [leftRef.current, rightRef.current];
    const observers = els.map(el => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
        { threshold: 0.08 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setPacketId(Math.random().toString(36).slice(2, 11).toUpperCase());
      setIsSent(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', category: 'General', message: '' });
      setTimeout(() => setIsSent(false), 10000);
    }, 2400);
  };

  return (
    <>
      <style>{STYLES}</style>
      <section className="ct-root">

        {/* ══ LEFT ══ */}
        <div ref={leftRef} className="ct-left">
          <div className="ct-noise" />

          <div className="ct-left-content">
            <div className="ct-terminal-row">
              <Terminal size={12} style={{ color: 'rgba(255,255,255,0.22)' }} />
              <span className="ct-terminal-label">COMMS_ARCHIVE // US-EST</span>
            </div>

            <div className="ct-eyebrow">
              <div className="ct-eyebrow-line" />
              <span className="ct-eyebrow-text">Correspondence</span>
            </div>

            <h2 className="ct-title">
              Initiate<br />
              <em>Correspondence.</em>
            </h2>

            <p className="ct-quote">
              "Every transmission is a permanent record in our domestic registry."
            </p>

            <p className="ct-body">
              Our New York hub processes inquiries regarding technical specifications,
              archive sourcing, and logistical routing for global fulfilment.
            </p>

            <div className="ct-status-list">
              <div className="ct-status-item">
                <Globe size={12} className="ct-status-icon" />
                <span className="ct-status-dot" />
                <span className="ct-status-text">Global Relay Active</span>
              </div>
              <div className="ct-status-item">
                <Clock3 size={12} className="ct-status-icon" />
                <span className="ct-status-dot" style={{ background: '#C9A96E' }} />
                <span className="ct-status-text">EST Protocol: 09:00 — 18:00</span>
              </div>
            </div>
          </div>

          <div className="ct-left-footer">
            <p className="ct-version">VENDO_SYSTEM_v2.0.26 // ENCRYPTED</p>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div ref={rightRef} className="ct-right">
          <div className="ct-form-wrap">

            {isSent ? (
              /* SUCCESS */
              <div className="ct-success">
                <CheckCircle2 size={48} strokeWidth={1} className="ct-success-icon" style={{ margin: '0 auto 24px' }} />
                <p className="ct-success-title">Transmission Successful</p>
                <p className="ct-success-id">Packet ID: {packetId}</p>
                <p className="ct-success-body">
                  Your inquiry has been indexed in the New York Registry. Expect a manual response within 48 hours.
                </p>
                <button className="ct-success-reset" onClick={() => setIsSent(false)}>
                  New Correspondence
                </button>
              </div>
            ) : (
              /* FORM */
              <form className="ct-form" onSubmit={handleSubmit}>

                {/* Name + Email */}
                <div className="ct-row-2">
                  <div className="ct-field">
                    <label className="ct-label" htmlFor="ct-name">Identity</label>
                    <input id="ct-name" className="ct-input" type="text" name="name"
                      value={formData.name} onChange={handleChange}
                      placeholder="REQUIRED" required />
                  </div>
                  <div className="ct-field">
                    <label className="ct-label" htmlFor="ct-email">Electronic Mail</label>
                    <input id="ct-email" className="ct-input" type="email" name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder="ARCHIVE@RELAY.IO" required />
                  </div>
                </div>

                {/* Category selector */}
                <div>
                  <span className="ct-cat-label">Departmental Routing</span>
                  <div className="ct-cat-grid">
                    {CATEGORIES.map(cat => (
                      <button key={cat} type="button"
                        className={`ct-cat-btn${formData.category === cat ? ' selected' : ''}`}
                        onClick={() => setFormData(p => ({ ...p, category: cat }))}>
                        <span>{cat}</span>
                        {formData.category === cat && <ShieldCheck size={11} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="ct-field">
                  <label className="ct-label" htmlFor="ct-msg">Inquiry Payload</label>
                  <textarea id="ct-msg" className="ct-textarea" name="message"
                    value={formData.message} onChange={handleChange}
                    placeholder="PROVIDE SUFFICIENT DATA..." required />
                </div>

                {/* Submit */}
                <button type="submit" className="ct-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span style={{ fontStyle: 'italic', letterSpacing: '0.08em', textTransform: 'none' }}>
                        syncing_packets...
                      </span>
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    </>
                  ) : (
                    <>
                      Transmit Packet
                      <ArrowUpRight size={14} className="ct-submit-arrow" strokeWidth={1.5} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer meta */}
            <div className="ct-footer-meta">
              <div>
                <span className="ct-meta-head">Registry HQ // 01</span>
                <span className="ct-meta-line">401 Broadway, Suite 22</span>
                <span className="ct-meta-line">SoHo, New York — 10013</span>
              </div>
              <div className="ct-meta-right">
                <span className="ct-meta-head">Digital Archives</span>
                <span className="ct-meta-link">Instagram.Index</span>
                <span className="ct-meta-link">Pinterest.Archive</span>
              </div>
            </div>

          </div>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </section>
    </>
  );
};

export default Contact;