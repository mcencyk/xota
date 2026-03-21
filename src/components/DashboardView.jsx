import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CampaignDetailView from './CampaignDetailView';
import TestUpdatesView from './TestUpdatesView';

// ─── Status badge config ────────────────────────────────────────────────────
const STATUS = {
  RUNNING:          { bg: 'rgba(40,119,156,0.18)',  color: '#28a0c8', dot: '#28a0c8' },
  CREATED:          { bg: 'rgba(100,140,165,0.2)',   color: '#80b0c8', dot: '#80b0c8' },
  DRAFT:            { bg: 'rgba(170,135,25,0.22)',   color: '#c8a028', dot: '#c8a028' },
  COMPLETED:        { bg: 'rgba(40,140,80,0.2)',     color: '#38b060', dot: '#38b060' },
  FAILED:           { bg: 'rgba(180,40,40,0.22)',    color: '#cc3333', dot: '#cc3333' },
  CALCULATED:       { bg: 'rgba(80,110,130,0.2)',    color: '#607890', dot: '#607890' },
};

// ─── Mock data ───────────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { id: 1,  name: 'Middle Europe Critical Bug Fix',    vehicles: '2 382',  code: 'FA01', crit: '01', spec: 'ID_ECU.4.1.2_ME_V3_0-1_R2_2023-11-14_0832.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['RUNNING'] },
  { id: 2,  name: 'East Europe Brake Calibration',     vehicles: '312',    code: 'SE03', crit: '03', spec: 'ID_BRK.2.0.1_EE_K4_V1_0-3_2024-01-08_1340.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['RUNNING'] },
  { id: 3,  name: 'Middle East Fleet Diagnostic',      vehicles: '645',    code: 'FA01', crit: '01', spec: 'ID_DGN.5.3.0_ME_V2_1-0_R1_2022-07-19_0915.xlsx', measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['CREATED'] },
  { id: 4,  name: 'North America Software Update',     vehicles: '462',    code: 'FA01', crit: '01', spec: 'ID_SW.6.0.4_NA_K2_V5_2-1_2023-03-27_1628.xlsx',  measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['RUNNING'] },
  { id: 5,  name: 'Nordic Region Gateway Update',      vehicles: '5 686',  code: 'FA01', crit: '01', spec: 'ID_GW.1.8.3_NR_V4_0-2_R3_2024-02-11_0743.xlsx', measure: '',                type: 'Partial', date: '12.07.2024', statuses: ['DRAFT'] },
  { id: 6,  name: 'West Europe Performance Fix',       vehicles: '6 387',  code: 'KE05', crit: '05', spec: '',                                                measure: 'ID_DEMO_04.10.23',   type: 'Full',  date: '21.04.2024', statuses: ['COMPLETED'] },
  { id: 7,  name: 'Central Europe Critical Hotfix',    vehicles: '52',     code: 'SE03', crit: '05', spec: 'ID_HF.3.2.1_CE_K1_V2_1-4_2023-08-30_1105.xlsx', measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['RUNNING'] },
  { id: 8,  name: 'Turkey Region Software Patch',      vehicles: '7 536',  code: 'PU01', crit: '01', spec: '',                                                measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 9,  name: 'Pacific Region ECU Calibration',    vehicles: '84 563', code: 'FA01', crit: '01', spec: 'ID_ECU.7.0.2_PR_V6_3-0_R1_2023-06-05_1552.xlsx', measure: '',                type: 'Partial', date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 10, name: 'Baltic Region Brake Calibration',   vehicles: '5 756',  code: 'SE03', crit: '03', spec: 'ID_BRK.4.1.0_BR_K3_V1_0-5_2022-12-01_0820.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['COMPLETED'] },
  { id: 11, name: 'Iberia Powertrain Optimization',    vehicles: '82',     code: 'PU01', crit: '01', spec: '',                                                measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 12, name: 'Alpine Region Software Patch',      vehicles: '74',     code: 'KE05', crit: '05', spec: '',                                                measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 13, name: 'Canada East Drive System Update',   vehicles: '3 678',  code: 'FA01', crit: '01', spec: 'ID_DRV.2.5.3_CA_V3_1-2_R2_2023-09-18_1437.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['FAILED'] },
  { id: 14, name: 'DACH Region Critical Hotfix',       vehicles: '253',    code: 'FA01', crit: '01', spec: 'ID_HF.5.0.1_DC_K2_V4_0-1_2024-03-03_0911.xlsx',  measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['RUNNING'] },
  { id: 15, name: 'US West Coast Fleet Update',        vehicles: '85 365', code: 'FA01', crit: '01', spec: 'ID_FLT.8.2.0_US_V7_2-3_R1_2022-10-25_1300.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['COMPLETED'] },
  { id: 16, name: 'Mexico Distribution Firmware',      vehicles: '634',    code: 'FA01', crit: '01', spec: 'ID_FW.1.4.6_MX_K1_V2_0-4_2023-04-14_0756.xlsx',  measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['COMPLETED'] },
  { id: 17, name: 'Southeast Asia Software Full',      vehicles: '754',    code: 'PU01', crit: '01', spec: '',                                                measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 18, name: 'Scandinavia Performance Full',      vehicles: '8 464',  code: 'KE05', crit: '05', spec: '',                                                measure: 'ID_DEMO_04.10.23',   type: 'Full',  date: '12.07.2024', statuses: ['FAILED'] },
  { id: 19, name: 'Australia Pacific ECU Update',      vehicles: '1 633',  code: 'PU01', crit: '01', spec: '',                                                measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '21.04.2024', statuses: ['RUNNING'] },
  { id: 20, name: 'Eastern Europe Drivetrain Fix',     vehicles: '8 674',  code: 'SE03', crit: '03', spec: 'ID_DRV.3.3.2_EE_V5_1-0_R4_2024-01-22_1618.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['CREATED'] },
  { id: 21, name: 'France Region Software Patch',      vehicles: '85',     code: 'FA01', crit: '01', spec: 'ID_SW.2.9.1_FR_K3_V1_0-2_2023-07-07_0848.xlsx',  measure: '',                type: 'Partial', date: '12.07.2024', statuses: ['COMPLETED'] },
  { id: 22, name: 'US East Coast ECU Calibration',     vehicles: '63',     code: 'FA01', crit: '01', spec: 'ID_ECU.6.1.4_US_V2_0-3_R2_2022-11-30_1024.xlsx', measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['CALCULATED'] },
  { id: 23, name: 'Brazil South Fleet Firmware',       vehicles: '264',    code: 'FA01', crit: '01', spec: 'ID_FW.4.0.7_BR_K4_V3_1-1_2023-02-16_1349.xlsx',  measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['CALCULATED'] },
  { id: 24, name: 'Japan Region ECU Full Update',      vehicles: '12 345', code: 'FA01', crit: '02', spec: 'ID_ECU.9.1.0_JP_V5_2-1_R3_2024-04-18_1004.xlsx', measure: '',                type: 'Partial', date: '18.04.2024', statuses: ['RUNNING'] },
  { id: 25, name: 'Italy Network Firmware Patch',      vehicles: '891',    code: 'KE05', crit: '05', spec: '',                                                measure: 'ID_DEMO_15.03.24',   type: 'Full',  date: '15.03.2024', statuses: ['COMPLETED'] },
  { id: 26, name: 'Poland Regional Drive Fix',         vehicles: '3 241',  code: 'SE03', crit: '03', spec: 'ID_DRV.1.2.4_PL_K2_V3_0-1_2023-11-09_0732.xlsx', measure: '',                type: 'Partial', date: '09.11.2023', statuses: ['FAILED'] },
  { id: 27, name: 'UK Fleet Powertrain Update',        vehicles: '47 821', code: 'PU01', crit: '01', spec: '',                                                measure: 'ID_FINAL_22.01.24',  type: 'Full',  date: '22.01.2024', statuses: ['RUNNING'] },
  { id: 28, name: 'South Korea Brake Module Fix',      vehicles: '2 067',  code: 'SE03', crit: '03', spec: 'ID_BRK.6.0.2_KR_V4_1-3_R2_2023-05-30_1521.xlsx', measure: '',                type: 'Partial', date: '30.05.2023', statuses: ['COMPLETED'] },
  { id: 29, name: 'Argentina Fleet Diagnostic',        vehicles: '523',    code: 'FA01', crit: '01', spec: 'ID_DGN.3.1.7_AR_K1_V2_0-2_2024-06-12_0855.xlsx', measure: '',                type: 'Partial', date: '12.06.2024', statuses: ['DRAFT'] },
  { id: 30, name: 'China North Gateway Patch',         vehicles: '18 492', code: 'KE05', crit: '05', spec: '',                                                measure: 'ID_DEMO_08.09.23',   type: 'Full',  date: '08.09.2023', statuses: ['RUNNING'] },
  { id: 31, name: 'Netherlands Critical Hotfix',       vehicles: '178',    code: 'FA01', crit: '01', spec: 'ID_HF.2.4.3_NL_K3_V1_0-1_2024-02-27_1233.xlsx', measure: '',                type: 'Partial', date: '27.02.2024', statuses: ['CREATED'] },
  { id: 32, name: 'India South ECU Calibration',       vehicles: '9 304',  code: 'FA01', crit: '02', spec: 'ID_ECU.5.2.8_IN_V3_1-4_R1_2023-08-14_0647.xlsx', measure: '',                type: 'Partial', date: '14.08.2023', statuses: ['COMPLETED'] },
  { id: 33, name: 'Spain East Software Update',        vehicles: '654',    code: 'PU01', crit: '01', spec: '',                                                measure: 'ID_FINAL_17.05.24',  type: 'Full',  date: '17.05.2024', statuses: ['RUNNING'] },
  { id: 34, name: 'Russia West Fleet Firmware',        vehicles: '4 112',  code: 'SE03', crit: '03', spec: 'ID_FW.7.3.1_RU_K4_V5_2-0_2023-12-20_1118.xlsx', measure: '',                type: 'Partial', date: '20.12.2023', statuses: ['CALCULATED'] },
  { id: 35, name: 'Vietnam Fleet Drivetrain Fix',      vehicles: '267',    code: 'FA01', crit: '01', spec: 'ID_DRV.4.0.5_VN_K1_V2_1-3_2023-06-28_0930.xlsx', measure: '',                type: 'Partial', date: '28.06.2023', statuses: ['FAILED'] },
  { id: 36, name: 'Egypt Region Software Hotfix',      vehicles: '1 893',  code: 'KE05', crit: '05', spec: '',                                                measure: 'ID_DEMO_30.11.23',   type: 'Full',  date: '30.11.2023', statuses: ['RUNNING'] },
  { id: 37, name: 'Thailand Gateway Calibration',      vehicles: '732',    code: 'FA01', crit: '01', spec: 'ID_GW.3.5.0_TH_V2_0-1_R1_2024-03-09_1445.xlsx', measure: '',                type: 'Partial', date: '09.03.2024', statuses: ['COMPLETED'] },
  { id: 38, name: 'South Africa Brake System',         vehicles: '4 562',  code: 'SE03', crit: '03', spec: 'ID_BRK.5.1.3_ZA_K2_V4_1-0_2024-07-01_0812.xlsx', measure: '',                type: 'Partial', date: '01.07.2024', statuses: ['DRAFT'] },
  { id: 39, name: 'Czech Fleet ECU Diagnostic',        vehicles: '836',    code: 'FA01', crit: '02', spec: 'ID_DGN.6.2.1_CZ_K3_V1_0-3_2023-10-15_1556.xlsx', measure: '',                type: 'Partial', date: '15.10.2023', statuses: ['CREATED'] },
];

const TAB_TOTAL = { all: 39, active: 23, inactive: 16, mine: 8, attention: 11 };

const MINE_IDS = new Set([1, 2, 4, 13, 22, 23, 26, 31]);

const TAB_FILTER = {
  all:       () => true,
  active:    r => ['RUNNING', 'CALCULATED', 'CREATED'].includes(r.statuses[0]),
  inactive:  r => ['FAILED', 'DRAFT', 'COMPLETED'].includes(r.statuses[0]),
  mine:      r => MINE_IDS.has(r.id),
  attention: r => ['FAILED', 'CREATED', 'CALCULATED'].includes(r.statuses[0]),
};

const TABS_TOP = [
  { id: 'all', label: 'ALL', count: 39 },
  { id: 'active', label: 'ACTIVE', count: 23 },
  { id: 'inactive', label: 'INACTIVE', count: 16 },
  { id: 'attention', label: 'NEED ATTENTION', count: 11 },
  { id: 'mine', label: 'MINE', count: 8 },
];

const TABS_BOTTOM = [
  { id: 'CAMPAIGNS',  label: 'CAMPAIGNS',  tooltip: 'New Campaign' },
  { id: 'CRITERIONS', label: 'VARIABLES', tooltip: 'New Variable' },
];

const VARIABLES_DATA = [
  { code: '01', name: 'ECU Firmware Baseline Config',    created: '10.01.2024', modified: '15.03.2024', source: 'ECU_BASE_CFG_v1.xlsx',  author: 'Jonathan Blackwell',    type: 'Manual', campaigns: 4, status: 'Active'     },
  { code: '02', name: 'Brake Module Calibration Set',    created: '22.01.2024', modified: '22.01.2024', source: 'BRK_CAL_v2.xlsx',       author: 'Natalia Ferreira',      type: 'Import', campaigns: 2, status: 'Active'     },
  { code: '03', name: 'Gateway Protocol Parameters',     created: '01.02.2024', modified: '01.03.2024', source: 'GW_PARAMS_2024.csv',    author: 'Hiroshi Tanaka',        type: 'Import', campaigns: 3, status: 'Active'     },
  { code: '04', name: 'Powertrain Calibration Baseline', created: '12.02.2024', modified: '12.02.2024', source: 'PWR_CAL_BASE_2024.csv', author: 'Jonathan Blackwell',    type: 'Manual', campaigns: 1, status: 'Active'     },
  { code: '05', name: 'ABS Thresholds v2.1',             created: '20.02.2024', modified: '05.04.2024', source: 'ABS_THRESH_v2.1.xlsx',  author: 'Amélie Duchamp',        type: 'Import', campaigns: 5, status: 'Active'     },
  { code: '06', name: 'Drive Unit OTA Parameters',       created: '05.03.2024', modified: '05.03.2024', source: 'OTA_DU_PARAMS.csv',     author: 'Natalia Ferreira',      type: 'Import', campaigns: 3, status: 'Active'     },
  { code: '07', name: 'Charging System Config Set',      created: '17.03.2024', modified: '17.03.2024', source: 'CHG_SYS_CFG_v3.xlsx',   author: 'Sebastian Müller',      type: 'Manual', campaigns: 2, status: 'Active'     },
  { code: '08', name: 'Display Module Variables',        created: '01.04.2024', modified: '20.05.2024', source: 'DSP_VARS_1.5.xlsx',     author: 'Hiroshi Tanaka',        type: 'Import', campaigns: 1, status: 'Deprecated' },
  { code: '09', name: 'HVAC Control Parameters',         created: '14.04.2024', modified: '14.04.2024', source: 'HVAC_CTRL_v3.csv',      author: 'Amélie Duchamp',        type: 'Import', campaigns: 2, status: 'Active'     },
];

const VAR_COLUMNS = [
  { key: 'code',      label: 'CODE',          flex: 0.7  },
  { key: 'name',      label: 'VARIABLE NAME', flex: 2.8  },
  { key: 'created',   label: 'CREATED',       flex: 1.3  },
  { key: 'modified',  label: 'LAST MODIFIED', flex: 1.3  },
  { key: 'source',    label: 'SOURCE',        flex: 2.2  },
  { key: 'author',    label: 'AUTHOR',        flex: 1.5  },
  { key: 'type',      label: 'TYPE',          flex: 1    },
  { key: 'campaigns', label: 'CAMPAIGNS',     flex: 1    },
  { key: 'status',    label: 'STATUS',        flex: 1.2  },
];

const VAR_STATUS_CFG = {
  Active:     { bg: 'rgba(40,140,80,0.2)',  color: '#38b060', dot: '#38b060' },
  Deprecated: { bg: 'rgba(60,80,100,0.22)', color: '#607890', dot: '#607890' },
};
function VarStatusBadge({ status }) {
  const cfg = VAR_STATUS_CFG[status] || VAR_STATUS_CFG.Deprecated;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 8px', borderRadius:99, background:cfg.bg, fontSize:10, fontWeight:700, color:cfg.color, fontFamily:"'Inter',sans-serif", letterSpacing:0.5, whiteSpace:'nowrap' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.dot, flexShrink:0 }} />
      {status.toUpperCase()}
    </span>
  );
}

const VAR_TYPE_CFG = {
  Manual: { bg: 'rgba(40,119,156,0.18)', color: '#28a0c8' },
  Import: { bg: 'rgba(100,70,160,0.22)', color: '#a080e0' },
};
function VarTypeBadge({ type }) {
  const cfg = VAR_TYPE_CFG[type] || VAR_TYPE_CFG.Manual;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 8px', borderRadius:99, background:cfg.bg, fontSize:10, fontWeight:700, color:cfg.color, fontFamily:"'Inter',sans-serif", letterSpacing:0.5, whiteSpace:'nowrap' }}>
      {type.toUpperCase()}
    </span>
  );
}

const COLUMNS = [
  { key: 'name',     label: 'CAMPAIGN NAME',       flex: 3   },
  { key: 'vehicles', label: 'VEHICLES',             flex: 1   },
  { key: 'code',     label: 'SYSTEM CODE',          flex: 1.2 },
  { key: 'crit',     label: 'VARIABLE',             flex: 1   },
  { key: 'spec',     label: 'SPECIFICATION MODEL',  flex: 3   },
  { key: 'measure',  label: 'INTERNAL ID',          flex: 2.5 },
  { key: 'type',     label: 'UPDATE TYPE',          flex: 1.2 },
  { key: 'date',     label: 'START DATE',           flex: 1.4 },
  { key: 'statuses', label: 'STATUS',               flex: 2   },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS['CALCULATED'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 99,
      background: cfg.bg,
      fontSize: 10, fontWeight: 600, color: cfg.color,
      fontFamily: "'Inter', sans-serif",
      letterSpacing: 0.3,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function SortArrow({ active, dir }) {
  // When active: show only one arrow. When hover (not active): show both faintly.
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
        fontFamily: "'Inter', sans-serif",
        letterSpacing: 0.8, textTransform: 'uppercase',
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
          transition: 'background 0.15s',
          position: 'relative',
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
      key={tab.id}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '4px 10px', borderRadius: 6, border: 'none',
        background: active
          ? 'rgba(0,55,85,0.75)'
          : hovered ? 'rgba(0,70,102,0.18)' : 'transparent',
        color: active ? '#ffffff' : hovered ? 'rgba(128,176,200,0.9)' : 'rgba(128,176,200,0.6)',
        fontSize: 11, fontWeight: 600, cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        whiteSpace: 'nowrap',
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {tab.label} <span style={{ opacity: 0.7 }}>({tab.count})</span>
    </button>
  );
}


// ─── Filter panel options ─────────────────────────────────────────────────────
const FILTER_STATUSES = Object.keys(STATUS);
const FILTER_TYPES = ['Partial', 'Full'];
const FILTER_CODES = ['FA01', 'SE03', 'KE05', 'PU01'];

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
                  fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
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
                  fontFamily: "'Inter',sans-serif",
                  transition: 'all 0.15s',
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
                  fontFamily: "'Inter',sans-serif",
                  transition: 'all 0.15s',
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
          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '2px 6px', fontSize: 10, color: 'rgba(128,176,200,0.7)',
              fontFamily: "'Inter',sans-serif", outline: 'none', colorScheme: 'dark',
            }}
          />
          <span style={{ fontSize: 10, color: 'rgba(128,176,200,0.4)' }}>—</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => onChange({ ...filters, dateTo: e.target.value })}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '2px 6px', fontSize: 10, color: 'rgba(128,176,200,0.7)',
              fontFamily: "'Inter',sans-serif", outline: 'none', colorScheme: 'dark',
            }}
          />
        </div>
      </div>

      {/* Reset — right edge */}
      <span
        onClick={() => activeFilterCount > 0 && onChange({ statuses: [], types: [], codes: [], dateFrom: '', dateTo: '' })}
        onMouseEnter={() => activeFilterCount > 0 && setResetHovered(true)}
        onMouseLeave={() => setResetHovered(false)}
        style={{
          marginLeft: 'auto', alignSelf: 'flex-end',
          padding: '10px 18px', borderRadius: 8,
          cursor: activeFilterCount > 0 ? 'pointer' : 'default',
          background: activeFilterCount > 0
            ? (resetHovered ? 'rgba(180,40,40,0.28)' : 'rgba(180,40,40,0.15)')
            : 'rgba(255,255,255,0.03)',
          border: activeFilterCount > 0
            ? (resetHovered ? '1px solid rgba(180,40,40,0.75)' : '1px solid rgba(180,40,40,0.45)')
            : '1px solid rgba(255,255,255,0.08)',
          fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
          color: activeFilterCount > 0 ? (resetHovered ? '#ff8080' : '#e06060') : 'rgba(128,176,200,0.25)',
          fontFamily: "'Inter',sans-serif",
          transition: 'all 0.15s',
          userSelect: 'none',
        }}
      >
        Reset
      </span>
    </div>
  );
}

const LOAD_STEPS_CAMPAIGN = [
  'Fetching campaign data',
  'Loading vehicle statistics',
  'Preparing campaign view',
];

const LOAD_STEPS_BACK = [
  'Syncing campaign updates',
  'Refreshing campaign list',
  'Loading dashboard',
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function DashboardView({ activeBrand, onBrandChange, onLogout }) {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loadingCampaign, setLoadingCampaign] = useState(null);
  const [loadingBack, setLoadingBack] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [activeNav, setActiveNav] = useState('field');
  const [activeTopTab, setActiveTopTab] = useState('all');
  const [activeBottomTab, setActiveBottomTab] = useState('CAMPAIGNS');  // id
  const [searchValue, setSearchValue] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterHovered, setFilterHovered] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [filters, setFilters] = useState({ statuses: [], types: [], codes: [], dateFrom: '', dateTo: '' });
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [hoveredCol, setHoveredCol] = useState(null);
  const [loadSubtitle, setLoadSubtitle] = useState('Returning to Field');

  const [varTypeTab, setVarTypeTab] = useState('all');
  const [varSort, setVarSort] = useState({ key: 'code', dir: 'asc' });
  const [varHovCol, setVarHovCol] = useState(null);

  useEffect(() => {
    if (activeNav === 'field') setActiveBottomTab('CAMPAIGNS');
  }, [activeNav]);

  function handleCampaignOpen(row) {
    setLoadingCampaign(row);
    setLoadStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
    setTimeout(() => setLoadStep(1), 450);
    setTimeout(() => setLoadStep(2), 900);
    setTimeout(() => setLoaderVisible(false), 1300);
    setTimeout(() => {
      setLoadingCampaign(null);
      setSelectedCampaign(row);
    }, 1600);
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
    triggerBackLoader('Returning to Field');
  }

  function handleExternalNavChange(nav) {
    setSelectedCampaign(null);
    triggerBackLoader(nav === 'people' ? 'Loading Lab' : 'Returning to Field', () => setActiveNav(nav));
  }

  function handleSidebarNavChange(nav) {
    if (nav === activeNav) return;
    triggerBackLoader(nav === 'people' ? 'Loading Lab' : 'Loading Field', () => setActiveNav(nav));
  }

  if (activeNav === 'people') {
    return <TestUpdatesView activeNav={activeNav} onNavChange={setActiveNav} activeBrand={activeBrand} onBrandChange={onBrandChange} onLogout={onLogout} />;
  }

  if (selectedCampaign) {
    return <CampaignDetailView campaign={selectedCampaign} onBack={handleCampaignBack} activeBrand={activeBrand} onBrandChange={onBrandChange} onLogout={onLogout} onExternalNavChange={handleExternalNavChange} />;
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
              {loadSubtitle}
            </div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid rgba(128,176,200,0.15)', borderTopColor: '#28a0c8',
            animation: 'iteruSpin 0.85s linear infinite',
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

  if (loadingCampaign) {
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
          <div style={{ textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5, marginBottom: 6 }}>
              Loading campaign
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.3 }}>
              {loadingCampaign.name}
            </div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid rgba(128,176,200,0.15)', borderTopColor: '#28a0c8',
            animation: 'iteruSpin 0.85s linear infinite',
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOAD_STEPS_CAMPAIGN.map((s, i) => (
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

  const searchLower = searchValue.trim().toLowerCase();

  const tabFiltered = CAMPAIGNS
    .filter(TAB_FILTER[activeTopTab] ?? TAB_FILTER.all)
    .filter(r => {
      if (filters.statuses.length && !filters.statuses.includes(r.statuses[0])) return false;
      if (filters.types.length && !filters.types.includes(r.type)) return false;
      if (filters.codes.length && !filters.codes.includes(r.code)) return false;
      if (filters.dateFrom) {
        const [d, m, y] = r.date.split('.');
        if (new Date(`${y}-${m}-${d}`) < new Date(filters.dateFrom)) return false;
      }
      if (filters.dateTo) {
        const [d, m, y] = r.date.split('.');
        if (new Date(`${y}-${m}-${d}`) > new Date(filters.dateTo)) return false;
      }
      if (!searchLower) return true;
      return [r.name, r.code, r.crit, r.spec, r.measure, r.type, r.date, r.statuses[0], r.vehicles]
        .some(v => v.toLowerCase().includes(searchLower));
    });

  const sortedCampaigns = [...tabFiltered].sort((a, b) => {
    const va = String(a[sort.key] ?? '');
    const vb = String(b[sort.key] ?? '');
    const cmp = va.localeCompare(vb, undefined, { numeric: true });
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  function handleColSort(key) {
    setSort(prev => prev.key === key
      ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: 'asc' }
    );
  }

  function handleVarColSort(key) {
    setVarSort(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  }

  const varCounts = { all: VARIABLES_DATA.length, Manual: VARIABLES_DATA.filter(v => v.type === 'Manual').length, Import: VARIABLES_DATA.filter(v => v.type === 'Import').length };

  const sortedVariables = [...VARIABLES_DATA]
    .filter(v => {
      if (varTypeTab === 'Manual') return v.type === 'Manual';
      if (varTypeTab === 'Import') return v.type === 'Import';
      return true;
    })
    .filter(v => {
      if (!searchValue.trim()) return true;
      const sl = searchValue.trim().toLowerCase();
      return [v.code, v.name, v.source, v.author, v.type, v.status].some(f => f.toLowerCase().includes(sl));
    })
    .sort((a, b) => {
      const va = String(a[varSort.key] ?? '');
      const vb = String(b[varSort.key] ?? '');
      const cmp = va.localeCompare(vb, undefined, { numeric: true });
      return varSort.dir === 'asc' ? cmp : -cmp;
    });

  const activeFilterCount =
    filters.statuses.length +
    filters.types.length +
    filters.codes.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  const headerCell = {
    fontSize: 10, fontWeight: 700, color: 'rgba(128,176,200,0.6)',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: 0.8, textTransform: 'uppercase',
    padding: '0 12px', whiteSpace: 'nowrap',
  };

  const cell = {
    fontSize: 11, fontWeight: 500, color: '#ccdfe9',
    fontFamily: "'Inter', sans-serif",
    padding: '0 12px', overflow: 'hidden',
    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)',
      backgroundColor: '#003050',
      padding: 24, gap: 24, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      {/* ── Sidebar ── */}
      <Sidebar activeNav={activeNav} onNavChange={handleSidebarNavChange} attentionCount={TAB_TOTAL.attention} testAttentionCount={5} activeBrand={activeBrand} onBrandChange={onBrandChange} onLogout={onLogout}
        onOpenCampaign={(campaignId, isTest) => {
          if (isTest) { handleSidebarNavChange('people'); }
          else { const c = CAMPAIGNS.find(x => x.id === campaignId); if (c) handleCampaignOpen(c); }
        }}
      />

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, position: 'relative' }}>

        {/* Top bar: title + tabs + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <span style={{
            fontSize: 22, fontWeight: 700, color: '#ffffff',
            fontFamily: "'Montserrat', sans-serif", whiteSpace: 'nowrap',
            letterSpacing: 0.3,
          }}>
            Field
          </span>

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }} />

          {/* Top tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {activeBottomTab === 'CRITERIONS' ? (
              <>
                <TopTab tab={{ id: 'all',    label: 'ALL',    count: varCounts.all    }} active={varTypeTab === 'all'}    onClick={() => setVarTypeTab('all')}    />
                <TopTab tab={{ id: 'Manual', label: 'MANUAL', count: varCounts.Manual }} active={varTypeTab === 'Manual'} onClick={() => setVarTypeTab('Manual')} />
                <TopTab tab={{ id: 'Import', label: 'IMPORT', count: varCounts.Import }} active={varTypeTab === 'Import'} onClick={() => setVarTypeTab('Import')} />
              </>
            ) : (
              <>
                {TABS_TOP.map((tab, i) => (
                  <React.Fragment key={tab.id}>
                    {tab.id === 'mine' && (
                      <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)', marginInline: 4 }} />
                    )}
                    <TopTab
                      tab={tab}
                      active={activeTopTab === tab.id}
                      onClick={() => setActiveTopTab(tab.id)}
                    />
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
                        position: 'absolute', top: 0, right: 0,
                        width: 16, height: 16, borderRadius: 8,
                        background: '#cc4422',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: '#fff',
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: '0 2px 6px rgba(180,40,20,0.55), 0 1px 2px rgba(0,0,0,0.3)',
                        pointerEvents: 'none',
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
                      fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap',
                      pointerEvents: 'none', zIndex: 10,
                    }}>
                      Filtering
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Spacer */}
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
                fontFamily: "'Inter', sans-serif",
                caretColor: '#ffffff', width: '100%',
                '--placeholder-color': 'rgba(128,176,200,0.45)',
              }}
              className="dashboard-search"
            />
            {searchValue && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setSearchValue('')}
                  style={{
                    background: 'none', border: 'none', padding: '2px 2px 0',
                    cursor: 'pointer', color: 'rgba(128,176,200,0.5)',
                    display: 'flex', alignItems: 'center',
                    lineHeight: 1, transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'rgba(128,176,200,1)';
                    e.currentTarget.parentNode.querySelector('.search-clear-tip').style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(128,176,200,0.5)';
                    e.currentTarget.parentNode.querySelector('.search-clear-tip').style.opacity = '0';
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <div className="search-clear-tip" style={{
                  position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '3px 7px', borderRadius: 4,
                  background: '#012d42', border: '1px solid #153f53',
                  fontSize: 10, fontWeight: 600, color: '#80b0c8',
                  fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                  pointerEvents: 'none', opacity: 0, transition: 'opacity 0.15s',
                  zIndex: 10,
                }}>
                  Clear
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Table area ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'rgba(1,45,66,0.6)', border: '1px solid #153f53',
          borderRadius: 16, overflow: 'hidden',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          {activeBottomTab === 'CRITERIONS' ? (
            /* ── VARIABLES TABLE ── */
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 64 }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                height: 40, flexShrink: 0, borderBottom: '1px solid #153f53',
                background: 'rgb(1, 41, 64)', position: 'sticky', top: 0, zIndex: 1,
              }}>
                {VAR_COLUMNS.map(col => {
                  const isActive = varSort.key === col.key;
                  const isHovered = varHovCol === col.key;
                  return (
                    <div
                      key={col.key}
                      onClick={() => handleVarColSort(col.key)}
                      onMouseEnter={() => setVarHovCol(col.key)}
                      onMouseLeave={() => setVarHovCol(null)}
                      style={{
                        ...headerCell, flex: col.flex, minWidth: 0,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        color: isActive ? 'rgba(128,176,200,0.95)' : isHovered ? 'rgba(128,176,200,0.8)' : 'rgba(128,176,200,0.6)',
                        userSelect: 'none', transition: 'color 0.15s',
                      }}
                    >
                      {col.label}
                      {(isActive || isHovered) && <SortArrow active={isActive} dir={varSort.dir} />}
                    </div>
                  );
                })}
              </div>

              {sortedVariables.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, padding: '48px 0' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.25)" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif" }}>No variables found</div>
                </div>
              )}

              {sortedVariables.map((v, i) => {
                const baseBg = i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)';
                const hoverBg = 'rgba(0,70,102,0.2)';
                return (
                  <div
                    key={v.code}
                    style={{
                      display: 'flex', alignItems: 'center',
                      height: 36, flexShrink: 0,
                      borderBottom: '1px solid rgba(21,63,83,0.5)',
                      background: baseBg, transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = baseBg}
                  >
                    <div style={{ ...cell, flex: 0.7, minWidth: 0 }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(128,176,200,0.7)', letterSpacing: 0.6 }}>{v.code}</span>
                    </div>
                    <div style={{ flex: 2.8, minWidth: 0, padding: '0 12px' }}>
                      <div title={v.name} style={{ ...cell, padding: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                    </div>
                    <div style={{ ...cell, flex: 1.3, minWidth: 0, color: 'rgba(204,223,233,0.7)', fontSize: 11 }}>{v.created}</div>
                    <div style={{ ...cell, flex: 1.3, minWidth: 0, color: 'rgba(204,223,233,0.7)', fontSize: 11 }}>{v.modified}</div>
                    <div style={{ flex: 2.2, minWidth: 0, padding: '0 12px' }}>
                      <div title={v.source} style={{ ...cell, padding: 0, fontSize: 11, color: 'rgba(204,223,233,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.source}</div>
                    </div>
                    <div style={{ flex: 1.5, minWidth: 0, padding: '0 12px' }}>
                      <div title={v.author} style={{ ...cell, padding: 0, fontSize: 11, color: 'rgba(204,223,233,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.author}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, padding: '0 8px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                      <VarTypeBadge type={v.type} />
                    </div>
                    <div style={{ ...cell, flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, color: '#ffffff' }}>{v.campaigns}</div>
                    <div style={{ flex: 1.2, minWidth: 0, padding: '0 8px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                      <VarStatusBadge status={v.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── CAMPAIGNS TABLE ── */
            <>
              <div className={`filter-panel-wrapper${filterOpen ? ' open' : ''}`}>
                <div className="filter-panel-inner">
                  <FilterPanel filters={filters} onChange={setFilters} activeFilterCount={activeFilterCount} />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 64 }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  height: 40, flexShrink: 0,
                  borderBottom: '1px solid #153f53',
                  background: 'rgb(1, 41, 64)',
                  position: 'sticky', top: 0, zIndex: 1,
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
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                          color: isActive ? 'rgba(128,176,200,0.95)' : isHovered ? 'rgba(128,176,200,0.8)' : 'rgba(128,176,200,0.6)',
                          userSelect: 'none',
                          transition: 'color 0.15s',
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
                  const isCreated = row.statuses[0] === 'CREATED' || row.statuses[0] === 'CALCULATED';
                  const baseBg = isCreated
                    ? (i % 2 === 0 ? 'rgba(100,140,165,0.07)' : 'rgba(100,140,165,0.12)')
                    : (i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)');
                  const hoverBg = isCreated ? 'rgba(100,140,165,0.18)' : 'rgba(0,70,102,0.2)';
                  return (
                    <div
                      key={row.id}
                      style={{
                        display: 'flex', alignItems: 'center',
                        height: 32, flexShrink: 0,
                        borderBottom: '1px solid rgba(21,63,83,0.5)',
                        borderLeft: isCreated ? '2px solid rgba(128,176,200,0.35)' : '2px solid transparent',
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
                      <div style={{ ...cell, flex: 1, minWidth: 0 }}>{row.crit}</div>
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
          )}
        </div>

        {/* ── Bottom tab bar (floating) ── */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 8px', borderRadius: 14,
          background: 'rgba(1,45,66,0.75)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #153f53',
          boxShadow: '0px 8px 32px rgba(0,0,0,0.48)',
          animation: 'floatingBarEnter 0.45s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          {TABS_BOTTOM.map(tab => (
            <BottomTab
              key={tab.id}
              label={tab.label}
              tooltip={tab.tooltip}
              active={activeBottomTab === tab.id}
              onClick={() => setActiveBottomTab(tab.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
