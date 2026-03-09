import { useState } from 'react';
import Sidebar from './Sidebar';

// ─── Status badge (reused from DashboardView) ────────────────────────────────
const STATUS = {
  RUNNING:    { bg: 'rgba(40,119,156,0.18)',  color: '#28a0c8', dot: '#28a0c8' },
  CREATED:    { bg: 'rgba(100,140,165,0.2)',   color: '#80b0c8', dot: '#80b0c8' },
  DRAFT:      { bg: 'rgba(170,135,25,0.22)',   color: '#c8a028', dot: '#c8a028' },
  COMPLETED:  { bg: 'rgba(40,140,80,0.2)',     color: '#38b060', dot: '#38b060' },
  FAILED:     { bg: 'rgba(180,40,40,0.22)',    color: '#cc3333', dot: '#cc3333' },
  CALCULATED: { bg: 'rgba(80,110,130,0.2)',    color: '#607890', dot: '#607890' },
};

function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS['CALCULATED'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99,
      background: cfg.bg, border: `1px solid ${cfg.dot}`,
      fontSize: 10, fontWeight: 700, color: cfg.color,
      fontFamily: "'Inter', sans-serif", letterSpacing: 0.5,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

// ─── Trend arrow ─────────────────────────────────────────────────────────────
function Trend({ dir }) {
  // dir: 'up' (positive/green), 'down' (negative/red), 'neutral'
  const color = dir === 'up' ? '#38b060' : dir === 'down' ? '#cc4433' : 'rgba(128,176,200,0.5)';
  if (dir === 'neutral') return (
    <span style={{ color, fontSize: 12, fontWeight: 700, lineHeight: 1 }}>→</span>
  );
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ display: 'inline', marginLeft: 2 }}>
      {dir === 'up'
        ? <path d="M6 10V2M6 2L2 6M6 2L10 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        : <path d="M6 2V10M6 10L2 6M6 10L10 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      }
    </svg>
  );
}

// ─── Small stat card ─────────────────────────────────────────────────────────
function StatCard({ value, unit, trend, label, sub }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'rgba(1,45,66,0.55)', border: '1px solid #153f53',
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(128,176,200,0.7)', fontFamily: "'Inter', sans-serif" }}>
            {unit}
          </span>
        )}
        {trend && <Trend dir={trend} />}
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 9, fontWeight: 500, color: 'rgba(128,176,200,0.35)', fontFamily: "'Inter', sans-serif" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Progress stat card ───────────────────────────────────────────────────────
function ProgressCard({ value, trend, label, barColor, barWidth, empty }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'rgba(1,45,66,0.55)', border: '1px solid #153f53',
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: empty ? 'rgba(128,176,200,0.3)' : '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
            {value}
          </span>
          {!empty && trend && <Trend dir={trend} />}
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase' }}>
          {label}
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
        {!empty && <div style={{ height: '100%', borderRadius: 2, width: barWidth, background: barColor, transition: 'width 0.6s ease' }} />}
      </div>
    </div>
  );
}

// ─── Filter dropdown (visual only) ───────────────────────────────────────────
function FilterDropdown({ label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 12px', borderRadius: 8,
        background: hovered ? 'rgba(0,70,102,0.3)' : 'rgba(1,45,66,0.55)',
        border: hovered ? '1px solid #28779c' : '1px solid #153f53',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 500, color: '#ccdfe9', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.5)" strokeWidth="2" strokeLinecap="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

// ─── Vehicle distribution bar ─────────────────────────────────────────────────
const VEHICLE_SEGMENTS = [
  { color: '#e03070', label: 'ERRORS',       pct: 17 },
  { color: '#e08020', label: 'DOWNLOADING',  pct: 30 },
  { color: '#c8a020', label: 'INITIALIZING', pct: 27 },
  { color: '#38b060', label: 'INSTALLING',   pct: 12 },
  { color: '#28a0c8', label: 'CHECKING',     pct: 7  },
  { color: '#8060c8', label: 'POSTPONED',    pct: 7  },
];

// Sub-segment detail data per main segment
const SUB_SEGMENTS = [
  [{ label: 'Downloading',  pct: 42, color: '#e03070' }, { label: 'Verifying',   pct: 33, color: '#c02858' }, { label: 'Pending',     pct: 25, color: '#801840' }],
  [{ label: 'Installing',   pct: 50, color: '#e08020' }, { label: 'Rebooting',   pct: 22, color: '#b86010' }, { label: 'Queued',      pct: 28, color: '#804008' }],
  [{ label: 'Transferring', pct: 46, color: '#c8a020' }, { label: 'Connecting',  pct: 36, color: '#a07818' }, { label: 'Waiting',     pct: 18, color: '#705010' }],
  [{ label: 'Finalizing',   pct: 58, color: '#38b060' }, { label: 'Verifying',   pct: 42, color: '#288048' }],
  [{ label: 'Downloading',  pct: 55, color: '#28a0c8' }, { label: 'Pending',     pct: 45, color: '#1870a0' }],
  [{ label: 'Scheduled',    pct: 48, color: '#8060c8' }, { label: 'Queued',      pct: 52, color: '#604098' }],
];

function ShowVinsButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px', borderRadius: 8,
        background: hovered ? '#005a80' : '#004666',
        border: 'none',
        color: '#ccdfe9',
        fontSize: 10, fontWeight: 700,
        fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, cursor: 'pointer',
        transition: 'background 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0px 2px 8px 0px rgba(0,37,55,0.48)' : '0px 1px 4px 0px rgba(0,37,55,0.32)',
      }}
    >
      SHOW VINS
    </button>
  );
}

function CloseDetailBtn({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 24, height: 24, borderRadius: 6, border: '1px solid #1e5068',
          background: hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
          color: hovered ? '#ccdfe9' : 'rgba(128,176,200,0.7)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, transition: 'all 0.15s',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          padding: '3px 8px', borderRadius: 4,
          background: '#012d42', border: '1px solid #153f53',
          fontSize: 10, fontWeight: 600, color: '#80b0c8',
          fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 20,
        }}>
          Close
        </div>
      )}
    </div>
  );
}

function VehicleBar({ totalVehicles, disabled }) {
  const [hoveredSeg, setHoveredSeg] = useState(null);
  const [selectedSeg, setSelectedSeg] = useState(null);
  const [closingDetail, setClosingDetail] = useState(false);
  const total = parseInt(String(totalVehicles).replace(/\s/g, ''), 10) || 0;

  function handleSegClick(i) {
    if (selectedSeg === i) {
      handleCloseDetail();
    } else {
      setClosingDetail(false);
      setSelectedSeg(i);
    }
  }

  function handleCloseDetail() {
    setClosingDetail(true);
  }

  function handleDetailAnimEnd() {
    if (closingDetail) {
      setSelectedSeg(null);
      setClosingDetail(false);
    }
  }

  const activeSeg = selectedSeg !== null ? VEHICLE_SEGMENTS[selectedSeg] : null;
  const subSegs = selectedSeg !== null ? SUB_SEGMENTS[selectedSeg] : [];
  const segCount = activeSeg ? Math.round(total * activeSeg.pct / 100) : 0;

  if (disabled) {
    return (
      <div style={{
        height: 28, borderRadius: 6,
        background: 'rgba(40,119,156,0.22)',
        border: '1px solid rgba(40,119,156,0.18)',
        animation: 'barEnter 0.55s cubic-bezier(0.22,1,0.36,1) both',
      }} />
    );
  }

  return (
    <>
      {/* Segmented bar */}
      <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'visible', gap: 2, animation: 'barEnter 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
        {VEHICLE_SEGMENTS.map((seg, i) => {
          const count = Math.round(total * seg.pct / 100);
          const isHovered = hoveredSeg === i;
          const activeHighlight = hoveredSeg !== null ? hoveredSeg : selectedSeg;
          const isDimmed = activeHighlight !== null && activeHighlight !== i;
          const isFirst = i === 0;
          const isLast = i === VEHICLE_SEGMENTS.length - 1;
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredSeg(i)}
              onMouseLeave={() => setHoveredSeg(null)}
              onClick={() => handleSegClick(i)}
              style={{
                flex: seg.pct,
                background: seg.color,
                borderRadius: isFirst ? '6px 0 0 6px' : isLast ? '0 6px 6px 0' : 0,
                opacity: isDimmed ? 0.22 : 1,
                cursor: 'pointer',
                position: 'relative',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                transform: isHovered ? 'scaleY(1.12)' : 'scaleY(1)',
                transformOrigin: 'center',
              }}
            >
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#012d42',
                  border: '1px solid #153f53',
                  borderRadius: 8,
                  padding: '7px 12px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 10,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  animation: 'tooltipFadeIn 0.15s ease',
                }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: 1.1 }}>
                    {seg.pct}%
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", marginTop: 2 }}>
                    {count.toLocaleString()} Vehicles
                  </div>
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                    borderTop: '5px solid #153f53',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sub-segment detail panel */}
      {selectedSeg !== null && (
        <div
          onAnimationEnd={handleDetailAnimEnd}
          style={{
            marginTop: -6,
            background: 'rgba(0,16,28,0.82)',
            border: `1px solid ${activeSeg.color}44`,
            borderTop: `2px solid ${activeSeg.color}88`,
            borderRadius: '0 0 8px 8px',
            padding: '10px 14px 12px',
            display: 'flex', flexDirection: 'column', gap: 10,
            position: 'relative', zIndex: 2,
            animation: closingDetail
              ? 'detailSlideOut 0.22s ease forwards'
              : 'detailSlideIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          {/* Detail header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
                {segCount.toLocaleString()}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: activeSeg.color, fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase' }}>
                {activeSeg.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShowVinsButton />
              <CloseDetailBtn onClick={handleCloseDetail} />
            </div>
          </div>

          {/* Sub-segment bar */}
          <div style={{ display: 'flex', height: 22, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
            {subSegs.map((sub, j) => {
              const isFirst = j === 0;
              const isLast = j === subSegs.length - 1;
              return (
                <div
                  key={j}
                  style={{
                    flex: sub.pct,
                    background: sub.color,
                    borderRadius: isFirst ? '4px 0 0 4px' : isLast ? '0 4px 4px 0' : 0,
                  }}
                />
              );
            })}
          </div>

          {/* Sub-segment legend */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {subSegs.map((sub, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: sub.color, flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(180,210,225,0.75)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.4 }}>
                  {sub.label}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(220,235,245,0.92)', fontFamily: "'Inter', sans-serif" }}>
                  {sub.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {VEHICLE_SEGMENTS.map((seg, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredSeg(i)}
            onMouseLeave={() => setHoveredSeg(null)}
            onClick={() => handleSegClick(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
              opacity: (hoveredSeg !== null ? hoveredSeg : selectedSeg) !== null && (hoveredSeg !== null ? hoveredSeg : selectedSeg) !== i ? 0.35 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: hoveredSeg === i || selectedSeg === i ? seg.color : 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5, transition: 'color 0.2s ease' }}>
              {seg.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Bottom action bar ────────────────────────────────────────────────────────
function BottomTab({ label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px', borderRadius: 8,
        background: active ? '#004666' : hovered ? '#013d58' : 'transparent',
        border: active ? '2px solid #28779c' : hovered ? '2px solid #1e6080' : '2px solid transparent',
        color: active ? '#ffffff' : hovered ? '#ccdfe9' : 'rgba(128,176,200,0.7)',
        fontSize: 11, fontWeight: 700, cursor: 'pointer',
        fontFamily: "'Inter', sans-serif", letterSpacing: 0.8,
        boxShadow: active ? '0px 0px 8px 0px rgba(40,119,156,0.32)' : 'none',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

function IconBtn({ children, tooltip, danger, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 32, height: 32, borderRadius: 8, border: 'none',
          background: danger
            ? (hovered ? 'rgba(180,40,40,0.35)' : 'rgba(180,40,40,0.2)')
            : (hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'),
          color: danger ? (hovered ? '#ff6060' : '#cc4433') : (hovered ? '#ccdfe9' : 'rgba(128,176,200,0.7)'),
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}
      >
        {children}
      </button>
      {hovered && tooltip && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 7px)', left: '50%',
          transform: 'translateX(-50%)',
          padding: '3px 8px', borderRadius: 4,
          background: '#012d42', border: '1px solid #153f53',
          fontSize: 10, fontWeight: 600, color: '#80b0c8',
          fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 20,
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

// ─── Configure overlay ────────────────────────────────────────────────────────
const CONFIGURE_PARAMS = {
  PRIMARY: [
    { label: 'Flash Duration HV',        value: '102', unit: 'sec.' },
    { label: 'Flash Duration LV',        value: '102', unit: 'sec.' },
    { label: 'Flash Duration HMI',       value: '4',   unit: 'min.' },
    { label: 'Enabled Power Grid',       value: '2',   unit: ''     },
    { label: 'Current Consumption HV',   value: '10',  unit: 'amp.' },
    { label: 'Current Consumption LV',   value: '10',  unit: 'amp.' },
    { label: 'Block Flash Attempts',     value: '3',   unit: ''     },
    { label: 'Flash Process Repeat',     value: '2',   unit: ''     },
    { label: 'Repeat',                   value: '6',   unit: ''     },
    { label: 'Retry',                    value: '3',   unit: ''     },
    { label: 'Max Retry Number',         value: '5',   unit: ''     },
    { label: 'Time Delay General',       value: '5',   unit: 'sec.' },
    { label: 'Time Delay Start 1',       value: '600', unit: 'sec.' },
    { label: 'Time Delay Start 2',       value: '120', unit: 'sec.' },
    { label: 'Time Delay Wait For Sleep',value: '30',  unit: 'sec.' },
    { label: 'Log Level',                value: '7',   unit: ''     },
    { label: 'Installation Failure Action', value: 'Continue', unit: '' },
  ],
  SECONDARY: [
    { label: 'Fallback Timeout',         value: '60',  unit: 'sec.' },
    { label: 'Retry Interval',           value: '15',  unit: 'sec.' },
    { label: 'Max Parallel Sessions',    value: '8',   unit: ''     },
    { label: 'Session Timeout',          value: '300', unit: 'sec.' },
    { label: 'Heartbeat Interval',       value: '30',  unit: 'sec.' },
    { label: 'Diagnostic Level',         value: '2',   unit: ''     },
    { label: 'Log Retention',            value: '14',  unit: 'days' },
    { label: 'Error Threshold',          value: '5',   unit: '%'    },
    { label: 'Priority Level',           value: '3',   unit: ''     },
    { label: 'Notification Mode',        value: 'Push', unit: ''    },
  ],
};

function ParamField({ label, value, unit }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? 'rgba(0,70,100,0.25)' : 'rgba(0,40,60,0.5)',
        border: `1px solid ${hovered ? '#1e6080' : '#0e3a52'}`,
        borderRadius: 10, padding: '8px 12px',
        display: 'flex', flexDirection: 'column', gap: 3,
        transition: 'background 0.15s, border-color 0.15s',
        cursor: 'default',
      }}
    >
      <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.4 }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif" }}>
            {unit}
          </span>
        )}
      </div>
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 7px)', left: '50%', transform: 'translateX(-50%)',
          background: '#012d42', border: '1px solid #153f53', borderRadius: 8,
          padding: '6px 10px', whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
          fontSize: 10, fontWeight: 500, color: 'rgba(204,223,233,0.85)', fontFamily: "'Inter', sans-serif",
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          Tooltip that describes this parameter
        </div>
      )}
    </div>
  );
}

function ConfigureOverlay({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('PRIMARY');

  function handleClose() { setClosing(true); }

  const params = CONFIGURE_PARAMS[activeTab];

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{ position: 'absolute', inset: 0, zIndex: 99 }} />
      {/* Panel */}
      <div
        onAnimationEnd={() => { if (closing) onClose(); }}
        style={{
          position: 'absolute',
          bottom: 72,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 540,
          height: 520,
          background: 'rgba(1,45,66,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #153f53',
          borderRadius: 24,
          boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.24), 0 24px 64px rgba(0,0,0,0.5)',
          animation: closing ? 'panelFadeOut 0.18s ease forwards' : 'panelFadeIn 0.22s ease',
          padding: '24px',
          display: 'flex', flexDirection: 'column', gap: 20,
          zIndex: 100,
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.3 }}>
            Campaign Parameters
          </span>
          <button
            onClick={handleClose}
            style={{
              width: 28, height: 28, borderRadius: 8, border: '1px solid #1e5068',
              background: 'rgba(255,255,255,0.06)', color: 'rgba(128,176,200,0.7)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#ccdfe9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(128,176,200,0.7)'; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'rgba(0,20,32,0.6)', border: '1px solid #0e3a52',
          borderRadius: 12, padding: 4, gap: 4, flexShrink: 0,
        }}>
          {['PRIMARY', 'SECONDARY'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '7px 0', borderRadius: 9, border: 'none',
                background: activeTab === tab ? 'rgba(0,70,100,0.55)' : 'transparent',
                color: activeTab === tab ? '#ffffff' : 'rgba(128,176,200,0.5)',
                fontSize: 10, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: 0.8,
                cursor: 'pointer', transition: 'all 0.15s',
                outline: activeTab === tab ? '1px solid #1e6080' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Parameter grid (scrollable) */}
        <div style={{ overflowY: 'auto', flexShrink: 1, minHeight: 0 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
          }}>
            {params.map((p, i) => (
              <ParamField key={i} label={p.label} value={p.value} unit={p.unit} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Per-campaign stats (deterministic from campaign id) ─────────────────────
function getCampaignStats(campaign) {
  const s = campaign.id;
  const r = (min, max, salt = 0) => min + ((s * 37 + salt * 13) % (max - min + 1));

  const days         = r(8,  62,  1);
  const models       = r(2,  9,   2);
  const countries    = r(2,  14,  3);
  const updateSpeed  = r(280, 920, 4);
  const dlSpeed      = r(350, 1400, 5);
  const dailyCars    = r(40,  680, 6);
  const launchRate   = r(78,  100, 7);
  const successRate  = r(72,  98,  8);
  const failureRate  = 100 - successRate;

  const updateTrend  = updateSpeed > 600 ? 'up' : 'down';
  const dlTrend      = dlSpeed     > 800 ? 'up' : 'down';
  const carsTrend    = dailyCars   > 300 ? 'up' : 'down';
  const successTrend = successRate > 88  ? 'up' : 'down';
  const failTrend    = failureRate > 12  ? 'up' : 'down';

  const CREATORS = ['MIKE DEAN', 'ANNA KOWALSKI', 'JOHN SMITH', 'LAURA MÜLLER', 'PETER NOVAK', 'SARA JENSEN'];
  const SPECS    = ['ABS SPRING UPDATE 4', 'ECU PATCH V2.1', 'BRAKE CAL. REV3', 'GATEWAY FW 1.8', 'DRIVE SYS. K7', 'POWERTRAIN B2'];
  const BASE_IDS = ['CD01_01_TEST INPUT', 'BD02_FLEET_MAIN', 'BD04_ECU_BASE', 'CD07_REGION_A', 'BD11_FULL_DIAG', 'CD03_PARTIAL_R'];

  const creator  = CREATORS[s % CREATORS.length];
  const spec     = SPECS[s % SPECS.length];
  const baseData = BASE_IDS[s % BASE_IDS.length];

  const startDates = ['12.01.2024', '05.03.2024', '21.04.2024', '07.08.2024', '12.07.2024', '19.09.2024'];
  const startDate  = startDates[s % startDates.length];

  return { days, models, countries, updateSpeed, dlSpeed, dailyCars,
           updateTrend, dlTrend, carsTrend, launchRate, successRate, failureRate,
           successTrend, failTrend, creator, spec, baseData, startDate };
}

const LOAD_STEPS_BACK = [
  'Syncing campaign updates',
  'Refreshing campaign list',
  'Loading dashboard',
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function CampaignDetailView({ campaign, onBack }) {
  const [activeNav, setActiveNav] = useState('aftersales');
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [configureOpen, setConfigureOpen] = useState(false);
  const [loadingBack, setLoadingBack] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loadStep, setLoadStep] = useState(0);

  function handleBack() {
    setLoadingBack(true);
    setLoadStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
    setTimeout(() => setLoadStep(1), 450);
    setTimeout(() => setLoadStep(2), 900);
    setTimeout(() => setLoaderVisible(false), 1300);
    setTimeout(() => onBack(), 1600);
  }

  if (loadingBack) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100vw', height: '100vh',
        background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)',
        backgroundColor: '#003050',
      }}>
        <div style={{
          opacity: loaderVisible ? 1 : 0, transition: 'opacity 0.3s ease',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>
              Returning to dashboard
            </div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid rgba(128,176,200,0.15)', borderTopColor: '#28a0c8',
            animation: 'gvuSpin 0.85s linear infinite',
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOAD_STEPS_BACK.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: 0.2,
                color: i < loadStep ? 'rgba(56,176,96,0.85)' : i === loadStep ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.2)',
                transition: 'color 0.3s ease',
              }}>
                <span style={{ width: 14, display: 'flex', justifyContent: 'center', fontSize: i < loadStep ? 11 : 13 }}>
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

  const status = campaign.statuses[0];
  const isCreated = status === 'CREATED';
  const stats = getCampaignStats(campaign);

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)',
      backgroundColor: '#003050',
      padding: 24, gap: 24, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} attentionCount={2} />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, position: 'relative' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          {/* Back button */}
          <button
            onClick={handleBack}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid #153f53',
              background: 'rgba(1,45,66,0.55)', color: 'rgba(128,176,200,0.8)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#28779c'; e.currentTarget.style.color = '#ccdfe9'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#153f53'; e.currentTarget.style.color = 'rgba(128,176,200,0.8)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>

          {/* Campaign name */}
          <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.3, whiteSpace: 'nowrap' }}>
            {campaign.name}
          </span>

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

          {/* Meta info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0, overflow: 'hidden' }}>
            <MetaItem label="BASE DATA" value={stats.baseData} />
            <MetaItem label="SPECIFICATION MODEL" value={stats.spec} />
            <MetaItem label="CREATOR" value={stats.creator} />
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Status */}
          <StatusBadge status={status} />
          {isCreated && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 99,
              background: 'rgba(40,140,80,0.15)', border: '1px solid rgba(40,140,80,0.4)',
              fontSize: 10, fontWeight: 700, color: '#38b060',
              fontFamily: "'Inter', sans-serif", letterSpacing: 0.5, whiteSpace: 'nowrap',
            }}>
              CAMPAIGN APPROVAL
            </span>
          )}
        </div>

        {/* ── Filter bar ── */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <FilterDropdown label="All Countries" />
          <FilterDropdown label="All Product IDs" />
          <FilterDropdown label="All Waves" />
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          {/* Row 1: 6 small cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {isCreated
              ? <StatCard value={`-${stats.days}`} unit="days" label={`To start (${stats.startDate})`} />
              : <StatCard value={stats.days} unit="days" label={`Since start (${stats.startDate})`} />
            }
            <StatCard value={stats.models} label="Models" />
            <StatCard value={stats.countries} label="Countries" />
            <StatCard
              value={isCreated ? '–' : stats.updateSpeed}
              unit={isCreated ? undefined : 'sec'}
              trend={isCreated ? undefined : stats.updateTrend}
              label="Average update speed"
            />
            <StatCard
              value={isCreated ? '–' : stats.dlSpeed}
              unit={isCreated ? undefined : 'sec'}
              trend={isCreated ? undefined : stats.dlTrend}
              label="Average download speed"
            />
            <StatCard
              value={isCreated ? '–' : stats.dailyCars}
              unit={isCreated ? undefined : 'cars'}
              trend={isCreated ? undefined : stats.carsTrend}
              label="Updated vehicles each day"
            />
          </div>

          {/* Row 2: 3 progress cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            <ProgressCard
              value={isCreated ? '–' : `${stats.launchRate}%`}
              trend={isCreated ? undefined : (stats.launchRate === 100 ? 'neutral' : 'down')}
              label="Launch rate"
              barColor="linear-gradient(90deg, #28779c 0%, #28a0c8 100%)"
              barWidth={`${stats.launchRate}%`}
              empty={isCreated}
            />
            <ProgressCard
              value={isCreated ? '–' : `${stats.successRate}%`}
              trend={isCreated ? undefined : stats.successTrend}
              label="Success rate"
              barColor="linear-gradient(90deg, #28779c 0%, #28a0c8 100%)"
              barWidth={`${stats.successRate}%`}
              empty={isCreated}
            />
            <ProgressCard
              value={isCreated ? '–' : `${stats.failureRate}%`}
              trend={isCreated ? undefined : stats.failTrend}
              label="Failure rate"
              barColor="linear-gradient(90deg, #8b2020 0%, #cc3333 100%)"
              barWidth={`${stats.failureRate}%`}
              empty={isCreated}
            />
          </div>
        </div>

        {/* ── Vehicle distribution ── */}
        <div style={{
          flexShrink: 0,
          background: 'rgba(1,45,66,0.55)', border: '1px solid #153f53',
          borderRadius: 16, padding: '14px 20px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>{campaign.vehicles}</span>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2 }}>Vehicles</div>
            </div>
            <ShowVinsButton />
          </div>

          <VehicleBar totalVehicles={campaign.vehicles} disabled={isCreated} />
        </div>

        {/* ── Bottom action bar (floating) ── */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 8px', borderRadius: 14,
          background: 'rgba(1,28,42,0.72)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(21,63,83,0.6)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
        }}>
          <BottomTab label="OVERVIEW" active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} />
          <BottomTab label="WAVES" active={activeTab === 'WAVES'} onClick={() => setActiveTab('WAVES')} />

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />

          {/* Icon buttons */}
          <IconBtn tooltip="Configure" onClick={() => setConfigureOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </IconBtn>
          <IconBtn tooltip="Refresh">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </IconBtn>
          {isCreated
            ? (
              <IconBtn tooltip="Approve campaign">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38b060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </IconBtn>
            ) : (
              <IconBtn tooltip="Abort campaign" danger>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </IconBtn>
            )
          }
        </div>

        {configureOpen && <ConfigureOverlay onClose={() => setConfigureOpen(false)} />}
      </div>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, minWidth: 0, overflow: 'hidden' }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase', flexShrink: 0 }}>
        {label}:
      </span>
      <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(128,176,200,0.85)', fontFamily: "'Inter', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </span>
    </div>
  );
}
