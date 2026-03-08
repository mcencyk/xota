import { useState } from 'react';

const base = import.meta.env.BASE_URL;

// Inline SVG icons (Lucide / mynaui style, stroke-based)
const CarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17H5a2 2 0 0 1-2-2v-4l2-5h10l2 5v4a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17" r="1.5"/>
    <circle cx="16.5" cy="17" r="1.5"/>
    <path d="M5 10h14"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3"/>
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    <path d="M21 21v-2a4 4 0 0 0-3-3.85"/>
  </svg>
);

const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <polyline points="8 14 10 16 16 11"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const SlidersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="14" y2="6"/>
    <line x1="14" y1="6" x2="14" y2="2"/>
    <line x1="14" y1="6" x2="14" y2="10"/>
    <line x1="4" y1="12" x2="4" y2="8"/>
    <line x1="4" y1="12" x2="4" y2="16"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="20" y1="18" x2="20" y2="14"/>
    <line x1="20" y1="18" x2="20" y2="22"/>
    <line x1="10" y1="18" x2="20" y2="18"/>
  </svg>
);

const Divider = () => (
  <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />
);

function NavIcon({ icon, active, badge, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 48, height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 12,
        background: active ? '#004666' : hovered ? 'rgba(0,70,102,0.3)' : 'transparent',
        boxShadow: active ? '0px 1px 4px 0px rgba(0,37,55,0.32)' : 'none',
        color: active ? '#ffffff' : hovered ? '#80b0c8' : 'rgba(128,176,200,0.5)',
        transition: 'background 0.15s, color 0.15s',
        position: 'relative',
      }}>
        {icon}
        {badge != null && (
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 18, height: 18, borderRadius: 9,
            background: '#cc4422',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700, color: '#fff',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 2px 6px rgba(180,40,20,0.55), 0 1px 2px rgba(0,0,0,0.3)',
          }}>
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ activeNav, onNavChange, attentionCount }) {
  return (
    <div style={{
      width: 80,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      background: '#012d42',
      border: '1px solid #004666',
      borderRadius: 24,
      boxShadow: '0px 0px 12px 0px rgba(0,30,45,0.32)',
      overflow: 'hidden',
    }}>
      {/* Logo + GVU PRO */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, paddingTop: 24, paddingBottom: 12,
      }}>
        <img
          src={base + 'assets/vw.svg'}
          alt="VW"
          style={{ width: 32, height: 32, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
        />
        <div style={{ textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
          <div style={{ fontSize: 13, letterSpacing: 0.3, color: '#ffffff', lineHeight: '16px' }}>GVU</div>
          <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#ccdfe9', opacity: 0.5, lineHeight: '12px' }}>PRO</div>
        </div>
      </div>

      <Divider />

      <NavIcon icon={<CarIcon />} active={activeNav === 'aftersales'} badge={attentionCount} onClick={() => onNavChange('aftersales')} />
      <NavIcon icon={<PeopleIcon />} active={activeNav === 'people'} onClick={() => onNavChange('people')} />
      <NavIcon icon={<GearIcon />} active={activeNav === 'settings'} onClick={() => onNavChange('settings')} />

      <Divider />

      <NavIcon icon={<BellIcon />} active={activeNav === 'bell'} badge={1} onClick={() => onNavChange('bell')} />
      <NavIcon icon={<CalendarIcon />} active={activeNav === 'calendar'} onClick={() => onNavChange('calendar')} />

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      <Divider />

      <NavIcon icon={<ChevronRightIcon />} onClick={() => {}} />
      <NavIcon icon={<SlidersIcon />} onClick={() => {}} />

      {/* Avatar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px 0 16px',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: '#004666',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#80b0c8',
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
        }}>
          MC
        </div>
      </div>
    </div>
  );
}
