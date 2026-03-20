import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import CampaignDetailView from './CampaignDetailView';
import VehicleDetailView from './VehicleDetailView';

// ─── Status config (only valid test statuses) ─────────────────────────────────
const STATUS = {
  RUNNING:   { bg: 'rgba(40,119,156,0.18)',  color: '#28a0c8', dot: '#28a0c8' },
  COMPLETED: { bg: 'rgba(40,140,80,0.2)',    color: '#38b060', dot: '#38b060' },
  FAILED:    { bg: 'rgba(180,40,40,0.22)',   color: '#cc3333', dot: '#cc3333' },
};

// ─── Test campaigns (18, max 100 vehicles, no CREATED/CALCULATED) ─────────────
const TEST_CAMPAIGNS = [
  { id: 101, name: 'ECU Firmware v3.2 Validation',    vehicles: '87',  code: 'TC01', spec: 'ID_ECU.3.2_VAL_V1_2024-01-15_0900.xlsx',   measure: '',                  type: 'Partial', date: '15.01.2024', statuses: ['RUNNING']   },
  { id: 102, name: 'Brake Module Alpha Test',          vehicles: '42',  code: 'TC02', spec: '',                                          measure: 'ID_TEST_BRK_ALPHA', type: 'Full',    date: '22.02.2024', statuses: ['COMPLETED'] },
  { id: 103, name: 'Gateway Protocol Stress Test',     vehicles: '99',  code: 'TC01', spec: 'ID_GW.1.0_STRESS_2024-03-01_1100.xlsx',     measure: '',                  type: 'Partial', date: '01.03.2024', statuses: ['FAILED']    },
  { id: 104, name: 'Powertrain Calibration Beta',      vehicles: '56',  code: 'TC03', spec: '',                                          measure: 'ID_TEST_PWR_B2',    type: 'Full',    date: '12.03.2024', statuses: ['RUNNING']   },
  { id: 105, name: 'ABS System Integration Test',      vehicles: '33',  code: 'TC02', spec: 'ID_ABS.2.1_INT_2024-02-20_0820.xlsx',       measure: '',                  type: 'Partial', date: '20.02.2024', statuses: ['COMPLETED'] },
  { id: 106, name: 'Drive Unit OTA Smoke Test',        vehicles: '75',  code: 'TC01', spec: 'ID_OTA.4.0_SMOKE_2024-04-05_1430.xlsx',     measure: '',                  type: 'Partial', date: '05.04.2024', statuses: ['RUNNING']   },
  { id: 107, name: 'Charging System Regression',       vehicles: '18',  code: 'TC03', spec: '',                                          measure: 'ID_TEST_CHG_REG',   type: 'Full',    date: '17.04.2024', statuses: ['FAILED']    },
  { id: 108, name: 'Display Module Canary Test',       vehicles: '64',  code: 'TC02', spec: 'ID_DSP.1.5_CAN_2024-05-01_0745.xlsx',       measure: '',                  type: 'Partial', date: '01.05.2024', statuses: ['COMPLETED'] },
  { id: 109, name: 'HVAC Control Unit Test',           vehicles: '91',  code: 'TC01', spec: 'ID_HVAC.3.0_TEST_2024-05-14_1600.xlsx',     measure: '',                  type: 'Partial', date: '14.05.2024', statuses: ['RUNNING']   },
  { id: 110, name: 'Battery Management Pilot',         vehicles: '12',  code: 'TC03', spec: '',                                          measure: 'ID_TEST_BMS_P1',    type: 'Full',    date: '28.05.2024', statuses: ['FAILED']    },
  { id: 111, name: 'Telematics Unit Validation',       vehicles: '47',  code: 'TC02', spec: 'ID_TEL.2.2_VAL_2024-06-09_0930.xlsx',       measure: '',                  type: 'Partial', date: '09.06.2024', statuses: ['COMPLETED'] },
  { id: 112, name: 'Suspension ECU Hotfix Test',       vehicles: '83',  code: 'TC01', spec: 'ID_SUS.1.1_HF_2024-06-22_1145.xlsx',        measure: '',                  type: 'Partial', date: '22.06.2024', statuses: ['RUNNING']   },
  { id: 113, name: 'Climate Module Partial Test',      vehicles: '29',  code: 'TC03', spec: '',                                          measure: 'ID_TEST_CLI_PT',    type: 'Full',    date: '03.07.2024', statuses: ['COMPLETED'] },
  { id: 114, name: 'Infotainment System Alpha',        vehicles: '100', code: 'TC02', spec: 'ID_IFT.5.0_ALPHA_2024-07-15_0800.xlsx',     measure: '',                  type: 'Partial', date: '15.07.2024', statuses: ['FAILED']    },
  { id: 115, name: 'Door Lock Module Regression',      vehicles: '38',  code: 'TC01', spec: 'ID_DLK.0.9_REG_2024-07-29_1300.xlsx',       measure: '',                  type: 'Partial', date: '29.07.2024', statuses: ['RUNNING']   },
  { id: 116, name: 'Radar Sensor Calibration Test',    vehicles: '71',  code: 'TC03', spec: '',                                          measure: 'ID_TEST_RDR_CAL',   type: 'Full',    date: '08.08.2024', statuses: ['COMPLETED'] },
  { id: 117, name: 'Camera System OTA Test',           vehicles: '55',  code: 'TC02', spec: 'ID_CAM.2.0_OTA_2024-08-19_1015.xlsx',       measure: '',                  type: 'Partial', date: '19.08.2024', statuses: ['FAILED']    },
  { id: 118, name: 'Steering Control Unit Beta',       vehicles: '22',  code: 'TC01', spec: 'ID_STR.4.1_BETA_2024-09-01_0700.xlsx',      measure: '',                  type: 'Partial', date: '01.09.2024', statuses: ['RUNNING']   },
];

// RUNNING: 101,104,106,109,112,115,118 = 7 | COMPLETED: 102,105,108,111,113,116 = 6 | FAILED: 103,107,110,114,117 = 5
const TAB_TOTAL = { all: 18, active: 7, inactive: 11, mine: 4, attention: 5 };
const MINE_IDS  = new Set([101, 104, 107, 112]);

const TAB_FILTER = {
  all:       () => true,
  active:    r => r.statuses[0] === 'RUNNING',
  inactive:  r => ['FAILED', 'COMPLETED'].includes(r.statuses[0]),
  mine:      r => MINE_IDS.has(r.id),
  attention: r => r.statuses[0] === 'FAILED',
};

const TABS_TOP = [
  { id: 'all',       label: 'ALL',             count: TAB_TOTAL.all       },
  { id: 'active',    label: 'ACTIVE',           count: TAB_TOTAL.active    },
  { id: 'inactive',  label: 'INACTIVE',         count: TAB_TOTAL.inactive  },
  { id: 'attention', label: 'NEED ATTENTION',   count: TAB_TOTAL.attention },
  { id: 'mine',      label: 'MINE',             count: TAB_TOTAL.mine      },
];

const TABS_BOTTOM = [
  { id: 'CAMPAIGNS', label: 'CAMPAIGNS', tooltip: 'New Lab Campaign' },
  { id: 'VEHICLES',  label: 'VEHICLES',  tooltip: 'New Vehicle'       },
];

const BRAND_MODELS = {
  vw:    ['ID.3', 'ID.4', 'ID.4 GTX', 'ID.5', 'ID.7', 'Golf 8', 'Passat B9', 'Tiguan'],
  audi:  ['A3', 'A4 TFSI', 'A5', 'A6', 'Q3', 'Q4 e-tron', 'Q5', 'Q8 e-tron'],
  ford:  ['Focus', 'Mustang Mach-E', 'Puma ST', 'Kuga PHEV', 'Explorer PHEV', 'Transit Custom'],
  seat:  ['Ibiza FR', 'Leon e-Hybrid', 'Arona', 'Ateca', 'Tarraco'],
  skoda: ['Octavia iV', 'Superb iV', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq iV'],
  volvo: ['XC40 Recharge', 'XC60 T8', 'XC90 B5', 'V60 CC', 'C40 Recharge', 'S60 Recharge'],
};
const VEH_SW   = ['v2.4.1','v2.8.3','v3.0.0','v3.1.2','v3.2.4','v4.0.0','v4.1.1','v4.2.0'];
const VEH_CHIP = ['ECU-MQB-4.1','ECU-MQB-4.2','BMS-v2.0','BMS-v2.1','GW-1.4','GW-2.0','HVAC-3.1','NAV-2.5'];

function mkRng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}

function generateLabVehicles(brandId = 'vw') {
  const seed = brandId.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7) & 0x7fffffff;
  const rng = mkRng(seed);
  const models = BRAND_MODELS[brandId] || BRAND_MODELS.vw;
  const CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  return Array.from({ length: 100 }, (_, i) => {
    const vin   = Array.from({ length: 17 }, () => CHARS[Math.floor(rng() * CHARS.length)]).join('');
    const model = models[Math.floor(rng() * models.length)];
    const year  = 2023 + Math.floor(rng() * 4);
    const sw    = VEH_SW[Math.floor(rng() * VEH_SW.length)];
    const chip  = VEH_CHIP[Math.floor(rng() * VEH_CHIP.length)];
    const status = rng() > 0.22 ? 'Active' : 'Inactive';
    return { id: i + 1, vin, model, year, sw, chip, status };
  });
}

const VEH_STATUS_CFG = {
  Active:   { bg: 'rgba(40,140,80,0.2)',   color: '#38b060', dot: '#38b060' },
  Inactive: { bg: 'rgba(60,80,100,0.22)',  color: '#607890', dot: '#607890' },
};
function VehicleStatusBadge({ status }) {
  const cfg = VEH_STATUS_CFG[status] || VEH_STATUS_CFG.Inactive;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 8px', borderRadius:99, background:cfg.bg, fontSize:10, fontWeight:700, color:cfg.color, fontFamily:"'Inter',sans-serif", letterSpacing:0.5, whiteSpace:'nowrap' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.dot, flexShrink:0 }} />
      {status.toUpperCase()}
    </span>
  );
}

const VEH_COLUMNS = [
  { key: 'vin',    label: 'VIN',              flex: 2.5  },
  { key: 'model',  label: 'MODEL',            flex: 1.8  },
  { key: 'year',   label: 'PRODUCTION YEAR',  flex: 1.4  },
  { key: 'sw',     label: 'SOFTWARE VERSION', flex: 1.5  },
  { key: 'chip',   label: 'CHIP VERSION',     flex: 1.6  },
  { key: 'status', label: 'STATUS',           flex: 1.2  },
];

const VEH_TABS_TOP = [
  { id: 'all',      label: 'ALL'      },
  { id: 'active',   label: 'ACTIVE'   },
  { id: 'inactive', label: 'INACTIVE' },
];

// No VARIABLE column
const COLUMNS = [
  { key: 'name',     label: 'CAMPAIGN NAME',       flex: 3   },
  { key: 'vehicles', label: 'VEHICLES',             flex: 1   },
  { key: 'code',     label: 'SYSTEM CODE',          flex: 1.2 },
  { key: 'spec',     label: 'SPECIFICATION MODEL',  flex: 3   },
  { key: 'measure',  label: 'INTERNAL ID',          flex: 2.5 },
  { key: 'type',     label: 'UPDATE TYPE',          flex: 1.2 },
  { key: 'date',     label: 'START DATE',           flex: 1.4 },
  { key: 'statuses', label: 'STATUS',               flex: 2   },
];

const FILTER_STATUSES = ['RUNNING', 'COMPLETED', 'FAILED'];
const FILTER_TYPES    = ['Partial', 'Full'];
const FILTER_CODES    = ['TC01', 'TC02', 'TC03'];

const LOAD_STEPS_CAMPAIGN = ['Fetching campaign data', 'Loading vehicle statistics', 'Preparing test view'];
const LOAD_STEPS_BACK     = ['Syncing test results', 'Refreshing campaign list', 'Loading test updates'];
const LOAD_STEPS_VEHICLE  = ['Fetching vehicle record', 'Loading OTA history', 'Preparing vehicle view'];

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS['FAILED'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 99,
      background: cfg.bg, fontSize: 10, fontWeight: 600, color: cfg.color,
      fontFamily: "'Inter', sans-serif", letterSpacing: 0.3, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function SortArrow({ active, dir }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, marginLeft: 4, opacity: active ? 0.9 : 0.35 }}>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="currentColor" style={{ opacity: active && dir === 'asc' ? 0 : 1 }}>
        <path d="M3.5 0L7 5H0L3.5 0Z"/>
      </svg>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="currentColor" style={{ opacity: active && dir === 'desc' ? 0 : 1 }}>
        <path d="M3.5 5L0 0H7L3.5 5Z"/>
      </svg>
    </span>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.5)" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function BottomTab({ label, tooltip, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [plusHovered, setPlusHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPlusHovered(false); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 10px 7px 16px', borderRadius: 8,
        background: active ? '#004666' : hovered ? '#013d58' : 'rgba(1,45,66,0.6)',
        border: active ? '2px solid #28779c' : hovered ? '2px solid #1e6080' : '2px solid #153f53',
        color: active ? '#ffffff' : hovered ? '#ccdfe9' : 'rgba(128,176,200,0.7)',
        fontSize: 11, fontWeight: 700, cursor: 'pointer',
        fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase',
        boxShadow: active ? '0px 0px 8px 0px rgba(40,119,156,0.32)' : 'none',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s',
        position: 'relative',
      }}
    >
      {label}
      <span
        onMouseEnter={e => { e.stopPropagation(); setPlusHovered(true); }}
        onMouseLeave={e => { e.stopPropagation(); setPlusHovered(false); }}
        style={{
          width: 20, height: 20, borderRadius: 5,
          background: plusHovered ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s', position: 'relative',
        }}
      >
        <PlusIcon />
        {plusHovered && tooltip && (
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
      </span>
    </button>
  );
}

function TopTab({ tab, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '4px 10px', borderRadius: 6, border: 'none',
        background: active ? 'rgba(0,55,85,0.75)' : hovered ? 'rgba(0,70,102,0.18)' : 'transparent',
        color: active ? '#ffffff' : hovered ? 'rgba(128,176,200,0.9)' : 'rgba(128,176,200,0.6)',
        fontSize: 11, fontWeight: 600, cursor: 'pointer',
        fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {tab.label} <span style={{ opacity: 0.7 }}>({tab.count})</span>
    </button>
  );
}

function FilterPanel({ filters, onChange, activeFilterCount }) {
  const [resetHovered, setResetHovered] = useState(false);
  return (
    <div style={{
      display: 'flex', gap: 24, padding: '12px 16px',
      background: 'rgba(0,16,26,0.72)', borderBottom: '1px solid #153f53',
      flexWrap: 'wrap', alignItems: 'flex-start',
    }}>
      {/* Status */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", marginBottom: 6, textTransform: 'uppercase' }}>Status</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {FILTER_STATUSES.map(s => {
            const cfg = STATUS[s];
            const active = filters.statuses.includes(s);
            return (
              <span
                key={s}
                onClick={() => onChange({ ...filters, statuses: active ? filters.statuses.filter(x => x !== s) : [...filters.statuses, s] })}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', borderRadius: 99, cursor: 'pointer',
                  background: active ? cfg.bg : 'rgba(255,255,255,0.04)',
                  border: active ? `1px solid ${cfg.dot}` : '1px solid rgba(255,255,255,0.1)',
                  fontSize: 10, fontWeight: 600, color: active ? cfg.color : 'rgba(128,176,200,0.5)',
                  fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
              >
                {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />}
                {s}
              </span>
            );
          })}
        </div>
      </div>

      {/* Update Type */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", marginBottom: 6, textTransform: 'uppercase' }}>Update Type</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {FILTER_TYPES.map(t => {
            const active = filters.types.includes(t);
            return (
              <span
                key={t}
                onClick={() => onChange({ ...filters, types: active ? filters.types.filter(x => x !== t) : [...filters.types, t] })}
                style={{
                  padding: '2px 10px', borderRadius: 6, cursor: 'pointer',
                  background: active ? 'rgba(0,70,102,0.4)' : 'rgba(255,255,255,0.04)',
                  border: active ? '1px solid #28779c' : '1px solid rgba(255,255,255,0.1)',
                  fontSize: 10, fontWeight: 600,
                  color: active ? '#80d0f0' : 'rgba(128,176,200,0.5)',
                  fontFamily: "'Inter',sans-serif", transition: 'all 0.15s',
                }}
              >
                {t}
              </span>
            );
          })}
        </div>
      </div>

      {/* System Code */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", marginBottom: 6, textTransform: 'uppercase' }}>System Code</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {FILTER_CODES.map(c => {
            const active = filters.codes.includes(c);
            return (
              <span
                key={c}
                onClick={() => onChange({ ...filters, codes: active ? filters.codes.filter(x => x !== c) : [...filters.codes, c] })}
                style={{
                  padding: '2px 10px', borderRadius: 6, cursor: 'pointer',
                  background: active ? 'rgba(0,70,102,0.4)' : 'rgba(255,255,255,0.04)',
                  border: active ? '1px solid #28779c' : '1px solid rgba(255,255,255,0.1)',
                  fontSize: 10, fontWeight: 600,
                  color: active ? '#80d0f0' : 'rgba(128,176,200,0.5)',
                  fontFamily: "'Inter',sans-serif", transition: 'all 0.15s',
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
      </div>

      {/* Date range */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", marginBottom: 6, textTransform: 'uppercase' }}>Start Date</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="date" value={filters.dateFrom} onChange={e => onChange({ ...filters, dateFrom: e.target.value })} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 6px', fontSize: 10, color: 'rgba(128,176,200,0.7)', fontFamily: "'Inter',sans-serif", outline: 'none', colorScheme: 'dark' }} />
          <span style={{ fontSize: 10, color: 'rgba(128,176,200,0.4)' }}>—</span>
          <input type="date" value={filters.dateTo} onChange={e => onChange({ ...filters, dateTo: e.target.value })} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 6px', fontSize: 10, color: 'rgba(128,176,200,0.7)', fontFamily: "'Inter',sans-serif", outline: 'none', colorScheme: 'dark' }} />
        </div>
      </div>

      {/* Reset */}
      <span
        onClick={() => activeFilterCount > 0 && onChange({ statuses: [], types: [], codes: [], dateFrom: '', dateTo: '' })}
        onMouseEnter={() => activeFilterCount > 0 && setResetHovered(true)}
        onMouseLeave={() => setResetHovered(false)}
        style={{
          marginLeft: 'auto', alignSelf: 'flex-end',
          padding: '10px 18px', borderRadius: 8,
          cursor: activeFilterCount > 0 ? 'pointer' : 'default',
          background: activeFilterCount > 0 ? (resetHovered ? 'rgba(180,40,40,0.28)' : 'rgba(180,40,40,0.15)') : 'rgba(255,255,255,0.03)',
          border: activeFilterCount > 0 ? (resetHovered ? '1px solid rgba(180,40,40,0.75)' : '1px solid rgba(180,40,40,0.45)') : '1px solid rgba(255,255,255,0.08)',
          fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
          color: activeFilterCount > 0 ? (resetHovered ? '#ff8080' : '#e06060') : 'rgba(128,176,200,0.25)',
          fontFamily: "'Inter',sans-serif", transition: 'all 0.15s', userSelect: 'none',
        }}
      >
        Reset
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TestUpdatesView({ activeNav, onNavChange, activeBrand, onBrandChange, onLogout }) {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loadingCampaign, setLoadingCampaign] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(null);
  const [loadingBack, setLoadingBack] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState('all');
  const [activeBottomTab, setActiveBottomTab] = useState('CAMPAIGNS');
  const [searchValue, setSearchValue] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterHovered, setFilterHovered] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [filters, setFilters] = useState({ statuses: [], types: [], codes: [], dateFrom: '', dateTo: '' });
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [hoveredCol, setHoveredCol] = useState(null);
  const [loadSubtitle, setLoadSubtitle] = useState('Returning to Lab');

  const [vehicleTopTab, setVehicleTopTab] = useState('all');
  const [vehicleSort, setVehicleSort] = useState({ key: 'id', dir: 'asc' });
  const [vehicleHovCol, setVehicleHovCol] = useState(null);

  const allVehicles = useMemo(() => generateLabVehicles(activeBrand?.id || 'vw'), [activeBrand?.id]);

  const filteredVehicles = useMemo(() => {
    const sl = searchValue.trim().toLowerCase();
    return allVehicles
      .filter(v => {
        if (vehicleTopTab === 'active')   return v.status === 'Active';
        if (vehicleTopTab === 'inactive') return v.status === 'Inactive';
        return true;
      })
      .filter(v => !sl || [v.vin, v.model, String(v.year), v.sw, v.chip, v.status].some(f => f.toLowerCase().includes(sl)));
  }, [allVehicles, vehicleTopTab, searchValue]);

  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      const va = String(a[vehicleSort.key] ?? '');
      const vb = String(b[vehicleSort.key] ?? '');
      const cmp = va.localeCompare(vb, undefined, { numeric: true });
      return vehicleSort.dir === 'asc' ? cmp : -cmp;
    });
  }, [filteredVehicles, vehicleSort]);

  function handleVehicleColSort(key) {
    setVehicleSort(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  }

  const vehActiveCount   = allVehicles.filter(v => v.status === 'Active').length;
  const vehInactiveCount = allVehicles.filter(v => v.status === 'Inactive').length;

  function handleVehicleOpen(v) {
    setLoadingVehicle(v);
    setLoadStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
    setTimeout(() => setLoadStep(1), 450);
    setTimeout(() => setLoadStep(2), 900);
    setTimeout(() => setLoaderVisible(false), 1300);
    setTimeout(() => { setLoadingVehicle(null); setSelectedVehicle(v); }, 1600);
  }

  function handleCampaignOpen(row) {
    setLoadingCampaign(row);
    setLoadStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
    setTimeout(() => setLoadStep(1), 450);
    setTimeout(() => setLoadStep(2), 900);
    setTimeout(() => setLoaderVisible(false), 1300);
    setTimeout(() => { setLoadingCampaign(null); setSelectedCampaign(row); }, 1600);
  }

  function triggerBackLoader(subtitle, onDone) {
    setLoadSubtitle(subtitle);
    setLoadingBack(true);
    setLoadStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
    setTimeout(() => setLoadStep(1), 450);
    setTimeout(() => setLoadStep(2), 900);
    setTimeout(() => setLoaderVisible(false), 1300);
    setTimeout(() => { setLoadingBack(false); setLoadStep(0); if (onDone) onDone(); }, 1600);
  }

  function handleCampaignBack() {
    setSelectedCampaign(null);
    triggerBackLoader('Returning to Lab');
  }

  function handleExternalNavChange(nav) {
    setSelectedCampaign(null);
    triggerBackLoader(nav === 'aftersales' ? 'Loading Field' : 'Returning to Lab', () => onNavChange(nav));
  }

  if (selectedVehicle) {
    return <VehicleDetailView
      vehicle={selectedVehicle}
      onBack={() => setSelectedVehicle(null)}
      onNavChange={nav => { setSelectedVehicle(null); onNavChange(nav); }}
      activeBrand={activeBrand}
      onBrandChange={onBrandChange}
      onLogout={onLogout}
    />;
  }

  if (selectedCampaign) {
    return <CampaignDetailView campaign={selectedCampaign} onBack={handleCampaignBack} activeBrand={activeBrand} onBrandChange={onBrandChange} onLogout={onLogout} isTest onExternalNavChange={handleExternalNavChange} />;
  }

  const LoaderScreen = ({ steps, title, subtitle }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100vw', height: '100vh',
      background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)',
      backgroundColor: '#003050',
    }}>
      <div style={{ opacity: loaderVisible ? 1 : 0, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center' }}>
          {subtitle && <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5, marginBottom: 6 }}>{subtitle}</div>}
          {title && <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.3 }}>{title}</div>}
        </div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(128,176,200,0.15)', borderTopColor: '#28a0c8', animation: 'iteruSpin 0.85s linear infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {steps.map((s, i) => (
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

  if (loadingBack)     return <LoaderScreen steps={LOAD_STEPS_BACK}     subtitle={loadSubtitle} />;
  if (loadingCampaign) return <LoaderScreen steps={LOAD_STEPS_CAMPAIGN} subtitle="Loading campaign" title={loadingCampaign.name} />;
  if (loadingVehicle)  return <LoaderScreen steps={LOAD_STEPS_VEHICLE}  subtitle="Loading vehicle"  title={loadingVehicle.vin} />;

  const searchLower = searchValue.trim().toLowerCase();
  const tabFiltered = TEST_CAMPAIGNS
    .filter(TAB_FILTER[activeTopTab] ?? TAB_FILTER.all)
    .filter(r => {
      if (filters.statuses.length && !filters.statuses.includes(r.statuses[0])) return false;
      if (filters.types.length   && !filters.types.includes(r.type))            return false;
      if (filters.codes.length   && !filters.codes.includes(r.code))            return false;
      if (filters.dateFrom) { const [d,m,y] = r.date.split('.'); if (new Date(`${y}-${m}-${d}`) < new Date(filters.dateFrom)) return false; }
      if (filters.dateTo)   { const [d,m,y] = r.date.split('.'); if (new Date(`${y}-${m}-${d}`) > new Date(filters.dateTo))   return false; }
      if (!searchLower) return true;
      return [r.name, r.code, r.spec, r.measure, r.type, r.date, r.statuses[0], r.vehicles]
        .some(v => v.toLowerCase().includes(searchLower));
    });

  const sortedCampaigns = [...tabFiltered].sort((a, b) => {
    const va = String(a[sort.key] ?? '');
    const vb = String(b[sort.key] ?? '');
    const cmp = va.localeCompare(vb, undefined, { numeric: true });
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  function handleColSort(key) {
    setSort(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  }

  const activeFilterCount =
    filters.statuses.length + filters.types.length + filters.codes.length +
    (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0);

  const headerCell = {
    fontSize: 10, fontWeight: 700, color: 'rgba(128,176,200,0.6)',
    fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase',
    padding: '0 12px', whiteSpace: 'nowrap',
  };

  const cell = {
    fontSize: 11, fontWeight: 500, color: '#ccdfe9',
    fontFamily: "'Inter', sans-serif", padding: '0 12px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)',
      backgroundColor: '#003050',
      padding: 24, gap: 24, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      <Sidebar activeNav={activeNav} onNavChange={nav => { if (nav !== activeNav) triggerBackLoader(nav === 'aftersales' ? 'Loading Field' : 'Returning to Lab', () => onNavChange(nav)); }} attentionCount={11} testAttentionCount={TAB_TOTAL.attention} activeBrand={activeBrand} onBrandChange={onBrandChange} onLogout={onLogout}
        onOpenCampaign={(campaignId, isTest) => {
          if (isTest) { const c = TEST_CAMPAIGNS.find(x => x.id === campaignId); if (c) handleCampaignOpen(c); }
          else { triggerBackLoader('Loading Field', () => onNavChange('aftersales')); }
        }}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, position: 'relative' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", whiteSpace: 'nowrap', letterSpacing: 0.3 }}>
            Lab
          </span>

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }} />

          {/* Top tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {activeBottomTab === 'VEHICLES' ? (
              VEH_TABS_TOP.map(tab => {
                const count = tab.id === 'all' ? allVehicles.length : tab.id === 'active' ? vehActiveCount : vehInactiveCount;
                return (
                  <TopTab
                    key={tab.id}
                    tab={{ ...tab, count }}
                    active={vehicleTopTab === tab.id}
                    onClick={() => setVehicleTopTab(tab.id)}
                  />
                );
              })
            ) : (
              <>
                {TABS_TOP.map((tab, i) => (
                  <React.Fragment key={tab.id}>
                    {tab.id === 'mine' && <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)', marginInline: 4 }} />}
                    <TopTab tab={tab} active={activeTopTab === tab.id} onClick={() => setActiveTopTab(tab.id)} />
                  </React.Fragment>
                ))}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setFilterOpen(o => !o)}
                    onMouseEnter={() => setFilterHovered(true)}
                    onMouseLeave={() => setFilterHovered(false)}
                    style={{
                      width: 28, height: 28, borderRadius: 6, border: 'none',
                      background: filterOpen ? 'rgba(0,50,80,0.65)' : filterHovered ? 'rgba(0,70,102,0.2)' : 'transparent',
                      color: filterOpen ? '#80d0f0' : filterHovered ? 'rgba(128,176,200,0.9)' : 'rgba(128,176,200,0.6)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    <FilterIcon />
                    {activeFilterCount > 0 && (
                      <div style={{
                        position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: 8,
                        background: '#cc4422', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: "'Inter', sans-serif",
                        boxShadow: '0 2px 6px rgba(180,40,20,0.55), 0 1px 2px rgba(0,0,0,0.3)', pointerEvents: 'none',
                      }}>
                        {activeFilterCount}
                      </div>
                    )}
                  </button>
                  {filterHovered && !filterOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                      marginTop: 4, padding: '3px 8px', borderRadius: 4,
                      background: '#012d42', border: '1px solid #153f53',
                      fontSize: 10, fontWeight: 600, color: '#80b0c8',
                      fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
                    }}>
                      Filtering
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div
            onMouseEnter={() => setSearchHovered(true)}
            onMouseLeave={() => setSearchHovered(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 32, padding: '0 12px',
              background: searchHovered ? 'rgba(0,70,102,0.28)' : 'rgba(0,70,102,0.16)',
              border: searchHovered ? '1px solid #28779c' : '1px solid #16506c',
              borderRadius: 6, minWidth: 200,
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            <SearchIcon />
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontSize: 12, fontWeight: 500, color: '#ffffff',
                fontFamily: "'Inter', sans-serif", caretColor: '#ffffff', width: '100%',
              }}
              className="dashboard-search"
            />
            {searchValue && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setSearchValue('')}
                  style={{ background: 'none', border: 'none', padding: '2px 2px 0', cursor: 'pointer', color: 'rgba(128,176,200,0.5)', display: 'flex', alignItems: 'center', lineHeight: 1, transition: 'color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(128,176,200,1)'; e.currentTarget.parentNode.querySelector('.search-clear-tip').style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(128,176,200,0.5)'; e.currentTarget.parentNode.querySelector('.search-clear-tip').style.opacity = '0'; }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <div className="search-clear-tip" style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', padding: '3px 7px', borderRadius: 4, background: '#012d42', border: '1px solid #153f53', fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.15s', zIndex: 10 }}>
                  Clear
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table area */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'rgba(1,45,66,0.6)', border: '1px solid #153f53',
          borderRadius: 16, overflow: 'hidden',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          {activeBottomTab === 'CAMPAIGNS' ? (
            <>
              <div className={`filter-panel-wrapper${filterOpen ? ' open' : ''}`}>
                <div className="filter-panel-inner">
                  <FilterPanel filters={filters} onChange={setFilters} activeFilterCount={activeFilterCount} />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 64 }}>
                {/* Header row */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  height: 40, flexShrink: 0, borderBottom: '1px solid #153f53',
                  background: 'rgb(1, 41, 64)', position: 'sticky', top: 0, zIndex: 1,
                }}>
                  {COLUMNS.map(col => {
                    const isActive = sort.key === col.key;
                    const isHovered = hoveredCol === col.key;
                    return (
                      <div
                        key={col.key}
                        onClick={() => handleColSort(col.key)}
                        onMouseEnter={() => setHoveredCol(col.key)}
                        onMouseLeave={() => setHoveredCol(null)}
                        style={{
                          ...headerCell, flex: col.flex, minWidth: 0,
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          color: isActive ? 'rgba(128,176,200,0.95)' : isHovered ? 'rgba(128,176,200,0.8)' : 'rgba(128,176,200,0.6)',
                          userSelect: 'none', transition: 'color 0.15s',
                        }}
                      >
                        {col.label}
                        {(isActive || isHovered) && <SortArrow active={isActive} dir={sort.dir} />}
                      </div>
                    );
                  })}
                </div>

                {sortedCampaigns.length === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, padding: '48px 0' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.25)" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif" }}>No results found</div>
                    <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(128,176,200,0.3)', fontFamily: "'Inter', sans-serif" }}>Try adjusting your search or filters</div>
                  </div>
                )}

                {sortedCampaigns.map((row, i) => {
                  const baseBg = i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)';
                  const hoverBg = 'rgba(0,70,102,0.2)';
                  return (
                    <div
                      key={row.id}
                      style={{
                        display: 'flex', alignItems: 'center',
                        height: 32, flexShrink: 0,
                        borderBottom: '1px solid rgba(21,63,83,0.5)',
                        borderLeft: '2px solid transparent',
                        background: baseBg, cursor: 'pointer', transition: 'background 0.1s',
                      }}
                      onClick={() => handleCampaignOpen(row)}
                      onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = baseBg}
                    >
                      <div style={{ flex: 3, minWidth: 0, padding: '0 12px' }}>
                        <div title={row.name} style={{ ...cell, padding: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</div>
                      </div>
                      <div style={{ ...cell, flex: 1, minWidth: 0 }}>{row.vehicles}</div>
                      <div style={{ ...cell, flex: 1.2, minWidth: 0 }}>{row.code}</div>
                      <div style={{ flex: 3, minWidth: 0, padding: '0 12px' }}>
                        <div title={row.spec || '–'} style={{ ...cell, padding: 0, fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.spec || '–'}</div>
                      </div>
                      <div style={{ flex: 2.5, minWidth: 0, padding: '0 12px' }}>
                        <div title={row.measure || '–'} style={{ ...cell, padding: 0, fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.measure || '–'}</div>
                      </div>
                      <div style={{ ...cell, flex: 1.2, minWidth: 0 }}>{row.type}</div>
                      <div style={{ ...cell, flex: 1.4, minWidth: 0 }}>{row.date}</div>
                      <div style={{ flex: 2, minWidth: 0, padding: '0 8px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                        <StatusBadge status={row.statuses[0]} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* VEHICLES TABLE */
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 64 }}>
              {/* Header row */}
              <div style={{
                display: 'flex', alignItems: 'center',
                height: 40, flexShrink: 0, borderBottom: '1px solid #153f53',
                background: 'rgb(1, 41, 64)', position: 'sticky', top: 0, zIndex: 1,
              }}>
                {VEH_COLUMNS.map(col => {
                  const isActive = vehicleSort.key === col.key;
                  const isHovered = vehicleHovCol === col.key;
                  return (
                    <div
                      key={col.key}
                      onClick={() => handleVehicleColSort(col.key)}
                      onMouseEnter={() => setVehicleHovCol(col.key)}
                      onMouseLeave={() => setVehicleHovCol(null)}
                      style={{
                        ...headerCell, flex: col.flex, minWidth: 0,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        color: isActive ? 'rgba(128,176,200,0.95)' : isHovered ? 'rgba(128,176,200,0.8)' : 'rgba(128,176,200,0.6)',
                        userSelect: 'none', transition: 'color 0.15s',
                      }}
                    >
                      {col.label}
                      {(isActive || isHovered) && <SortArrow active={isActive} dir={vehicleSort.dir} />}
                    </div>
                  );
                })}
              </div>

              {sortedVehicles.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, padding: '48px 0' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.25)" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif" }}>No vehicles found</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(128,176,200,0.3)', fontFamily: "'Inter', sans-serif" }}>Try adjusting your search or filter</div>
                </div>
              )}

              {sortedVehicles.map((v, i) => {
                const baseBg = i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)';
                const hoverBg = 'rgba(0,70,102,0.2)';
                return (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex', alignItems: 'center',
                      height: 32, flexShrink: 0,
                      borderBottom: '1px solid rgba(21,63,83,0.5)',
                      background: baseBg, transition: 'background 0.1s', cursor: 'pointer',
                    }}
                    onClick={() => handleVehicleOpen(v)}
                    onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = baseBg}
                  >
                    <div style={{ flex: 2.5, minWidth: 0, padding: '0 12px' }}>
                      <div title={v.vin} style={{ ...cell, padding: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.vin}</div>
                    </div>
                    <div style={{ ...cell, flex: 1.8, minWidth: 0 }}>{v.model}</div>
                    <div style={{ ...cell, flex: 1.4, minWidth: 0 }}>{v.year}</div>
                    <div style={{ ...cell, flex: 1.5, minWidth: 0, color: 'rgba(128,176,200,0.85)', fontSize: 11 }}>{v.sw}</div>
                    <div style={{ ...cell, flex: 1.6, minWidth: 0, color: 'rgba(128,176,200,0.85)', fontSize: 10 }}>{v.chip}</div>
                    <div style={{ flex: 1.2, minWidth: 0, padding: '0 8px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                      <VehicleStatusBadge status={v.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom floating bar — no VARIABLES tab */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 8px', borderRadius: 14,
          background: 'rgba(1,45,66,0.75)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #153f53', boxShadow: '0px 8px 32px rgba(0,0,0,0.48)',
          animation: 'floatingBarEnter 0.45s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          {TABS_BOTTOM.map(tab => (
            <BottomTab key={tab.id} label={tab.label} tooltip={tab.tooltip} active={activeBottomTab === tab.id} onClick={() => setActiveBottomTab(tab.id)} />
          ))}
        </div>

      </div>
    </div>
  );
}
