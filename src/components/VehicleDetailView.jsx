import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';

// ─── Brand models (last 6 years, 2020-2026) ───────────────────────────────────
const BRAND_MODELS = {
  vw:    ['ID.3', 'ID.4', 'ID.4 GTX', 'ID.5', 'ID.7', 'Golf 8', 'Passat B9', 'Tiguan'],
  audi:  ['A3', 'A5', 'A6', 'Q3', 'Q4 e-tron', 'Q5', 'Q6 e-tron', 'Q8 e-tron', 'e-tron GT'],
  ford:  ['Mustang Mach-E', 'Puma ST', 'Kuga PHEV', 'Explorer PHEV', 'Transit Custom', 'Focus Active'],
  seat:  ['Ibiza FR', 'Leon e-Hybrid', 'Arona', 'Ateca', 'Tarraco'],
  skoda: ['Octavia iV', 'Superb iV', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq iV'],
  volvo: ['XC40 Recharge', 'XC60 T8', 'XC90 B6', 'C40 Recharge', 'S60 Recharge', 'EX30', 'EX90'],
};

// ─── Count-up animation ───────────────────────────────────────────────────────
function useCountUp(target, duration = 600) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    setCurrent(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (target === 0) return;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setCurrent(Math.round(target * e));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return current;
}

function Trend({ dir }) {
  const color = dir === 'up' ? '#38b060' : dir === 'down' ? '#cc4433' : 'rgba(128,176,200,0.5)';
  if (dir === 'neutral') return <span style={{ color, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>→</span>;
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ display: 'inline', marginLeft: 2 }}>
      {dir === 'up'
        ? <path d="M6 10V2M6 2L2 6M6 2L10 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        : <path d="M6 2V10M6 10L2 6M6 10L10 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      }
    </svg>
  );
}

function StatCard({ value, unit, trend, label }) {
  const isNum = typeof value === 'number';
  const animated = useCountUp(isNum ? value : 0);
  const display = isNum ? animated.toLocaleString('en-US') : value;
  return (
    <div style={{ flex: 1, minWidth: 0, background: 'rgba(1,45,66,0.55)', border: '1px solid #153f53', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>{display}</span>
        {unit && <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(128,176,200,0.7)', fontFamily: "'Inter', sans-serif" }}>{unit}</span>}
        {trend && <Trend dir={trend} />}
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function ProgressCard({ value, trend, label, barColor, barWidth }) {
  const numMatch = typeof value === 'string' ? value.match(/^(\d+)%$/) : null;
  const numValue = numMatch ? parseInt(numMatch[1], 10) : 0;
  const animated = useCountUp(numValue);
  const display = numMatch ? `${animated}%` : value;
  return (
    <div style={{ flex: 1, minWidth: 0, background: 'rgba(1,45,66,0.55)', border: '1px solid #153f53', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>{display}</span>
          {trend && <Trend dir={trend} />}
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</div>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', borderRadius: 2, width: barWidth, background: barColor, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

// ─── Seeded data generation ───────────────────────────────────────────────────
function mkRng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}

const LOCATIONS = ['Germany', 'Czech Republic', 'Poland', 'Austria', 'Sweden', 'Netherlands', 'Spain', 'France', 'Italy', 'Norway'];

function getVehicleStats(vehicle) {
  const rng = mkRng(vehicle.id * 7919 + 13337);
  const ri  = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
  const rf  = (min, max) => +(rng() * (max - min) + min).toFixed(1);

  const totalUpdates = ri(4, 28);
  const monthly = Array.from({ length: 12 }, () => ri(0, 4));

  return {
    daysInFleet:       ri(60, 840),
    totalUpdates,
    mileage:           ri(4200, 87000),
    lastUpdateDays:    ri(1, 30),
    updateSpeed:       rf(2.1, 8.9),
    dlSpeed:           rf(3.2, 12.4),
    updateTrend:       ['up', 'down', 'neutral'][ri(0, 2)],
    dlTrend:           ['up', 'down', 'neutral'][ri(0, 2)],
    successRate:       ri(72, 100),
    selfTestRate:      ri(80, 100),
    connectivity:      ri(88, 100),
    monthly,
    components: [
      { name: 'DRC Main',      version: vehicle.sw },
      { name: 'BMS',           version: `v${ri(1,3)}.${ri(0,9)}.${ri(0,9)}` },
      { name: 'Gateway',       version: `v${ri(1,4)}.${ri(0,5)}` },
      { name: 'HVAC Control',  version: `v${ri(2,5)}.${ri(0,9)}.${ri(0,4)}` },
      { name: 'Navigation',    version: `v${ri(3,8)}.${ri(0,9)}` },
      { name: 'Telematics',    version: `v${ri(1,3)}.${ri(0,9)}.${ri(0,9)}` },
    ],
    enrolledCampaigns: ri(1, 6),
    location:          LOCATIONS[ri(0, LOCATIONS.length - 1)],
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const VEH_STATUS_CFG = {
  ACTIVE:   { bg: 'rgba(40,140,80,0.2)',   color: '#38b060', dot: '#38b060' },
  INACTIVE: { bg: 'rgba(60,80,100,0.22)',  color: '#607890', dot: '#607890' },
};
function VehicleStatusBadge({ status }) {
  const key = status.toUpperCase();
  const cfg = VEH_STATUS_CFG[key] || VEH_STATUS_CFG.INACTIVE;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:99, background:cfg.bg, border:`1px solid ${cfg.dot}`, fontSize:10, fontWeight:700, color:cfg.color, fontFamily:"'Inter', sans-serif", letterSpacing:0.5, whiteSpace:'nowrap' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.dot, flexShrink:0 }} />
      {key}
    </span>
  );
}

function MetaItem({ label, value }) {
  return (
    <div style={{ display:'flex', alignItems:'baseline', gap:6, whiteSpace:'nowrap' }}>
      <span style={{ fontSize:9, fontWeight:700, color:'rgba(128,176,200,0.45)', fontFamily:"'Inter', sans-serif", letterSpacing:1.2, textTransform:'uppercase' }}>{label}:</span>
      <span style={{ fontSize:11, fontWeight:600, color:'rgba(204,223,233,0.85)', fontFamily:"'Inter', sans-serif" }}>{value}</span>
    </div>
  );
}

function BackButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ position:'relative', flexShrink:0 }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width:32, height:32, borderRadius:8,
          border:'none', background:'none',
          color: hov ? '#ccdfe9' : 'rgba(128,176,200,0.5)',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          transition:'color 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>
      {hov && (
        <div style={{
          position:'absolute', left:'calc(100% + 8px)', top:'50%', transform:'translateY(-50%)',
          padding:'4px 10px', borderRadius:6, whiteSpace:'nowrap',
          background:'#012d42', border:'1px solid #153f53',
          fontSize:11, fontWeight:600, color:'#80b0c8', fontFamily:"'Inter', sans-serif",
          pointerEvents:'none', zIndex:200, boxShadow:'0 2px 8px rgba(0,0,0,0.28)',
          animation:'tooltipFadeInRight 0.12s ease forwards',
        }}>
          Back to Lab
        </div>
      )}
    </div>
  );
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function UpdateHistoryChart({ monthly }) {
  const maxVal = Math.max(...monthly, 1);
  const [hoveredBar, setHoveredBar] = useState(null);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:5, flex:1, minHeight:0 }}>
      {monthly.map((val, i) => {
        const isHov = hoveredBar === i;
        const barH  = val === 0 ? 3 : `${Math.max((val / maxVal) * 100, 8)}%`;
        return (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', minHeight:0 }}>
            <div
              style={{ flex:1, display:'flex', alignItems:'flex-end', width:'100%', cursor:'pointer' }}
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Bar with tooltip anchored to its top */}
              <div style={{ width:'100%', height: barH, borderRadius:3, position:'relative',
                background: isHov
                  ? 'linear-gradient(180deg, #3cbce0 0%, #2280a8 100%)'
                  : (val === 0 ? 'rgba(255,255,255,0.06)' : 'linear-gradient(180deg, #28a0c8 0%, #1a6a90 100%)'),
                animation: 'barEnter 0.55s cubic-bezier(0.22,1,0.36,1) both',
                transition: 'background 0.2s',
              }}>
                {val > 0 && (
                  <div style={{
                    position:'absolute', bottom:'calc(100% + 5px)', left:'50%', transform:'translateX(-50%)',
                    padding:'3px 7px', borderRadius:4, whiteSpace:'nowrap',
                    background:'#012d42', border:'1px solid #153f53',
                    fontSize:9, fontWeight:700, color:'#80b0c8', fontFamily:"'Inter', sans-serif",
                    letterSpacing:0.5,
                    pointerEvents:'none', zIndex:10,
                    opacity: isHov ? 1 : 0,
                    transition: 'opacity 0.18s',
                  }}>{val}</div>
                )}
              </div>
            </div>
            {/* Month label */}
            <div style={{
              fontSize:8, fontWeight:700, letterSpacing:0.9, textTransform:'uppercase',
              color: isHov ? 'rgba(128,176,200,0.85)' : 'rgba(128,176,200,0.35)',
              fontFamily:"'Inter', sans-serif", flexShrink:0,
              transition: 'color 0.18s',
            }}>
              {MONTHS[i]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IconBtn({ children, tooltip, danger, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ position:'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width:32, height:32, borderRadius:8, border:'none',
          background: danger
            ? (hov ? 'rgba(180,40,40,0.28)' : 'rgba(180,40,40,0.14)')
            : (hov ? 'rgba(0,70,102,0.38)'  : 'rgba(0,70,102,0.18)'),
          color: danger
            ? (hov ? '#f05858' : 'rgba(200,80,80,0.7)')
            : (hov ? '#ccdfe9' : 'rgba(128,176,200,0.65)'),
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          transition:'background 0.15s, color 0.15s',
        }}
      >
        {children}
      </button>
      {hov && tooltip && (
        <div style={{
          position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)',
          padding:'4px 10px', borderRadius:6, whiteSpace:'nowrap',
          background:'#012d42', border:'1px solid #153f53',
          fontSize:11, fontWeight:600, color:'#80b0c8', fontFamily:"'Inter', sans-serif",
          pointerEvents:'none', zIndex:200, boxShadow:'0 2px 8px rgba(0,0,0,0.28)',
          animation:'tooltipFadeIn 0.12s ease forwards',
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

// ─── Vehicle Configuration Modal ──────────────────────────────────────────────
function ConfigField({ label, value, onChange, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isNum  = type === 'number';
  const isDate = type === 'date';
  const floated = focused || isDate || String(value).length > 0;
  const borderColor = focused ? '#28779c' : hovered ? '#2a6a87' : '#16506c';
  const bgColor     = focused ? 'rgba(0,70,102,0.24)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)';
  const shadow      = focused
    ? '0px 0px 8px 0px rgba(40,119,156,0.32), inset 0px 0px 4px 0px rgba(0,0,0,0.24)'
    : '0px 1px 2px 0px rgba(0,0,0,0.12)';
  function step(delta) { onChange(String((parseInt(value, 10) || 0) + delta)); }
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:'relative', height:52, borderRadius:8,
        border:`1px solid ${borderColor}`, background:bgColor, boxShadow:shadow,
        transition:'border-color 0.15s, box-shadow 0.15s, background 0.15s', overflow:'hidden',
      }}
    >
      <label style={{
        position:'absolute', left:12,
        top: floated ? 7 : '50%',
        transform: floated ? 'none' : 'translateY(-50%)',
        fontSize: floated ? 9 : 12, fontWeight: floated ? 700 : 500,
        color: floated ? 'rgba(128,176,200,0.55)' : 'rgba(128,176,200,0.6)',
        fontFamily:"'Inter', sans-serif",
        letterSpacing: floated ? 0.8 : 0,
        textTransform: floated ? 'uppercase' : 'none',
        pointerEvents:'none',
        transition:'top 0.15s, font-size 0.15s, transform 0.15s, color 0.15s',
      }}>{label}</label>
      <input
        type={isDate ? 'date' : isNum ? 'text' : type}
        inputMode={isNum ? 'numeric' : undefined}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position:'absolute', left:0, right: isNum ? 36 : 0, top:0, bottom:0,
          background:'transparent', border:'none', outline:'none',
          fontFamily:"'Inter', sans-serif", fontSize:13, fontWeight:500,
          color:'#ffffff', caretColor:'#ffffff',
          padding:'22px 12px 6px',
          ...(isDate ? { colorScheme:'dark' } : {}),
        }}
      />
      {isNum && (
        <div style={{
          position:'absolute', right:0, top:0, bottom:0, width:36,
          display:'flex', flexDirection:'column',
          borderLeft:'1px solid rgba(40,100,140,0.25)',
        }}>
          {[1, -1].map(delta => (
            <button
              key={delta}
              tabIndex={-1}
              onClick={() => step(delta)}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,90,130,0.35)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(128,176,200,0.7)'; }}
              style={{
                flex:1, background:'transparent', border:'none',
                borderBottom: delta === 1 ? '1px solid rgba(40,100,140,0.25)' : 'none',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                color:'rgba(128,176,200,0.7)', transition:'background 0.15s, color 0.15s',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {delta === 1
                  ? <polyline points="6 15 12 9 18 15"/>
                  : <polyline points="6 9 12 15 18 9"/>
                }
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfigSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const borderColor = open ? '#28779c' : hovered ? '#2a6a87' : '#16506c';
  const bgColor     = open ? 'rgba(0,70,102,0.24)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)';
  const shadow      = open
    ? '0px 0px 8px 0px rgba(40,119,156,0.32), inset 0px 0px 4px 0px rgba(0,0,0,0.24)'
    : '0px 1px 2px 0px rgba(0,0,0,0.12)';
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height:52, borderRadius:8, padding:'0 12px',
          border:`1px solid ${borderColor}`, background:bgColor, boxShadow:shadow,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          cursor:'pointer', userSelect:'none',
          transition:'border-color 0.15s, background 0.15s, box-shadow 0.15s',
        }}
      >
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          <span style={{ fontSize:9, fontWeight:700, color:'rgba(128,176,200,0.55)', fontFamily:"'Inter', sans-serif", letterSpacing:0.8, textTransform:'uppercase' }}>{label}</span>
          <span style={{ fontSize:13, fontWeight:500, color:'#ffffff', fontFamily:"'Inter', sans-serif" }}>{value}</span>
        </div>
        <span style={{ color:'#80b0c8', opacity: open ? 1 : 0.6, transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s, opacity 0.15s', display:'flex' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', left:0, right:0,
          background:'#012d42', border:'1px solid #153f53',
          borderRadius:8, boxShadow:'0px 8px 12px 0px rgba(0,0,0,0.18)',
          overflow:'hidden', zIndex:220,
        }}>
          {options.map((opt, i) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding:'10px 12px', cursor:'pointer',
                borderBottom: i < options.length - 1 ? '1px solid #153f53' : 'none',
                background:'transparent', transition:'background 0.12s',
                fontSize:12, fontWeight:500,
                color: opt === value ? '#ffffff' : '#80b0c8',
                fontFamily:"'Inter', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function VehicleConfigModal({ vehicle, onClose, models = [] }) {
  const [closing, setClosing] = useState(false);
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [saveHov, setSaveHov] = useState(false);

  const [model,  setModel]  = useState(vehicle.model);
  const [sw,     setSw]     = useState(vehicle.sw);
  const [chip,   setChip]   = useState(vehicle.chip);
  const [status, setStatus] = useState(vehicle.status);

  const initProdDate = (() => {
    const m = String(1 + ((vehicle.id * 7)  % 12)).padStart(2,'0');
    const d = String(1 + ((vehicle.id * 13) % 28)).padStart(2,'0');
    return `${vehicle.year}-${m}-${d}`;
  })();
  const [prodDate, setProdDate] = useState(initProdDate);

  const authCode = `${vehicle.vin.slice(0,4)}-${vehicle.vin.slice(4,8)}-${vehicle.vin.slice(8,12)}`;
  const connectedDate = (() => {
    const base = new Date(initProdDate);
    const offset = 30 + ((vehicle.id * 17) % 90);
    const d = new Date(base.getTime() + offset * 86400000);
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  })();

  const changed = model !== vehicle.model || prodDate !== initProdDate ||
                  sw !== vehicle.sw || chip !== vehicle.chip || status !== vehicle.status;

  function handleClose() { setClosing(true); }

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position:'fixed', inset:0, zIndex:200,
          background:'rgba(0,46,67,0.75)',
          backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
          animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease',
        }}
      />
      <div
        onAnimationEnd={() => { if (closing) onClose(); }}
        style={{
          position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width:520,
          background:'rgba(1,45,66,0.82)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
          border:'1px solid #153f53', borderRadius:24, padding:24,
          display:'flex', flexDirection:'column', gap:24,
          boxShadow:'0px 0px 16px 0px rgba(0,0,0,0.24)',
          zIndex:201, boxSizing:'border-box',
          animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards',
        }}
      >
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:20, fontWeight:600, color:'#ffffff', fontFamily:"'Montserrat', sans-serif", letterSpacing:0.4 }}>
            Vehicle Configuration
          </span>
          <div style={{ position:'relative' }}>
            <button
              onClick={handleClose}
              onMouseEnter={() => setCloseHov(true)}
              onMouseLeave={() => setCloseHov(false)}
              style={{
                width:24, height:24, background:'none', border:'none', padding:0,
                cursor:'pointer',
                color: closeHov ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'color 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {closeHov && (
              <div style={{
                position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)',
                padding:'3px 8px', borderRadius:4,
                background:'#012d42', border:'1px solid #153f53',
                fontSize:10, fontWeight:600, color:'#80b0c8',
                fontFamily:"'Inter', sans-serif", whiteSpace:'nowrap',
                pointerEvents:'none', zIndex:210,
              }}>Close</div>
            )}
          </div>
        </div>

        {/* Read-only info row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          <div style={{ background:'rgba(0,70,102,0.14)', border:'1px solid #16506c', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:3, gridColumn:'1 / 3' }}>
            <span style={{ fontSize:9, fontWeight:700, color:'rgba(128,176,200,0.55)', fontFamily:"'Inter', sans-serif", letterSpacing:0.8, textTransform:'uppercase' }}>VIN</span>
            <span style={{ fontSize:13, fontWeight:500, color:'rgba(204,223,233,0.55)', fontFamily:"'Inter', sans-serif" }}>{vehicle.vin}</span>
          </div>
          <div style={{ background:'rgba(0,70,102,0.14)', border:'1px solid #16506c', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:3 }}>
            <span style={{ fontSize:9, fontWeight:700, color:'rgba(128,176,200,0.55)', fontFamily:"'Inter', sans-serif", letterSpacing:0.8, textTransform:'uppercase' }}>Connected</span>
            <span style={{ fontSize:13, fontWeight:500, color:'rgba(204,223,233,0.55)', fontFamily:"'Inter', sans-serif" }}>{connectedDate}</span>
          </div>
        </div>

        {/* Authentication code (read-only) */}
        <div style={{ background:'rgba(0,70,102,0.14)', border:'1px solid #16506c', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:3 }}>
          <span style={{ fontSize:9, fontWeight:700, color:'rgba(128,176,200,0.55)', fontFamily:"'Inter', sans-serif", letterSpacing:0.8, textTransform:'uppercase' }}>Authentication Code</span>
          <span style={{ fontSize:13, fontWeight:600, color:'rgba(204,223,233,0.55)', fontFamily:"'Inter', sans-serif", letterSpacing:1.5 }}>{authCode}</span>
        </div>

        {/* Fields grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <ConfigSelect label="Model"           value={model}    options={models}     onChange={setModel} />
          <ConfigField  label="Production Date" value={prodDate} onChange={setProdDate} type="date" />
          <ConfigField label="Software Version" value={sw}       onChange={setSw} />
          <ConfigField label="Chip Version"     value={chip}     onChange={setChip} />
          <div style={{ gridColumn:'1 / -1' }}>
            <ConfigSelect label="Status" value={status} options={['Active', 'Inactive']} onChange={setStatus} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
          <button
            onClick={handleClose}
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            style={{
              padding:'10px 18px', borderRadius:8,
              fontFamily:"'Inter', sans-serif", fontWeight:700, fontSize:10,
              letterSpacing:1.2, textTransform:'uppercase',
              color: cancelHov ? '#ccdfe9' : 'rgba(128,176,200,0.7)',
              background: cancelHov ? 'rgba(0,70,102,0.28)' : 'transparent',
              border:'1px solid rgba(128,176,200,0.2)',
              cursor:'pointer', transition:'all 0.15s',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => { if (changed) handleClose(); }}
            onMouseEnter={() => setSaveHov(true)}
            onMouseLeave={() => setSaveHov(false)}
            style={{
              padding:'10px 18px', borderRadius:8,
              fontFamily:"'Inter', sans-serif", fontWeight:700, fontSize:10,
              letterSpacing:1.2, textTransform:'uppercase',
              color: !changed ? 'rgba(128,176,200,0.3)' : (saveHov ? '#ffffff' : '#28a0c8'),
              background: !changed ? 'rgba(0,70,102,0.1)' : (saveHov ? 'rgba(30,120,160,0.55)' : 'rgba(30,120,160,0.32)'),
              border: `1px solid ${!changed ? 'rgba(128,176,200,0.1)' : (saveHov ? 'rgba(40,160,200,0.6)' : 'rgba(40,160,200,0.35)')}`,
              cursor: changed ? 'pointer' : 'default',
              transition:'all 0.15s',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Remove from Fleet Modal ──────────────────────────────────────────────────
function RemoveFleetModal({ vehicle, onClose }) {
  const [closing, setClosing] = useState(false);
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [removeHov, setRemoveHov] = useState(false);

  function handleClose() { setClosing(true); }

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position:'fixed', inset:0, zIndex:200,
          background:'rgba(0,46,67,0.75)',
          backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
          animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease',
        }}
      />
      <div
        onAnimationEnd={() => { if (closing) onClose(); }}
        style={{
          position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          width:568,
          background:'rgba(1,45,66,0.82)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
          border:'1px solid #153f53', borderRadius:24, padding:24,
          display:'flex', flexDirection:'column', gap:24,
          boxShadow:'0px 0px 16px 0px rgba(0,0,0,0.24)',
          zIndex:201, boxSizing:'border-box',
          animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards',
        }}
      >
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:20, fontWeight:600, color:'#ffffff', fontFamily:"'Montserrat', sans-serif", letterSpacing:0.4 }}>
            Remove from Fleet
          </span>
          <div style={{ position:'relative' }}>
            <button
              onClick={handleClose}
              onMouseEnter={() => setCloseHov(true)}
              onMouseLeave={() => setCloseHov(false)}
              style={{
                width:24, height:24, background:'none', border:'none', padding:0,
                cursor:'pointer',
                color: closeHov ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'color 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {closeHov && (
              <div style={{
                position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)',
                padding:'3px 8px', borderRadius:4,
                background:'#012d42', border:'1px solid #153f53',
                fontSize:10, fontWeight:600, color:'#80b0c8',
                fontFamily:"'Inter', sans-serif", whiteSpace:'nowrap',
                pointerEvents:'none', zIndex:210,
              }}>Close</div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{
          background:'rgba(0,46,67,0.5)', border:'1px solid #153f53',
          borderRadius:16, padding:'16px 24px 20px',
          display:'flex', flexDirection:'column', gap:12,
        }}>
          <p style={{ fontSize:12, fontWeight:500, color:'#ccdfe9', fontFamily:"'Inter', sans-serif", lineHeight:'20px', margin:0 }}>
            Removing <strong style={{ color:'#ffffff' }}>{vehicle.vin}</strong> ({vehicle.model}) from the test fleet will permanently revoke its access to OTA campaigns and erase all associated test data. Vehicles removed from the fleet cannot be re-enrolled automatically and must go through the full onboarding process again. This action cannot be undone.
          </p>
          <p style={{ fontSize:14, fontWeight:700, color:'#ffffff', fontFamily:"'Inter', sans-serif", lineHeight:'22px', margin:0 }}>
            Are you sure you want to remove this vehicle from the fleet?
          </p>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
          <button
            onClick={handleClose}
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            style={{
              padding:'10px 18px', borderRadius:8,
              fontFamily:"'Inter', sans-serif", fontWeight:700, fontSize:10,
              letterSpacing:1.2, textTransform:'uppercase',
              color: cancelHov ? '#ccdfe9' : 'rgba(128,176,200,0.7)',
              background: cancelHov ? 'rgba(0,70,102,0.28)' : 'transparent',
              border:'1px solid rgba(128,176,200,0.2)',
              cursor:'pointer', transition:'all 0.15s',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleClose}
            onMouseEnter={() => setRemoveHov(true)}
            onMouseLeave={() => setRemoveHov(false)}
            style={{
              padding:'10px 18px', borderRadius:8,
              fontFamily:"'Inter', sans-serif", fontWeight:700, fontSize:10,
              letterSpacing:1.2, textTransform:'uppercase',
              color: removeHov ? '#ff6060' : '#cc4433',
              background: removeHov ? 'rgba(180,40,40,0.35)' : 'rgba(180,40,40,0.2)',
              border:`1px solid ${removeHov ? 'rgba(200,60,60,0.5)' : 'rgba(180,40,40,0.35)'}`,
              cursor:'pointer', transition:'all 0.15s',
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Loader steps ─────────────────────────────────────────────────────────────
const LOAD_STEPS_VEHICLE  = ['Fetching vehicle data', 'Loading OTA history', 'Preparing vehicle view'];
const LOAD_STEPS_BACK     = ['Syncing test results', 'Refreshing vehicle list', 'Loading test fleet'];
const LOAD_STEPS_FIELD    = ['Syncing vehicle data', 'Loading campaign list', 'Preparing Field view'];

// ─── Main component ───────────────────────────────────────────────────────────
export default function VehicleDetailView({ vehicle, onBack, onNavChange, activeBrand, onBrandChange, onLogout }) {
  const [loading,      setLoading]      = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loadStep,     setLoadStep]     = useState(0);
  const [loadSteps,    setLoadSteps]    = useState(LOAD_STEPS_BACK);
  const [loadSubtitle, setLoadSubtitle] = useState('');
  const [refreshKey,   setRefreshKey]   = useState(0);
  const [configOpen,   setConfigOpen]   = useState(false);
  const [removeOpen,   setRemoveOpen]   = useState(false);

  const stats = getVehicleStats({ ...vehicle, id: vehicle.id + refreshKey * 1000 });

  function triggerLoader(steps, subtitle, onDone) {
    setLoadSteps(steps);
    setLoadSubtitle(subtitle);
    setLoading(true);
    setLoadStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
    setTimeout(() => setLoadStep(1), 450);
    setTimeout(() => setLoadStep(2), 900);
    setTimeout(() => setLoaderVisible(false), 1300);
    setTimeout(() => { setLoading(false); setLoadStep(0); if (onDone) onDone(); }, 1600);
  }

  function handleBack() {
    triggerLoader(LOAD_STEPS_BACK, 'Returning to Lab', onBack);
  }

  function handleRefresh() {
    triggerLoader(LOAD_STEPS_VEHICLE, 'Refreshing vehicle data', () => setRefreshKey(k => k + 1));
  }

  if (loading) {
    return (
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        width:'100vw', height:'100vh',
        background:'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)',
        backgroundColor:'#003050',
      }}>
        <div style={{ opacity: loaderVisible ? 1 : 0, transition:'opacity 0.3s ease', display:'flex', flexDirection:'column', alignItems:'center', gap:28 }}>
          <div style={{ textAlign:'center' }}>
            {loadSubtitle && <div style={{ fontSize:13, fontWeight:600, color:'rgba(128,176,200,0.6)', fontFamily:"'Inter', sans-serif", letterSpacing:0.5, marginBottom:6 }}>{loadSubtitle}</div>}
          </div>
          <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid rgba(128,176,200,0.15)', borderTopColor:'#28a0c8', animation:'iteruSpin 0.85s linear infinite' }} />
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {loadSteps.map((s, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:10,
                fontSize:11, fontFamily:"'Inter', sans-serif", fontWeight:500, letterSpacing:0.2,
                color: i < loadStep ? 'rgba(56,176,96,0.85)' : i === loadStep ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.2)',
                transition:'color 0.3s ease',
              }}>
                <span style={{ width:14, display:'flex', justifyContent:'center', fontSize: i < loadStep ? 11 : 13 }}>
                  {i < loadStep ? '✓' : i === loadStep ? '›' : '·'}
                </span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        display:'flex', height:'100vh', width:'100vw',
        background:'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)',
        backgroundColor:'#003050',
        padding:24, gap:24, boxSizing:'border-box', overflow:'hidden',
      }}>
        <Sidebar
          activeNav="people"
          onNavChange={nav => {
            if (nav === 'people') return;
            const steps = nav === 'field' ? LOAD_STEPS_FIELD : LOAD_STEPS_BACK;
            const subtitle = nav === 'field' ? 'Loading Field' : 'Loading Lab';
            triggerLoader(steps, subtitle, () => { if (onNavChange) onNavChange(nav); });
          }}
          attentionCount={11}
          testAttentionCount={5}
          activeBrand={activeBrand}
          onBrandChange={onBrandChange}
          onLogout={onLogout}
        />

        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:16, minWidth:0, position:'relative', overflowY:'auto' }}>

          {/* ── Header ── */}
          <div style={{ display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
            <BackButton onClick={handleBack} />
            <span style={{ fontSize:22, fontWeight:700, color:'#ffffff', fontFamily:"'Montserrat', sans-serif", letterSpacing:0.3, whiteSpace:'nowrap' }}>
              {vehicle.vin}
            </span>
            <div style={{ width:1, height:18, background:'rgba(255,255,255,0.12)', flexShrink:0 }} />
            <div style={{ display:'flex', alignItems:'center', gap:20, minWidth:0, overflow:'hidden' }}>
              <MetaItem label="Model"            value={vehicle.model}    />
              <MetaItem label="Production Year"  value={vehicle.year}     />
              <MetaItem label="Software"         value={vehicle.sw}       />
              <MetaItem label="Chip"             value={vehicle.chip}     />
              <MetaItem label="Last Location"    value={stats.location}   />
            </div>
            <div style={{ flex:1 }} />
            <VehicleStatusBadge status={vehicle.status} />
          </div>

          {/* ── Stats row 1 ── */}
          <div style={{ display:'flex', gap:10, flexShrink:0 }}>
            <StatCard value={stats.daysInFleet}   unit="days"  label="In test fleet"          />
            <StatCard value={stats.totalUpdates}              label="OTA updates applied"     />
            <StatCard value={stats.mileage}       unit="km"   label="Estimated mileage"      />
            <StatCard value={`${stats.lastUpdateDays}d`}     label="Since last update"       />
            <StatCard value={stats.updateSpeed}   unit="sec"  trend={stats.updateTrend} label="Avg update speed"    />
            <StatCard value={stats.dlSpeed}       unit="sec"  trend={stats.dlTrend}    label="Avg download speed"  />
          </div>

          {/* ── Stats row 2 — progress ── */}
          <div style={{ display:'flex', gap:10, flexShrink:0 }}>
            <ProgressCard
              value={`${stats.successRate}%`}
              trend={stats.successRate > 88 ? 'up' : 'down'}
              label="Update success rate"
              barColor="linear-gradient(90deg, #28779c 0%, #28a0c8 100%)"
              barWidth={`${stats.successRate}%`}
            />
            <ProgressCard
              value={`${stats.selfTestRate}%`}
              trend={stats.selfTestRate > 85 ? 'up' : 'down'}
              label="Self-test pass rate"
              barColor="linear-gradient(90deg, #28779c 0%, #28a0c8 100%)"
              barWidth={`${stats.selfTestRate}%`}
            />
            <ProgressCard
              value={`${stats.connectivity}%`}
              trend={stats.connectivity > 92 ? 'up' : 'neutral'}
              label="Connectivity uptime"
              barColor="linear-gradient(90deg, #28779c 0%, #28a0c8 100%)"
              barWidth={`${stats.connectivity}%`}
            />
          </div>

          {/* ── Bottom panels ── */}
          <div style={{ display:'flex', gap:10, flex:1, minHeight:220, paddingBottom:72 }}>

            {/* Update history */}
            <div style={{ flex:2, background:'rgba(1,45,66,0.55)', border:'1px solid #153f53', borderRadius:16, padding:'16px 20px', display:'flex', flexDirection:'column', gap:16, minHeight:0 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:26, fontWeight:700, color:'#ffffff', fontFamily:"'Inter', sans-serif" }}>
                    {stats.totalUpdates}
                  </div>
                  <div style={{ fontSize:9, fontWeight:700, color:'rgba(128,176,200,0.5)', fontFamily:"'Inter', sans-serif", letterSpacing:0.8, textTransform:'uppercase', marginTop:2 }}>
                    OTA Updates — last 12 months
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ background:'rgba(1,45,66,0.55)', border:'1px solid #153f53', borderRadius:12, padding:'10px 14px', display:'flex', flexDirection:'column', gap:4 }}>
                    <span style={{ fontSize:18, fontWeight:700, color:'#ffffff', fontFamily:"'Inter', sans-serif" }}>{stats.enrolledCampaigns}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:'rgba(128,176,200,0.5)', fontFamily:"'Inter', sans-serif", letterSpacing:0.8, textTransform:'uppercase' }}>Active campaigns</span>
                  </div>
                </div>
              </div>
              <UpdateHistoryChart monthly={stats.monthly} />
            </div>

            {/* Software components */}
            <div style={{ flex:1.4, background:'rgba(1,45,66,0.55)', border:'1px solid #153f53', borderRadius:16, padding:'16px 20px', display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'rgba(128,176,200,0.5)', fontFamily:"'Inter', sans-serif", letterSpacing:1.2, textTransform:'uppercase' }}>
                Installed Software Components
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {stats.components.map(c => (
                  <div key={c.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:32, padding:'0 12px', borderRadius:7, background:'rgba(0,70,102,0.22)' }}>
                    <span style={{ fontSize:11, fontWeight:500, color:'rgba(204,223,233,0.85)', fontFamily:"'Inter', sans-serif" }}>{c.name}</span>
                    <span style={{ fontSize:10, fontWeight:700, color:'#80b0c8', fontFamily:"'Inter', sans-serif", letterSpacing:0.5 }}>{c.version}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Floating bottom bar ── */}
          <div style={{
            position:'fixed', bottom:36, left:'50%', transform:'translateX(-50%)',
            display:'flex', alignItems:'center', gap:8,
            padding:'6px 8px', borderRadius:14,
            background:'rgba(1,45,66,0.75)',
            backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
            border:'1px solid #153f53',
            boxShadow:'0px 8px 32px rgba(0,0,0,0.48)',
            animation:'floatingBarEnter 0.45s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            <IconBtn tooltip="Refresh data" onClick={handleRefresh}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </IconBtn>
            <IconBtn tooltip="Vehicle configuration" onClick={() => setConfigOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </IconBtn>
            <IconBtn tooltip="Remove from fleet" danger onClick={() => setRemoveOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </IconBtn>
          </div>

        </div>
      </div>

      {configOpen && <VehicleConfigModal vehicle={vehicle} onClose={() => setConfigOpen(false)} models={BRAND_MODELS[activeBrand?.id] || BRAND_MODELS.vw} />}
      {removeOpen && <RemoveFleetModal   vehicle={vehicle} onClose={() => setRemoveOpen(false)} />}
    </>
  );
}
