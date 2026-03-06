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
          display: 'flex', alignItems: 'center', gap: 8,
          height: 32, padding: '4px 8px',
          borderRadius: 6,
          border: open ? '1px solid #28779c' : hovered ? '1px solid #2a6a87' : '1px solid #16506c',
          background: open ? 'rgba(0,70,102,0.24)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)',
          boxShadow: open
            ? '0px 0px 8px 0px rgba(40,119,156,0.32), inset 0px 0px 4px 0px rgba(0,0,0,0.24)'
            : '0px 1px 2px 0px rgba(0,0,0,0.12)',
          cursor: 'pointer', userSelect: 'none',
          transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
        }}
      >
        <span style={{
          flex: 1, fontSize: 12, fontWeight: 500, lineHeight: '16px',
          color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {brandName} {selected}
        </span>
        <span style={{
          color: '#80b0c8', opacity: 0.6, flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s, opacity 0.15s',
          display: 'flex',
          ...(open ? { opacity: 1 } : {}),
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
