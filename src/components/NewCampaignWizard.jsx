import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// ─── Icons ───────────────────────────────────────────────────────────────────
const ChevronIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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

const CopyIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const PasteIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'iteruSpin 0.75s linear infinite', flexShrink: 0 }}>
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);
const GearIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────
const BASE_DATA_OPTIONS = [
  'FA01 — Full Area Update',
  'SE03 — Selective ECU',
  'KE05 — Key ECU Flash',
  'PU01 — Powertrain Update',
];

const VARIABLE_OPTIONS = [
  { code: '01', name: 'ECU Firmware Baseline Config',    status: 'Active',     used: false },
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
    { country: 'Germany',  date: '15.03.2024', status: 'RUNNING',   vehicles: 1842 },
    { country: 'Austria',  date: '15.03.2024', status: 'COMPLETED', vehicles: 312  },
    { country: 'Poland',   date: '10.01.2024', status: 'CREATED',   vehicles: 228  },
  ],
  '02': [
    { country: 'Ukraine',  date: '22.01.2024', status: 'RUNNING', vehicles: 198 },
    { country: 'Romania',  date: '22.01.2024', status: 'CREATED', vehicles: 114 },
  ],
  '03': [
    { country: 'Sweden',   date: '01.03.2024', status: 'RUNNING',   vehicles: 421 },
    { country: 'Norway',   date: '01.02.2024', status: 'COMPLETED', vehicles: 156 },
    { country: 'Finland',  date: '01.02.2024', status: 'CREATED',   vehicles: 68  },
  ],
  '04': [
    { country: 'France',   date: '12.02.2024', status: 'DRAFT',  vehicles: 645 },
  ],
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
  '08': [
    { country: 'Japan', date: '20.05.2024', status: 'FAILED', vehicles: 234 },
  ],
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

const FILTER_TYPES = ['VIN', 'PKN', 'Country', 'Model', 'Region', 'Production Year'];
const FILTER_OPERATORS = ['Contains', 'Equals', 'Starts with', 'Ends with', 'In range'];

const CAMPAIGN_PARAMS_PRIMARY = [
  { key: 'flashDurHV',      label: 'Flash Duration HV',           defaultVal: '102',      unit: 'sec.',  type: 'number', tooltip: 'Max time allowed for high-voltage ECU firmware flashing' },
  { key: 'flashDurLV',      label: 'Flash Duration LV',           defaultVal: '102',      unit: 'sec.',  type: 'number', tooltip: 'Max time allowed for low-voltage ECU firmware flashing' },
  { key: 'flashDurHMI',     label: 'Flash Duration HMI',          defaultVal: '4',        unit: 'min.',  type: 'number', tooltip: 'Max time allowed for HMI display firmware flashing' },
  { key: 'enabledPowerGrid',label: 'Enabled Power Grid',          defaultVal: '2',        unit: '',      type: 'number', tooltip: 'Number of active power domains required during flashing' },
  { key: 'currentHV',       label: 'Current Consumption HV',      defaultVal: '10',       unit: 'amp.', type: 'number', tooltip: 'Max current draw from the high-voltage system during update' },
  { key: 'currentLV',       label: 'Current Consumption LV',      defaultVal: '10',       unit: 'amp.', type: 'number', tooltip: 'Max current draw from the low-voltage system during update' },
  { key: 'blockFlash',      label: 'Block Flash Attempts',        defaultVal: '3',        unit: '',      type: 'number', tooltip: 'Consecutive failures before flashing is permanently blocked' },
  { key: 'flashRepeat',     label: 'Flash Process Repeat',        defaultVal: '2',        unit: '',      type: 'number', tooltip: 'Times the flash process is re-run on partial completion' },
  { key: 'repeat',          label: 'Repeat',                      defaultVal: '6',        unit: '',      type: 'number', tooltip: 'Total number of full update cycle repetitions allowed' },
  { key: 'retry',           label: 'Retry',                       defaultVal: '3',        unit: '',      type: 'number', tooltip: 'Retry attempts after a single failed operation' },
  { key: 'maxRetry',        label: 'Max Retry Number',            defaultVal: '5',        unit: '',      type: 'number', tooltip: 'Hard cap on total retries across all operations' },
  { key: 'tDelayGeneral',   label: 'Time Delay General',          defaultVal: '5',        unit: 'sec.', type: 'number', tooltip: 'Pause between sequential update operations' },
  { key: 'tDelayStart1',    label: 'Time Delay Start 1',          defaultVal: '600',      unit: 'sec.', type: 'number', tooltip: 'Initial delay before the first update step begins' },
  { key: 'tDelayStart2',    label: 'Time Delay Start 2',          defaultVal: '120',      unit: 'sec.', type: 'number', tooltip: 'Secondary delay applied before critical update operations' },
  { key: 'tDelayWaitSleep', label: 'Time Delay Wait For Sleep',   defaultVal: '30',       unit: 'sec.', type: 'number', tooltip: 'Wait time before verifying vehicle is in sleep mode' },
  { key: 'logLevel',        label: 'Log Level',                   defaultVal: '7',        unit: '',      type: 'number', tooltip: 'Diagnostic log verbosity — higher value means more detail' },
  { key: 'installFailAction',label: 'Installation Failure Action',defaultVal: 'Continue', unit: '',      type: 'number', tooltip: 'Behavior when an ECU installation fails mid-campaign' },
];
const CAMPAIGN_PARAMS_SECONDARY = [
  { key: 'fallbackTimeout', label: 'Fallback Timeout',       defaultVal: '60',   unit: 'sec.', type: 'number', tooltip: 'Time before reverting to previous software version on failure' },
  { key: 'retryInterval',   label: 'Retry Interval',         defaultVal: '15',   unit: 'sec.', type: 'number', tooltip: 'Wait time between consecutive retry attempts' },
  { key: 'maxParallel',     label: 'Max Parallel Sessions',  defaultVal: '8',    unit: '',     type: 'number', tooltip: 'Maximum number of vehicles updating simultaneously' },
  { key: 'sessionTimeout',  label: 'Session Timeout',        defaultVal: '300',  unit: 'sec.', type: 'number', tooltip: 'Maximum duration of a single vehicle update session' },
  { key: 'heartbeat',       label: 'Heartbeat Interval',     defaultVal: '30',   unit: 'sec.', type: 'number', tooltip: 'Frequency of status pings to verify an active connection' },
  { key: 'diagLevel',       label: 'Diagnostic Level',       defaultVal: '2',    unit: '',     type: 'number', tooltip: 'Depth of on-board diagnostics collected during update' },
  { key: 'logRetention',    label: 'Log Retention',          defaultVal: '14',   unit: 'days', type: 'number', tooltip: 'Days update logs are stored before automatic deletion' },
  { key: 'errorThreshold',  label: 'Error Threshold',        defaultVal: '5',    unit: '%',    type: 'number', tooltip: 'Max error rate before the campaign is automatically paused' },
  { key: 'priorityLevel',   label: 'Priority Level',         defaultVal: '3',    unit: '',     type: 'number', tooltip: 'Scheduling priority relative to other active campaigns' },
  { key: 'notifMode',       label: 'Notification Mode',      defaultVal: 'Push', unit: '',     type: 'number', tooltip: 'Method used to deliver campaign status notifications' },
];

const WIZARD_STEPS = [
  { n: 1, label: 'BASE DATA' },
  { n: 2, label: 'INTERVALS' },
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

let _uid = 0;
const uid = () => ++_uid;

// ─── Shared primitives ───────────────────────────────────────────────────────
const F = "'Inter', sans-serif";

function RemoveBtn({ onConfirm, size = 11, label = 'Remove this item?' }) {
  const [hov, setHov] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [rect, setRect] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  const capture = () => {
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    if (!confirming) return;
    const h = e => {
      if (popRef.current && !popRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setConfirming(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [confirming]);

  const tooltipStyle = rect ? {
    position: 'fixed',
    bottom: window.innerHeight - rect.top + 4,
    left: rect.left + rect.width / 2,
    transform: 'translateX(-50%)',
    padding: '3px 7px', borderRadius: 4,
    background: '#012d42', border: '1px solid #153f53',
    fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: F,
    whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 9999,
  } : null;

  const confirmStyle = rect ? {
    position: 'fixed',
    bottom: window.innerHeight - rect.top + 6,
    right: window.innerWidth - rect.right,
    padding: '10px 12px', borderRadius: 8,
    background: '#011e2e', border: '1px solid #1e5570',
    boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
    zIndex: 9999, whiteSpace: 'nowrap',
    display: 'flex', flexDirection: 'column', gap: 8,
  } : null;

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        ref={btnRef}
        onClick={e => { e.stopPropagation(); capture(); setConfirming(true); setHov(false); }}
        onMouseEnter={() => { if (!confirming) { capture(); setHov(true); } }}
        onMouseLeave={() => setHov(false)}
        style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: confirming ? '#cc4444' : hov ? '#cc4444' : 'rgba(128,176,200,0.35)', display: 'flex', transition: 'color 0.12s' }}
      >
        <XIcon size={size} />
      </button>
      {hov && !confirming && rect && ReactDOM.createPortal(
        <div style={tooltipStyle}>Remove</div>,
        document.body
      )}
      {confirming && rect && ReactDOM.createPortal(
        <div ref={popRef} style={confirmStyle}>
          <div style={{ fontSize: 11, fontWeight: 600, fontFamily: F, color: '#ccdde9' }}>{label}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={e => { e.stopPropagation(); setConfirming(false); onConfirm(); }}
              style={{ flex: 1, padding: '4px 10px', borderRadius: 5, border: '1px solid rgba(180,40,40,0.35)', background: 'rgba(180,40,40,0.2)', color: '#cc4433', fontSize: 10, fontWeight: 700, fontFamily: F, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,40,40,0.35)'; e.currentTarget.style.borderColor = 'rgba(200,60,60,0.5)'; e.currentTarget.style.color = '#ff6060'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(180,40,40,0.2)'; e.currentTarget.style.borderColor = 'rgba(180,40,40,0.35)'; e.currentTarget.style.color = '#cc4433'; }}
            >
              Remove
            </button>
            <button
              onClick={e => { e.stopPropagation(); setConfirming(false); }}
              style={{ flex: 1, padding: '4px 10px', borderRadius: 5, border: '1px solid rgba(21,63,83,0.8)', background: 'transparent', color: 'rgba(128,176,200,0.7)', fontSize: 10, fontWeight: 700, fontFamily: F, cursor: 'pointer', transition: 'background 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Cancel
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

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
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 99,
      background: cfg.bg, border: `1px solid ${cfg.dot}`,
      fontSize: 9, fontWeight: 700, color: cfg.color, fontFamily: F, letterSpacing: 0.5, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 32, height: 17, borderRadius: 9,
        background: value ? '#28779c' : 'rgba(128,176,200,0.18)',
        border: value ? '1px solid #28779c' : '1px solid rgba(128,176,200,0.25)',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: value ? 17 : 2,
        width: 11, height: 11, borderRadius: '50%',
        background: value ? '#ffffff' : 'rgba(128,176,200,0.5)',
        transition: 'left 0.18s, background 0.18s',
      }} />
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
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 38, padding: '0 12px', borderRadius: 8,
          border: disabled ? '1px solid #0e3a52' : open ? '1px solid #28779c' : hovered ? '1px solid #2a6a87' : '1px solid #16506c',
          background: disabled ? 'rgba(0,30,46,0.3)' : open ? 'rgba(0,70,102,0.28)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)',
          cursor: disabled ? 'default' : 'pointer', userSelect: 'none',
          boxShadow: open ? '0px 0px 8px 0px rgba(40,119,156,0.28)' : 'none',
          transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 500, fontFamily: F, color: value ? '#ffffff' : 'rgba(128,176,200,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {value || placeholder}
        </span>
        <span style={{ color: '#80b0c8', opacity: disabled ? 0.25 : open ? 1 : 0.6, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s, opacity 0.15s', display: 'flex' }}>
          <ChevronIcon />
        </span>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#012d42', border: '1px solid #153f53', borderRadius: 8, boxShadow: '0px 8px 20px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex, maxHeight: 190, overflowY: 'auto' }}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{ padding: '9px 12px', cursor: 'pointer', borderBottom: i < options.length - 1 ? '1px solid rgba(21,63,83,0.6)' : 'none', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.32)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 12, fontWeight: 500, fontFamily: F, color: opt === value ? '#ffffff' : '#80b0c8' }}>{opt}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniDropdown({ options, value, onChange, placeholder = '—', width }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 30, padding: '0 8px', borderRadius: 6,
          border: open ? '1px solid #28779c' : '1px solid #16506c',
          background: open ? 'rgba(0,70,102,0.28)' : 'rgba(0,70,102,0.16)',
          cursor: 'pointer', userSelect: 'none', gap: 4,
          transition: 'border-color 0.12s, background 0.12s',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: value ? '#ffffff' : 'rgba(128,176,200,0.38)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {value || placeholder}
        </span>
        <span style={{ color: '#80b0c8', opacity: 0.6, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s', display: 'flex' }}>
          <ChevronIcon size={12} />
        </span>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 3px)', left: 0, right: 0, background: '#012d42', border: '1px solid #153f53', borderRadius: 6, boxShadow: '0 6px 16px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex: 30, maxHeight: 160, overflowY: 'auto' }}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{ padding: '7px 8px', cursor: 'pointer', borderBottom: i < options.length - 1 ? '1px solid rgba(21,63,83,0.5)' : 'none', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.32)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: opt === value ? '#ffffff' : '#80b0c8' }}>{opt}</span>
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
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="wizard-input"
      style={{
        width, height, padding: '0 10px', borderRadius: 6,
        border: focused ? '1px solid #28779c' : hovered ? '1px solid #2a6a87' : '1px solid #16506c',
        background: focused ? 'rgba(0,70,102,0.28)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)',
        boxShadow: focused ? '0px 0px 6px 0px rgba(40,119,156,0.25)' : 'none',
        color: '#ffffff', fontSize: 11, fontWeight: 500, fontFamily: F,
        outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.12s, background 0.12s, box-shadow 0.12s',
      }}
    />
  );
}

function ParamLabel({ label, tooltip }) {
  const [hov, setHov] = useState(false);
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'inline-block', cursor: 'default' }}
      onMouseEnter={() => { if (ref.current) setRect(ref.current.getBoundingClientRect()); setHov(true); }}
      onMouseLeave={() => setHov(false)}
    >
      <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(204,223,233,0.8)' }}>{label}</span>
      {hov && tooltip && rect && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          top: rect.bottom + 5,
          left: rect.left,
          maxWidth: 220, width: 'max-content',
          background: '#012d42', border: '1px solid #153f53', borderRadius: 8,
          padding: '6px 10px', zIndex: 9999, pointerEvents: 'none',
          fontSize: 10, fontWeight: 500, color: 'rgba(204,223,233,0.85)', fontFamily: F,
          lineHeight: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          whiteSpace: 'normal', wordBreak: 'break-word',
        }}>
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
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
        fontSize: 10, fontWeight: 700, fontFamily: F, letterSpacing: 1.2, textTransform: 'uppercase',
        transition: 'background 0.15s, box-shadow 0.15s, border-color 0.15s',
        ...(primary ? {
          color: '#ccdfe9', background: hov ? '#005a80' : '#004666', border: 'none',
          boxShadow: hov ? '0px 2px 8px 0px rgba(0,37,55,0.48)' : '0px 1px 4px 0px rgba(0,37,55,0.32)',
        } : {
          color: '#ccdfe9', background: hov ? '#01374f' : '#012d42',
          border: hov ? '1px solid #1e6080' : '1px solid #004666',
        }),
      }}
    >
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
      <button
        ref={btnRef}
        onClick={onClose}
        onMouseEnter={() => { if (btnRef.current) setRect(btnRef.current.getBoundingClientRect()); setHov(true); }}
        onMouseLeave={() => setHov(false)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: hov ? '#ffffff' : 'rgba(128,176,200,0.5)', display: 'flex', padding: 4, transition: 'color 0.15s' }}
      >
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
      <div
        onClick={handleClose}
        style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,20,35,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', animation: closing ? 'backdropFadeOut 0.22s ease forwards' : 'backdropFadeIn 0.22s ease' }}
      />
      <div
        onAnimationEnd={onAnimEnd}
        style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 301, width: 360, background: 'rgba(1,45,66,0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid #153f53', borderRadius: 20, boxShadow: '0px 8px 32px rgba(0,0,0,0.48)', padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 20, animation: closing ? 'modalFadeOut 0.22s ease forwards' : 'modalFadeIn 0.22s ease forwards' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>
            Discard campaign?
          </span>
          <button
            onClick={handleClose}
            style={{ width: 24, height: 24, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(128,176,200,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(204,223,233,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(128,176,200,0.5)'}
          >
            <XIcon size={16} />
          </button>
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#ccdfe9', fontFamily: F, lineHeight: '20px', margin: 0 }}>
          Are you sure you want to discard this campaign? All progress will be lost and the campaign will not be saved.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <WizardNavBtn onClick={handleClose}>Cancel</WizardNavBtn>
          <WizardNavBtn primary onClick={handleConfirm}>Discard</WizardNavBtn>
        </div>
      </div>
    </>
  );
}

function IconBtn({ onClick, tooltip, children, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: 26, height: 26, borderRadius: 6, border: 'none',
          background: hov ? (danger ? 'rgba(180,40,40,0.28)' : 'rgba(0,70,102,0.45)') : 'rgba(0,70,102,0.22)',
          color: hov ? (danger ? '#cc4444' : '#ffffff') : 'rgba(128,176,200,0.6)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.12s, color 0.12s', padding: 0,
        }}
      >
        {children}
      </button>
      {hov && tooltip && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)', padding: '3px 7px', borderRadius: 4, background: '#012d42', border: '1px solid #153f53', fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: F, whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 40 }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ step }) {
  return (
    <div style={{ display: 'flex', height: 50, flexShrink: 0, borderBottom: '1px solid rgba(21,63,83,0.8)' }}>
      {WIZARD_STEPS.map((s, i) => {
        const isActive = step === s.n;
        const isDone = step > s.n;
        return (
          <React.Fragment key={s.n}>
            {i > 0 && (() => {
              const prevStep = WIZARD_STEPS[i - 1];
              const bgLeft  = step > prevStep.n ? '#002840' : step === prevStep.n ? '#002434' : '#000c1a';
              const bgRight = isDone ? '#002840' : isActive ? '#002434' : '#000c1a';
              return (
                <div style={{ width: 22, flexShrink: 0, alignSelf: 'stretch', position: 'relative', overflow: 'hidden' }}>
                  <svg viewBox="0 0 22 50" width="22" height="50" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                    {/* right pentagon — no overlap with left triangle */}
                    <polygon points="0,0 22,0 22,50 0,50 14,25" fill={bgRight} />
                    {/* left triangle */}
                    <polygon points="0,0 14,25 0,50" fill={bgLeft} />
                    {/* separator stroke */}
                    <polyline points="0,0 14,25 0,50" fill="none" stroke="rgba(21,63,83,0.9)" strokeWidth="1" />
                  </svg>
                </div>
              );
            })()}
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              padding: i === 0 ? '0 16px 0 24px' : '0 16px',
              background: isDone ? '#002840' : isActive ? '#002434' : '#000c1a',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: isDone || isActive ? '#28779c' : 'transparent',
                border: isDone || isActive ? 'none' : '1px solid rgba(128,176,200,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone
                  ? <CheckIcon />
                  : <span style={{ fontSize: 11, fontWeight: 700, fontFamily: F, color: isActive ? '#ffffff' : 'rgba(128,176,200,0.35)' }}>{s.n}</span>
                }
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.7, fontFamily: F, color: isActive ? '#ffffff' : isDone ? 'rgba(204,223,233,0.65)' : 'rgba(128,176,200,0.28)', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Step 1: BASE DATA ───────────────────────────────────────────────────────
function Step1({ baseData, setBaseData, variable, setVariable, showUnused, setShowUnused, tableRows, selectedVarOption }) {
  const varOptions = showUnused
    ? VARIABLE_OPTIONS.filter(v => !v.used)
    : VARIABLE_OPTIONS;
  const varLabels = varOptions.map(v => `${v.code} — ${v.name}`);
  const varLabel = selectedVarOption ? `${selectedVarOption.code} — ${selectedVarOption.name}` : '';

  const colHeader = { fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', letterSpacing: 0.8, fontFamily: F, padding: '0 12px' };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px 24px', gap: 16, overflow: 'hidden' }}>
      {/* Dropdowns row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <WizardDropdown label={null} options={BASE_DATA_OPTIONS} value={baseData} onChange={setBaseData} placeholder="Select Base Data…" flex={1} zIndex={20} />
        <WizardDropdown label={null} options={varLabels} value={varLabel} onChange={v => {
          const opt = VARIABLE_OPTIONS.find(o => `${o.code} — ${o.name}` === v);
          setVariable(opt ? opt.code : '');
        }} placeholder="Select Variable…" disabled={!baseData} flex={2} zIndex={20} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Toggle value={showUnused} onChange={setShowUnused} />
          <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.65)', whiteSpace: 'nowrap' }}>Hide used</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderRadius: 12, border: '1px solid #153f53', background: 'rgba(1,45,66,0.4)' }}>
        {/* Left: Variable column */}
        <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid #153f53', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 36, display: 'flex', alignItems: 'center', borderBottom: '1px solid #153f53', background: 'rgba(1,38,58,0.8)' }}>
            <span style={colHeader}>VARIABLE</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {!selectedVarOption ? (
              <EmptyState label="No variable selected" />
            ) : (
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: F, letterSpacing: 0.5 }}>
                  {selectedVarOption.code}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', fontFamily: F, lineHeight: 1.4 }}>
                  {selectedVarOption.name}
                </div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: selectedVarOption.status === 'Active' ? '#38b060' : '#c8a028', fontFamily: F, background: selectedVarOption.status === 'Active' ? 'rgba(40,140,80,0.15)' : 'rgba(170,135,25,0.18)', border: `1px solid ${selectedVarOption.status === 'Active' ? '#38b060' : '#c8a028'}`, borderRadius: 99, padding: '2px 7px' }}>
                    {selectedVarOption.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: details */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: 36, display: 'flex', alignItems: 'center', borderBottom: '1px solid #153f53', background: 'rgba(1,38,58,0.8)', flexShrink: 0 }}>
            {['COUNTRY', 'DATE', 'STATUS', 'TOTAL VEHICLES'].map(h => (
              <div key={h} style={{ ...colHeader, flex: 1 }}>{h}</div>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {tableRows.length === 0 ? (
              <EmptyState label={selectedVarOption ? 'No country data available' : 'Select a variable to view data'} />
            ) : (
              tableRows.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', height: 38, borderBottom: '1px solid rgba(21,63,83,0.4)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)'}
                >
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

function EmptyState({ label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, padding: '32px 16px' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.2)" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      <div style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.3)', textAlign: 'center' }}>{label}</div>
    </div>
  );
}

const TOTAL_POOL = 248342;
const COUNTRIES_POOL = [
  'Germany','Poland','France','Italy','Spain','Netherlands','Belgium','Sweden',
  'Norway','Austria','Switzerland','UK','Czechia','Hungary','Romania','Portugal',
  'Denmark','Finland','Slovakia','Croatia','USA','Canada','Japan','Australia',
  'Greece','Turkey','Ukraine','Serbia','Bulgaria','Lithuania',
];


// ─── Info icon with portal tooltip ───────────────────────────────────────────
function InfoIcon({ tooltip }) {
  const [hov, setHov] = useState(false);
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => { setRect(ref.current?.getBoundingClientRect()); setHov(true); }}
        onMouseLeave={() => setHov(false)}
        style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid rgba(128,176,200,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default', flexShrink: 0 }}
      >
        <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(128,176,200,0.55)', fontFamily: F, lineHeight: 1, userSelect: 'none' }}>i</span>
      </div>
      {hov && rect && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: rect.bottom + 6, right: window.innerWidth - rect.right, maxWidth: 230, background: '#012d42', border: '1px solid #153f53', borderRadius: 8, padding: '8px 10px', zIndex: 9999, pointerEvents: 'none', fontSize: 10, fontWeight: 500, color: 'rgba(204,223,233,0.8)', fontFamily: F, lineHeight: 1.55, whiteSpace: 'pre-line', boxShadow: '0 4px 16px rgba(0,0,0,0.45)' }}>
          {tooltip}
        </div>,
        document.body
      )}
    </>
  );
}

// ─── Copy / Paste rule group buttons ─────────────────────────────────────────
function CopyGroupBtn({ onCopy }) {
  const [hov, setHov] = useState(false);
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  function handleClick() { onCopy(); setCopied(true); setTimeout(() => setCopied(false), 1200); }
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        ref={ref}
        onClick={handleClick}
        style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${copied ? 'rgba(40,119,156,0.6)' : 'rgba(21,63,83,0.7)'}`, background: copied ? 'rgba(0,70,102,0.3)' : 'transparent', color: copied ? '#80d0e8' : 'rgba(128,176,200,0.45)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'all 0.12s' }}
        onMouseEnter={e => { setRect(ref.current?.getBoundingClientRect()); setHov(true); e.currentTarget.style.borderColor = '#28779c'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(0,70,102,0.3)'; }}
        onMouseLeave={e => { setHov(false); if (!copied) { e.currentTarget.style.borderColor = 'rgba(21,63,83,0.7)'; e.currentTarget.style.color = 'rgba(128,176,200,0.45)'; e.currentTarget.style.background = 'transparent'; } }}
      >
        <CopyIcon />
      </button>
      {hov && rect && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: rect.top - 28, left: rect.left + rect.width / 2, transform: 'translateX(-50%)', background: '#012d42', border: '1px solid #153f53', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap', zIndex: 9999, pointerEvents: 'none', fontSize: 9, fontWeight: 700, color: 'rgba(204,223,233,0.9)', fontFamily: F, letterSpacing: 0.5 }}>
          {copied ? 'COPIED' : 'COPY RULE GROUP'}
        </div>,
        document.body
      )}
    </div>
  );
}

function PasteGroupBtn({ copied, onPaste }) {
  const [hov, setHov] = useState(false);
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  const active = !!copied;
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        ref={ref}
        onClick={() => { if (active) onPaste(); }}
        style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${active ? '#28779c' : 'rgba(21,63,83,0.5)'}`, background: active && hov ? 'rgba(0,90,130,0.45)' : active ? 'rgba(0,70,102,0.3)' : 'transparent', color: active ? '#80d0e8' : 'rgba(128,176,200,0.25)', cursor: active ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'all 0.12s', opacity: active ? 1 : 0.4 }}
        onMouseEnter={() => { if (active) { setRect(ref.current?.getBoundingClientRect()); setHov(true); } }}
        onMouseLeave={() => setHov(false)}
      >
        <PasteIcon />
      </button>
      {hov && rect && active && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: rect.top - 28, left: rect.left + rect.width / 2, transform: 'translateX(-50%)', background: '#012d42', border: '1px solid #153f53', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap', zIndex: 9999, pointerEvents: 'none', fontSize: 9, fontWeight: 700, color: 'rgba(204,223,233,0.9)', fontFamily: F, letterSpacing: 0.5 }}>
          PASTE RULE GROUP
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Add-filter button (shows AND/OR picker for 2nd+ filter) ─────────────────
function AddFilterBtn({ hasFilters, onSelect }) {
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);
  const [btnRect, setBtnRect] = useState(null);
  const btnRef = useRef(null);
  const dropRef = useRef(null);
  useEffect(() => {
    const h = e => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  function handleClick() {
    if (!hasFilters) { onSelect(null); return; }
    setBtnRect(btnRef.current?.getBoundingClientRect());
    setOpen(o => !o);
  }
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={btnRef}
        onClick={handleClick}
        style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid rgba(21,63,83,0.8)', background: 'transparent', color: 'rgba(128,176,200,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'all 0.12s' }}
        onMouseEnter={e => { setBtnRect(btnRef.current?.getBoundingClientRect()); setHov(true); e.currentTarget.style.borderColor = '#28779c'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(0,70,102,0.3)'; }}
        onMouseLeave={e => { setHov(false); e.currentTarget.style.borderColor = 'rgba(21,63,83,0.8)'; e.currentTarget.style.color = 'rgba(128,176,200,0.55)'; e.currentTarget.style.background = 'transparent'; }}
      >
        <PlusIcon />
      </button>
      {hov && !open && btnRect && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: btnRect.top - 28, left: btnRect.left + btnRect.width / 2, transform: 'translateX(-50%)', background: '#012d42', border: '1px solid #153f53', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap', zIndex: 9999, pointerEvents: 'none', fontSize: 9, fontWeight: 700, color: 'rgba(204,223,233,0.9)', fontFamily: F, letterSpacing: 0.5 }}>
          ADD FILTER
        </div>,
        document.body
      )}
      {open && btnRect && ReactDOM.createPortal(
        <div ref={dropRef} style={{ position: 'fixed', top: btnRect.bottom + 4, left: btnRect.left, background: '#012d42', border: '1px solid #153f53', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.45)', overflow: 'hidden', zIndex: 9999, minWidth: 64 }}>
          {['AND', 'OR'].map((conn, i) => (
            <div
              key={conn}
              onClick={() => { onSelect(conn); setOpen(false); }}
              style={{ padding: '7px 12px', cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: F, color: conn === 'AND' ? '#f59e0b' : '#a78bfa', borderBottom: i === 0 ? '1px solid rgba(21,63,83,0.5)' : 'none', transition: 'background 0.1s', letterSpacing: 0.5 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.32)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {conn}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Step 2: INTERVALS ───────────────────────────────────────────────────────
function Step2({ intervals, selIntervalId, setSelIntervalId, rules, setRules, currentFilterGroups, onAddInterval, onRemoveInterval, onAddFilterGroup, onRemoveFilterGroup, onUpdateFilterGroup, onAddFilter, onRemoveFilter, onUpdateFilter, filterGroupsMap, onRecalculatingChange, onPasteFilterGroup }) {
  const [copiedRuleGroup, setCopiedRuleGroup] = useState(null);
  const [intervalVehicles, setIntervalVehicles] = useState(() => {
    const v = { ungrouped: TOTAL_POOL };
    intervals.forEach(i => { if (!i.fixed) v[i.id] = 0; });
    return v;
  });
  const [intervalCountries, setIntervalCountries] = useState(() => {
    // Distribute TOTAL_POOL across countries for ungrouped
    const countries = [...COUNTRIES_POOL];
    const rows = [];
    let rem = TOTAL_POOL;
    for (let i = 0; i < countries.length - 1; i++) {
      const share = Math.round(rem * (0.04 + Math.random() * 0.12));
      rows.push({ country: countries[i], count: share });
      rem -= share;
    }
    rows.push({ country: countries[countries.length - 1], count: rem });
    rows.sort((a, b) => b.count - a.count);
    return { ungrouped: rows };
  });
  const [expandedIntervals, setExpandedIntervals] = useState(new Set());
  const [recalculating, setRecalculating] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [gearHov, setGearHov] = useState(false);
  const [gearRect, setGearRect] = useState(null);
  const gearRef = useRef(null);

  // Sync intervalVehicles when intervals list changes (removal returns vehicles to ungrouped)
  useEffect(() => {
    const allIds = new Set(intervals.map(i => i.id));
    setIntervalVehicles(prev => {
      const next = { ungrouped: prev.ungrouped || TOTAL_POOL };
      let returned = 0;
      Object.entries(prev).forEach(([id, v]) => {
        if (id === 'ungrouped') return;
        if (allIds.has(id)) next[id] = v;
        else returned += v;
      });
      next.ungrouped += returned;
      intervals.forEach(i => { if (!i.fixed && !(i.id in next)) next[i.id] = 0; });
      return next;
    });
  }, [intervals]);

  function handleRecalculate() {
    if (recalculating) return;
    const activeIntervals = intervals.filter(i => !i.fixed && (filterGroupsMap[i.id] || []).some(fg => fg.filters.length > 0));
    const fgSnapshot = filterGroupsMap;

    setRecalculating(true);
    onRecalculatingChange(true);

    setTimeout(() => {
      const newV = { ungrouped: TOTAL_POOL };
      intervals.forEach(i => { if (!i.fixed) newV[i.id] = 0; });
      let remaining = TOTAL_POOL;
      activeIntervals.forEach(i => {
        const filterCount = (fgSnapshot[i.id] || []).reduce((sum, fg) => sum + fg.filters.length, 0);
        const base = Math.min(remaining * 0.22, 12000 + filterCount * 9000);
        const allocation = Math.round(base * (0.78 + Math.random() * 0.44));
        const actual = Math.min(allocation, remaining - 15000);
        if (actual > 0) { newV[i.id] = actual; remaining -= actual; }
      });
      newV.ungrouped = remaining;

      // Build per-country breakdown for each interval
      const newC = {};
      const allCountries = [...COUNTRIES_POOL];
      Object.entries(newV).forEach(([id, total]) => {
        if (total === 0) { newC[id] = []; return; }
        const count = id === 'ungrouped' ? allCountries.length : Math.min(3 + Math.floor(Math.random() * 6), allCountries.length);
        const pool = id === 'ungrouped' ? [...allCountries] : [...allCountries].sort(() => Math.random() - 0.5).slice(0, count);
        const rows = [];
        let rem = total;
        for (let k = 0; k < pool.length - 1; k++) {
          const share = Math.round(rem * (id === 'ungrouped' ? (0.04 + Math.random() * 0.12) : (0.08 + Math.random() * 0.3)));
          rows.push({ country: pool[k], count: Math.max(1, share) });
          rem -= Math.max(1, share);
        }
        rows.push({ country: pool[pool.length - 1], count: Math.max(1, rem) });
        rows.sort((a, b) => b.count - a.count);
        newC[id] = rows;
      });

      setIntervalVehicles(newV);
      setIntervalCountries(newC);
      setRecalculating(false);
      onRecalculatingChange(false);
    }, 1100 + Math.random() * 700);
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '16px 24px 24px', gap: 12 }}>
      {/* Left: intervals list */}
      <div style={{ width: 184, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, opacity: recalculating ? 0.4 : 1, pointerEvents: recalculating ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
        {/* Top bar: ADD INTERVAL + Gear icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <button
            onClick={onAddInterval}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, border: '1px solid #28779c', background: 'rgba(0,70,102,0.55)', color: '#ffffff', fontSize: 10, fontWeight: 700, fontFamily: F, cursor: 'pointer', transition: 'all 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,90,130,0.7)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,70,102,0.55)'}
          >
            <PlusIcon /> ADD INTERVAL
          </button>
          {/* Gear button */}
          <button
            ref={gearRef}
            onClick={() => setRulesOpen(o => !o)}
            onMouseEnter={e => { setGearRect(gearRef.current?.getBoundingClientRect()); setGearHov(true); e.currentTarget.style.borderColor = '#28779c'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(0,70,102,0.3)'; }}
            onMouseLeave={e => { setGearHov(false); if (!rulesOpen) { e.currentTarget.style.borderColor = 'rgba(21,63,83,0.8)'; e.currentTarget.style.color = 'rgba(128,176,200,0.55)'; e.currentTarget.style.background = 'transparent'; } }}
            style={{ width: 24, height: 24, borderRadius: 6, border: rulesOpen ? '1px solid #28779c' : '1px solid rgba(21,63,83,0.8)', background: rulesOpen ? 'rgba(0,70,102,0.4)' : 'transparent', color: rulesOpen ? '#ffffff' : 'rgba(128,176,200,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'all 0.12s' }}
          >
            <GearIcon />
          </button>
          {gearHov && gearRect && ReactDOM.createPortal(
            <div style={{ position: 'fixed', top: gearRect.bottom + 6, left: gearRect.left + gearRect.width / 2, transform: 'translateX(-50%)', background: '#012d42', border: '1px solid #153f53', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap', zIndex: 9999, pointerEvents: 'none', fontSize: 9, fontWeight: 700, color: 'rgba(204,223,233,0.9)', fontFamily: F, letterSpacing: 0.5 }}>
              Intervals thresholds
            </div>,
            document.body
          )}
        </div>

        {/* Collapsible rules panel */}
        <div className={`filter-panel-wrapper${rulesOpen ? ' open' : ''}`} style={{ flexShrink: 0 }}>
          <div className="filter-panel-inner">
            <div style={{ background: 'rgba(0,15,28,0.65)', border: '1px solid rgba(21,63,83,0.7)', borderRadius: 8, padding: '10px 12px', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', letterSpacing: 0.8, fontFamily: F, textTransform: 'uppercase' }}>Intervals thresholds</div>
                <InfoIcon tooltip={'Success rate: the percentage of successful vehicle updates that triggers automatic advancement to the next interval.\n\nFailure rate: the percentage of failed updates that automatically pauses the campaign to prevent further issues.'} />
              </div>
              {[
                { label: 'Success rate:', key: 'success' },
                { label: 'Failure rate:', key: 'failure' },
              ].map(r => (
                <div key={r.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(204,223,233,0.65)', flex: 1, paddingRight: 6 }}>{r.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                    <WizardInput value={rules[r.key]} onChange={v => setRules(pr => ({ ...pr, [r.key]: v }))} width={44} />
                    <span style={{ fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.55)' }}>%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[...intervals].sort((a, b) => (b.isUngrouped ? 1 : 0) - (a.isUngrouped ? 1 : 0)).map(interval => {
            const isActive = selIntervalId === interval.id;
            const vCount = intervalVehicles[interval.id] ?? 0;
            return (
              <div
                key={interval.id}
                onClick={() => setSelIntervalId(interval.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', background: isActive ? 'rgba(0,65,96,0.7)' : 'rgba(0,45,68,0.4)', border: isActive ? '1px solid #28779c' : '1px solid rgba(21,63,83,0.6)', transition: 'background 0.12s, border-color 0.12s', animation: 'wiz-item-in 0.22s ease' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,55,80,0.5)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,45,68,0.4)'; }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, fontFamily: F, color: isActive ? '#ffffff' : 'rgba(204,223,233,0.75)' }}>{interval.name}</div>
                  <div style={{ fontSize: 9, fontWeight: 500, fontFamily: F, color: isActive ? 'rgba(128,210,230,0.7)' : 'rgba(128,176,200,0.45)', marginTop: 2 }}>
                    {vCount.toLocaleString()} vehicles
                  </div>
                </div>
                {!interval.fixed && (
                  <RemoveBtn onConfirm={() => onRemoveInterval(interval.id)} label="Remove interval?" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle: rule groups */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden', opacity: recalculating ? 0.4 : 1, pointerEvents: recalculating ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button
            onClick={onAddFilterGroup}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, border: '1px solid #28779c', background: 'rgba(0,70,102,0.55)', color: '#ffffff', fontSize: 10, fontWeight: 700, fontFamily: F, cursor: 'pointer', transition: 'all 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,90,130,0.7)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,70,102,0.55)'}
          >
            <PlusIcon /> ADD RULES GROUP
          </button>
          <PasteGroupBtn copied={copiedRuleGroup} onPaste={() => { onPasteFilterGroup(copiedRuleGroup); }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 2 }}>
          {currentFilterGroups.length === 0 && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(0,50,80,0.18)', border: '1px solid rgba(40,119,156,0.22)', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: 'rgba(128,176,200,0.45)', fontFamily: F, lineHeight: 1.5 }}>Click <span style={{ color: 'rgba(128,190,220,0.65)', fontWeight: 700 }}>ADD RULES GROUP</span> to start defining vehicle filters for this interval.</div>
            </div>
          )}
          {currentFilterGroups.map((fg, fgi) => (
            <div key={fg.id} style={{ background: 'rgba(0,30,46,0.5)', border: '1px solid rgba(21,63,83,0.7)', borderRadius: 10, padding: '12px 14px', flexShrink: 0, animation: 'wiz-item-in 0.22s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', letterSpacing: 0.8, fontFamily: F, textTransform: 'uppercase' }}>Rule Group {fgi + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CopyGroupBtn onCopy={() => setCopiedRuleGroup({ filters: fg.filters })} />
                  <RemoveBtn onConfirm={() => onRemoveFilterGroup(fg.id)} label="Remove rule group?" />
                </div>
              </div>
              {fg.filters.map(f => (
                <div key={f.id}>
                  {f.connector && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, marginTop: 2 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 7px', borderRadius: 4, lineHeight: 1, background: f.connector === 'AND' ? 'rgba(245,158,11,0.12)' : 'rgba(167,139,250,0.12)', border: `1px solid ${f.connector === 'AND' ? 'rgba(245,158,11,0.35)' : 'rgba(167,139,250,0.35)'}`, color: f.connector === 'AND' ? '#f59e0b' : '#a78bfa', fontSize: 8, fontWeight: 700, fontFamily: F, letterSpacing: 0.8 }}>
                        {f.connector}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <MiniDropdown options={FILTER_TYPES} value={f.type} onChange={v => onUpdateFilter(fg.id, f.id, 'type', v)} placeholder="Type" width={110} />
                    <MiniDropdown options={FILTER_OPERATORS} value={f.operator} onChange={v => onUpdateFilter(fg.id, f.id, 'operator', v)} placeholder="Operator" width={110} />
                    <div style={{ flex: 1 }}>
                      <WizardInput value={f.value} onChange={v => onUpdateFilter(fg.id, f.id, 'value', v)} placeholder="Value…" width="100%" height={30} />
                    </div>
                    <RemoveBtn onConfirm={() => onRemoveFilter(fg.id, f.id)} label="Remove filter?" />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: fg.filters.length > 0 ? 4 : 0 }}>
                <AddFilterBtn hasFilters={fg.filters.length > 0} onSelect={conn => onAddFilter(fg.id, conn)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: calculations */}
      <div style={{ width: 190, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid #28779c', background: 'rgba(0,70,102,0.55)', color: '#ffffff', fontSize: 10, fontWeight: 700, fontFamily: F, cursor: recalculating ? 'default' : 'pointer', transition: 'all 0.12s', alignSelf: 'flex-start', position: 'relative' }}
          onMouseEnter={e => { if (!recalculating) e.currentTarget.style.background = 'rgba(0,90,130,0.7)'; }}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,70,102,0.55)'}
        >
          <span style={{ opacity: recalculating ? 0 : 1 }}>RECALCULATE</span>
          {recalculating && (
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SpinnerIcon />
            </span>
          )}
        </button>
        <div style={{ flex: 1, background: 'rgba(0,30,46,0.5)', border: '1px solid rgba(21,63,83,0.7)', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: recalculating ? 0.4 : 1, transition: 'opacity 0.2s' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(21,63,83,0.7)', background: 'rgba(1,38,58,0.6)', flexShrink: 0, padding: '7px 10px' }}>
            <div style={{ width: 18, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 8, fontWeight: 700, color: 'rgba(128,176,200,0.5)', letterSpacing: 0.7, fontFamily: F }}>INTERVAL</div>
            <div style={{ width: 72, flexShrink: 0, fontSize: 8, fontWeight: 700, color: 'rgba(128,176,200,0.5)', letterSpacing: 0.7, fontFamily: F, textAlign: 'right' }}>VEHICLES</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {[...intervals].sort((a, b) => (b.isUngrouped ? 1 : 0) - (a.isUngrouped ? 1 : 0)).map((interval, i) => {
              const vCount = intervalVehicles[interval.id] ?? 0;
              const isExpanded = expandedIntervals.has(interval.id);
              const countries = intervalCountries[interval.id] || [];
              const canExpand = countries.length > 0;
              return (
                <div key={interval.id}>
                  {/* Interval row */}
                  <div
                    onClick={() => canExpand && setExpandedIntervals(prev => { const s = new Set(prev); s.has(interval.id) ? s.delete(interval.id) : s.add(interval.id); return s; })}
                    style={{ display: 'flex', alignItems: 'center', padding: '7px 10px', borderBottom: '1px solid rgba(21,63,83,0.3)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.12)', cursor: canExpand ? 'pointer' : 'default' }}
                  >
                    <div style={{ width: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {canExpand && (
                        <svg width="8" height="8" viewBox="0 0 8 8" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', color: 'rgba(128,176,200,0.5)' }}>
                          <path d="M2.5 1.5L5.5 4L2.5 6.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1, fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(204,223,233,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{interval.name}</div>
                    <div style={{ width: 72, flexShrink: 0, fontSize: 11, fontWeight: 600, fontFamily: F, color: '#ffffff', textAlign: 'right' }}>{vCount.toLocaleString('de-DE')}</div>
                  </div>
                  {/* Country sub-rows */}
                  {isExpanded && countries.map((row, ci) => (
                    <div key={ci} style={{ display: 'flex', alignItems: 'center', padding: '5px 10px', background: 'rgba(0,20,34,0.55)', borderBottom: '1px solid rgba(21,63,83,0.15)' }}>
                      <div style={{ width: 18, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 10, fontWeight: 400, fontFamily: F, color: 'rgba(128,176,200,0.7)', paddingLeft: 4 }}>{row.country}</div>
                      <div style={{ width: 72, flexShrink: 0, fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(204,223,233,0.75)', textAlign: 'right' }}>{row.count.toLocaleString('de-DE')}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: SPECIFICATION MODEL ─────────────────────────────────────────────
function Step3({ specModel, setSpecModel }) {
  const specInfo = specModel ? { status: 'Approved', id: `SM-${specModel.slice(8, 14).toUpperCase()}` } : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px 24px', gap: 14, overflow: 'hidden' }}>
      {/* Top row: dropdown + status + id */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <WizardDropdown label="Specification Model" options={SPEC_MODEL_OPTIONS} value={specModel} onChange={setSpecModel} placeholder="Select Specification Model…" flex={3} zIndex={20} />
        <div style={{ flex: 1 }}>
          <SectionLabel>Status</SectionLabel>
          <div style={{ height: 38, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 8, border: '1px solid #0e3a52', background: 'rgba(0,30,46,0.3)', fontSize: 12, fontWeight: 500, fontFamily: F, color: specInfo ? '#38b060' : 'rgba(128,176,200,0.3)' }}>
            {specInfo ? specInfo.status : '—'}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <SectionLabel>ID</SectionLabel>
          <div style={{ height: 38, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 8, border: '1px solid #0e3a52', background: 'rgba(0,30,46,0.3)', fontSize: 12, fontWeight: 500, fontFamily: F, color: specInfo ? '#ffffff' : 'rgba(128,176,200,0.3)' }}>
            {specInfo ? specInfo.id : '—'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, borderRadius: 12, border: '1px solid #153f53', background: 'rgba(1,45,66,0.4)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 36, display: 'flex', alignItems: 'center', borderBottom: '1px solid #153f53', background: 'rgba(1,38,58,0.8)', flexShrink: 0 }}>
          {['HARDWARE ID', 'HARDWARE VERSION', 'SOFTWARE ID', 'SOFTWARE VERSION', 'DOCUMENT ID'].map((h, i) => (
            <div key={i} style={{ flex: 1, padding: '0 12px', fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', letterSpacing: 0.7, fontFamily: F }}>{h}</div>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {!specModel ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <EmptyState label="Select a Specification Model to view data" />
            </div>
          ) : (
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
function Step4({ paramValues, setParamValues, paramTab, setParamTab, baseData, variable, specModel, intervals, onClose }) {
  const allParams = paramTab === 'PRIMARY' ? CAMPAIGN_PARAMS_PRIMARY : CAMPAIGN_PARAMS_SECONDARY;
  const varOpt = VARIABLE_OPTIONS.find(v => v.code === variable);
  const userIntervals = intervals.filter(i => !i.isUngrouped);

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '16px 24px 24px', gap: 12 }}>
      {/* Left: parameters */}
      <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 10 }}>
        <SectionLabel>Campaign Parameters</SectionLabel>
        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(0,20,32,0.6)', border: '1px solid #0e3a52', borderRadius: 10, padding: 3, gap: 3, flexShrink: 0 }}>
          {['PRIMARY', 'SECONDARY'].map(tab => (
            <button key={tab} onClick={() => setParamTab(tab)} style={{
              flex: 1, padding: '6px 0', borderRadius: 8, border: 'none',
              background: paramTab === tab ? 'rgba(0,70,100,0.55)' : 'transparent',
              color: paramTab === tab ? '#ffffff' : 'rgba(128,176,200,0.45)',
              fontSize: 10, fontWeight: 700, fontFamily: F, letterSpacing: 0.7,
              cursor: 'pointer', transition: 'all 0.15s',
              outline: paramTab === tab ? '1px solid #1e6080' : 'none',
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Params table */}
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
          {/* Warning banner */}
          <div style={{ background: 'rgba(38,28,4,0.88)', border: '1px solid rgba(200,155,35,0.45)', borderRadius: 8, padding: '10px 12px', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(200,155,35,0.75)', lineHeight: 1.55 }}>
              Review all parameters before confirming. Edits may not be possible once the campaign is submitted for approval.
            </div>
          </div>

          {/* Summary rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            {[
              { label: 'Base Data',          value: baseData || '—' },
              { label: 'Variable',           value: varOpt ? `${varOpt.code} — ${varOpt.name}` : '—' },
              { label: 'Specification Model',value: specModel || '—' },
              { label: 'Total Intervals',    value: String(userIntervals.length) },
              { label: 'Status',             value: 'DRAFT' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(21,63,83,0.35)' }}>
                <span style={{ fontSize: 11, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.6)', flexShrink: 0 }}>{row.label}:</span>
                <span style={{ fontSize: 11, fontWeight: 600, fontFamily: F, color: '#ffffff', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }} title={row.value}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{ background: 'rgba(0,20,32,0.4)', borderRadius: 8, padding: '10px 12px', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 500, fontFamily: F, color: 'rgba(128,176,200,0.5)', lineHeight: 1.6 }}>
              The campaign needs to be approved before execution. Once confirmed, it will be queued for the approval workflow and assigned a campaign ID.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main wizard ─────────────────────────────────────────────────────────────
export default function NewCampaignWizard({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [closing, setClosing] = useState(false);

  // Step 1
  const [baseData, setBaseData] = useState('');
  const [variable, setVariable] = useState('');
  const [showUnused, setShowUnused] = useState(false);

  // Step 2
  const [intervals, setIntervals] = useState([
    { id: 'ungrouped', name: 'Ungrouped', fixed: true, isUngrouped: true },
  ]);
  const [selIntervalId, setSelIntervalId] = useState('ungrouped');
  const [rules, setRules] = useState({ success: '60', failure: '40' });
  const [filterGroupsMap, setFilterGroupsMap] = useState({ ungrouped: [] });

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
  const [recalculating, setRecalculating] = useState(false);
  function handleClose() { setDiscardOpen(true); }
  function handleConfirmDiscard() { setDiscardOpen(false); setClosing(true); }
  function handleConfirm() {
    setSubmitting(true);
    setTimeout(() => { onClose(); onSuccess?.(); }, 2600);
  }
  function onAnimEnd() { if (closing) onClose(); }

  function addInterval() {
    const num = intervals.filter(i => !i.fixed).length + 1;
    const newId = String(uid());
    setIntervals(prev => {
      const idx = prev.findIndex(i => i.isUngrouped);
      const next = [...prev];
      next.splice(idx, 0, { id: newId, name: `Interval ${num}`, fixed: false, isUngrouped: false });
      return next;
    });
    setFilterGroupsMap(prev => ({ ...prev, [newId]: [] }));
    setSelIntervalId(newId);
  }

  function removeInterval(id) {
    setIntervals(prev => prev.filter(i => i.id !== id));
    setFilterGroupsMap(prev => { const n = { ...prev }; delete n[id]; return n; });
    if (selIntervalId === id) setSelIntervalId('pilot');
  }

  const currentFilterGroups = filterGroupsMap[selIntervalId] || [];

  function addFilterGroup() {
    const fg = { id: uid(), vehicleLimit: '', filters: [] };
    setFilterGroupsMap(prev => ({ ...prev, [selIntervalId]: [...(prev[selIntervalId] || []), fg] }));
  }
  function pasteFilterGroup(source) {
    if (!source) return;
    const fg = { id: uid(), vehicleLimit: '', filters: source.filters.map(f => ({ ...f, id: uid() })) };
    setFilterGroupsMap(prev => ({ ...prev, [selIntervalId]: [...(prev[selIntervalId] || []), fg] }));
  }
  function removeFilterGroup(fgId) {
    setFilterGroupsMap(prev => ({ ...prev, [selIntervalId]: prev[selIntervalId].filter(fg => fg.id !== fgId) }));
  }
  function updateFilterGroup(fgId, key, value) {
    setFilterGroupsMap(prev => ({ ...prev, [selIntervalId]: prev[selIntervalId].map(fg => fg.id === fgId ? { ...fg, [key]: value } : fg) }));
  }
  function addFilter(fgId, connector = null) {
    const f = { id: uid(), connector, type: '', operator: '', value: '' };
    setFilterGroupsMap(prev => ({ ...prev, [selIntervalId]: prev[selIntervalId].map(fg => fg.id === fgId ? { ...fg, filters: [...fg.filters, f] } : fg) }));
  }
  function removeFilter(fgId, filterId) {
    setFilterGroupsMap(prev => ({ ...prev, [selIntervalId]: prev[selIntervalId].map(fg => fg.id === fgId ? { ...fg, filters: fg.filters.filter(f => f.id !== filterId) } : fg) }));
  }
  function updateFilter(fgId, filterId, key, value) {
    setFilterGroupsMap(prev => ({ ...prev, [selIntervalId]: prev[selIntervalId].map(fg => fg.id === fgId ? { ...fg, filters: fg.filters.map(f => f.id === filterId ? { ...f, [key]: value } : f) } : fg) }));
  }

  const canNext = step === 1 ? !!baseData : step === 3 ? !!specModel : true;

  const selectedVarOption = VARIABLE_OPTIONS.find(v => v.code === variable);
  const varLabel = selectedVarOption ? `${selectedVarOption.code} — ${selectedVarOption.name}` : '';
  const tableRows = selectedVarOption ? (VARIABLE_TABLE_ROWS[selectedVarOption.code] || []) : [];

  const btnBase = { padding: '8px 18px', borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: F, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: 0.4 };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,8,18,0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', animation: closing ? 'backdropFadeOut 0.2s ease forwards' : 'backdropFadeIn 0.22s ease' }}
      />

      {/* Panel */}
      <div
        onAnimationEnd={onAnimEnd}
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 201, width: 980, height: 680,
          background: 'rgba(1,22,36,0.97)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid #153f53',
          borderRadius: 20,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(40,119,156,0.08)',
          display: 'flex', flexDirection: 'column',
          animation: closing ? 'modalFadeOut 0.2s ease forwards' : 'modalFadeIn 0.26s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 52, borderBottom: '1px solid rgba(21,63,83,0.7)', flexShrink: 0, borderRadius: '20px 20px 0 0', overflow: 'hidden', opacity: recalculating ? 0.4 : 1, pointerEvents: recalculating ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Montserrat', sans-serif", color: '#ffffff', letterSpacing: 0.3 }}>
            NEW CAMPAIGN
          </span>
          <CloseBtn onClose={handleClose} />
        </div>

        {/* Step indicator */}
        <div style={{ opacity: recalculating ? 0.4 : 1, transition: 'opacity 0.2s', pointerEvents: recalculating ? 'none' : 'auto' }}>
          <StepIndicator step={step} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {submitting && <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(0,10,20,0.35)', pointerEvents: 'all' }} />}
          {step === 1 && (
            <Step1
              baseData={baseData} setBaseData={setBaseData}
              variable={variable}
              setVariable={code => setVariable(code)}
              showUnused={showUnused} setShowUnused={setShowUnused}
              tableRows={tableRows} selectedVarOption={selectedVarOption}
            />
          )}
          {step === 2 && (
            <Step2
              intervals={intervals} selIntervalId={selIntervalId} setSelIntervalId={setSelIntervalId}
              rules={rules} setRules={setRules}
              currentFilterGroups={currentFilterGroups}
              filterGroupsMap={filterGroupsMap}
              onAddInterval={addInterval} onRemoveInterval={removeInterval}
              onAddFilterGroup={addFilterGroup} onRemoveFilterGroup={removeFilterGroup}
              onUpdateFilterGroup={updateFilterGroup}
              onAddFilter={addFilter} onRemoveFilter={removeFilter} onUpdateFilter={updateFilter}
              onRecalculatingChange={setRecalculating}
              onPasteFilterGroup={pasteFilterGroup}
            />
          )}
          {step === 3 && (
            <Step3 specModel={specModel} setSpecModel={setSpecModel} />
          )}
          {step === 4 && (
            <Step4
              paramValues={paramValues} setParamValues={setParamValues}
              paramTab={paramTab} setParamTab={setParamTab}
              baseData={baseData} variable={variable} specModel={specModel}
              intervals={intervals} onClose={handleClose}
            />
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderTop: '1px solid rgba(21,63,83,0.7)', flexShrink: 0, opacity: recalculating ? 0.4 : 1, pointerEvents: recalculating ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          {/* Left: BACK */}
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ ...btnBase, background: 'transparent', border: '1px solid #153f53', color: 'rgba(128,176,200,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#28779c'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#153f53'; e.currentTarget.style.color = 'rgba(128,176,200,0.7)'; }}
              >
                ← BACK
              </button>
            )}
          </div>
          {/* Right: CANCEL + NEXT/CONFIRM */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleClose}
              style={{ ...btnBase, background: 'transparent', border: '1px solid rgba(128,176,200,0.2)', color: 'rgba(128,176,200,0.55)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(128,176,200,0.45)'; e.currentTarget.style.color = 'rgba(128,176,200,0.85)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(128,176,200,0.2)'; e.currentTarget.style.color = 'rgba(128,176,200,0.55)'; }}
            >
              CANCEL
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext}
                style={{ ...btnBase, background: canNext ? 'rgba(0,70,102,0.7)' : 'rgba(0,40,60,0.4)', border: canNext ? '1px solid #28779c' : '1px solid #0e3a52', color: canNext ? '#ffffff' : 'rgba(128,176,200,0.25)', cursor: canNext ? 'pointer' : 'default' }}
                onMouseEnter={e => { if (canNext) e.currentTarget.style.background = 'rgba(0,90,130,0.8)'; }}
                onMouseLeave={e => { if (canNext) e.currentTarget.style.background = 'rgba(0,70,102,0.7)'; }}
              >
                NEXT →
              </button>
            ) : (
              <button
                onClick={!submitting ? handleConfirm : undefined}
                style={{ ...btnBase, background: submitting ? 'rgba(0,70,102,0.5)' : 'rgba(0,70,102,0.7)', border: '1px solid #28779c', color: '#ffffff', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.8 : 1, position: 'relative' }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = 'rgba(0,90,130,0.8)'; }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = 'rgba(0,70,102,0.7)'; }}
              >
                <span style={{ opacity: submitting ? 0 : 1 }}>CONFIRM</span>
                {submitting && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SpinnerIcon /></span>}
              </button>
            )}
          </div>
        </div>
      </div>

      {discardOpen && (
        <DiscardModal onCancel={() => setDiscardOpen(false)} onConfirm={handleConfirmDiscard} />
      )}
    </>
  );
}
