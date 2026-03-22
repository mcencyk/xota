import { useState, useRef, useEffect } from 'react';

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export default function VariantSelect({ brandName, variants, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 52, padding: '0 12px',
          borderRadius: 8,
          border: open ? '1px solid #28779c' : hovered ? '1px solid #2a6a87' : '1px solid #16506c',
          background: open ? 'rgba(0,70,102,0.24)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)',
          boxShadow: open
            ? '0px 0px 8px 0px rgba(40,119,156,0.32), inset 0px 0px 4px 0px rgba(0,0,0,0.24)'
            : '0px 1px 2px 0px rgba(0,0,0,0.12)',
          cursor: 'pointer', userSelect: 'none',
          transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: 1 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
            color: 'rgba(128,176,200,0.55)', fontFamily: "'Inter', sans-serif",
          }}>
            Variant
          </span>
          <span style={{
            fontSize: 13, fontWeight: 500, color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {brandName} {selected}
          </span>
        </div>
        <span style={{
          color: '#80b0c8', opacity: open ? 1 : 0.6, flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s, opacity 0.15s',
          display: 'flex',
        }}>
          <ChevronIcon />
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#012d42', border: '1px solid #153f53',
          borderRadius: 8, boxShadow: '0px 8px 12px 0px rgba(0,0,0,0.18)',
          overflow: 'hidden', zIndex: 10,
        }}>
          {variants.map((v, i) => {
            const isSelected = v === selected;
            return (
              <div
                key={v}
                onClick={() => { onSelect(v); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '10px 12px', cursor: 'pointer',
                  borderBottom: i < variants.length - 1 ? '1px solid #153f53' : 'none',
                  background: 'transparent',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: isSelected ? '#ffffff' : '#80b0c8',
                }}>
                  {v}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
