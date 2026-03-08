import { useState } from 'react';
import Sidebar from './Sidebar';

// ─── Status badge config ────────────────────────────────────────────────────
const STATUS = {
  RUNNING:          { bg: 'rgba(40,119,156,0.18)',  color: '#28a0c8', dot: '#28a0c8' },
  CREATED:          { bg: 'rgba(100,140,165,0.2)',   color: '#80b0c8', dot: '#80b0c8' },
  DRAFT:            { bg: 'rgba(170,135,25,0.22)',   color: '#c8a028', dot: '#c8a028' },
  COMPLETED:        { bg: 'rgba(40,140,80,0.2)',     color: '#38b060', dot: '#38b060' },
  FAILED:           { bg: 'rgba(180,40,40,0.22)',    color: '#cc3333', dot: '#cc3333' },
  'ABORT APPROVAL': { bg: 'rgba(200,70,20,0.22)',    color: '#d04822', dot: '#d04822' },
  CALCULATED:       { bg: 'rgba(80,110,130,0.2)',    color: '#607890', dot: '#607890' },
};

// ─── Mock data ───────────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { id: 1,  name: 'Middle Europe Critical Bug Fix',    vehicles: '2 382',  code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['RUNNING'] },
  { id: 2,  name: 'East Europe Brake Calibration',     vehicles: '312',    code: 'SE03', crit: '03', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2023-05-22_1017.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['RUNNING'] },
  { id: 3,  name: 'Middle East Fleet Diagnostic',      vehicles: '645',    code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['CREATED'] },
  { id: 4,  name: 'North America Software Update',     vehicles: '462',    code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['RUNNING'] },
  { id: 5,  name: 'Nordic Region Gateway Update',      vehicles: '5 686',  code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '12.07.2024', statuses: ['DRAFT'] },
  { id: 6,  name: 'West Europe Performance Fix',       vehicles: '6 387',  code: 'KE05', crit: '05', spec: '',                                               measure: 'ID_DEMO_04.10.23',   type: 'Full',  date: '21.04.2024', statuses: ['COMPLETED'] },
  { id: 7,  name: 'Central Europe Critical Hotfix',    vehicles: '52',     code: 'SE03', crit: '05', spec: 'ID_F.7.5_H1_V2_0_V1_2023-05-22_1017.xlsx',     measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['RUNNING'] },
  { id: 8,  name: 'Turkey Region Software Patch',      vehicles: '7 536',  code: 'PU01', crit: '01', spec: '',                                               measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 9,  name: 'Pacific Region ECU Calibration',    vehicles: '84 563', code: 'FA01', crit: '01', spec: 'ID_F.7.5_H1_V2_0_V1_2023-05-22_1017.xlsx',     measure: '',                type: 'Partial', date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 10, name: 'Baltic Region Brake Calibration',   vehicles: '5 756',  code: 'SE03', crit: '03', spec: 'ID_F.7.5_H1_V2_0_V1_2023-05-22_1017.xlsx',     measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['COMPLETED'] },
  { id: 11, name: 'Iberia Powertrain Optimization',    vehicles: '82',     code: 'PU01', crit: '01', spec: '',                                               measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 12, name: 'Alpine Region Software Patch',      vehicles: '74',     code: 'KE05', crit: '05', spec: '',                                               measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 13, name: 'Canada East Drive System Update',   vehicles: '3 678',  code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['FAILED'] },
  { id: 14, name: 'DACH Region Critical Hotfix',       vehicles: '253',    code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['RUNNING'] },
  { id: 15, name: 'US West Coast Fleet Update',        vehicles: '85 365', code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['COMPLETED'] },
  { id: 16, name: 'Mexico Distribution Firmware',      vehicles: '634',    code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['COMPLETED'] },
  { id: 17, name: 'Southeast Asia Software Full',  vehicles: '754',    code: 'PU01', crit: '01', spec: '',                                               measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '12.07.2024', statuses: ['RUNNING'] },
  { id: 18, name: 'Scandinavia Performance Full',  vehicles: '8 464',  code: 'KE05', crit: '05', spec: '',                                               measure: 'ID_DEMO_04.10.23',   type: 'Full',  date: '12.07.2024', statuses: ['FAILED'] },
  { id: 19, name: 'Australia Pacific ECU Update',      vehicles: '1 633',  code: 'PU01', crit: '01', spec: '',                                               measure: 'ID_FINAL_10.06.24',  type: 'Full',  date: '21.04.2024', statuses: ['RUNNING'] },
  { id: 20, name: 'Eastern Europe Drivetrain Fix',     vehicles: '8 674',  code: 'SE03', crit: '03', spec: 'ID_F.7.5_H1_V2_0_V1_2023-05-22_1017.xlsx',     measure: '',                type: 'Partial', date: '21.04.2024', statuses: ['CREATED'] },
  { id: 21, name: 'France Region Software Patch',      vehicles: '85',     code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '12.07.2024', statuses: ['COMPLETED'] },
  { id: 22, name: 'US East Coast ECU Calibration',     vehicles: '63',     code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['CALCULATED'] },
  { id: 23, name: 'Brazil South Fleet Firmware',       vehicles: '264',    code: 'FA01', crit: '01', spec: 'ID_S.3.0.5_K1_V6_0-2_V1_2022-09-02_1455.xlsx', measure: '',                type: 'Partial', date: '07.08.2024', statuses: ['CALCULATED'] },
];

const TAB_TOTAL = { all: 23, active: 15, inactive: 8, mine: 6, attention: 2 };
const PER_PAGE = 24;

function buildPages(total) {
  if (total <= 1) return [1];
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  return [1, 2, 3, '…', total];
}

const MINE_IDS = new Set([1, 2, 4, 13, 22, 23]);

const TAB_FILTER = {
  all:       () => true,
  active:    r => ['RUNNING', 'CALCULATED', 'CREATED'].includes(r.statuses[0]),
  inactive:  r => ['FAILED', 'DRAFT', 'COMPLETED'].includes(r.statuses[0]),
  mine:      r => MINE_IDS.has(r.id),
  attention: r => r.statuses[0] === 'FAILED',
};

const TABS_TOP = [
  { id: 'all', label: 'ALL', count: 23 },
  { id: 'active', label: 'ACTIVE', count: 15 },
  { id: 'inactive', label: 'INACTIVE', count: 8 },
  { id: 'mine', label: 'MINE', count: 6 },
  { id: 'attention', label: 'NEED ATTENTION', count: 2 },
];

const TABS_BOTTOM = ['CAMPAIGNS', 'RECALL CRITERIONS', 'VEHICLES'];

const COLUMNS = [
  { key: 'name',     label: 'CAMPAIGN NAME',       flex: 3   },
  { key: 'vehicles', label: 'VEHICLES',             flex: 1   },
  { key: 'code',     label: 'ACTION CODE',          flex: 1.2 },
  { key: 'crit',     label: 'CRITERION',            flex: 1   },
  { key: 'spec',     label: 'UPDATE SPECIFICATION', flex: 3   },
  { key: 'measure',  label: 'CHANGE MEASURE ID',    flex: 2.5 },
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

function BottomTab({ label, active, onClick }) {
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
        }}
      >
        <PlusIcon />
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
  return (
    <div style={{
      display: 'flex', gap: 24, padding: '12px 16px',
      background: 'rgba(0,30,45,0.5)', borderBottom: '1px solid #153f53',
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

      {/* Action Code */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter',sans-serif", marginBottom: 6, textTransform: 'uppercase' }}>Action Code</div>
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

      {/* Date range + Reset */}
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
          <span
            onClick={() => activeFilterCount > 0 && onChange({ statuses: [], types: [], codes: [], dateFrom: '', dateTo: '' })}
            style={{
              padding: '2px 10px', borderRadius: 6,
              cursor: activeFilterCount > 0 ? 'pointer' : 'default',
              background: activeFilterCount > 0 ? 'rgba(180,40,40,0.15)' : 'rgba(255,255,255,0.03)',
              border: activeFilterCount > 0 ? '1px solid rgba(180,40,40,0.45)' : '1px solid rgba(255,255,255,0.08)',
              fontSize: 10, fontWeight: 600,
              color: activeFilterCount > 0 ? '#e06060' : 'rgba(128,176,200,0.25)',
              fontFamily: "'Inter',sans-serif",
              transition: 'all 0.15s',
              userSelect: 'none',
            }}
          >
            Reset
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DashboardView() {
  const [activeNav, setActiveNav] = useState('aftersales');
  const [activeTopTab, setActiveTopTab] = useState('all');
  const [activeBottomTab, setActiveBottomTab] = useState('CAMPAIGNS');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterHovered, setFilterHovered] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [filters, setFilters] = useState({ statuses: [], types: [], codes: [], dateFrom: '', dateTo: '' });
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' });
  const [hoveredCol, setHoveredCol] = useState(null);
  const [hoveredPage, setHoveredPage] = useState(null);

  const tabFiltered = CAMPAIGNS.filter(TAB_FILTER[activeTopTab] ?? TAB_FILTER.all);

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

  const totalCount = TAB_TOTAL[activeTopTab] ?? 372;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const displayEnd = Math.min(PER_PAGE, totalCount);
  const pages = buildPages(totalPages);

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
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} attentionCount={TAB_TOTAL.attention} />

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, position: 'relative' }}>

        {/* Top bar: title + tabs + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <span style={{
            fontSize: 22, fontWeight: 700, color: '#ffffff',
            fontFamily: "'Montserrat', sans-serif", whiteSpace: 'nowrap',
            letterSpacing: 0.3,
          }}>
            Campaigns
          </span>

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)' }} />

          {/* Top tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {TABS_TOP.map(tab => (
              <TopTab
                key={tab.id}
                tab={tab}
                active={activeTopTab === tab.id}
                onClick={() => setActiveTopTab(tab.id)}
              />
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
              placeholder="Search table..."
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontSize: 12, fontWeight: 500, color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
                caretColor: '#ffffff', width: '100%',
                '--placeholder-color': 'rgba(128,176,200,0.45)',
              }}
              className="dashboard-search"
            />
          </div>
        </div>

        {/* ── Table area ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'rgba(1,45,66,0.6)', border: '1px solid #153f53',
          borderRadius: 16, overflow: 'hidden',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          {/* Filter panel */}
          <div className={`filter-panel-wrapper${filterOpen ? ' open' : ''}`}>
            <div className="filter-panel-inner">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>

          {/* Table header */}
          <div style={{
            display: 'flex', alignItems: 'center',
            height: 40, flexShrink: 0,
            borderBottom: '1px solid #153f53',
            background: 'rgba(0,30,45,0.3)',
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
                  {(isActive || isHovered) && (
                    <SortArrow active={isActive} dir={sort.dir} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Table rows */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 32 }}>
            {sortedCampaigns.map((row, i) => (
              <div
                key={row.id}
                style={{
                  display: 'flex', alignItems: 'center',
                  height: 32, flexShrink: 0,
                  borderBottom: '1px solid rgba(21,63,83,0.5)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,50,74,0.15)'}
              >
                <div style={{ ...cell, flex: 3, minWidth: 0 }}>{row.name}</div>
                <div style={{ ...cell, flex: 1, minWidth: 0 }}>{row.vehicles}</div>
                <div style={{ ...cell, flex: 1.2, minWidth: 0 }}>{row.code}</div>
                <div style={{ ...cell, flex: 1, minWidth: 0 }}>{row.crit}</div>
                <div style={{ ...cell, flex: 3, minWidth: 0, fontSize: 10 }}>{row.spec || '–'}</div>
                <div style={{ ...cell, flex: 2.5, minWidth: 0, fontSize: 10 }}>{row.measure || '–'}</div>
                <div style={{ ...cell, flex: 1.2, minWidth: 0 }}>{row.type}</div>
                <div style={{ ...cell, flex: 1.4, minWidth: 0 }}>{row.date}</div>
                <div style={{ flex: 2, minWidth: 0, padding: '0 8px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <StatusBadge status={row.statuses[0]} />
                </div>
              </div>
            ))}
          </div>

          {/* Table footer: row count + pagination */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 40, paddingLeft: 16, paddingRight: 12, flexShrink: 0,
            borderTop: '1px solid #153f53',
            background: 'rgba(0,30,45,0.3)',
          }}>
            <span style={{
              fontSize: 11, fontWeight: 500, color: 'rgba(128,176,200,0.6)',
              fontFamily: "'Inter', sans-serif",
            }}>
              1 — {displayEnd} / {totalCount}
            </span>
            {totalPages > 1 && <div style={{ display: 'flex', gap: 4 }}>
              {pages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => typeof p === 'number' && setCurrentPage(p)}
                  onMouseEnter={() => setHoveredPage(i)}
                  onMouseLeave={() => setHoveredPage(null)}
                  style={{
                    width: 28, height: 28, borderRadius: 6, border: 'none',
                    background: currentPage === p ? '#004666' : hoveredPage === i ? 'rgba(0,70,102,0.25)' : 'transparent',
                    color: currentPage === p ? '#ffffff' : hoveredPage === i ? 'rgba(128,176,200,0.95)' : 'rgba(128,176,200,0.6)',
                    fontSize: 11, fontWeight: 600, cursor: typeof p === 'number' ? 'pointer' : 'default',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'background 0.12s, color 0.12s',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>}
          </div>
        </div>

        {/* ── Bottom tab bar (floating) ── */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 8px', borderRadius: 14,
          background: 'rgba(1,28,42,0.72)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(21,63,83,0.6)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {TABS_BOTTOM.map(tab => (
            <BottomTab
              key={tab}
              label={tab}
              active={activeBottomTab === tab}
              onClick={() => setActiveBottomTab(tab)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
