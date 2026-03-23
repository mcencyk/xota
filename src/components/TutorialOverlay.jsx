import { useState, useEffect } from 'react';

const F = "'Inter', sans-serif";
const PAD = 8; // spotlight padding around element

const STEPS = [
  {
    target: 'sidebar',
    title: 'Navigation Panel',
    body: 'The sidebar gives you access to all modules, notifications, and system settings. It stays visible throughout the app.',
    pos: 'right',
  },
  {
    target: 'nav-field',
    title: 'Field',
    body: 'The Field module is where you manage production update campaigns for your entire vehicle fleet. The red badge shows how many campaigns need attention.',
    pos: 'right',
  },
  {
    target: 'nav-lab',
    title: 'Lab',
    body: 'The Lab module lets you create and run isolated test campaigns on selected vehicles before rolling out to production.',
    pos: 'right',
  },
  {
    target: 'top-tabs',
    title: 'Status Filters',
    body: 'Quickly filter the campaign list by status: All, Running, Completed, Attention, Draft, or only your own campaigns.',
    pos: 'bottom',
  },
  {
    target: 'search',
    title: 'Search',
    body: 'Search across all campaigns by name, code, criterion, specification model, type, date, or status.',
    pos: 'bottom',
  },
  {
    target: 'bottom-tabs',
    title: 'Content Tabs',
    body: 'Switch between Campaigns, Criterions (update variables), and Scheduled Updates. Click the + icon on any tab to create a new item.',
    pos: 'top',
  },
];

function useRect(target, step) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    const el = document.querySelector(`[data-tutorial="${target}"]`);
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [target, step]);

  return rect;
}

export default function TutorialOverlay({ onDone }) {
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const current = STEPS[step];
  const rect = useRect(current.target, step);

  function go(next) {
    setAnimKey(k => k + 1);
    setStep(next);
  }

  function handleNext() {
    if (step < STEPS.length - 1) go(step + 1);
    else onDone();
  }

  function handlePrev() {
    if (step > 0) go(step - 1);
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Spotlight coords with padding
  const sp = rect ? {
    top: Math.max(0, rect.top - PAD),
    left: Math.max(0, rect.left - PAD),
    right: Math.min(vw, rect.left + rect.width + PAD),
    bottom: Math.min(vh, rect.top + rect.height + PAD),
  } : null;

  // Tooltip size estimate
  const TW = 280;
  const TH = 160;
  const GAP = 16;

  function tooltipStyle() {
    if (!sp) return { top: vh / 2 - TH / 2, left: vw / 2 - TW / 2 };
    const { pos } = current;
    if (pos === 'right') {
      const left = sp.right + GAP;
      const top = sp.top + (sp.bottom - sp.top) / 2 - TH / 2;
      return { top: Math.max(16, Math.min(vh - TH - 16, top)), left: Math.min(vw - TW - 16, left) };
    }
    if (pos === 'left') {
      const left = sp.left - GAP - TW;
      const top = sp.top + (sp.bottom - sp.top) / 2 - TH / 2;
      return { top: Math.max(16, Math.min(vh - TH - 16, top)), left: Math.max(16, left) };
    }
    if (pos === 'bottom') {
      const top = sp.bottom + GAP;
      const left = sp.left + (sp.right - sp.left) / 2 - TW / 2;
      return { top: Math.min(vh - TH - 16, top), left: Math.max(16, Math.min(vw - TW - 16, left)) };
    }
    // top
    const top = sp.top - GAP - TH;
    const left = sp.left + (sp.right - sp.left) / 2 - TW / 2;
    return { top: Math.max(16, top), left: Math.max(16, Math.min(vw - TW - 16, left)) };
  }

  const ttStyle = tooltipStyle();

  // Arrow direction (points toward highlighted element)
  function arrowStyle() {
    if (!sp) return null;
    const { pos } = current;
    const tt = ttStyle;
    const arrowBase = { position: 'absolute', width: 0, height: 0, border: '7px solid transparent' };
    if (pos === 'right') return { ...arrowBase, left: -14, top: TH / 2 - 7, borderRightColor: 'rgba(1,45,66,0.97)', borderLeftWidth: 0 };
    if (pos === 'left') return { ...arrowBase, right: -14, top: TH / 2 - 7, borderLeftColor: 'rgba(1,45,66,0.97)', borderRightWidth: 0 };
    if (pos === 'bottom') return { ...arrowBase, top: -14, left: TW / 2 - 7, borderBottomColor: 'rgba(1,45,66,0.97)', borderTopWidth: 0 };
    return { ...arrowBase, bottom: -14, left: TW / 2 - 7, borderTopColor: 'rgba(1,45,66,0.97)', borderBottomWidth: 0 };
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none' }}>
      {/* Dark overlay — 4 panels creating spotlight cutout */}
      {sp ? (
        <>
          {/* Top */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sp.top, background: 'rgba(0,8,18,0.72)', transition: 'height 0.25s ease' }} />
          {/* Bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: sp.bottom, background: 'rgba(0,8,18,0.72)', transition: 'top 0.25s ease' }} />
          {/* Left */}
          <div style={{ position: 'absolute', top: sp.top, left: 0, width: sp.left, bottom: vh - sp.bottom, background: 'rgba(0,8,18,0.72)', transition: 'all 0.25s ease' }} />
          {/* Right */}
          <div style={{ position: 'absolute', top: sp.top, left: sp.right, right: 0, bottom: vh - sp.bottom, background: 'rgba(0,8,18,0.72)', transition: 'all 0.25s ease' }} />
          {/* Highlight border */}
          <div style={{
            position: 'absolute',
            top: sp.top, left: sp.left,
            width: sp.right - sp.left,
            height: sp.bottom - sp.top,
            borderRadius: 12,
            border: '2px solid rgba(40,119,156,0.7)',
            boxShadow: '0 0 0 1px rgba(40,119,156,0.25), 0 0 20px rgba(40,119,156,0.2)',
            transition: 'all 0.25s ease',
            pointerEvents: 'none',
          }} />
        </>
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,8,18,0.72)' }} />
      )}

      {/* Tooltip card */}
      <div
        key={animKey}
        style={{
          position: 'absolute',
          top: ttStyle.top,
          left: ttStyle.left,
          width: TW,
          background: 'rgba(1,45,66,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #1e5a78',
          borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(40,119,156,0.15)',
          padding: '16px 18px',
          pointerEvents: 'all',
          animation: 'tutorialCardIn 0.22s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Arrow */}
        {sp && <div style={arrowStyle()} />}

        {/* Step indicator dots */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 16 : 6, height: 6, borderRadius: 3,
              background: i === step ? '#28779c' : i < step ? 'rgba(40,119,156,0.45)' : 'rgba(40,119,156,0.2)',
              transition: 'all 0.2s ease',
            }} />
          ))}
        </div>

        {/* Title */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', fontFamily: F, letterSpacing: 0.2, marginBottom: 6 }}>
          {current.title}
        </div>

        {/* Body */}
        <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(204,223,233,0.75)', fontFamily: F, lineHeight: 1.6, marginBottom: 16 }}>
          {current.body}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onDone}
            style={{ fontSize: 10, fontWeight: 600, color: 'rgba(128,176,200,0.45)', fontFamily: F, background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: 0.3 }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(128,176,200,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(128,176,200,0.45)'}
          >
            Skip
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {step > 0 && (
              <button
                onClick={handlePrev}
                style={{ fontSize: 10, fontWeight: 700, color: 'rgba(128,176,200,0.65)', fontFamily: F, background: 'transparent', border: '1px solid rgba(40,119,156,0.35)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', letterSpacing: 0.4 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(40,119,156,0.65)'; e.currentTarget.style.color = 'rgba(204,223,233,0.9)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(40,119,156,0.35)'; e.currentTarget.style.color = 'rgba(128,176,200,0.65)'; }}
              >
                ← BACK
              </button>
            )}
            <button
              onClick={handleNext}
              style={{ fontSize: 10, fontWeight: 700, color: '#ffffff', fontFamily: F, background: 'rgba(0,70,102,0.7)', border: '1px solid #28779c', borderRadius: 7, padding: '5px 14px', cursor: 'pointer', letterSpacing: 0.4 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,90,130,0.85)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,70,102,0.7)'}
            >
              {step < STEPS.length - 1 ? 'NEXT →' : 'DONE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
