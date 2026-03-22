import React, { useState, useEffect, useRef } from 'react';
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
  { code: '01', name: 'ECU Firmware Baseline Config',    created: '10.01.2024', modified: '15.03.2024', source: 'ECU_BASE_CFG_v1.xlsx',  author: 'Jonathan Blackwell',    type: 'Manual', campaigns: 4, status: 'Active',
    files: [{ name: 'ECU_BASE_CFG_v1.xlsx', date: '15.03.2024', type: 'Manual' }, { name: 'ECU_BASE_CFG_v0.9.xlsx', date: '20.02.2024', type: 'Manual' }, { name: 'ECU_BASE_CFG_v0.8.xlsx', date: '10.01.2024', type: 'Manual' }] },
  { code: '02', name: 'Brake Module Calibration Set',    created: '22.01.2024', modified: '22.01.2024', source: 'BRK_CAL_v2.xlsx',       author: 'Natalia Ferreira',      type: 'Import', campaigns: 2, status: 'Active',
    files: [{ name: 'BRK_CAL_v2.xlsx', date: '22.01.2024', type: 'Import' }, { name: 'BRK_CAL_v1.xlsx', date: '05.11.2023', type: 'Import' }] },
  { code: '03', name: 'Gateway Protocol Parameters',     created: '01.02.2024', modified: '01.03.2024', source: 'GW_PARAMS_2024.csv',    author: 'Hiroshi Tanaka',        type: 'Import', campaigns: 3, status: 'Active',
    files: [{ name: 'GW_PARAMS_2024.csv', date: '01.03.2024', type: 'Import' }, { name: 'GW_PARAMS_2024_draft.csv', date: '01.02.2024', type: 'Import' }, { name: 'GW_PARAMS_2023.csv', date: '14.10.2023', type: 'Import' }] },
  { code: '04', name: 'Powertrain Calibration Baseline', created: '12.02.2024', modified: '12.02.2024', source: 'PWR_CAL_BASE_2024.csv', author: 'Jonathan Blackwell',    type: 'Manual', campaigns: 1, status: 'Active',
    files: [{ name: 'PWR_CAL_BASE_2024.csv', date: '12.02.2024', type: 'Manual' }, { name: 'PWR_CAL_BASE_2023.csv', date: '03.09.2023', type: 'Manual' }] },
  { code: '05', name: 'ABS Thresholds v2.1',             created: '20.02.2024', modified: '05.04.2024', source: 'ABS_THRESH_v2.1.xlsx',  author: 'Amélie Duchamp',        type: 'Import', campaigns: 5, status: 'Active',
    files: [{ name: 'ABS_THRESH_v2.1.xlsx', date: '05.04.2024', type: 'Import' }, { name: 'ABS_THRESH_v2.0.xlsx', date: '20.02.2024', type: 'Import' }, { name: 'ABS_THRESH_v1.8.xlsx', date: '11.12.2023', type: 'Import' }, { name: 'ABS_THRESH_v1.5.xlsx', date: '07.08.2023', type: 'Manual' }] },
  { code: '06', name: 'Drive Unit OTA Parameters',       created: '05.03.2024', modified: '05.03.2024', source: 'OTA_DU_PARAMS.csv',     author: 'Natalia Ferreira',      type: 'Import', campaigns: 3, status: 'Active',
    files: [{ name: 'OTA_DU_PARAMS.csv', date: '05.03.2024', type: 'Import' }, { name: 'OTA_DU_PARAMS_prev.csv', date: '18.01.2024', type: 'Import' }] },
  { code: '07', name: 'Charging System Config Set',      created: '17.03.2024', modified: '17.03.2024', source: 'CHG_SYS_CFG_v3.xlsx',   author: 'Sebastian Müller',      type: 'Manual', campaigns: 2, status: 'Active',
    files: [{ name: 'CHG_SYS_CFG_v3.xlsx', date: '17.03.2024', type: 'Manual' }, { name: 'CHG_SYS_CFG_v2.xlsx', date: '29.01.2024', type: 'Manual' }, { name: 'CHG_SYS_CFG_v1.xlsx', date: '04.11.2023', type: 'Manual' }] },
  { code: '08', name: 'Display Module Variables',        created: '01.04.2024', modified: '20.05.2024', source: 'DSP_VARS_1.5.xlsx',     author: 'Hiroshi Tanaka',        type: 'Import', campaigns: 1, status: 'Deprecated',
    files: [{ name: 'DSP_VARS_1.5.xlsx', date: '20.05.2024', type: 'Import' }, { name: 'DSP_VARS_1.3.xlsx', date: '01.04.2024', type: 'Import' }] },
  { code: '09', name: 'HVAC Control Parameters',         created: '14.04.2024', modified: '14.04.2024', source: 'HVAC_CTRL_v3.csv',      author: 'Amélie Duchamp',        type: 'Import', campaigns: 2, status: 'Active',
    files: [{ name: 'HVAC_CTRL_v3.csv', date: '14.04.2024', type: 'Import' }, { name: 'HVAC_CTRL_v2.csv', date: '22.02.2024', type: 'Import' }, { name: 'HVAC_CTRL_v1.csv', date: '30.10.2023', type: 'Manual' }] },
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

function BottomTab({ label, tooltip, active, onClick, onPlus }) {
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
        onClick={e => { e.stopPropagation(); onPlus?.(); }}
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

// ─── Variable Detail ──────────────────────────────────────────────────────────
function VarIconBtn({ children, tooltip, danger, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          width: 32, height: 32, borderRadius: 8, border: 'none',
          background: danger ? (hov ? 'rgba(180,40,40,0.35)' : 'rgba(180,40,40,0.2)') : (hov ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'),
          color: danger ? (hov ? '#ff6060' : '#cc4433') : (hov ? '#ccdfe9' : 'rgba(128,176,200,0.7)'),
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s, color 0.15s',
        }}>
        {children}
      </button>
      {hov && tooltip && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 7px)', left: '50%', transform: 'translateX(-50%)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap', background: '#012d42', border: '1px solid #153f53', fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: "'Inter', sans-serif", pointerEvents: 'none', zIndex: 200 }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

function VarBackButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'none', color: hov ? '#ccdfe9' : 'rgba(128,176,200,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>
      {hov && (
        <div style={{ position: 'absolute', left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)', padding: '4px 10px', borderRadius: 6, background: '#012d42', border: '1px solid #153f53', fontSize: 11, fontWeight: 600, color: '#80b0c8', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 200, boxShadow: '0 2px 8px rgba(0,0,0,0.28)' }}>
          Back to Variables
        </div>
      )}
    </div>
  );
}

function VarParamsModal({ variable, onClose }) {
  const [closing, setClosing] = useState(false);
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [saveHov, setSaveHov] = useState(false);
  const [name, setName] = useState(variable.name);
  const [nameFocused, setNameFocused] = useState(false);
  const [nameHovered, setNameHovered] = useState(false);
  const [status, setStatus] = useState(variable.status === 'Deprecated' ? 'Deprecated' : 'Active');
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusHovered, setStatusHovered] = useState(false);
  const statusRef = useRef(null);

  const initStatus = variable.status === 'Deprecated' ? 'Deprecated' : 'Active';
  const isDirty = name !== variable.name || status !== initStatus;

  useEffect(() => {
    const h = e => { if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  function handleClose() { setClosing(true); }

  const nameBorder = nameFocused ? '#28779c' : nameHovered ? '#2a6a87' : '#16506c';
  const nameBg = nameFocused ? 'rgba(0,70,102,0.24)' : nameHovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)';
  const nameShadow = nameFocused ? '0px 0px 8px 0px rgba(40,119,156,0.32), inset 0px 0px 4px 0px rgba(0,0,0,0.24)' : '0px 1px 2px 0px rgba(0,0,0,0.12)';
  const statusBorder = statusOpen ? '#28779c' : statusHovered ? '#2a6a87' : '#16506c';
  const statusBg = statusOpen ? 'rgba(0,70,102,0.24)' : statusHovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)';
  const statusShadow = statusOpen ? '0px 0px 8px 0px rgba(40,119,156,0.32), inset 0px 0px 4px 0px rgba(0,0,0,0.24)' : '0px 1px 2px 0px rgba(0,0,0,0.12)';

  return (
    <>
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,46,67,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease' }} />
      <div onAnimationEnd={() => { if (closing) onClose(); }}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 520, background: 'rgba(1,45,66,0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid #153f53', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.24)', zIndex: 201, boxSizing: 'border-box', animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>Variable Parameters</span>
          <div style={{ position: 'relative' }}>
            <button onClick={handleClose} onMouseEnter={() => setCloseHov(true)} onMouseLeave={() => setCloseHov(false)}
              style={{ width: 24, height: 24, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: closeHov ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {closeHov && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', padding: '3px 8px', borderRadius: 4, background: '#012d42', border: '1px solid #153f53', fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 210 }}>Close</div>}
          </div>
        </div>
        {/* Read-only meta row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[['Code', variable.code], ['Created', variable.created], ['Modified', variable.modified]].map(([lbl, val]) => (
            <div key={lbl} style={{ height: 52, borderRadius: 8, border: '1px solid rgba(21,63,83,0.5)', background: 'rgba(0,40,60,0.3)', padding: '0 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase' }}>{lbl}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(204,223,233,0.55)', fontFamily: "'Inter', sans-serif" }}>{val || '—'}</span>
            </div>
          ))}
        </div>
        {/* Editable Name — floating label */}
        <div
          onMouseEnter={() => setNameHovered(true)}
          onMouseLeave={() => setNameHovered(false)}
          style={{ position: 'relative', height: 52, borderRadius: 8, border: `1px solid ${nameBorder}`, background: nameBg, boxShadow: nameShadow, transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s', overflow: 'hidden', cursor: 'text' }}
          onClick={() => document.getElementById('varParamName')?.focus()}
        >
          <label style={{ position: 'absolute', left: 12, top: 7, fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase', pointerEvents: 'none' }}>Name</label>
          <input
            id="varParamName"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: '#ffffff', caretColor: '#ffffff', padding: '22px 12px 6px' }}
          />
        </div>
        {/* Editable Status — custom dropdown */}
        <div ref={statusRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setStatusOpen(o => !o)}
            onMouseEnter={() => setStatusHovered(true)}
            onMouseLeave={() => setStatusHovered(false)}
            style={{ height: 52, borderRadius: 8, border: `1px solid ${statusBorder}`, background: statusBg, boxShadow: statusShadow, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none', transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.55)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase' }}>Status</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>{status}</span>
            </div>
            <span style={{ color: '#80b0c8', opacity: statusOpen ? 1 : 0.6, transform: statusOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s, opacity 0.15s', display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </div>
          {statusOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#012d42', border: '1px solid #153f53', borderRadius: 8, boxShadow: '0px 8px 12px 0px rgba(0,0,0,0.18)', overflow: 'hidden', zIndex: 220 }}>
              {['Active', 'Deprecated'].map((opt, i) => (
                <div key={opt} onClick={() => { setStatus(opt); setStatusOpen(false); }}
                  style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: i === 0 ? '1px solid #153f53' : 'none', background: 'transparent', transition: 'background 0.12s', fontSize: 12, fontWeight: 500, color: opt === status ? '#ffffff' : '#80b0c8', fontFamily: "'Inter', sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{opt}</div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={handleClose} onMouseEnter={() => setCancelHov(true)} onMouseLeave={() => setCancelHov(false)}
            style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: '#ccdfe9', background: cancelHov ? '#013d58' : '#012d42', border: '1px solid #004666', cursor: 'pointer', transition: 'background 0.15s' }}>
            Cancel
          </button>
          <button disabled={!isDirty} onMouseEnter={() => setSaveHov(true)} onMouseLeave={() => setSaveHov(false)}
            style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: isDirty ? (saveHov ? '#fff' : '#28a0c8') : 'rgba(128,176,200,0.3)', background: isDirty ? (saveHov ? 'rgba(40,160,200,0.28)' : 'rgba(40,160,200,0.16)') : 'rgba(0,50,74,0.2)', border: `1px solid ${isDirty ? 'rgba(40,160,200,0.4)' : 'rgba(21,63,83,0.4)'}`, cursor: isDirty ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

function VarDeleteModal({ variable, onClose, onConfirm }) {
  const [closing, setClosing] = useState(false);
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [deleteHov, setDeleteHov] = useState(false);
  function handleClose() { setClosing(true); }
  return (
    <>
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,46,67,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease' }} />
      <div onAnimationEnd={() => { if (closing) onClose(); }}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 568, background: 'rgba(1,45,66,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid #153f53', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.16)', zIndex: 201, boxSizing: 'border-box', animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>Delete Variable</span>
          <div style={{ position: 'relative' }}>
            <button onClick={handleClose} onMouseEnter={() => setCloseHov(true)} onMouseLeave={() => setCloseHov(false)}
              style={{ width: 24, height: 24, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: closeHov ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {closeHov && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', padding: '3px 8px', borderRadius: 4, background: '#012d42', border: '1px solid #153f53', fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 210 }}>Close</div>}
          </div>
        </div>
        {/* Body */}
        <div style={{ background: '#012d42', border: '1px solid #153f53', borderRadius: 16, padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.24)' }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#ccdfe9', fontFamily: "'Inter', sans-serif", lineHeight: '20px', margin: 0 }}>
            Deleting this variable will permanently remove it from the system along with all its source file history. This variable is currently referenced by <span style={{ fontWeight: 700, color: '#ffffff' }}>{variable.campaigns} campaign{variable.campaigns !== 1 ? 's' : ''}</span> — removing it may affect their operation. This action cannot be undone.
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: '22px', margin: 0 }}>
            Are you sure you want to delete <span style={{ fontWeight: 700 }}>{variable.name}</span>?
          </p>
        </div>
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={handleClose} onMouseEnter={() => setCancelHov(true)} onMouseLeave={() => setCancelHov(false)}
            style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: '#ccdfe9', background: cancelHov ? '#013d58' : '#012d42', border: '1px solid #004666', cursor: 'pointer', transition: 'background 0.15s' }}>
            Cancel
          </button>
          <button onClick={() => { onConfirm?.(); handleClose(); }} onMouseEnter={() => setDeleteHov(true)} onMouseLeave={() => setDeleteHov(false)}
            style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: deleteHov ? '#ff6060' : '#cc4433', background: deleteHov ? 'rgba(180,40,40,0.35)' : 'rgba(180,40,40,0.2)', border: `1px solid ${deleteHov ? 'rgba(200,60,60,0.5)' : 'rgba(180,40,40,0.35)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

function FileRemoveModal({ file, onClose, onConfirm }) {
  const [closing, setClosing] = useState(false);
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [removeHov, setRemoveHov] = useState(false);
  function handleClose() { setClosing(true); }
  return (
    <>
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,46,67,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease' }} />
      <div onAnimationEnd={() => { if (closing) onClose(); }}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 568, background: 'rgba(1,45,66,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid #153f53', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.16)', zIndex: 201, boxSizing: 'border-box', animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>Remove Source File</span>
          <div style={{ position: 'relative' }}>
            <button onClick={handleClose} onMouseEnter={() => setCloseHov(true)} onMouseLeave={() => setCloseHov(false)}
              style={{ width: 24, height: 24, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: closeHov ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {closeHov && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', padding: '3px 8px', borderRadius: 4, background: '#012d42', border: '1px solid #153f53', fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 210 }}>Close</div>}
          </div>
        </div>
        {/* Body */}
        <div style={{ background: '#012d42', border: '1px solid #153f53', borderRadius: 16, padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.24)' }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#ccdfe9', fontFamily: "'Inter', sans-serif", lineHeight: '20px', margin: 0 }}>
            Removing this source file will permanently delete it from the variable's history. This action cannot be undone.
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: '22px', margin: 0 }}>
            Are you sure you want to remove <span style={{ fontWeight: 700 }}>{file.name}</span>?
          </p>
        </div>
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={handleClose} onMouseEnter={() => setCancelHov(true)} onMouseLeave={() => setCancelHov(false)}
            style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: '#ccdfe9', background: cancelHov ? '#013d58' : '#012d42', border: '1px solid #004666', cursor: 'pointer', transition: 'background 0.15s' }}>
            Cancel
          </button>
          <button onClick={() => { onConfirm?.(); handleClose(); }} onMouseEnter={() => setRemoveHov(true)} onMouseLeave={() => setRemoveHov(false)}
            style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: removeHov ? '#ff6060' : '#cc4433', background: removeHov ? 'rgba(180,40,40,0.35)' : 'rgba(180,40,40,0.2)', border: `1px solid ${removeHov ? 'rgba(200,60,60,0.5)' : 'rgba(180,40,40,0.35)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
            Remove
          </button>
        </div>
      </div>
    </>
  );
}

function FileRow({ file, isCurrent, onRemove }) {
  const [hov, setHov] = useState(false);
  const [dlState, setDlState] = useState('idle'); // idle | loading | done

  function handleDownload() {
    if (dlState !== 'idle') return;
    setDlState('loading');
    setTimeout(() => {
      setDlState('done');
      setTimeout(() => setDlState('idle'), 1000);
    }, 1400);
  }

  const showActions = hov || dlState !== 'idle';

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', height: 40, borderBottom: '1px solid rgba(21,63,83,0.5)', padding: '0 16px', background: isCurrent ? 'rgba(40,160,200,0.06)' : hov ? 'rgba(0,70,102,0.12)' : 'transparent', transition: 'background 0.1s' }}
    >
      <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isCurrent ? 'rgba(40,160,200,0.7)' : 'rgba(128,176,200,0.35)'} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
        <span style={{ fontSize: 12, fontWeight: isCurrent ? 600 : 400, color: isCurrent ? '#ccdfe9' : 'rgba(128,176,200,0.55)', fontFamily: "'Inter',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
        {isCurrent && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.8, color: '#28a0c8', background: 'rgba(40,160,200,0.15)', border: '1px solid rgba(40,160,200,0.3)', borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>CURRENT</span>}
      </div>
      <div style={{ flex: 1, fontSize: 11, color: isCurrent ? 'rgba(204,223,233,0.7)' : 'rgba(128,176,200,0.4)', fontFamily: "'Inter',sans-serif" }}>{file.date}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <VarTypeBadge type={file.type} />
      </div>
      {/* Action buttons — visible on hover */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 60, justifyContent: 'flex-end', flexShrink: 0 }}>
        {/* Remove — only for non-current files */}
        <div style={{ width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showActions && !isCurrent && (
            <button onClick={onRemove}
              style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'rgba(180,40,40,0.15)', color: '#cc4433', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', padding: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,40,40,0.28)'; e.currentTarget.style.color = '#ff6060'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(180,40,40,0.15)'; e.currentTarget.style.color = '#cc4433'; }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          )}
        </div>
        {/* Download */}
        <div style={{ width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showActions && (
            <button onClick={handleDownload}
              style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: dlState === 'done' ? 'rgba(40,140,80,0.2)' : 'rgba(40,160,200,0.15)', color: dlState === 'done' ? '#38b060' : '#28a0c8', cursor: dlState === 'idle' ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', padding: 0 }}>
              {dlState === 'loading' && (
                <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(40,160,200,0.25)', borderTopColor: '#28a0c8', animation: 'iteruSpin 0.75s linear infinite' }} />
              )}
              {dlState === 'done' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
              {dlState === 'idle' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function VariableDetailView({ variable, onBack, onNavChange, activeBrand, onBrandChange, onLogout }) {
  const [paramsOpen, setParamsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [loadSubtitle, setLoadSubtitle] = useState('');
  const LOAD_STEPS = ['Syncing variable data', 'Refreshing dataset', 'Loading view'];

  function triggerLoader(subtitle, onDone) {
    setLoadSubtitle(subtitle);
    setLoading(true); setLoadStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
    setTimeout(() => setLoadStep(1), 450);
    setTimeout(() => setLoadStep(2), 900);
    setTimeout(() => setLoaderVisible(false), 1300);
    setTimeout(() => { setLoading(false); setLoadStep(0); if (onDone) onDone(); }, 1600);
  }

  function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)', backgroundColor: '#003050' }}>
        <div style={{ opacity: loaderVisible ? 1 : 0, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
          {loadSubtitle && <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>{loadSubtitle}</div>}
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(128,176,200,0.15)', borderTopColor: '#28a0c8', animation: 'iteruSpin 0.85s linear infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOAD_STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: 0.2, color: i < loadStep ? 'rgba(56,176,96,0.85)' : i === loadStep ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.2)', transition: 'color 0.3s ease' }}>
                <span style={{ width: 14, display: 'flex', justifyContent: 'center', fontSize: i < loadStep ? 11 : 13 }}>{i < loadStep ? '✓' : i === loadStep ? '›' : '·'}</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const files = variable.files || [{ name: variable.source, date: variable.modified, type: variable.type }];

  const metaLabel = { fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase', flexShrink: 0 };
  const metaValue = { fontSize: 10, fontWeight: 600, color: 'rgba(128,176,200,0.85)', fontFamily: "'Inter', sans-serif" };

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)', backgroundColor: '#003050', padding: 24, gap: 24, boxSizing: 'border-box', overflow: 'hidden' }}>
        <Sidebar activeNav="field" onNavChange={nav => { if (nav === 'field') return; triggerLoader(nav === 'people' ? 'Loading Lab' : 'Loading Field', () => onNavChange(nav)); }} attentionCount={11} testAttentionCount={5} activeBrand={activeBrand} onBrandChange={onBrandChange} onLogout={onLogout} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, position: 'relative' }}>

          {/* Header — campaign pattern */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <VarBackButton onClick={onBack} />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{variable.name}</span>
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, minWidth: 0 }}>
                <span style={metaLabel}>CAMPAIGNS:</span>
                <span style={metaValue}>{variable.campaigns}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, minWidth: 0 }}>
                <span style={metaLabel}>CODE:</span>
                <span style={metaValue}>{variable.code}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, minWidth: 0 }}>
                <span style={metaLabel}>CREATED:</span>
                <span style={metaValue}>{variable.created}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, minWidth: 0 }}>
                <span style={metaLabel}>LAST MODIFIED:</span>
                <span style={metaValue}>{variable.modified}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, minWidth: 0 }}>
                <span style={metaLabel}>AUTHOR:</span>
                <span style={metaValue}>{variable.author}</span>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <VarStatusBadge status={variable.status} />
            <VarTypeBadge type={variable.type} />
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 64 }}>

            {/* Refresh banner */}
            {refreshing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(40,160,200,0.1)', border: '1px solid rgba(40,160,200,0.25)', flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(40,160,200,0.25)', borderTopColor: '#28a0c8', animation: 'iteruSpin 0.75s linear infinite' }} />
                <span style={{ fontSize: 12, color: 'rgba(128,176,200,0.7)', fontFamily: "'Inter',sans-serif" }}>Refreshing variable data…</span>
              </div>
            )}

            {/* Source files */}
            <div style={{ background: 'rgba(1,45,66,0.6)', border: '1px solid #153f53', borderRadius: 16, overflow: 'hidden', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
              {/* Table header */}
              <div style={{ display: 'flex', alignItems: 'center', height: 36, borderBottom: '1px solid #153f53', background: 'rgb(1,41,64)', padding: '0 16px', gap: 0 }}>
                <div style={{ flex: 3, fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", textTransform: 'uppercase' }}>Source Files</div>
                <div style={{ flex: 1, fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", textTransform: 'uppercase' }}>Date Added</div>
                <div style={{ flex: 1, fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", textTransform: 'uppercase' }}>Method</div>
                <div style={{ width: 28, flexShrink: 0 }} />
              </div>
              {files.map((f, i) => (
                <FileRow key={i} file={f} isCurrent={i === 0} onRemove={i === 0 ? undefined : () => setFileToRemove(f)} />
              ))}
            </div>
          </div>

          {/* Floating action bar */}
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 14, background: 'rgba(1,45,66,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid #153f53', boxShadow: '0px 8px 32px rgba(0,0,0,0.48)', animation: 'floatingBarEnter 0.45s cubic-bezier(0.22,1,0.36,1) both', zIndex: 10 }}>
            <VarIconBtn tooltip="Refresh data" onClick={handleRefresh}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </VarIconBtn>
            <VarIconBtn tooltip="Variable parameters" onClick={() => setParamsOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </VarIconBtn>
            <VarIconBtn tooltip="Delete variable" danger onClick={() => setDeleteOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
                <path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6"/>
              </svg>
            </VarIconBtn>
          </div>

        </div>
      </div>
      {paramsOpen && <VarParamsModal variable={variable} onClose={() => setParamsOpen(false)} />}
      {deleteOpen && <VarDeleteModal variable={variable} onClose={() => setDeleteOpen(false)} onConfirm={onBack} />}
      {fileToRemove && <FileRemoveModal file={fileToRemove} onClose={() => setFileToRemove(null)} onConfirm={() => setFileToRemove(null)} />}
    </>
  );
}

// ─── New Variable Modal ───────────────────────────────────────────────────────
function NewVariableModal({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState(null); // null | 'manual' | 'import'
  const [closeHov, setCloseHov] = useState(false);

  // Manual state
  const [varName, setVarName] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileObj, setFileObj] = useState(null);
  const fileInputRef = React.useRef(null);

  // Import state
  const IMPORT_SOURCES = [
    { id: 'sap', label: 'SAP Integration', icon: '🔗' },
    { id: 'confluence', label: 'Confluence', icon: '📄' },
    { id: 'sharepoint', label: 'SharePoint', icon: '☁️' },
    { id: 'jira', label: 'Jira', icon: '🎯' },
  ];
  const [importSource, setImportSource] = useState(null);
  const [importQuery, setImportQuery] = useState('');
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);

  function handleClose() { setClosing(true); }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileObj(f);
    setFileName(f.name);
  }

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'csv'].includes(ext)) return;
    setFileObj(f);
    setFileName(f.name);
  }

  function handleImport() {
    if (!importSource || importing) return;
    setImporting(true);
    setTimeout(() => { setImporting(false); setImportDone(true); }, 1600);
  }

  const canSaveManual = varName.trim().length > 0 && fileObj !== null;
  const canImport = importSource !== null && !importDone;

  const overlay = { fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", marginBottom: 6, textTransform: 'uppercase' };
  const inputStyle = { background: 'rgba(0,50,74,0.4)', border: '1px solid #1e5570', borderRadius: 8, padding: '10px 12px', fontSize: 12, fontWeight: 500, color: '#ffffff', fontFamily: "'Inter',sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s' };

  return (
    <>
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,46,67,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease' }} />
      <div
        onAnimationEnd={() => { if (closing) onClose(); }}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 520, background: 'rgba(1,45,66,0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid #153f53', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.24)', zIndex: 201, boxSizing: 'border-box', animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>New Variable</span>
          <div style={{ position: 'relative' }}>
            <button onClick={handleClose} onMouseEnter={() => setCloseHov(true)} onMouseLeave={() => setCloseHov(false)}
              style={{ width: 24, height: 24, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: closeHov ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {closeHov && <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', padding: '3px 8px', borderRadius: 4, background: '#012d42', border: '1px solid #153f53', fontSize: 10, fontWeight: 600, color: '#80b0c8', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 210 }}>Close</div>}
          </div>
        </div>

        {/* Mode selector */}
        {mode === null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'rgba(128,176,200,0.6)', fontFamily: "'Inter',sans-serif" }}>Choose how you want to add a new variable:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { id: 'manual', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#28a0c8" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="12" x2="12" y2="18"/><line x1="9" y1="15" x2="15" y2="15"/></svg>, title: 'Manual Entry', desc: 'Upload an Excel or CSV file from your computer' },
                { id: 'import', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#28a0c8" strokeWidth="1.5" strokeLinecap="round"><polyline points="8,17 12,21 16,17"/><line x1="12" y1="21" x2="12" y2="7"/><path d="M3 7a9 9 0 0 1 18 0"/></svg>, title: 'Import', desc: 'Fetch a file from an external service (SAP, Confluence, SharePoint…)' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setMode(opt.id)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: '16px', borderRadius: 12, background: 'rgba(0,50,74,0.4)', border: '1px solid #1e5570', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s', textAlign: 'left' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,70,102,0.5)'; e.currentTarget.style.borderColor = '#28779c'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,50,74,0.4)'; e.currentTarget.style.borderColor = '#1e5570'; }}
                >
                  {opt.icon}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', fontFamily: "'Montserrat',sans-serif", marginBottom: 4 }}>{opt.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(128,176,200,0.65)', fontFamily: "'Inter',sans-serif", lineHeight: 1.4 }}>{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual mode */}
        {mode === 'manual' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button onClick={() => setMode(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(128,176,200,0.6)', fontSize: 11, fontFamily: "'Inter',sans-serif", alignSelf: 'flex-start', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(128,176,200,1)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(128,176,200,0.6)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
              Back
            </button>
            <div>
              <div style={overlay}>Variable Name</div>
              <input value={varName} onChange={e => setVarName(e.target.value)} placeholder="e.g. ECU Firmware Baseline Config" style={inputStyle} />
            </div>
            <div>
              <div style={overlay}>File (xlsx / csv)</div>
              <div
                onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                style={{ border: `2px dashed ${fileObj ? '#28a0c8' : '#1e5570'}`, borderRadius: 10, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: fileObj ? 'rgba(40,160,200,0.07)' : 'rgba(0,50,74,0.3)', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!fileObj) { e.currentTarget.style.borderColor = '#28779c'; e.currentTarget.style.background = 'rgba(0,70,102,0.25)'; }}}
                onMouseLeave={e => { if (!fileObj) { e.currentTarget.style.borderColor = '#1e5570'; e.currentTarget.style.background = 'rgba(0,50,74,0.3)'; }}}
              >
                <input ref={fileInputRef} type="file" accept=".xlsx,.csv" style={{ display: 'none' }} onChange={handleFileChange} />
                {fileObj ? (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#28a0c8" strokeWidth="1.8" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#28a0c8', fontFamily: "'Inter',sans-serif" }}>{fileName}</span>
                    <span style={{ fontSize: 10, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif" }}>Click to replace</span>
                  </>
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.5)" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(128,176,200,0.6)', fontFamily: "'Inter',sans-serif" }}>Drop file here or click to browse</span>
                    <span style={{ fontSize: 10, color: 'rgba(128,176,200,0.35)', fontFamily: "'Inter',sans-serif" }}>.xlsx or .csv</span>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={handleClose} style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(128,176,200,0.7)', background: 'transparent', border: '1px solid rgba(128,176,200,0.2)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ccdfe9'; e.currentTarget.style.background = 'rgba(0,70,102,0.28)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(128,176,200,0.7)'; e.currentTarget.style.background = 'transparent'; }}>
                Cancel
              </button>
              <button onClick={canSaveManual ? handleClose : undefined}
                style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', cursor: canSaveManual ? 'pointer' : 'default', color: canSaveManual ? '#28a0c8' : 'rgba(128,176,200,0.3)', background: canSaveManual ? 'rgba(40,160,200,0.16)' : 'rgba(0,70,102,0.1)', border: canSaveManual ? '1px solid rgba(40,160,200,0.4)' : '1px solid rgba(40,100,140,0.2)', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (canSaveManual) { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(40,160,200,0.28)'; }}} onMouseLeave={e => { if (canSaveManual) { e.currentTarget.style.color = '#28a0c8'; e.currentTarget.style.background = 'rgba(40,160,200,0.16)'; }}}>
                Save
              </button>
            </div>
          </div>
        )}

        {/* Import mode */}
        {mode === 'import' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button onClick={() => { setMode(null); setImportSource(null); setImportQuery(''); setImporting(false); setImportDone(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'rgba(128,176,200,0.6)', fontSize: 11, fontFamily: "'Inter',sans-serif", alignSelf: 'flex-start', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(128,176,200,1)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(128,176,200,0.6)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
              Back
            </button>
            <div>
              <div style={overlay}>Source</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {IMPORT_SOURCES.map(src => {
                  const active = importSource === src.id;
                  return (
                    <button key={src.id} onClick={() => setImportSource(src.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: active ? 'rgba(40,160,200,0.14)' : 'rgba(0,50,74,0.4)', border: active ? '1px solid rgba(40,160,200,0.5)' : '1px solid #1e5570', transition: 'all 0.15s', textAlign: 'left' }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(0,70,102,0.4)'; e.currentTarget.style.borderColor = '#28779c'; }}}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'rgba(0,50,74,0.4)'; e.currentTarget.style.borderColor = '#1e5570'; }}}>
                      <span style={{ fontSize: 18 }}>{src.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: active ? '#28a0c8' : 'rgba(128,176,200,0.8)', fontFamily: "'Inter',sans-serif" }}>{src.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {importSource && !importDone && (
              <div>
                <div style={overlay}>File / Path</div>
                <input value={importQuery} onChange={e => setImportQuery(e.target.value)} placeholder="e.g. /configs/ecu_baseline.xlsx" style={inputStyle} />
              </div>
            )}
            {importDone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(40,160,80,0.12)', border: '1px solid rgba(40,160,80,0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38b060" strokeWidth="2" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#38b060', fontFamily: "'Inter',sans-serif" }}>Variable imported successfully</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={handleClose} style={{ padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(128,176,200,0.7)', background: 'transparent', border: '1px solid rgba(128,176,200,0.2)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ccdfe9'; e.currentTarget.style.background = 'rgba(0,70,102,0.28)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(128,176,200,0.7)'; e.currentTarget.style.background = 'transparent'; }}>
                {importDone ? 'Close' : 'Cancel'}
              </button>
              {!importDone && (
                <button onClick={handleImport}
                  style={{ position: 'relative', padding: '10px 18px', borderRadius: 8, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', minWidth: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: canImport && !importing ? 'pointer' : 'default', color: canImport ? '#28a0c8' : 'rgba(128,176,200,0.3)', background: canImport ? 'rgba(40,160,200,0.16)' : 'rgba(0,70,102,0.1)', border: canImport ? '1px solid rgba(40,160,200,0.4)' : '1px solid rgba(40,100,140,0.2)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (canImport && !importing) { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(40,160,200,0.28)'; }}} onMouseLeave={e => { if (canImport) { e.currentTarget.style.color = '#28a0c8'; e.currentTarget.style.background = 'rgba(40,160,200,0.16)'; }}}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(40,160,200,0.25)', borderTopColor: '#28a0c8', animation: 'iteruSpin 0.75s linear infinite', flexShrink: 0, opacity: importing ? 1 : 0 }} />
                  <span style={{ position: 'absolute', opacity: importing ? 0 : 1 }}>Import</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DashboardView({ activeBrand, onBrandChange, onLogout }) {
  const [selectedVariable, setSelectedVariable] = useState(null);
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
  const [addVariableOpen, setAddVariableOpen] = useState(false);

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

  function handleBottomTabChange(id) { setActiveBottomTab(id); }

  function handleSidebarNavChange(nav) {
    if (nav === activeNav) return;
    triggerBackLoader(nav === 'people' ? 'Loading Lab' : 'Loading Field', () => setActiveNav(nav));
  }

  if (activeNav === 'people') {
    return <TestUpdatesView activeNav={activeNav} onNavChange={setActiveNav} activeBrand={activeBrand} onBrandChange={onBrandChange} onLogout={onLogout} />;
  }

  if (selectedVariable) {
    return <VariableDetailView
      variable={selectedVariable}
      onBack={() => setSelectedVariable(null)}
      onNavChange={nav => { setSelectedVariable(null); triggerBackLoader(nav === 'people' ? 'Loading Lab' : 'Loading Field', () => setActiveNav(nav)); }}
      activeBrand={activeBrand}
      onBrandChange={onBrandChange}
      onLogout={onLogout}
    />;
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
    <>
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
        {(() => {
          const isCamp = activeBottomTab === 'CAMPAIGNS';
          const isCrit = activeBottomTab === 'CRITERIONS';
          const T = 'opacity 0.26s ease, transform 0.26s cubic-bezier(0.22,1,0.36,1)';
          const boxBase = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'rgba(1,45,66,0.6)', border: '1px solid #153f53', borderRadius: 16, overflow: 'hidden', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', transition: T };
          return (
            <div style={{ flex: 1, position: 'relative', isolation: 'isolate' }}>
              {/* CAMPAIGNS panel */}
              <div style={{ ...boxBase, opacity: isCamp ? 1 : 0, transform: isCamp ? 'translateX(0)' : 'translateX(-28px)', zIndex: isCamp ? 2 : 1, pointerEvents: isCamp ? 'auto' : 'none' }}>
                <div className={`filter-panel-wrapper${filterOpen ? ' open' : ''}`}>
                  <div className="filter-panel-inner">
                    <FilterPanel filters={filters} onChange={setFilters} activeFilterCount={activeFilterCount} />
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 64 }}>
                  <div style={{ display: 'flex', alignItems: 'center', height: 40, flexShrink: 0, borderBottom: '1px solid #153f53', background: 'rgb(1,41,64)', position: 'sticky', top: 0, zIndex: 1 }}>
                    {COLUMNS.map(col => {
                      const isActive = sort.key === col.key;
                      const isHovered = hoveredCol === col.key;
                      return (
                        <div key={col.key} onClick={() => handleColSort(col.key)} onMouseEnter={() => setHoveredCol(col.key)} onMouseLeave={() => setHoveredCol(null)}
                          style={{ ...headerCell, flex: col.flex, minWidth: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: isActive ? 'rgba(128,176,200,0.95)' : isHovered ? 'rgba(128,176,200,0.8)' : 'rgba(128,176,200,0.6)', userSelect: 'none', transition: 'color 0.15s' }}>
                          {col.label}
                          {(isActive || isHovered) && <SortArrow active={isActive} dir={sort.dir} />}
                        </div>
                      );
                    })}
                  </div>
                  {sortedCampaigns.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, padding: '48px 0' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.25)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif" }}>No results found</div>
                      <div style={{ fontSize: 11, fontWeight: 400, color: 'rgba(128,176,200,0.3)', fontFamily: "'Inter', sans-serif" }}>Try adjusting your search or filters</div>
                    </div>
                  )}
                  {sortedCampaigns.map((row, i) => {
                    const isCreated = row.statuses[0] === 'CREATED' || row.statuses[0] === 'CALCULATED';
                    const baseBg = isCreated ? (i % 2 === 0 ? 'rgba(100,140,165,0.07)' : 'rgba(100,140,165,0.12)') : (i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)');
                    const hoverBg = isCreated ? 'rgba(100,140,165,0.18)' : 'rgba(0,70,102,0.2)';
                    return (
                      <div key={row.id} style={{ display: 'flex', alignItems: 'center', height: 32, flexShrink: 0, borderBottom: '1px solid rgba(21,63,83,0.5)', borderLeft: isCreated ? '2px solid rgba(128,176,200,0.35)' : '2px solid transparent', background: baseBg, cursor: 'pointer', transition: 'background 0.1s' }}
                        onClick={() => handleCampaignOpen(row)} onMouseEnter={e => e.currentTarget.style.background = hoverBg} onMouseLeave={e => e.currentTarget.style.background = baseBg}>
                        <div style={{ flex: 3, minWidth: 0, padding: '0 12px' }}><div title={row.name} style={{ ...cell, padding: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</div></div>
                        <div style={{ ...cell, flex: 1, minWidth: 0 }}>{row.vehicles}</div>
                        <div style={{ ...cell, flex: 1.2, minWidth: 0 }}>{row.code}</div>
                        <div style={{ ...cell, flex: 1, minWidth: 0 }}>{row.crit}</div>
                        <div style={{ flex: 3, minWidth: 0, padding: '0 12px' }}><div title={row.spec || '–'} style={{ ...cell, padding: 0, fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.spec || '–'}</div></div>
                        <div style={{ flex: 2.5, minWidth: 0, padding: '0 12px' }}><div title={row.measure || '–'} style={{ ...cell, padding: 0, fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.measure || '–'}</div></div>
                        <div style={{ ...cell, flex: 1.2, minWidth: 0 }}>{row.type}</div>
                        <div style={{ ...cell, flex: 1.4, minWidth: 0 }}>{row.date}</div>
                        <div style={{ flex: 2, minWidth: 0, padding: '0 8px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}><StatusBadge status={row.statuses[0]} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* VARIABLES panel */}
              <div style={{ ...boxBase, opacity: isCrit ? 1 : 0, transform: isCrit ? 'translateX(0)' : 'translateX(28px)', zIndex: isCrit ? 2 : 1, pointerEvents: isCrit ? 'auto' : 'none' }}>
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 64 }}>
                  <div style={{ display: 'flex', alignItems: 'center', height: 40, flexShrink: 0, borderBottom: '1px solid #153f53', background: 'rgb(1,41,64)', position: 'sticky', top: 0, zIndex: 1 }}>
                    {VAR_COLUMNS.map(col => {
                      const isActive = varSort.key === col.key;
                      const isHovered = varHovCol === col.key;
                      return (
                        <div key={col.key} onClick={() => handleVarColSort(col.key)} onMouseEnter={() => setVarHovCol(col.key)} onMouseLeave={() => setVarHovCol(null)}
                          style={{ ...headerCell, flex: col.flex, minWidth: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: isActive ? 'rgba(128,176,200,0.95)' : isHovered ? 'rgba(128,176,200,0.8)' : 'rgba(128,176,200,0.6)', userSelect: 'none', transition: 'color 0.15s' }}>
                          {col.label}
                          {(isActive || isHovered) && <SortArrow active={isActive} dir={varSort.dir} />}
                        </div>
                      );
                    })}
                  </div>
                  {sortedVariables.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, padding: '48px 0' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.25)" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(128,176,200,0.45)', fontFamily: "'Inter', sans-serif" }}>No variables found</div>
                    </div>
                  )}
                  {sortedVariables.map((v, i) => {
                    const baseBg = i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)';
                    const hoverBg = 'rgba(0,70,102,0.2)';
                    return (
                      <div key={v.code} style={{ display: 'flex', alignItems: 'center', height: 36, flexShrink: 0, borderBottom: '1px solid rgba(21,63,83,0.5)', background: baseBg, transition: 'background 0.1s', cursor: 'pointer' }}
                        onClick={() => setSelectedVariable(v)} onMouseEnter={e => e.currentTarget.style.background = hoverBg} onMouseLeave={e => e.currentTarget.style.background = baseBg}>
                        <div style={{ ...cell, flex: 0.7, minWidth: 0 }}><span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(128,176,200,0.7)', letterSpacing: 0.6 }}>{v.code}</span></div>
                        <div style={{ flex: 2.8, minWidth: 0, padding: '0 12px' }}><div title={v.name} style={{ ...cell, padding: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div></div>
                        <div style={{ ...cell, flex: 1.3, minWidth: 0, color: 'rgba(204,223,233,0.7)', fontSize: 11 }}>{v.created}</div>
                        <div style={{ ...cell, flex: 1.3, minWidth: 0, color: 'rgba(204,223,233,0.7)', fontSize: 11 }}>{v.modified}</div>
                        <div style={{ flex: 2.2, minWidth: 0, padding: '0 12px' }}><div title={v.source} style={{ ...cell, padding: 0, fontSize: 11, color: 'rgba(204,223,233,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.source}</div></div>
                        <div style={{ flex: 1.5, minWidth: 0, padding: '0 12px' }}><div title={v.author} style={{ ...cell, padding: 0, fontSize: 11, color: 'rgba(204,223,233,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.author}</div></div>
                        <div style={{ flex: 1, minWidth: 0, padding: '0 8px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}><VarTypeBadge type={v.type} /></div>
                        <div style={{ ...cell, flex: 1, minWidth: 0, fontSize: 12, fontWeight: 600, color: '#ffffff' }}>{v.campaigns}</div>
                        <div style={{ flex: 1.2, minWidth: 0, padding: '0 8px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}><VarStatusBadge status={v.status} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

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
              onClick={() => handleBottomTabChange(tab.id)}
              onPlus={tab.id === 'CRITERIONS' ? () => { handleBottomTabChange('CRITERIONS'); setAddVariableOpen(true); } : undefined}
            />
          ))}
        </div>

      </div>
    </div>
    {addVariableOpen && <NewVariableModal onClose={() => setAddVariableOpen(false)} />}
    </>
  );
}
