import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// ─── Icons ───────────────────────────────────────────────────────────────────
const ChevronIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const XIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <path d="M2 6L5 9L10 3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'iteruSpin 0.75s linear infinite', flexShrink: 0 }}>
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);
const SearchIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// ─── Shared data ─────────────────────────────────────────────────────────────
const BASE_DATA_OPTIONS = [
  'FA01 — Full Area Update',
  'SE03 — Selective DRC',
  'KE05 — Key DRC Flash',
  'PU01 — Powertrain Update',
];

const VARIABLE_OPTIONS = [
  { code: '01', name: 'DRC Firmware Baseline Config',    status: 'Active',     used: false },
  { code: '02', name: 'Brake Module Calibration Set',    status: 'Active',     used: true  },
  { code: '03', name: 'Gateway Protocol Parameters',     status: 'Active',     used: true  },
  { code: '04', name: 'Powertrain Calibration Baseline', status: 'Active',     used: false },
  { code: '05', name: 'ABS Thresholds v2.1',             status: 'Active',     used: true  },
  { code: '06', name: 'Drive Unit OTA Parameters',       status: 'Active',     used: false },
  { code: '07', name: 'Charging System Config Set',      status: 'Active',     used: true  },
  { code: '08', name: 'Display Module Variables',        status: 'Deprecated', used: true  },
];

const VARIABLE_TABLE_ROWS = {
  '01': [
    { country: 'Germany', date: '15.03.2024', status: 'RUNNING',   vehicles: 1842 },
    { country: 'Austria', date: '15.03.2024', status: 'COMPLETED', vehicles: 312  },
    { country: 'Poland',  date: '10.01.2024', status: 'CREATED',   vehicles: 228  },
  ],
  '02': [
    { country: 'Ukraine', date: '22.01.2024', status: 'RUNNING', vehicles: 198 },
    { country: 'Romania', date: '22.01.2024', status: 'CREATED', vehicles: 114 },
  ],
  '03': [
    { country: 'Sweden',  date: '01.03.2024', status: 'RUNNING',   vehicles: 421 },
    { country: 'Norway',  date: '01.02.2024', status: 'COMPLETED', vehicles: 156 },
    { country: 'Finland', date: '01.02.2024', status: 'CREATED',   vehicles: 68  },
  ],
  '04': [{ country: 'France', date: '12.02.2024', status: 'DRAFT', vehicles: 645 }],
  '05': [
    { country: 'Spain',       date: '05.04.2024', status: 'RUNNING',   vehicles: 2341 },
    { country: 'Portugal',    date: '05.04.2024', status: 'RUNNING',   vehicles: 876  },
    { country: 'Netherlands', date: '20.02.2024', status: 'COMPLETED', vehicles: 1123 },
    { country: 'Belgium',     date: '20.02.2024', status: 'COMPLETED', vehicles: 450  },
  ],
  '06': [
    { country: 'UK',      date: '05.03.2024', status: 'DRAFT', vehicles: 312 },
    { country: 'Ireland', date: '05.03.2024', status: 'DRAFT', vehicles: 87  },
  ],
  '07': [
    { country: 'Switzerland', date: '17.03.2024', status: 'CREATED', vehicles: 145 },
    { country: 'Austria',     date: '17.03.2024', status: 'CREATED', vehicles: 98  },
  ],
  '08': [{ country: 'Japan', date: '20.05.2024', status: 'FAILED', vehicles: 234 }],
};

const SPEC_MODEL_OPTIONS = [
  'DLCM_ID_82736konlonsd_v1_v1_2023-11-24_1432.xlsx',
  'DLCM_ID_93847prodtest_v2_v3_2024-01-15_0832.xlsx',
  'DLCM_ID_74625updatepkg_v1_v2_2023-09-08_1540.xlsx',
  'DLCM_ID_61029releaseB_v3_v4_2023-06-30_1120.xlsx',
  'DLCM_ID_55483hotfix_v1_v1_2024-02-18_0900.xlsx',
  'DLCM_ID_47382standard_v2_v2_2023-08-14_1345.xlsx',
];

const SPEC_MODEL_ROWS = {
  'DLCM_ID_82736konlonsd_v1_v1_2023-11-24_1432.xlsx': [
    { hwId: '7L0907553D', hwVersion: '0001', swId: '7L0910553B', swVersion: 'H22', docId: 'DOC-82736-001' },
    { hwId: '5N0907115E', hwVersion: '0003', swId: '5N0910115A', swVersion: 'H14', docId: 'DOC-82736-002' },
    { hwId: '4F0907357C', hwVersion: '0002', swId: '4F0910357D', swVersion: 'H09', docId: 'DOC-82736-003' },
  ],
  'DLCM_ID_93847prodtest_v2_v3_2024-01-15_0832.xlsx': [
    { hwId: '8K0907115B', hwVersion: '0004', swId: '8K0910115C', swVersion: 'H31', docId: 'DOC-93847-001' },
    { hwId: '4G0907468M', hwVersion: '0001', swId: '4G0910468K', swVersion: 'H07', docId: 'DOC-93847-002' },
  ],
  'DLCM_ID_74625updatepkg_v1_v2_2023-09-08_1540.xlsx': [
    { hwId: '1K0907115F', hwVersion: '0002', swId: '1K0910115E', swVersion: 'H18', docId: 'DOC-74625-001' },
    { hwId: '3C0907115A', hwVersion: '0005', swId: '3C0910115B', swVersion: 'H22', docId: 'DOC-74625-002' },
    { hwId: '7P6907115C', hwVersion: '0003', swId: '7P6910115A', swVersion: 'H11', docId: 'DOC-74625-003' },
    { hwId: '5G0907115D', hwVersion: '0001', swId: '5G0910115C', swVersion: 'H04', docId: 'DOC-74625-004' },
  ],
  'DLCM_ID_61029releaseB_v3_v4_2023-06-30_1120.xlsx': [
    { hwId: '2Q0907115G', hwVersion: '0006', swId: '2Q0910115F', swVersion: 'H41', docId: 'DOC-61029-001' },
    { hwId: '5WA907115H', hwVersion: '0002', swId: '5WA910115G', swVersion: 'H15', docId: 'DOC-61029-002' },
  ],
  'DLCM_ID_55483hotfix_v1_v1_2024-02-18_0900.xlsx': [
    { hwId: '6Q0907115J', hwVersion: '0001', swId: '6Q0910115H', swVersion: 'H03', docId: 'DOC-55483-001' },
  ],
  'DLCM_ID_47382standard_v2_v2_2023-08-14_1345.xlsx': [
    { hwId: '9A0907115K', hwVersion: '0003', swId: '9A0910115J', swVersion: 'H28', docId: 'DOC-47382-001' },
    { hwId: '3QF907115L', hwVersion: '0004', swId: '3QF910115K', swVersion: 'H19', docId: 'DOC-47382-002' },
    { hwId: '7N0907115M', hwVersion: '0002', swId: '7N0910115L', swVersion: 'H12', docId: 'DOC-47382-003' },
  ],
};

const CAMPAIGN_PARAMS_PRIMARY = [
  { key: 'flashDurHV',       label: 'Flash Duration HV',           defaultVal: '102',      unit: 'sec.',  tooltip: 'Max time allowed for high-voltage DRC firmware flashing' },
  { key: 'flashDurLV',       label: 'Flash Duration LV',           defaultVal: '102',      unit: 'sec.',  tooltip: 'Max time allowed for low-voltage DRC firmware flashing' },
  { key: 'flashDurHMI',      label: 'Flash Duration HMI',          defaultVal: '4',        unit: 'min.',  tooltip: 'Max time allowed for HMI display firmware flashing' },
  { key: 'enabledPowerGrid', label: 'Enabled Power Grid',          defaultVal: '2',        unit: '',      tooltip: 'Number of active power domains required during flashing' },
  { key: 'currentHV',        label: 'Current Consumption HV',      defaultVal: '10',       unit: 'amp.', tooltip: 'Max current draw from the high-voltage system during update' },
  { key: 'currentLV',        label: 'Current Consumption LV',      defaultVal: '10',       unit: 'amp.', tooltip: 'Max current draw from the low-voltage system during update' },
  { key: 'blockFlash',       label: 'Block Flash Attempts',        defaultVal: '3',        unit: '',      tooltip: 'Consecutive failures before flashing is permanently blocked' },
  { key: 'flashRepeat',      label: 'Flash Process Repeat',        defaultVal: '2',        unit: '',      tooltip: 'Times the flash process is re-run on partial completion' },
  { key: 'repeat',           label: 'Repeat',                      defaultVal: '6',        unit: '',      tooltip: 'Total number of full update cycle repetitions allowed' },
  { key: 'retry',            label: 'Retry',                       defaultVal: '3',        unit: '',      tooltip: 'Retry attempts after a single failed operation' },
  { key: 'maxRetry',         label: 'Max Retry Number',            defaultVal: '5',        unit: '',      tooltip: 'Hard cap on total retries across all operations' },
  { key: 'tDelayGeneral',    label: 'Time Delay General',          defaultVal: '5',        unit: 'sec.', tooltip: 'Pause between sequential update operations' },
  { key: 'tDelayStart1',     label: 'Time Delay Start 1',          defaultVal: '600',      unit: 'sec.', tooltip: 'Initial delay before the first update step begins' },
  { key: 'tDelayStart2',     label: 'Time Delay Start 2',          defaultVal: '120',      unit: 'sec.', tooltip: 'Secondary delay applied before critical update operations' },
  { key: 'tDelayWaitSleep',  label: 'Time Delay Wait For Sleep',   defaultVal: '30',       unit: 'sec.', tooltip: 'Wait time before verifying vehicle is in sleep mode' },
  { key: 'logLevel',         label: 'Log Level',                   defaultVal: '7',        unit: '',      tooltip: 'Diagnostic log verbosity — higher value means more detail' },
  { key: 'installFailAction',label: 'Installation Failure Action', defaultVal: 'Continue', unit: '',      tooltip: 'Behavior when an DRC installation fails mid-campaign' },
];
const CAMPAIGN_PARAMS_SECONDARY = [
  { key: 'fallbackTimeout', label: 'Fallback Timeout',      defaultVal: '60',   unit: 'sec.', tooltip: 'Time before reverting to previous software version on failure' },
  { key: 'retryInterval',   label: 'Retry Interval',        defaultVal: '15',   unit: 'sec.', tooltip: 'Wait time between consecutive retry attempts' },
  { key: 'maxParallel',     label: 'Max Parallel Sessions', defaultVal: '8',    unit: '',     tooltip: 'Maximum number of vehicles updating simultaneously' },
  { key: 'sessionTimeout',  label: 'Session Timeout',       defaultVal: '300',  unit: 'sec.', tooltip: 'Maximum duration of a single vehicle update session' },
  { key: 'heartbeat',       label: 'Heartbeat Interval',    defaultVal: '30',   unit: 'sec.', tooltip: 'Frequency of status pings to verify an active connection' },
  { key: 'diagLevel',       label: 'Diagnostic Level',      defaultVal: '2',    unit: '',     tooltip: 'Depth of on-board diagnostics collected during update' },
  { key: 'logRetention',    label: 'Log Retention',         defaultVal: '14',   unit: 'days', tooltip: 'Days update logs are stored before automatic deletion' },
  { key: 'errorThreshold',  label: 'Error Threshold',       defaultVal: '5',    unit: '%',    tooltip: 'Max error rate before the campaign is automatically paused' },
  { key: 'priorityLevel',   label: 'Priority Level',        defaultVal: '3',    unit: '',     tooltip: 'Scheduling priority relative to other active campaigns' },
  { key: 'notifMode',       label: 'Notification Mode',     defaultVal: 'Push', unit: '',     tooltip: 'Method used to deliver campaign status notifications' },
];

const LAB_WIZARD_STEPS = [
  { n: 1, label: 'BASE DATA' },
  { n: 2, label: 'VEHICLES' },
  { n: 3, label: 'SPECIFICATION' },
  { n: 4, label: 'SUMMARY' },
];

const STATUS_CFG = {
  RUNNING:   { color: '#28a0c8', bg: 'rgba(40,119,156,0.18)', dot: '#28a0c8' },
  CREATED:   { color: '#80b0c8', bg: 'rgba(100,140,165,0.2)',  dot: '#80b0c8' },
  DRAFT:     { color: '#c8a028', bg: 'rgba(170,135,25,0.22)',  dot: '#c8a028' },
  COMPLETED: { color: '#38b060', bg: 'rgba(40,140,80,0.2)',    dot: '#38b060' },
  FAILED:    { color: '#cc3333', bg: 'rgba(180,40,40,0.22)',   dot: '#cc3333' },
};

const F = "'Inter', sans-serif";

// ─── Shared primitives ───────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', letterSpacing: 0.9, textTransform: 'uppercase', fontFamily: F, marginBottom: 6 }}>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.CREATED;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, background: cfg.bg, border: `1px solid ${cfg.dot}`, fontSize: 9, fontWeight: 700, color: cfg.color, fontFamily: F, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 32, height: 17, borderRadius: 9, background: value ? '#28779c' : 'rgba(128,176,200,0.18)', border: value ? '1px solid #28779c' : '1px solid rgba(128,176,200,0.25)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s, border-color 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: value ? 17 : 2, width: 11, height: 11, borderRadius: '50%', background: value ? '#ffffff' : 'rgba(128,176,200,0.5)', transition: 'left 0.18s, background 0.18s' }} />
    </div>
  );
}

function WizardDropdown({ label, options, value, onChange, placeholder = 'Select…', disabled, flex = 1, zIndex = 10 }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', flex }}>
      {label && <SectionLabel>{label}</SectionLabel>}
      <div
        onClick={() => !disabled && setOpen(o => !o)}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 38, padding: '0 12px', borderRadius: 8, border: disabled ? '1px solid #0e3a52' : open ? '1px solid #28779c' : hovered ? '1px solid #2a6a87' : '1px solid #16506c', background: disabled ? 'rgba(0,30,46,0.3)' : open ? 'rgba(0,70,102,0.28)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)', cursor: disabled ? 'default' : 'pointer', userSelect: 'none', boxShadow: open ? '0px 0px 8px 0px rgba(40,119,156,0.28)' : 'none', transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s' }}
      >
        <span style={{ fontSize: 12, fontWeight: 500, fontFamily: F, color: value ? '#ffffff' : 'rgba(128,176,200,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{value || placeholder}</span>
        <span style={{ color: '#80b0c8', opacity: disabled ? 0.25 : open ? 1 : 0.6, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s, opacity 0.15s', display: 'flex' }}><ChevronIcon /></span>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#012d42', border: '1px solid #153f53', borderRadius: 8, boxShadow: '0px 8px 20px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex, maxHeight: 190, overflowY: 'auto' }}>
          {options.map((opt, i) => (
            <div key={i} onClick={() => { onChange(opt); setOpen(false); }} style={{ padding: '9px 12px', cursor: 'pointer', borderBottom: i < options.length - 1 ? '1px solid rgba(21,63,83,0.6)' : 'none', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.32)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 12, fontWeight: 500, fontFamily: F, color: opt === value ? '#ffffff' : '#80b0c8' }}>{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WizardInput({ value, onChange, placeholder, width, height = 30 }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="wizard-input"
      style={{ width, height, padding: '0 10px', borderRadius: 6, border: focused ? '1px solid #28779c' : hovered ? '1px solid #2a6a87' : '1px solid #16506c', background: focused ? 'rgba(0,70,102,0.28)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)', boxShadow: focused ? '0px 0px 6px 0px rgba(40,119,156,0.25)' : 'none', color: '#ffffff', fontSize: 11, fontWeight: 500, fontFamily: F, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.12s, background 0.12s, box-shadow 0.12s' }}
    />
  );
}

function ParamLabel({ label, tooltip }) {
  const [hov, setHov] = useState(false);
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', cursor: 'default' }} onMouseEnter={() => { if (ref.current) setRect(ref.current.getBoundingClientRect()); setHov(true); }} onMouseLeave={() => setHov(false)}>
      <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(204,223,233,0.8)' }}>{label}</span>
      {hov && tooltip && rect && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: rect.bottom + 5, left: rect.left, maxWidth: 220, width: 'max-content', background: '#012d42', border: '1px solid #153f53', borderRadius: 8, padding: '6px 10px', zIndex: 9999, pointerEvents: 'none', fontSize: 10, fontWeight: 500, color: 'rgba(204,223,233,0.85)', fontFamily: F, lineHeight: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.4)', whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {tooltip}
        </div>,
        document.body
      )}
    </div>
  );
}

function WizardNavBtn({ children, primary, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: F, letterSpacing: 1.2, textTransform: 'uppercase', transition: 'background 0.15s, box-shadow 0.15s, border-color 0.15s', ...(primary ? { color: '#ccdfe9', background: hov ? '#005a80' : '#004666', border: 'none', boxShadow: hov ? '0px 2px 8px 0px rgba(0,37,55,0.48)' : '0px 1px 4px 0px rgba(0,37,55,0.32)' } : { color: '#ccdfe9', background: hov ? '#01374f' : '#012d42', border: hov ? '1px solid #1e6080' : '1px solid #004666' }) }}>
      {children}
    </button>
  );
}

function CloseBtn({ onClose }) {
  const [hov, setHov] = useState(false);
  const [rect, setRect] = useState(null);
  const btnRef = useRef(null);
  return (
    <div style={{ flexShrink: 0 }}>
      <button ref={btnRef} onClick={onClose} onMouseEnter={() => { if (btnRef.current) setRect(btnRef.current.getBoundingClientRect()); setHov(true); }} onMouseLeave={() => setHov(false)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: hov ? '#ffffff' : 'rgba(128,176,200,0.5)', display: 'flex', padding: 4, transition: 'color 0.15s' }}>
        <XIcon size={16} />
      </button>
      {hov && rect && ReactDOM.createPortal(
        <div style={{ position: 'fixed', bottom: window.innerHeight - rect.top + 4, left: rect.left + rect.width / 2, transform: 'translateX(-50%)', padding: '3px 8px', borderRadius: 4, background: '#012d42', border: '1px solid #153f53', fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: F, whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 9999 }}>
          Close
        </div>,
        document.body
      )}
    </div>
  );
}

function DiscardModal({ onCancel, onConfirm }) {
  const [closing, setClosing] = useState(false);
  const [willConfirm, setWillConfirm] = useState(false);
  function handleClose() { setClosing(true); }
  function handleConfirm() { setWillConfirm(true); setClosing(true); }
  function onAnimEnd() { if (!closing) return; if (willConfirm) onConfirm(); else onCancel(); }
  return (
    <>
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,20,35,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', animation: closing ? 'backdropFadeOut 0.22s ease forwards' : 'backdropFadeIn 0.22s ease' }} />
      <div onAnimationEnd={onAnimEnd} style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 301, width: 360, background: 'rgba(1,45,66,0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid #153f53', borderRadius: 20, boxShadow: '0px 8px 32px rgba(0,0,0,0.48)', padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 20, animation: closing ? 'modalFadeOut 0.22s ease forwards' : 'modalFadeIn 0.22s ease forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>Discard campaign?</span>
          <button onClick={handleClose} style={{ width: 24, height: 24, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(128,176,200,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = 'rgba(204,223,233,0.9)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(128,176,200,0.5)'}><XIcon size={16} /></button>
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#ccdfe9', fontFamily: F, lineHeight: '20px', margin: 0 }}>Are you sure you want to discard this campaign? All progress will be lost and the campaign will not be saved.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <WizardNavBtn onClick={handleClose}>Cancel</WizardNavBtn>
          <WizardNavBtn primary onClick={handleConfirm}>Discard</WizardNavBtn>
        </div>
      </div>
    </>
  );
}

function StepIndicator({ step }) {
  return (
    <div style={{ display: 'flex', height: 50, flexShrink: 0, borderBottom: '1px solid rgba(21,63,83,0.8)' }}>
      {LAB_WIZARD_STEPS.map((s, i) => {
        const isActive = step === s.n;
        const isDone = step > s.n;
        return (
          <React.Fragment key={s.n}>
            {i > 0 && (() => {
              const prev = LAB_WIZARD_STEPS[i - 1];
              const bgLeft  = step > prev.n ? '#002840' : step === prev.n ? '#002434' : '#000c1a';
              const bgRight = isDone ? '#002840' : isActive ? '#002434' : '#000c1a';
              return (
                <div style={{ width: 22, flexShrink: 0, alignSelf: 'stretch', position: 'relative', overflow: 'hidden' }}>
                  <svg viewBox="0 0 22 50" width="22" height="50" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                    <polygon points="0,0 22,0 22,50 0,50 14,25" fill={bgRight} />
                    <polygon points="0,0 14,25 0,50" fill={bgLeft} />
                    <polyline points="0,0 14,25 0,50" fill="none" stroke="rgba(21,63,83,0.9)" strokeWidth="1" />
                  </svg>
                </div>
              );
            })()}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: i === 0 ? '0 16px 0 24px' : '0 16px', background: isDone ? '#002840' : isActive ? '#002434' : '#000c1a' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: isDone || isActive ? '#28779c' : 'transparent', border: isDone || isActive ? 'none' : '1px solid rgba(128,176,200,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDone ? <CheckIcon /> : <span style={{ fontSize: 11, fontWeight: 700, fontFamily: F, color: isActive ? '#ffffff' : 'rgba(128,176,200,0.35)' }}>{s.n}</span>}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.7, fontFamily: F, color: isActive ? '#ffffff' : isDone ? 'rgba(204,223,233,0.65)' : 'rgba(128,176,200,0.28)', whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24 }}>
      <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.3)', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

// ─── Step 1: BASE DATA ───────────────────────────────────────────────────────
function Step1({ baseData, setBaseData, variable, setVariable, showUnused, setShowUnused, tableRows, selectedVarOption }) {
  const varOptions = showUnused ? VARIABLE_OPTIONS.filter(v => !v.used) : VARIABLE_OPTIONS;
  const varLabels = varOptions.map(v => `${v.code} — ${v.name}`);
  const varLabel = selectedVarOption ? `${selectedVarOption.code} — ${selectedVarOption.name}` : '';
  const colHeader = { fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', letterSpacing: 0.8, fontFamily: F, padding: '0 12px' };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px 24px', gap: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <WizardDropdown options={BASE_DATA_OPTIONS} value={baseData} onChange={setBaseData} placeholder="Select Base Data…" flex={1} zIndex={20} />
        <WizardDropdown options={varLabels} value={varLabel} onChange={v => { const opt = VARIABLE_OPTIONS.find(o => `${o.code} — ${o.name}` === v); setVariable(opt ? opt.code : ''); }} placeholder="Select Variable…" disabled={!baseData} flex={2} zIndex={20} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Toggle value={showUnused} onChange={setShowUnused} />
          <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.65)', whiteSpace: 'nowrap' }}>Hide used</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderRadius: 12, border: '1px solid #153f53', background: 'rgba(1,45,66,0.4)' }}>
        <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid #153f53', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 36, display: 'flex', alignItems: 'center', borderBottom: '1px solid #153f53', background: 'rgba(1,38,58,0.8)' }}>
            <span style={colHeader}>VARIABLE</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {!selectedVarOption ? <EmptyState label="No variable selected" /> : (
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: F, letterSpacing: 0.5 }}>{selectedVarOption.code}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', fontFamily: F, lineHeight: 1.4 }}>{selectedVarOption.name}</div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: selectedVarOption.status === 'Active' ? '#38b060' : '#c8a028', fontFamily: F, background: selectedVarOption.status === 'Active' ? 'rgba(40,140,80,0.15)' : 'rgba(170,135,25,0.18)', border: `1px solid ${selectedVarOption.status === 'Active' ? '#38b060' : '#c8a028'}`, borderRadius: 99, padding: '2px 7px' }}>{selectedVarOption.status}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 36, display: 'flex', alignItems: 'center', borderBottom: '1px solid #153f53', background: 'rgba(1,38,58,0.8)', flexShrink: 0 }}>
            {['COUNTRY', 'DATE', 'STATUS', 'TOTAL VEHICLES'].map(h => (
              <div key={h} style={{ ...colHeader, flex: 1 }}>{h}</div>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {tableRows.length === 0 ? <EmptyState label={selectedVarOption ? 'No country data available' : 'Select a variable to view data'} /> : (
              tableRows.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', height: 38, borderBottom: '1px solid rgba(21,63,83,0.4)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.2)'} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)'}>
                  <div style={{ flex: 1, padding: '0 12px', fontSize: 12, fontWeight: 500, fontFamily: F, color: '#ffffff' }}>{row.country}</div>
                  <div style={{ flex: 1, padding: '0 12px', fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(204,223,233,0.7)' }}>{row.date}</div>
                  <div style={{ flex: 1, padding: '0 12px' }}><StatusBadge status={row.status} /></div>
                  <div style={{ flex: 1, padding: '0 12px', fontSize: 12, fontWeight: 600, fontFamily: F, color: '#ffffff' }}>{row.vehicles.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Remove button with tooltip ──────────────────────────────────────────────
function RemoveBtn({ onRemove }) {
  const [hov, setHov] = useState(false);
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  return (
    <div ref={ref} style={{ flexShrink: 0 }}>
      <button
        onClick={onRemove}
        onMouseEnter={() => { if (ref.current) setRect(ref.current.getBoundingClientRect()); setHov(true); }}
        onMouseLeave={() => setHov(false)}
        style={{ width: 20, height: 20, background: 'none', border: 'none', cursor: 'pointer', color: hov ? '#cc3333' : 'rgba(128,176,200,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'color 0.12s', borderRadius: 4 }}
      >
        <XIcon size={10} />
      </button>
      {hov && rect && ReactDOM.createPortal(
        <div style={{ position: 'fixed', bottom: window.innerHeight - rect.top + 4, left: rect.left + rect.width / 2, transform: 'translateX(-50%)', padding: '3px 7px', borderRadius: 4, background: '#012d42', border: '1px solid #153f53', fontSize: 9, fontWeight: 700, color: '#80b0c8', fontFamily: F, whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 9999, letterSpacing: 0.4 }}>
          Remove
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Step 2: VEHICLES ─────────────────────────────────────────────────────────
function Step2Vehicles({ vehicles, selectedIds, setSelectedIds }) {
  const [search, setSearch] = useState('');
  const [searchHovered, setSearchHovered] = useState(false);

  const activeVehicles = vehicles.filter(v => v.status === 'Active');
  const filtered = search.trim()
    ? activeVehicles.filter(v => v.vin.toLowerCase().includes(search.toLowerCase()) || v.model.toLowerCase().includes(search.toLowerCase()) || String(v.year).includes(search))
    : activeVehicles;

  const allFiltered = filtered.every(v => selectedIds.has(v.id));
  const someSelected = filtered.some(v => selectedIds.has(v.id));

  function toggleAll() {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allFiltered) { filtered.forEach(v => next.delete(v.id)); }
      else { filtered.forEach(v => next.add(v.id)); }
      return next;
    });
  }

  function toggleOne(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selectedVehicles = activeVehicles.filter(v => selectedIds.has(v.id));

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '16px 24px 24px', gap: 12 }}>

      {/* Left: available vehicles */}
      <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Search */}
        <div
          onMouseEnter={() => setSearchHovered(true)}
          onMouseLeave={() => setSearchHovered(false)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, padding: '0 12px', borderRadius: 6, border: searchHovered ? '1px solid #28779c' : '1px solid #16506c', background: searchHovered ? 'rgba(0,70,102,0.28)' : 'rgba(0,70,102,0.16)', transition: 'background 0.15s, border-color 0.15s', flexShrink: 0 }}>
          <span style={{ color: 'rgba(128,176,200,0.5)', display: 'flex', flexShrink: 0 }}><SearchIcon /></span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, fontWeight: 500, fontFamily: F, color: '#ffffff', caretColor: '#ffffff', width: '100%' }}
            className="dashboard-search"
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', padding: '2px 2px 0', cursor: 'pointer', color: 'rgba(128,176,200,0.5)', display: 'flex', alignItems: 'center', lineHeight: 1, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(128,176,200,0.5)'}><XIcon size={10} /></button>}
        </div>

        {/* Select all + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '0 2px' }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.45)', fontFamily: F, letterSpacing: 0.7 }}>
            {filtered.length} ACTIVE VEHICLE{filtered.length !== 1 ? 'S' : ''}
          </span>
          <button
            onClick={toggleAll}
            style={{ fontSize: 9, fontWeight: 700, fontFamily: F, letterSpacing: 0.5, color: allFiltered ? '#28a0c8' : someSelected ? '#80b0c8' : 'rgba(128,176,200,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', transition: 'color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = allFiltered ? '#28a0c8' : someSelected ? '#80b0c8' : 'rgba(128,176,200,0.5)'}
          >
            {allFiltered ? 'DESELECT ALL' : 'SELECT ALL'}
          </button>
        </div>

        {/* Vehicle list */}
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3, paddingRight: 5 }}>
          {filtered.length === 0 ? (
            <EmptyState label="No vehicles match the search" />
          ) : filtered.map(v => {
            const sel = selectedIds.has(v.id);
            return (
              <div
                key={v.id}
                onClick={() => toggleOne(v.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 7, border: sel ? '1px solid rgba(40,119,156,0.55)' : '1px solid rgba(21,63,83,0.4)', background: sel ? 'rgba(0,70,102,0.28)' : 'rgba(0,30,46,0.3)', cursor: 'pointer', transition: 'border-color 0.12s, background 0.12s', flexShrink: 0 }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'rgba(0,50,74,0.42)'; }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'rgba(0,30,46,0.3)'; }}
              >
                {/* Checkbox */}
                <div style={{ width: 14, height: 14, borderRadius: 3, border: sel ? '1px solid #28779c' : '1px solid rgba(128,176,200,0.3)', background: sel ? '#28779c' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.12s, border-color 0.12s' }}>
                  {sel && <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, fontFamily: F, color: sel ? '#ffffff' : 'rgba(204,223,233,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.vin}</div>
                  <div style={{ fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.65)', marginTop: 1 }}>{v.model} · {v.year}</div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Right: selected vehicles */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, height: 34 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.45)', fontFamily: F, letterSpacing: 0.7 }}>
            SELECTED — {selectedIds.size} / {activeVehicles.length}
          </span>
          {selectedIds.size > 0 && (
            <button onClick={() => setSelectedIds(new Set())} style={{ fontSize: 9, fontWeight: 700, fontFamily: F, letterSpacing: 0.5, color: 'rgba(128,176,200,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', transition: 'color 0.12s' }} onMouseEnter={e => e.currentTarget.style.color = '#cc3333'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(128,176,200,0.4)'}>
              CLEAR ALL
            </button>
          )}
        </div>

        {/* Selected list */}
        <div style={{ flex: 1, borderRadius: 10, border: '1px solid rgba(21,63,83,0.7)', background: 'rgba(0,18,30,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedVehicles.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.2)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12h6M12 9v6"/></svg>
              <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.25)', textAlign: 'center' }}>No vehicles selected.<br/>Click vehicles on the left to add them.</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', height: 34, borderBottom: '1px solid rgba(21,63,83,0.6)', background: 'rgba(1,38,58,0.8)', flexShrink: 0, padding: '0 12px', gap: 12 }}>
                {[['VIN', 2], ['MODEL', 1], ['YEAR', 0.6], ['SW', 0.8]].map(([h, f]) => (
                  <div key={h} style={{ flex: f, fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', letterSpacing: 0.8, fontFamily: F }}>{h}</div>
                ))}
                <div style={{ width: 20, flexShrink: 0 }} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {selectedVehicles.map((v, i) => (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', height: 36, borderBottom: '1px solid rgba(21,63,83,0.25)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,30,46,0.2)', padding: '0 12px', gap: 12 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.18)'} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,30,46,0.2)'}>
                    <div style={{ flex: 2, fontSize: 11, fontWeight: 600, fontFamily: F, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.vin}</div>
                    <div style={{ flex: 1, fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(204,223,233,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.model}</div>
                    <div style={{ flex: 0.6, fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.65)' }}>{v.year}</div>
                    <div style={{ flex: 0.8, fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.sw}</div>
                    <RemoveBtn onRemove={() => toggleOne(v.id)} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: SPECIFICATION ───────────────────────────────────────────────────
function Step3({ specModel, setSpecModel }) {
  const specInfo = specModel ? { status: 'Approved', id: `SM-${specModel.slice(8, 14).toUpperCase()}` } : null;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px 24px', gap: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <WizardDropdown label="Specification Model" options={SPEC_MODEL_OPTIONS} value={specModel} onChange={setSpecModel} placeholder="Select Specification Model…" flex={3} zIndex={20} />
        <div style={{ flex: 1 }}>
          <SectionLabel>Status</SectionLabel>
          <div style={{ height: 38, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 8, border: '1px solid #0e3a52', background: 'rgba(0,30,46,0.3)', fontSize: 12, fontWeight: 500, fontFamily: F, color: specInfo ? '#38b060' : 'rgba(128,176,200,0.3)' }}>{specInfo ? specInfo.status : '—'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <SectionLabel>ID</SectionLabel>
          <div style={{ height: 38, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 8, border: '1px solid #0e3a52', background: 'rgba(0,30,46,0.3)', fontSize: 12, fontWeight: 500, fontFamily: F, color: specInfo ? '#ffffff' : 'rgba(128,176,200,0.3)' }}>{specInfo ? specInfo.id : '—'}</div>
        </div>
      </div>
      <div style={{ flex: 1, borderRadius: 12, border: '1px solid #153f53', background: 'rgba(1,45,66,0.4)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 36, display: 'flex', alignItems: 'center', borderBottom: '1px solid #153f53', background: 'rgba(1,38,58,0.8)', flexShrink: 0 }}>
          {['HARDWARE ID', 'HARDWARE VERSION', 'SOFTWARE ID', 'SOFTWARE VERSION', 'DOCUMENT ID'].map((h, i) => (
            <div key={i} style={{ flex: 1, padding: '0 12px', fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', letterSpacing: 0.7, fontFamily: F }}>{h}</div>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {!specModel ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><EmptyState label="Select a Specification Model to view data" /></div> : (
            (SPEC_MODEL_ROWS[specModel] || []).map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', height: 38, borderBottom: '1px solid rgba(21,63,83,0.5)', background: i % 2 === 1 ? 'rgba(0,30,46,0.25)' : 'transparent' }}>
                <div style={{ flex: 1, padding: '0 12px', fontSize: 12, fontWeight: 500, fontFamily: F, color: '#ffffff' }}>{row.hwId}</div>
                <div style={{ flex: 1, padding: '0 12px', fontSize: 12, fontWeight: 500, fontFamily: F, color: '#80b0c8' }}>{row.hwVersion}</div>
                <div style={{ flex: 1, padding: '0 12px', fontSize: 12, fontWeight: 500, fontFamily: F, color: '#ffffff' }}>{row.swId}</div>
                <div style={{ flex: 1, padding: '0 12px', fontSize: 12, fontWeight: 500, fontFamily: F, color: '#80b0c8' }}>{row.swVersion}</div>
                <div style={{ flex: 1, padding: '0 12px', fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.6)' }}>{row.docId}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: SUMMARY ─────────────────────────────────────────────────────────
function Step4({ paramValues, setParamValues, paramTab, setParamTab, baseData, variable, specModel, selectedVehicleCount }) {
  const allParams = paramTab === 'PRIMARY' ? CAMPAIGN_PARAMS_PRIMARY : CAMPAIGN_PARAMS_SECONDARY;
  const varOpt = VARIABLE_OPTIONS.find(v => v.code === variable);
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '16px 24px 24px', gap: 12 }}>
      {/* Left: parameters */}
      <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 10 }}>
        <SectionLabel>Campaign Parameters</SectionLabel>
        <div style={{ display: 'flex', background: 'rgba(0,20,32,0.6)', border: '1px solid #0e3a52', borderRadius: 10, padding: 3, gap: 3, flexShrink: 0 }}>
          {['PRIMARY', 'SECONDARY'].map(tab => (
            <button key={tab} onClick={() => setParamTab(tab)} style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: 'none', background: paramTab === tab ? 'rgba(0,70,100,0.55)' : 'transparent', color: paramTab === tab ? '#ffffff' : 'rgba(128,176,200,0.45)', fontSize: 10, fontWeight: 700, fontFamily: F, letterSpacing: 0.7, cursor: 'pointer', transition: 'all 0.15s', outline: paramTab === tab ? '1px solid #1e6080' : 'none' }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: 'hidden', borderRadius: 10, border: '1px solid rgba(21,63,83,0.7)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', background: 'rgba(1,38,58,0.8)', borderBottom: '1px solid rgba(21,63,83,0.7)', flexShrink: 0 }}>
            {[['PARAMETER', 2.5], ['VALUE', 1.2], ['UNIT', 1]].map(([h, f]) => (
              <div key={h} style={{ flex: f, padding: '8px 12px', fontSize: 8, fontWeight: 700, color: 'rgba(128,176,200,0.5)', letterSpacing: 0.7, fontFamily: F }}>{h}</div>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {allParams.map((p, i) => (
              <div key={p.key} style={{ display: 'flex', alignItems: 'center', minHeight: 36, borderBottom: '1px solid rgba(21,63,83,0.3)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.12)' }}>
                <div style={{ flex: 2.5, padding: '6px 12px' }}><ParamLabel label={p.label} tooltip={p.tooltip} /></div>
                <div style={{ flex: 1.2, padding: '4px 12px' }}>
                  <WizardInput value={String(paramValues[p.key])} onChange={v => setParamValues(pv => ({ ...pv, [p.key]: v }))} width={72} height={26} />
                </div>
                <div style={{ flex: 1, padding: '6px 12px', fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.45)' }}>{p.unit || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right: summary */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <SectionLabel>Summary</SectionLabel>
        <div style={{ flex: 1, background: 'rgba(0,30,46,0.5)', border: '1px solid rgba(21,63,83,0.7)', borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
          <div style={{ background: 'rgba(38,28,4,0.88)', border: '1px solid rgba(200,155,35,0.45)', borderRadius: 8, padding: '10px 12px', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(200,155,35,0.75)', lineHeight: 1.55 }}>Review all parameters before running. Once started, the campaign will begin executing immediately on selected vehicles.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            {[
              { label: 'Base Data',          value: baseData || '—' },
              { label: 'Variable',           value: varOpt ? `${varOpt.code} — ${varOpt.name}` : '—' },
              { label: 'Specification Model',value: specModel || '—' },
              { label: 'Selected Vehicles',  value: String(selectedVehicleCount) },
              { label: 'Status',             value: 'DRAFT' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(21,63,83,0.35)' }}>
                <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.6)', flexShrink: 0 }}>{row.label}:</span>
                <span style={{ fontSize: 11, fontWeight: 600, fontFamily: F, color: '#ffffff', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }} title={row.value}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────
export default function NewLabCampaignWizard({ onClose, onSuccess, vehicles = [] }) {
  const [step, setStep] = useState(1);
  const [closing, setClosing] = useState(false);

  // Step 1
  const [baseData, setBaseData] = useState('');
  const [variable, setVariable] = useState('');
  const [showUnused, setShowUnused] = useState(false);

  // Step 2
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Step 3
  const [specModel, setSpecModel] = useState('');

  // Step 4
  const [paramValues, setParamValues] = useState(() => {
    const v = {};
    [...CAMPAIGN_PARAMS_PRIMARY, ...CAMPAIGN_PARAMS_SECONDARY].forEach(p => { v[p.key] = p.defaultVal; });
    return v;
  });
  const [paramTab, setParamTab] = useState('PRIMARY');

  const [discardOpen, setDiscardOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleClose() { setDiscardOpen(true); }
  function handleConfirmDiscard() { setDiscardOpen(false); setClosing(true); }
  function handleConfirm() { setSubmitting(true); setTimeout(() => { onClose(); onSuccess?.(); }, 2600); }
  function onAnimEnd() { if (closing) onClose(); }

  const canNext = step === 1 ? !!baseData : step === 2 ? selectedIds.size > 0 : step === 3 ? !!specModel : true;

  const selectedVarOption = VARIABLE_OPTIONS.find(v => v.code === variable);
  const tableRows = selectedVarOption ? (VARIABLE_TABLE_ROWS[selectedVarOption.code] || []) : [];
  const btnBase = { padding: '8px 18px', borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: F, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: 0.4 };

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,8,18,0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', animation: closing ? 'backdropFadeOut 0.2s ease forwards' : 'backdropFadeIn 0.22s ease' }} />

      {/* Panel */}
      <div onAnimationEnd={onAnimEnd} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 201, width: 900, height: 640, background: 'rgba(1,22,36,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid #153f53', borderRadius: 20, boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(40,119,156,0.08)', display: 'flex', flexDirection: 'column', animation: closing ? 'modalFadeOut 0.2s ease forwards' : 'modalFadeIn 0.26s ease' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 52, borderBottom: '1px solid rgba(21,63,83,0.7)', flexShrink: 0, borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Montserrat', sans-serif", color: '#ffffff', letterSpacing: 0.3 }}>NEW CAMPAIGN</span>
          <CloseBtn onClose={handleClose} />
        </div>

        {/* Step indicator */}
        <StepIndicator step={step} />

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {submitting && <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(0,10,20,0.35)', pointerEvents: 'all' }} />}
          {step === 1 && <Step1 baseData={baseData} setBaseData={setBaseData} variable={variable} setVariable={code => setVariable(code)} showUnused={showUnused} setShowUnused={setShowUnused} tableRows={tableRows} selectedVarOption={selectedVarOption} />}
          {step === 2 && <Step2Vehicles vehicles={vehicles} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />}
          {step === 3 && <Step3 specModel={specModel} setSpecModel={setSpecModel} />}
          {step === 4 && <Step4 paramValues={paramValues} setParamValues={setParamValues} paramTab={paramTab} setParamTab={setParamTab} baseData={baseData} variable={variable} specModel={specModel} selectedVehicleCount={selectedIds.size} />}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderTop: '1px solid rgba(21,63,83,0.7)', flexShrink: 0 }}>
          <div>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{ ...btnBase, background: 'transparent', border: '1px solid #153f53', color: 'rgba(128,176,200,0.7)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#28779c'; e.currentTarget.style.color = '#ffffff'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#153f53'; e.currentTarget.style.color = 'rgba(128,176,200,0.7)'; }}>
                ← BACK
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleClose} style={{ ...btnBase, background: 'transparent', border: '1px solid rgba(128,176,200,0.2)', color: 'rgba(128,176,200,0.55)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(128,176,200,0.45)'; e.currentTarget.style.color = 'rgba(128,176,200,0.85)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(128,176,200,0.2)'; e.currentTarget.style.color = 'rgba(128,176,200,0.55)'; }}>
              CANCEL
            </button>
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext} style={{ ...btnBase, background: canNext ? 'rgba(0,70,102,0.7)' : 'rgba(0,40,60,0.4)', border: canNext ? '1px solid #28779c' : '1px solid #0e3a52', color: canNext ? '#ffffff' : 'rgba(128,176,200,0.25)', cursor: canNext ? 'pointer' : 'default' }} onMouseEnter={e => { if (canNext) e.currentTarget.style.background = 'rgba(0,90,130,0.8)'; }} onMouseLeave={e => { if (canNext) e.currentTarget.style.background = 'rgba(0,70,102,0.7)'; }}>
                NEXT →
              </button>
            ) : (
              <button onClick={!submitting ? handleConfirm : undefined} style={{ ...btnBase, background: submitting ? 'rgba(0,70,102,0.5)' : 'rgba(0,70,102,0.7)', border: '1px solid #28779c', color: '#ffffff', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.8 : 1, position: 'relative' }} onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'rgba(0,90,130,0.8)'; }} onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = 'rgba(0,70,102,0.7)'; }}>
                <span style={{ opacity: submitting ? 0 : 1 }}>RUN</span>
                {submitting && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SpinnerIcon /></span>}
              </button>
            )}
          </div>
        </div>
      </div>

      {discardOpen && <DiscardModal onCancel={() => setDiscardOpen(false)} onConfirm={handleConfirmDiscard} />}
    </>
  );
}
