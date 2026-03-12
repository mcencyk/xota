import { useState, useRef, useEffect } from 'react';
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

// ─── Smooth count-up animation hook ──────────────────────────────────────────
function useCountUp(target, duration = 480) {
  const [current, setCurrent] = useState(target);
  const fromRef = useRef(target);
  const rafRef  = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    fromRef.current = target;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // ease-in-out quad
      setCurrent(Math.round(from + (target - from) * e));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return current;
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
  const isNum = typeof value === 'number';
  const animated = useCountUp(isNum ? value : 0);
  const display = isNum ? animated : value;
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'rgba(1,45,66,0.55)', border: '1px solid #153f53',
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
          {display}
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
  const numMatch = !empty && typeof value === 'string' ? value.match(/^(\d+)%$/) : null;
  const numValue = numMatch ? parseInt(numMatch[1], 10) : 0;
  const animated = useCountUp(numValue);
  const display = numMatch ? `${animated}%` : value;
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
            {display}
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

// ─── Country pools per campaign region ───────────────────────────────────────
const REGION_COUNTRIES = {
  middle_europe:   ['Germany', 'Austria', 'Czech Republic', 'Poland', 'Hungary', 'Slovakia', 'Slovenia', 'Croatia', 'Switzerland', 'Belgium'],
  east_europe:     ['Ukraine', 'Romania', 'Bulgaria', 'Serbia', 'Moldova', 'Belarus', 'Montenegro', 'North Macedonia', 'Kosovo', 'Albania'],
  middle_east:     ['UAE', 'Saudi Arabia', 'Turkey', 'Israel', 'Egypt', 'Qatar', 'Kuwait', 'Jordan', 'Bahrain', 'Oman'],
  north_america:   ['USA', 'Canada', 'Mexico', 'Puerto Rico', 'Cuba', 'Dominican Republic', 'Guatemala', 'Costa Rica', 'Panama', 'Honduras'],
  nordic:          ['Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Greenland', 'Faroe Islands', 'Estonia', 'Latvia', 'Lithuania'],
  west_europe:     ['France', 'Spain', 'Portugal', 'Netherlands', 'Belgium', 'Luxembourg', 'UK', 'Ireland', 'Monaco', 'Andorra'],
  central_europe:  ['Germany', 'Poland', 'Czech Republic', 'Hungary', 'Slovakia', 'Austria', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia'],
  turkey:          ['Turkey', 'Azerbaijan', 'Georgia', 'Armenia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Turkmenistan', 'Tajikistan', 'Iran'],
  pacific:         ['Japan', 'Australia', 'New Zealand', 'South Korea', 'Philippines', 'Indonesia', 'Malaysia', 'Thailand', 'Vietnam', 'Singapore'],
  baltic:          ['Lithuania', 'Latvia', 'Estonia', 'Finland', 'Poland', 'Sweden', 'Denmark', 'Russia', 'Belarus', 'Norway'],
  iberia:          ['Spain', 'Portugal', 'Andorra', 'Gibraltar', 'Morocco', 'Algeria', 'France', 'Italy', 'Malta', 'Tunisia'],
  alpine:          ['Switzerland', 'Austria', 'Liechtenstein', 'Germany', 'France', 'Italy', 'Slovenia', 'Czech Republic', 'Slovakia', 'Hungary'],
  canada:          ['Canada', 'USA', 'Greenland', 'Iceland', 'Norway', 'Denmark', 'UK', 'France', 'Netherlands', 'Belgium'],
  dach:            ['Germany', 'Austria', 'Switzerland', 'Liechtenstein', 'Luxembourg', 'Netherlands', 'Belgium', 'Czech Republic', 'Poland', 'France'],
  us_west:         ['USA', 'Canada', 'Mexico', 'Hawaii', 'Alaska', 'Japan', 'South Korea', 'Australia', 'New Zealand', 'Philippines'],
  mexico:          ['Mexico', 'Guatemala', 'Belize', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'USA'],
  southeast_asia:  ['Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Brunei'],
  scandinavia:     ['Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Faroe Islands', 'Estonia', 'Latvia', 'Lithuania', 'Greenland'],
  australia:       ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu', 'Samoa', 'Tonga', 'Kiribati', 'Micronesia'],
  eastern_europe:  ['Ukraine', 'Romania', 'Bulgaria', 'Serbia', 'Moldova', 'Hungary', 'Slovakia', 'Poland', 'Croatia', 'Bosnia'],
  france:          ['France', 'Belgium', 'Luxembourg', 'Switzerland', 'Monaco', 'Andorra', 'Italy', 'Spain', 'Germany', 'Netherlands'],
  us_east:         ['USA', 'Canada', 'UK', 'Ireland', 'France', 'Germany', 'Netherlands', 'Belgium', 'Spain', 'Portugal'],
  brazil:          ['Brazil', 'Argentina', 'Chile', 'Uruguay', 'Paraguay', 'Bolivia', 'Peru', 'Colombia', 'Venezuela', 'Ecuador'],
};

const CAMPAIGN_REGION = {
  1: 'middle_europe', 2: 'east_europe',   3: 'middle_east',  4: 'north_america',
  5: 'nordic',        6: 'west_europe',   7: 'central_europe', 8: 'turkey',
  9: 'pacific',       10: 'baltic',       11: 'iberia',      12: 'alpine',
  13: 'canada',       14: 'dach',         15: 'us_west',     16: 'mexico',
  17: 'southeast_asia', 18: 'scandinavia', 19: 'australia',  20: 'eastern_europe',
  21: 'france',       22: 'us_east',      23: 'brazil',
};

const BRAND_MODELS = {
  vw:    ['Golf', 'Passat', 'Tiguan', 'Polo', 'T-Roc', 'Touareg', 'Arteon', 'ID.4', 'Caddy', 'Crafter'],
  volvo: ['XC90', 'XC60', 'XC40', 'V90', 'V60', 'S90', 'S60', 'EX90', 'EX40', 'C40'],
  skoda: ['Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Fabia', 'Scala', 'Enyaq', 'Kamiq', 'Rapid', 'Citigo'],
  audi:  ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'e-tron', 'A8', 'TT', 'RS6'],
  ford:  ['Focus', 'Mondeo', 'Puma', 'Kuga', 'Explorer', 'Mustang', 'Transit', 'Ranger', 'Edge', 'EcoSport'],
  seat:  ['Ibiza', 'Leon', 'Ateca', 'Arona', 'Tarraco', 'Formentor', 'Mii', 'Toledo', 'Alhambra', 'Born'],
};

function getCampaignFilters(campaign, brandId) {
  const s = campaign.id;
  const r = (min, max, salt) => min + ((s * 37 + salt * 13) % (max - min + 1));

  // Countries
  const regionKey = CAMPAIGN_REGION[s] || 'west_europe';
  const pool = REGION_COUNTRIES[regionKey];
  const countryCount = r(2, 14, 3); // matches getCampaignStats countries
  const countries = [];
  for (let i = 0; i < Math.min(countryCount, pool.length); i++) {
    countries.push(pool[(s * 7 + i * 11) % pool.length]);
  }
  // dedupe preserving order
  const seen = new Set();
  const uniqueCountries = countries.filter(c => seen.has(c) ? false : seen.add(c));

  // Models
  const key = brandId && BRAND_MODELS[brandId] ? brandId : 'vw';
  const modelPool = BRAND_MODELS[key];
  const modelCount = r(2, 9, 2); // matches getCampaignStats models
  const models = [];
  for (let i = 0; i < Math.min(modelCount, modelPool.length); i++) {
    models.push(modelPool[(s * 5 + i * 9) % modelPool.length]);
  }
  const seenM = new Set();
  const uniqueModels = models.filter(m => seenM.has(m) ? false : seenM.add(m));

  // Intervals (4–8)
  const intervalCount = r(4, 8, 9);
  const intervals = Array.from({ length: intervalCount }, (_, i) => `Interval ${i + 1}`);

  return { countries: uniqueCountries, models: uniqueModels, intervals };
}

// ─── Sparse vehicle distribution across (country × model × interval) ──────────
// Returns array of { country, model, interval, count } — only entries with count > 0.
// Each (country, model) pair is guaranteed to have at least one interval with vehicles.
function getCampaignDistribution(campaign, brandId) {
  const filters = getCampaignFilters(campaign, brandId);
  const { countries, models, intervals } = filters;
  const s = campaign.id;
  const totalVehicles = parseInt(String(campaign.vehicles).replace(/[\s\u00a0,]/g, ''), 10) || 0;

  if (totalVehicles === 0 || !countries.length || !models.length || !intervals.length) return [];

  const records = [];
  let totalWeight = 0;

  for (let ci = 0; ci < countries.length; ci++) {
    for (let mi = 0; mi < models.length; mi++) {
      // Ensure each (country, model) always has at least one interval
      const guaranteed = (s * 3 + ci * 7 + mi * 11) % intervals.length;
      for (let ii = 0; ii < intervals.length; ii++) {
        const hash = (s * 41 + ci * 29 + mi * 19 + ii * 13) % 100;
        if (hash < 65 || ii === guaranteed) {
          const weight = 1 + (hash % 8); // 1–8
          records.push({ country: countries[ci], model: models[mi], interval: intervals[ii], weight });
          totalWeight += weight;
        }
      }
    }
  }

  if (totalWeight === 0) return [];

  // Distribute vehicles with largest-remainder so counts sum to exactly totalVehicles
  const exacts = records.map(r => totalVehicles * r.weight / totalWeight);
  const floors = exacts.map(e => Math.floor(e));
  const floorSum = floors.reduce((a, b) => a + b, 0);
  const remainder = totalVehicles - floorSum;
  const byFrac = exacts.map((e, i) => ({ i, frac: e % 1 })).sort((a, b) => b.frac - a.frac);
  const counts = [...floors];
  for (let k = 0; k < remainder; k++) counts[byFrac[k].i]++;

  return records.map((r, i) => ({ ...r, count: counts[i] })).filter(r => r.count > 0);
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────
function FilterDropdown({ allLabel, options, value, onChange, triggerWidth }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = value ?? allLabel;
  const isFiltered = value !== null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px', borderRadius: 8,
          width: triggerWidth,
          background: open ? 'rgba(0,70,102,0.4)' : hovered ? 'rgba(0,70,102,0.3)' : isFiltered ? 'rgba(0,70,102,0.28)' : 'rgba(1,45,66,0.55)',
          border: open || hovered ? '1px solid #28779c' : isFiltered ? '1px solid rgba(40,119,156,0.6)' : '1px solid #153f53',
          cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none', boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, color: isFiltered ? '#ffffff' : '#ccdfe9', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="rgba(128,176,200,0.5)" strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          background: '#012d42', border: '1px solid #153f53',
          borderRadius: 8, boxShadow: '0px 8px 12px 0px rgba(0,0,0,0.28)',
          overflow: 'hidden', zIndex: 300, minWidth: '100%',
        }}>
          {[null, ...options].map((opt, i) => {
            const isSelected = opt === value;
            const displayLabel = opt ?? allLabel;
            return (
              <div
                key={displayLabel}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '10px 12px', cursor: 'pointer',
                  borderBottom: i < options.length ? '1px solid #153f53' : 'none',
                  background: 'transparent', transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,70,102,0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
                  color: isSelected ? '#ffffff' : '#80b0c8',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {displayLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Vehicle distribution bar ─────────────────────────────────────────────────
// Campaigns in this set get 100% launch rate (no errors)
const PERFECT_LAUNCH_IDS = new Set([1, 8, 9, 19, 22]);

const VEHICLE_SEGMENTS = [
  { color: '#e03070', label: 'ERRORS',       pct: 17 },
  { color: '#e08020', label: 'DOWNLOADING',  pct: 30 },
  { color: '#c8a020', label: 'INITIALIZING', pct: 27 },
  { color: '#38b060', label: 'INSTALLING',   pct: 12 },
  { color: '#28a0c8', label: 'CHECKING',     pct: 7  },
  { color: '#8060c8', label: 'POSTPONED',    pct: 7  },
];

// Segments without ERRORS (for 100% launch rate campaigns) — redistributed proportionally
const VEHICLE_SEGMENTS_NO_ERRORS = [
  { color: '#e08020', label: 'DOWNLOADING',  pct: 37 },
  { color: '#c8a020', label: 'INITIALIZING', pct: 32 },
  { color: '#38b060', label: 'INSTALLING',   pct: 14 },
  { color: '#28a0c8', label: 'CHECKING',     pct: 9  },
  { color: '#8060c8', label: 'POSTPONED',    pct: 8  },
];

// FAILED interval — ERRORS dominant (>70%)
const VEHICLE_SEGMENTS_FAILED = [
  { color: '#e03070', label: 'ERRORS',       pct: 76 },
  { color: '#e08020', label: 'DOWNLOADING',  pct: 10 },
  { color: '#c8a020', label: 'INITIALIZING', pct: 7  },
  { color: '#38b060', label: 'INSTALLING',   pct: 4  },
  { color: '#28a0c8', label: 'CHECKING',     pct: 2  },
  { color: '#8060c8', label: 'POSTPONED',    pct: 1  },
];

// 5 distinct variants for interval bars — with ERRORS
const INTERVAL_SEGMENT_VARIANTS = [
  [ { color: '#e03070', label: 'ERRORS', pct: 22 }, { color: '#e08020', label: 'DOWNLOADING', pct: 48 }, { color: '#c8a020', label: 'INITIALIZING', pct: 16 }, { color: '#38b060', label: 'INSTALLING', pct: 7 }, { color: '#28a0c8', label: 'CHECKING', pct: 4 }, { color: '#8060c8', label: 'POSTPONED', pct: 3 } ],
  [ { color: '#e03070', label: 'ERRORS', pct: 10 }, { color: '#e08020', label: 'DOWNLOADING', pct: 20 }, { color: '#c8a020', label: 'INITIALIZING', pct: 44 }, { color: '#38b060', label: 'INSTALLING', pct: 14 }, { color: '#28a0c8', label: 'CHECKING', pct: 7 }, { color: '#8060c8', label: 'POSTPONED', pct: 5 } ],
  [ { color: '#e03070', label: 'ERRORS', pct: 8  }, { color: '#e08020', label: 'DOWNLOADING', pct: 12 }, { color: '#c8a020', label: 'INITIALIZING', pct: 18 }, { color: '#38b060', label: 'INSTALLING', pct: 42 }, { color: '#28a0c8', label: 'CHECKING', pct: 13 }, { color: '#8060c8', label: 'POSTPONED', pct: 7 } ],
  [ { color: '#e03070', label: 'ERRORS', pct: 35 }, { color: '#e08020', label: 'DOWNLOADING', pct: 28 }, { color: '#c8a020', label: 'INITIALIZING', pct: 18 }, { color: '#38b060', label: 'INSTALLING', pct: 10 }, { color: '#28a0c8', label: 'CHECKING', pct: 5 }, { color: '#8060c8', label: 'POSTPONED', pct: 4 } ],
  [ { color: '#e03070', label: 'ERRORS', pct: 6  }, { color: '#e08020', label: 'DOWNLOADING', pct: 10 }, { color: '#c8a020', label: 'INITIALIZING', pct: 15 }, { color: '#38b060', label: 'INSTALLING', pct: 35 }, { color: '#28a0c8', label: 'CHECKING', pct: 22 }, { color: '#8060c8', label: 'POSTPONED', pct: 12 } ],
];

// Same 5 variants — no ERRORS (for 100% launch-rate campaigns)
const INTERVAL_SEGMENT_VARIANTS_NO_ERRORS = [
  [ { color: '#e08020', label: 'DOWNLOADING', pct: 62 }, { color: '#c8a020', label: 'INITIALIZING', pct: 20 }, { color: '#38b060', label: 'INSTALLING', pct: 9 }, { color: '#28a0c8', label: 'CHECKING', pct: 5 }, { color: '#8060c8', label: 'POSTPONED', pct: 4 } ],
  [ { color: '#e08020', label: 'DOWNLOADING', pct: 22 }, { color: '#c8a020', label: 'INITIALIZING', pct: 49 }, { color: '#38b060', label: 'INSTALLING', pct: 16 }, { color: '#28a0c8', label: 'CHECKING', pct: 8 }, { color: '#8060c8', label: 'POSTPONED', pct: 5 } ],
  [ { color: '#e08020', label: 'DOWNLOADING', pct: 13 }, { color: '#c8a020', label: 'INITIALIZING', pct: 20 }, { color: '#38b060', label: 'INSTALLING', pct: 45 }, { color: '#28a0c8', label: 'CHECKING', pct: 14 }, { color: '#8060c8', label: 'POSTPONED', pct: 8 } ],
  [ { color: '#e08020', label: 'DOWNLOADING', pct: 43 }, { color: '#c8a020', label: 'INITIALIZING', pct: 28 }, { color: '#38b060', label: 'INSTALLING', pct: 15 }, { color: '#28a0c8', label: 'CHECKING', pct: 8 }, { color: '#8060c8', label: 'POSTPONED', pct: 6 } ],
  [ { color: '#e08020', label: 'DOWNLOADING', pct: 11 }, { color: '#c8a020', label: 'INITIALIZING', pct: 16 }, { color: '#38b060', label: 'INSTALLING', pct: 37 }, { color: '#28a0c8', label: 'CHECKING', pct: 23 }, { color: '#8060c8', label: 'POSTPONED', pct: 13 } ],
];

// Distribute `total` vehicles across segments using largest-remainder method
// so counts always sum to exactly total, with no segment below 0.
function distributeVehicles(total, segments) {
  if (total === 0) return segments.map(() => 0);
  const items = segments.map((s, i) => {
    const exact = total * s.pct / 100;
    return { i, floor: Math.floor(exact), frac: exact % 1 };
  });
  const floorSum = items.reduce((a, b) => a + b.floor, 0);
  const remainder = total - floorSum;
  const sorted = [...items].sort((a, b) => b.frac - a.frac);
  const counts = new Array(segments.length).fill(0);
  items.forEach(x => { counts[x.i] = x.floor; });
  for (let k = 0; k < remainder; k++) counts[sorted[k].i]++;
  return counts;
}

// Sub-segment detail data per main segment
const SUB_SEGMENTS = [
  [{ label: 'Downloading',  pct: 42, color: '#e03070' }, { label: 'Verifying',   pct: 33, color: '#c02858' }, { label: 'Pending',     pct: 25, color: '#801840' }],
  [{ label: 'Installing',   pct: 50, color: '#e08020' }, { label: 'Rebooting',   pct: 22, color: '#b86010' }, { label: 'Queued',      pct: 28, color: '#804008' }],
  [{ label: 'Transferring', pct: 46, color: '#c8a020' }, { label: 'Connecting',  pct: 36, color: '#a07818' }, { label: 'Waiting',     pct: 18, color: '#705010' }],
  [{ label: 'Finalizing',   pct: 58, color: '#38b060' }, { label: 'Verifying',   pct: 42, color: '#288048' }],
  [{ label: 'Downloading',  pct: 55, color: '#28a0c8' }, { label: 'Pending',     pct: 45, color: '#1870a0' }],
  [{ label: 'Scheduled',    pct: 48, color: '#8060c8' }, { label: 'Queued',      pct: 52, color: '#604098' }],
];

function ShowVinsButton({ onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px', borderRadius: 8,
        background: disabled ? 'rgba(0,70,102,0.25)' : hovered ? '#005a80' : '#004666',
        border: 'none',
        color: disabled ? 'rgba(128,176,200,0.3)' : '#ccdfe9',
        fontSize: 10, fontWeight: 700,
        fontFamily: "'Inter', sans-serif", letterSpacing: 0.8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s, box-shadow 0.15s, color 0.15s',
        boxShadow: disabled ? 'none' : hovered ? '0px 2px 8px 0px rgba(0,37,55,0.48)' : '0px 1px 4px 0px rgba(0,37,55,0.32)',
      }}
    >
      SHOW VINS
    </button>
  );
}

// ─── Deterministic VIN generator ─────────────────────────────────────────────
const VIN_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'; // VIN-valid (no I/O/Q)
function generateVin(campaignId, idx) {
  let h = (campaignId * 7919 + idx * 6271 + 1) | 0;
  let vin = '';
  for (let i = 0; i < 17; i++) {
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) ^ (h >>> 15);
    vin += VIN_CHARS[Math.abs(h) % VIN_CHARS.length];
  }
  return vin;
}

// ─── Copy toast ───────────────────────────────────────────────────────────────
function CopyToast({ vin, onDone }) {
  const [hiding, setHiding] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 3000);
    const t2 = setTimeout(() => onDone(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div
      onAnimationEnd={() => { if (hiding) onDone(); }}
      style={{
        position: 'fixed', top: 20, right: 20, zIndex: 999,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px', borderRadius: 12,
        background: 'rgba(10,40,18,0.92)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(40,140,80,0.45)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.32), 0 0 0 1px rgba(40,140,80,0.12)',
        animation: hiding ? 'toastSlideOut 0.32s ease forwards' : 'toastSlideIn 0.28s ease forwards',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(40,140,80,0.25)', border: '1px solid rgba(56,176,96,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4cd87a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#4cd87a', fontFamily: "'Inter', sans-serif", letterSpacing: 0.3 }}>
          Copied to clipboard
        </div>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'rgba(56,176,96,0.75)', fontFamily: "'Inter', sans-serif", marginTop: 2 }}>
          VIN {vin} copied successfully.
        </div>
      </div>
    </div>
  );
}

// ─── VIN search (matches dashboard search style) ─────────────────────────────
function VinSearch({ search, onChange, inputRef }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
        height: 36, padding: '0 12px', borderRadius: 8,
        background: hovered ? 'rgba(0,70,102,0.28)' : 'rgba(0,70,102,0.16)',
        border: hovered ? '1px solid #28779c' : '1px solid #16506c',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.45)" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        ref={inputRef}
        value={search}
        onChange={e => onChange(e.target.value)}
        placeholder="Search VIN..."
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontSize: 12, fontWeight: 500, color: '#ffffff',
          fontFamily: "'Inter', sans-serif", caretColor: '#ffffff',
        }}
        className="dashboard-search"
      />
      {search && (
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => onChange('')}
            style={{
              background: 'none', border: 'none', padding: '2px 2px 0',
              cursor: 'pointer', color: 'rgba(128,176,200,0.5)',
              display: 'flex', alignItems: 'center', lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(128,176,200,1)';
              e.currentTarget.parentNode.querySelector('.vin-clear-tip').style.opacity = '1';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(128,176,200,0.5)';
              e.currentTarget.parentNode.querySelector('.vin-clear-tip').style.opacity = '0';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div className="vin-clear-tip" style={{
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
  );
}

// ─── VINs modal ───────────────────────────────────────────────────────────────
const VIN_CAP = 2000;
const VIN_COLUMNS = [
  { key: 'vin',       label: 'VIN' },
  { key: 'productId', label: 'PRODUCT ID' },
  { key: 'country',   label: 'COUNTRY' },
  { key: 'interval',  label: 'INTERVAL' },
  { key: 'status',    label: 'STATUS' },
];

function VinsModal({ campaign, dist, selectedCountry, effectiveModel, effectiveInterval, segmentFilter, vehicleSegments, onClose, onCopy, isTest }) {
  const [closing, setClosing] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'vin', dir: 'asc' });
  const [hoveredCol, setHoveredCol] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  function handleColSort(key) {
    setSort(prev => prev.key === key
      ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: 'asc' }
    );
  }

  function handleClose() { setClosing(true); }

  const filteredDist = dist.filter(r =>
    (selectedCountry   === null || r.country  === selectedCountry) &&
    (effectiveModel    === null || r.model    === effectiveModel) &&
    (effectiveInterval === null || r.interval === effectiveInterval)
  );

  // Build VIN list — when segmentFilter is set, take only that slice
  const fullCount = filteredDist.reduce((s, r) => s + r.count, 0);
  const segStart  = segmentFilter ? segmentFilter.offset : 0;
  const segEnd    = segmentFilter ? segmentFilter.offset + segmentFilter.count : Infinity;
  const totalCount = segmentFilter ? segmentFilter.count : fullCount;

  // Precompute cumulative segment boundaries for status annotation
  const showStatus = !segmentFilter && vehicleSegments;
  const segCounts  = showStatus ? distributeVehicles(fullCount, vehicleSegments) : null;
  const segBounds  = segCounts ? segCounts.reduce((acc, c, i) => {
    acc.push({ start: i === 0 ? 0 : acc[i - 1].end, end: (i === 0 ? 0 : acc[i - 1].end) + c, seg: vehicleSegments[i] });
    return acc;
  }, []) : null;
  function getSegmentForIdx(idx) {
    if (!segBounds) return null;
    for (const b of segBounds) { if (idx >= b.start && idx < b.end) return b.seg; }
    return null;
  }

  const vinList = [];
  let globalIdx = 0;
  outer: for (const rec of filteredDist) {
    for (let v = 0; v < rec.count; v++) {
      if (globalIdx >= segEnd) break outer;
      if (globalIdx >= segStart) {
        if (vinList.length >= VIN_CAP) break outer;
        const seg = getSegmentForIdx(globalIdx - segStart);
        vinList.push({
          vin: generateVin(campaign.id, globalIdx),
          productId: rec.model,
          country: rec.country,
          interval: rec.interval,
          statusLabel: seg ? seg.label : null,
          statusColor: seg ? seg.color : null,
        });
      }
      globalIdx++;
    }
  }

  const q = search.trim().toLowerCase();
  const filtered = q ? vinList.filter(v => v.vin.toLowerCase().includes(q)) : vinList;
  const displayed = [...filtered].sort((a, b) => {
    const va = a[sort.key] ?? '';
    const vb = b[sort.key] ?? '';
    const cmp = va.localeCompare(vb, undefined, { numeric: true });
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,46,67,0.75)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease',
        }}
      />
      <div
        onAnimationEnd={() => { if (closing) onClose(); }}
        style={{
          position: 'fixed', top: '50%', left: '50%',
          width: 680, height: '82vh', maxHeight: '82vh',
          background: 'rgba(1,45,66,0.82)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid #153f53', borderRadius: 24, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 16,
          boxShadow: '0px 0px 32px 0px rgba(0,0,0,0.28)',
          zIndex: 201, boxSizing: 'border-box',
          animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>
              Vehicle VINs
            </span>
            {segmentFilter && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 99,
                background: `${segmentFilter.color}22`,
                border: `1px solid ${segmentFilter.color}66`,
                fontSize: 10, fontWeight: 700, color: segmentFilter.color,
                fontFamily: "'Inter', sans-serif", letterSpacing: 0.5,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: segmentFilter.color, flexShrink: 0 }} />
                {segmentFilter.label}
              </span>
            )}
            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif" }}>
              {totalCount > VIN_CAP
                ? `showing ${VIN_CAP.toLocaleString()} of ${totalCount.toLocaleString()}`
                : `${totalCount.toLocaleString()} vehicle${totalCount !== 1 ? 's' : ''}`}
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                width: 24, height: 24, background: 'none', border: 'none', padding: 0,
                cursor: 'pointer',
                color: closeHovered ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {closeHovered && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                transform: 'translateX(-50%)',
                padding: '3px 8px', borderRadius: 4,
                background: '#012d42', border: '1px solid #153f53',
                fontSize: 10, fontWeight: 600, color: '#80b0c8',
                fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                pointerEvents: 'none', zIndex: 210,
              }}>
                Close
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <VinSearch search={search} onChange={setSearch} inputRef={searchRef} />

        {/* Table header */}
        <div style={{
          flexShrink: 0,
          display: 'grid', gridTemplateColumns: isTest
            ? (showStatus ? '2.2fr 1.2fr 1.1fr' : '2.2fr 1.2fr')
            : (showStatus ? '2.2fr 1.2fr 1.2fr 1fr 1.1fr' : '2.2fr 1.2fr 1.2fr 1fr'),
          padding: '10px 12px',
          background: 'rgb(1,41,64)',
          borderRadius: 10,
          scrollbarGutter: 'stable',
        }}>
          {(showStatus ? VIN_COLUMNS : VIN_COLUMNS.slice(0, 4)).filter(col => !isTest || (col.key !== 'country' && col.key !== 'interval')).map(col => {
            const isActive = sort.key === col.key;
            const isHov = hoveredCol === col.key;
            return (
              <div
                key={col.key}
                onClick={() => handleColSort(col.key)}
                onMouseEnter={() => setHoveredCol(col.key)}
                onMouseLeave={() => setHoveredCol(null)}
                style={{
                  display: 'flex', alignItems: 'center',
                  fontSize: 9, fontWeight: 700, letterSpacing: 1,
                  fontFamily: "'Inter', sans-serif",
                  color: isActive ? 'rgba(128,176,200,0.95)' : isHov ? 'rgba(128,176,200,0.8)' : 'rgba(128,176,200,0.6)',
                  cursor: 'pointer', userSelect: 'none',
                  transition: 'color 0.15s',
                }}
              >
                {col.label}
                {(isActive || isHov) && (
                  <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, marginLeft: 4, opacity: isActive ? 0.9 : 0.35 }}>
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="currentColor" style={{ opacity: isActive && sort.dir === 'asc' ? 0 : 1 }}>
                      <path d="M3.5 0L7 5H0L3.5 0Z"/>
                    </svg>
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="currentColor" style={{ opacity: isActive && sort.dir === 'desc' ? 0 : 1 }}>
                      <path d="M3.5 5L0 0H7L3.5 5Z"/>
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Scrollable list */}
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, scrollbarGutter: 'stable' }}>
          {displayed.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, height: '100%' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.25)" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(128,176,200,0.4)', fontFamily: "'Inter', sans-serif" }}>No VINs match your search</span>
            </div>
          ) : (
            displayed.map((item, i) => <VinRow key={item.vin} item={item} i={i} onCopy={onCopy} showStatus={showStatus} isTest={isTest} />)
          )}
        </div>
      </div>
    </>
  );
}

function VinRow({ item, i, onCopy, showStatus, isTest }) {
  const [hovered, setHovered] = useState(false);
  const [copyHovered, setCopyHovered] = useState(false);

  function handleCopy() {
    try { navigator.clipboard.writeText(item.vin); } catch (_) {}
    onCopy(item.vin);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setCopyHovered(false); }}
      style={{
        display: 'grid', gridTemplateColumns: isTest
          ? (showStatus ? '2.2fr 1.2fr 1.1fr' : '2.2fr 1.2fr')
          : (showStatus ? '2.2fr 1.2fr 1.2fr 1fr 1.1fr' : '2.2fr 1.2fr 1.2fr 1fr'),
        alignItems: 'center',
        padding: '9px 12px', borderRadius: 8,
        background: hovered ? 'rgba(0,70,102,0.22)' : i % 2 === 0 ? 'transparent' : 'rgba(0,40,60,0.18)',
        transition: 'background 0.12s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#ccdfe9', fontFamily: "'Inter', sans-serif", letterSpacing: 0.3, fontVariantNumeric: 'tabular-nums' }}>
          {item.vin}
        </span>
        <button
          onClick={handleCopy}
          onMouseEnter={() => setCopyHovered(true)}
          onMouseLeave={() => setCopyHovered(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 5, border: 'none',
            background: copyHovered ? 'rgba(40,140,80,0.28)' : 'rgba(40,140,80,0.15)',
            color: copyHovered ? '#4cd87a' : 'rgba(56,176,96,0.8)',
            fontSize: 9, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: 0.6,
            cursor: 'pointer', transition: 'all 0.12s',
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
            flexShrink: 0,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          COPY
        </button>
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(128,176,200,0.8)', fontFamily: "'Inter', sans-serif" }}>{item.productId}</span>
      {!isTest && <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(128,176,200,0.8)', fontFamily: "'Inter', sans-serif" }}>{item.country}</span>}
      {!isTest && <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(128,176,200,0.8)', fontFamily: "'Inter', sans-serif" }}>{item.interval}</span>}
      {showStatus && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 9, fontWeight: 700, color: item.statusColor ?? 'rgba(128,176,200,0.6)',
          fontFamily: "'Inter', sans-serif", letterSpacing: 0.5,
        }}>
          {item.statusColor && <span style={{ width: 5, height: 5, borderRadius: '50%', background: item.statusColor, flexShrink: 0 }} />}
          {item.statusLabel ?? '—'}
        </span>
      )}
    </div>
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

function VehicleBar({ totalVehicles, disabled, onShowVins, noErrors, segmentsOverride, onSegmentChange }) {
  const [hoveredSeg, setHoveredSeg] = useState(null);
  const [selectedSeg, setSelectedSeg] = useState(null);
  const [closingDetail, setClosingDetail] = useState(false);
  const total = typeof totalVehicles === 'number'
    ? totalVehicles
    : parseInt(String(totalVehicles).replace(/[\s\u00a0,]/g, ''), 10) || 0;

  const segments = segmentsOverride ?? (noErrors ? VEHICLE_SEGMENTS_NO_ERRORS : VEHICLE_SEGMENTS);

  // Close detail when total or error state changes
  useEffect(() => {
    setSelectedSeg(null);
    setClosingDetail(false);
    setHoveredSeg(null);
    onSegmentChange?.(false);
  }, [total, noErrors]);

  function handleSegClick(segIdx) {
    if (selectedSeg === segIdx) {
      handleCloseDetail();
    } else {
      setClosingDetail(false);
      setSelectedSeg(segIdx);
      onSegmentChange?.(true);
    }
  }

  function handleCloseDetail() { setClosingDetail(true); }

  function handleDetailAnimEnd() {
    if (closingDetail) { setSelectedSeg(null); setClosingDetail(false); onSegmentChange?.(false); }
  }

  // Compute exact vehicle counts per segment (always sums to total)
  const counts = distributeVehicles(total, segments);
  // Only render segments that have at least 1 vehicle, preserving original index for sub-segment data
  const visibleSegs = segments
    .map((seg, i) => ({ ...seg, origIdx: i, count: counts[i] }))
    .filter(s => s.count > 0);

  // For sub-segment lookup: when noErrors, ERRORS slot (index 0) is skipped, so offset by 1
  const subSegOffset = noErrors ? 1 : 0;
  const activeSeg = selectedSeg !== null ? segments[selectedSeg] : null;
  const subSegs = selectedSeg !== null ? (SUB_SEGMENTS[selectedSeg + subSegOffset] ?? []) : [];
  const segCount = activeSeg ? counts[selectedSeg] : 0;
  const segOffset = selectedSeg !== null ? counts.slice(0, selectedSeg).reduce((s, c) => s + c, 0) : 0;

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

  if (total === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '20px 0',
        animation: 'barEnter 0.55s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.25)" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(128,176,200,0.4)', fontFamily: "'Inter', sans-serif" }}>
          No vehicles match the selected criteria
        </div>
        <div style={{ fontSize: 10, fontWeight: 400, color: 'rgba(128,176,200,0.25)', fontFamily: "'Inter', sans-serif" }}>
          Try adjusting your filters
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Segmented bar — only segments with ≥1 vehicle */}
      <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'visible', gap: 2, animation: 'barEnter 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
        {visibleSegs.map((seg, j) => {
          const isHovered = hoveredSeg === seg.origIdx;
          const activeHighlight = hoveredSeg !== null ? hoveredSeg : selectedSeg;
          const isDimmed = activeHighlight !== null && activeHighlight !== seg.origIdx;
          const isFirst = j === 0;
          const isLast = j === visibleSegs.length - 1;
          const pct = Math.round(seg.count / total * 100);
          return (
            <div
              key={seg.origIdx}
              onMouseEnter={() => setHoveredSeg(seg.origIdx)}
              onMouseLeave={() => setHoveredSeg(null)}
              onClick={() => handleSegClick(seg.origIdx)}
              style={{
                flex: seg.count,
                background: seg.color,
                borderRadius: isFirst && isLast ? 6 : isFirst ? '6px 0 0 6px' : isLast ? '0 6px 6px 0' : 0,
                opacity: isDimmed ? 0.22 : 1,
                cursor: 'pointer',
                position: 'relative',
                transition: 'flex 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease, transform 0.2s ease',
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
                    {pct}%
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", marginTop: 2 }}>
                    {seg.count.toLocaleString()} Vehicles
                  </div>
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
          onTransitionEnd={closingDetail ? e => { if (e.propertyName === 'opacity') handleDetailAnimEnd(); } : undefined}
          style={{
            overflow: 'hidden',
            opacity: closingDetail ? 0 : 1,
            maxHeight: closingDetail ? 0 : 300,
            transition: closingDetail ? 'max-height 0.24s ease, opacity 0.18s ease' : 'none',
          }}
        >
        <div
          style={{
            marginTop: 6,
            background: 'rgba(0,16,28,0.82)',
            border: '1px solid #153f53',
            borderRadius: 10,
            padding: '14px 14px 12px',
            display: 'flex', flexDirection: 'column', gap: 10,
            position: 'relative', zIndex: 2,
            animation: closingDetail ? 'none' : 'detailSlideIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
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
              <ShowVinsButton onClick={() => onShowVins({ label: activeSeg.label, color: activeSeg.color, offset: segOffset, count: segCount })} />
              <CloseDetailBtn onClick={handleCloseDetail} />
            </div>
          </div>

          <div style={{ display: 'flex', height: 22, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
            {subSegs.map((sub, j) => (
              <div key={j} style={{
                flex: sub.pct, background: sub.color,
                borderRadius: j === 0 ? '4px 0 0 4px' : j === subSegs.length - 1 ? '0 4px 4px 0' : 0,
              }} />
            ))}
          </div>

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
        </div>
      )}

      {/* Legend — only segments with ≥1 vehicle */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {visibleSegs.map(seg => (
          <div
            key={seg.origIdx}
            onMouseEnter={() => setHoveredSeg(seg.origIdx)}
            onMouseLeave={() => setHoveredSeg(null)}
            onClick={() => handleSegClick(seg.origIdx)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
              opacity: (hoveredSeg !== null ? hoveredSeg : selectedSeg) !== null && (hoveredSeg !== null ? hoveredSeg : selectedSeg) !== seg.origIdx ? 0.35 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: hoveredSeg === seg.origIdx || selectedSeg === seg.origIdx ? seg.color : 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5, transition: 'color 0.2s ease' }}>
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

function IconBtn({ children, tooltip, danger, approve, onClick }) {
  const [hovered, setHovered] = useState(false);

  const bg = danger
    ? (hovered ? 'rgba(180,40,40,0.35)'  : 'rgba(180,40,40,0.2)')
    : approve
    ? (hovered ? 'rgba(40,140,80,0.35)'  : 'rgba(40,140,80,0.2)')
    : (hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)');

  const color = danger
    ? (hovered ? '#ff6060' : '#cc4433')
    : approve
    ? (hovered ? '#4cd87a' : '#38b060')
    : (hovered ? '#ccdfe9' : 'rgba(128,176,200,0.7)');

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 32, height: 32, borderRadius: 8, border: 'none',
          background: bg, color,
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
    { label: 'Flash Duration HV',           value: '102', unit: 'sec.', tooltip: 'Max time allowed for high-voltage ECU firmware flashing' },
    { label: 'Flash Duration LV',           value: '102', unit: 'sec.', tooltip: 'Max time allowed for low-voltage ECU firmware flashing' },
    { label: 'Flash Duration HMI',          value: '4',   unit: 'min.', tooltip: 'Max time allowed for HMI display firmware flashing' },
    { label: 'Enabled Power Grid',          value: '2',   unit: '',     tooltip: 'Number of active power domains required during flashing' },
    { label: 'Current Consumption HV',      value: '10',  unit: 'amp.', tooltip: 'Max current draw from the high-voltage system during update' },
    { label: 'Current Consumption LV',      value: '10',  unit: 'amp.', tooltip: 'Max current draw from the low-voltage system during update' },
    { label: 'Block Flash Attempts',        value: '3',   unit: '',     tooltip: 'Consecutive failures before flashing is permanently blocked' },
    { label: 'Flash Process Repeat',        value: '2',   unit: '',     tooltip: 'Times the flash process is re-run on partial completion' },
    { label: 'Repeat',                      value: '6',   unit: '',     tooltip: 'Total number of full update cycle repetitions allowed' },
    { label: 'Retry',                       value: '3',   unit: '',     tooltip: 'Retry attempts after a single failed operation' },
    { label: 'Max Retry Number',            value: '5',   unit: '',     tooltip: 'Hard cap on total retries across all operations' },
    { label: 'Time Delay General',          value: '5',   unit: 'sec.', tooltip: 'Pause between sequential update operations' },
    { label: 'Time Delay Start 1',          value: '600', unit: 'sec.', tooltip: 'Initial delay before the first update step begins' },
    { label: 'Time Delay Start 2',          value: '120', unit: 'sec.', tooltip: 'Secondary delay applied before critical update operations' },
    { label: 'Time Delay Wait For Sleep',   value: '30',  unit: 'sec.', tooltip: 'Wait time before verifying vehicle is in sleep mode' },
    { label: 'Log Level',                   value: '7',   unit: '',     tooltip: 'Diagnostic log verbosity — higher value means more detail' },
    { label: 'Installation Failure Action', value: 'Continue', unit: '', tooltip: 'Behavior when an ECU installation fails mid-campaign' },
  ],
  SECONDARY: [
    { label: 'Fallback Timeout',            value: '60',  unit: 'sec.', tooltip: 'Time before reverting to previous software version on failure' },
    { label: 'Retry Interval',              value: '15',  unit: 'sec.', tooltip: 'Wait time between consecutive retry attempts' },
    { label: 'Max Parallel Sessions',       value: '8',   unit: '',     tooltip: 'Maximum number of vehicles updating simultaneously' },
    { label: 'Session Timeout',             value: '300', unit: 'sec.', tooltip: 'Maximum duration of a single vehicle update session' },
    { label: 'Heartbeat Interval',          value: '30',  unit: 'sec.', tooltip: 'Frequency of status pings to verify an active connection' },
    { label: 'Diagnostic Level',            value: '2',   unit: '',     tooltip: 'Depth of on-board diagnostics collected during update' },
    { label: 'Log Retention',               value: '14',  unit: 'days', tooltip: 'Days update logs are stored before automatic deletion' },
    { label: 'Error Threshold',             value: '5',   unit: '%',    tooltip: 'Max error rate before the campaign is automatically paused' },
    { label: 'Priority Level',              value: '3',   unit: '',     tooltip: 'Scheduling priority relative to other active campaigns' },
    { label: 'Notification Mode',           value: 'Push', unit: '',    tooltip: 'Method used to deliver campaign status notifications' },
  ],
};

function ParamField({ label, value, unit, tooltip, isRightCol, tooltipBelow }) {
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
      {hovered && tooltip && (
        <div style={{
          position: 'absolute',
          ...(tooltipBelow ? { top: 'calc(100% + 7px)' } : { bottom: 'calc(100% + 7px)' }),
          ...(isRightCol ? { right: 0 } : { left: 0 }),
          width: 220,
          background: '#012d42', border: '1px solid #153f53', borderRadius: 8,
          padding: '6px 10px', whiteSpace: 'normal', wordBreak: 'break-word',
          zIndex: 110, pointerEvents: 'none',
          fontSize: 10, fontWeight: 500, color: 'rgba(204,223,233,0.85)', fontFamily: "'Inter', sans-serif",
          lineHeight: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

function ConfigureOverlay({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('PRIMARY');
  const [closeHovered, setCloseHovered] = useState(false);

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
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                width: 24, height: 24, background: 'none', border: 'none',
                color: closeHovered ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0, transition: 'color 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {closeHovered && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                transform: 'translateX(-50%)',
                padding: '3px 8px', borderRadius: 4,
                background: '#012d42', border: '1px solid #153f53',
                fontSize: 10, fontWeight: 600, color: '#80b0c8',
                fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                pointerEvents: 'none', zIndex: 110,
              }}>
                Close
              </div>
            )}
          </div>
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
        <div style={{ overflowY: 'auto', flexShrink: 1, minHeight: 0, paddingRight: 12 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
          }}>
            {params.map((p, i) => (
              <ParamField key={i} label={p.label} value={p.value} unit={p.unit} tooltip={p.tooltip} isRightCol={i % 2 === 1} tooltipBelow={i < 2} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const LOAD_STEPS_REFRESH = [
  'Fetching campaign data',
  'Loading vehicle statistics',
  'Refreshing campaign view',
];

// ─── Interval list item ───────────────────────────────────────────────────────
const INTERVAL_STATUSES = ['RUNNING', 'CALCULATED', 'COMPLETED', 'FAILED'];
function getIntervalMeta(campaignId, intervalIdx) {
  const status = INTERVAL_STATUSES[(campaignId * 7 + intervalIdx * 13) % INTERVAL_STATUSES.length];
  let successRate;
  if (status === 'FAILED') {
    successRate = 5 + ((campaignId * 11 + intervalIdx * 7) % 14); // 5–18%
  } else if (status === 'CALCULATED') {
    successRate = 0;
  } else {
    successRate = 48 + ((campaignId * 37 + intervalIdx * 17) % 50); // 48–97% — wide variation
  }
  return { status, successRate };
}

function IntervalListItem({ name, count, maxCount, active, onClick, status }) {
  const [hovered, setHovered] = useState(false);
  const barPct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
        background: active ? '#012d42' : 'rgba(0,45,68,0.62)',
        border: active ? '1px solid #28779c' : hovered ? '1px solid #28779c' : '1px solid #004666',
        boxShadow: active ? '0px 0px 12px 0px rgba(0,30,45,0.32)' : 'none',
        transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 7,
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#ffffff' : '#ccdfe9', fontFamily: "'Inter', sans-serif" }}>
          {name}
        </span>
        <StatusBadge status={status} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: active ? 'rgba(128,176,200,0.9)' : 'rgba(128,176,200,0.6)', fontFamily: "'Inter', sans-serif", fontVariantNumeric: 'tabular-nums' }}>
          {count.toLocaleString()} vehicles
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', borderRadius: 2, width: `${barPct}%`, background: 'linear-gradient(90deg, #28779c 0%, #28a0c8 100%)', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

// ─── Breakdown row ────────────────────────────────────────────────────────────
function BreakdownRow({ name, count, max }) {
  const barPct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#ccdfe9', fontFamily: "'Inter', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(128,176,200,0.75)', fontFamily: "'Inter', sans-serif", fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
          {count.toLocaleString()}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', borderRadius: 2, width: `${barPct}%`, background: 'linear-gradient(90deg, #28779c 0%, #28a0c8 100%)', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

// ─── Breakdown panel ──────────────────────────────────────────────────────────
function BreakdownPanel({ title, items }) {
  const max = items.length > 0 ? items[0].count : 0;
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'rgba(1,45,66,0.55)', border: '1px solid #153f53',
      borderRadius: 16, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase', flexShrink: 0 }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(item => (
          <BreakdownRow key={item.name} name={item.name} count={item.count} max={max} />
        ))}
      </div>
    </div>
  );
}

// ─── Interval detail ──────────────────────────────────────────────────────────
function IntervalDetail({ name, dist, isCreated, noErrors, onShowVins, campaignId, intervalIdx, onSegmentChange }) {
  const [segmentActive, setSegmentActive] = useState(false);
  function handleSegmentChange(v) { setSegmentActive(v); onSegmentChange?.(v); }
  const intervalDist = dist.filter(r => r.interval === name);
  const totalCount = intervalDist.reduce((s, r) => s + r.count, 0);
  const animTotal = useCountUp(totalCount);

  const { status, successRate } = getIntervalMeta(campaignId, intervalIdx);
  const intervalNum = name.replace('Interval ', '');

  const isIntervalCalculated = status === 'CALCULATED';
  const isIntervalFailed = status === 'FAILED';
  const isIntervalDisabled = isCreated || isIntervalCalculated;

  // Pick segment variant for this interval
  const variantIdx = (campaignId * 3 + intervalIdx * 7) % INTERVAL_SEGMENT_VARIANTS.length;
  let intervalSegments;
  if (isIntervalFailed) {
    intervalSegments = VEHICLE_SEGMENTS_FAILED;
  } else if (!isIntervalDisabled) {
    intervalSegments = noErrors
      ? INTERVAL_SEGMENT_VARIANTS_NO_ERRORS[variantIdx]
      : INTERVAL_SEGMENT_VARIANTS[variantIdx];
  }

  // Country breakdown
  const countryMap = {};
  intervalDist.forEach(r => { countryMap[r.country] = (countryMap[r.country] || 0) + r.count; });
  const countryItems = Object.entries(countryMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  // Model breakdown
  const modelMap = {};
  intervalDist.forEach(r => { modelMap[r.model] = (modelMap[r.model] || 0) + r.count; });
  const modelItems = Object.entries(modelMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  const countriesCount = countryItems.length;
  const modelsCount = modelItems.length;

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 68, paddingRight: 12, overflowY: 'auto' }}>
      {/* Row 1: Interval number / Countries / Models */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <StatCard value={intervalNum} label="Interval" />
        <StatCard value={countriesCount} label="Countries" />
        <StatCard value={modelsCount} label="Models" />
      </div>
      {/* Row 2: Success rate + Failure rate */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <ProgressCard
          value={`${successRate}%`}
          trend={successRate > 88 ? 'up' : 'down'}
          label="Success rate"
          barColor="linear-gradient(90deg, #28779c 0%, #28a0c8 100%)"
          barWidth={`${successRate}%`}
          empty={isIntervalDisabled}
        />
        <ProgressCard
          value={`${100 - successRate}%`}
          trend={(100 - successRate) > 12 ? 'down' : 'up'}
          label="Failure rate"
          barColor="linear-gradient(90deg, #8b2020 0%, #cc3333 100%)"
          barWidth={`${100 - successRate}%`}
          empty={isIntervalDisabled}
        />
      </div>

      {/* Vehicle distribution bar */}
      <div style={{
        flexShrink: 0,
        background: 'rgba(1,45,66,0.55)', border: '1px solid #153f53',
        borderRadius: 16, padding: '14px 20px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>
              {animTotal.toLocaleString('en-US').replace(/,/g, '\u00a0')}
            </span>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2 }}>Vehicles</div>
          </div>
          <ShowVinsButton onClick={() => onShowVins(name, null, intervalSegments ?? null)} disabled={segmentActive} />
        </div>
        <VehicleBar totalVehicles={totalCount} disabled={isIntervalDisabled} onShowVins={seg => onShowVins(name, seg, null)} noErrors={noErrors && !isIntervalFailed} segmentsOverride={intervalSegments} onSegmentChange={handleSegmentChange} />
      </div>

      {/* Breakdown panels */}
      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        <BreakdownPanel title="BY COUNTRY" items={countryItems} />
        <BreakdownPanel title="BY MODEL" items={modelItems} />
      </div>
    </div>
  );
}

// ─── Intervals view ───────────────────────────────────────────────────────────
function IntervalsView({ dist, campaignFilters, isCreated, noErrors, onShowVins, campaignId, onSegmentChange }) {
  const intervals = campaignFilters.intervals;
  const [selectedInterval, setSelectedInterval] = useState(intervals[0] ?? null);

  // Reset segment state when switching intervals
  useEffect(() => { onSegmentChange?.(false); }, [selectedInterval]);

  // Auto-select first interval when intervals list changes
  useEffect(() => {
    if (intervals.length > 0) setSelectedInterval(intervals[0]);
  }, [intervals.join(',')]);

  // Count per interval
  const intervalCounts = intervals.map((iv, i) => ({
    name: iv,
    idx: i,
    count: dist.filter(r => r.interval === iv).reduce((s, r) => s + r.count, 0),
    status: getIntervalMeta(campaignId, i).status,
  }));
  const maxCount = Math.max(...intervalCounts.map(i => i.count), 1);
  const selIdx = intervals.indexOf(selectedInterval);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 16 }}>
      {/* Left panel: interval list */}
      <div style={{
        width: 220, flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: 6,
        overflowY: 'auto', paddingBottom: 60, paddingRight: 12,
      }}>
        {intervalCounts.map(({ name, count, status }) => (
          <IntervalListItem
            key={name}
            name={name}
            count={count}
            maxCount={maxCount}
            active={selectedInterval === name}
            onClick={() => setSelectedInterval(name)}
            status={status}
          />
        ))}
      </div>

      {/* Right panel: interval detail */}
      {selectedInterval !== null && (
        <IntervalDetail
          name={selectedInterval}
          dist={dist}
          isCreated={isCreated}
          noErrors={noErrors}
          onShowVins={onShowVins}
          campaignId={campaignId}
          intervalIdx={selIdx}
          onSegmentChange={onSegmentChange}
        />
      )}
    </div>
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
  const isCampaignFailed = campaign.statuses[0] === 'FAILED';
  const launchRate   = isCampaignFailed ? r(55, 72, 7) : PERFECT_LAUNCH_IDS.has(s) ? 100 : r(78, 99, 7);
  const successRate  = isCampaignFailed ? 5 + ((s * 11 + 8 * 7) % 14) : r(72, 98, 8);
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

// ─── Approve campaign modal ───────────────────────────────────────────────────
function ApproveModal({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);
  const [approveHovered, setApproveHovered] = useState(false);

  function handleClose() { setClosing(true); }

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,46,67,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease',
        }}
      />
      <div
        onAnimationEnd={() => { if (closing) onClose(); }}
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          width: 568,
          background: 'rgba(1,45,66,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #153f53',
          borderRadius: 24,
          padding: 24,
          display: 'flex', flexDirection: 'column', gap: 24,
          boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.16)',
          zIndex: 201,
          boxSizing: 'border-box',
          animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>
            Approve Campaign
          </span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                width: 24, height: 24, background: 'none', border: 'none', padding: 0,
                cursor: 'pointer',
                color: closeHovered ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {closeHovered && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                transform: 'translateX(-50%)',
                padding: '3px 8px', borderRadius: 4,
                background: '#012d42', border: '1px solid #153f53',
                fontSize: 10, fontWeight: 600, color: '#80b0c8',
                fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                pointerEvents: 'none', zIndex: 210,
              }}>
                Close
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{
          background: '#012d42', border: '1px solid #153f53',
          borderRadius: 16, padding: '16px 24px 20px',
          display: 'flex', flexDirection: 'column', gap: 12,
          boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.24)',
        }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#ccdfe9', fontFamily: "'Inter', sans-serif", lineHeight: '20px', margin: 0 }}>
            Approving this campaign will schedule it for execution according to the configured parameters. All vehicles matching the campaign criteria will begin receiving the update. Once approved, the campaign cannot be reverted to draft.
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: '22px', margin: 0 }}>
            Are you sure you want to approve this campaign?
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleClose}
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              style={{
                padding: '10px 18px', borderRadius: 8,
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10,
                letterSpacing: 1.2, textTransform: 'uppercase',
                color: '#ccdfe9',
                background: cancelHovered ? '#013d58' : '#012d42',
                border: '1px solid #004666',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              Cancel
            </button>
            <button
              onMouseEnter={() => setApproveHovered(true)}
              onMouseLeave={() => setApproveHovered(false)}
              style={{
                padding: '10px 18px', borderRadius: 8,
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10,
                letterSpacing: 1.2, textTransform: 'uppercase',
                color: approveHovered ? '#4cd87a' : '#38b060',
                background: approveHovered ? 'rgba(40,140,80,0.35)' : 'rgba(40,140,80,0.2)',
                border: `1px solid ${approveHovered ? 'rgba(60,160,90,0.5)' : 'rgba(40,140,80,0.35)'}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Abort campaign modal ────────────────────────────────────────────────────
function AbortModal({ onClose }) {
  const [closing, setClosing] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);
  const [abortHovered, setAbortHovered] = useState(false);

  function handleClose() { setClosing(true); }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,46,67,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          animation: closing ? 'backdropFadeOut 0.18s ease forwards' : 'backdropFadeIn 0.22s ease',
        }}
      />
      {/* Modal */}
      <div
        onAnimationEnd={() => { if (closing) onClose(); }}
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          width: 568,
          background: 'rgba(1,45,66,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #153f53',
          borderRadius: 24,
          padding: 24,
          display: 'flex', flexDirection: 'column', gap: 24,
          boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.16)',
          zIndex: 201,
          boxSizing: 'border-box',
          animation: closing ? 'modalFadeOut 0.18s ease forwards' : 'modalFadeIn 0.22s ease forwards',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4 }}>
            Abort Campaign
          </span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleClose}
              onMouseEnter={() => setCloseHovered(true)}
              onMouseLeave={() => setCloseHovered(false)}
              style={{
                width: 24, height: 24, background: 'none', border: 'none', padding: 0,
                cursor: 'pointer',
                color: closeHovered ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            {closeHovered && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                transform: 'translateX(-50%)',
                padding: '3px 8px', borderRadius: 4,
                background: '#012d42', border: '1px solid #153f53',
                fontSize: 10, fontWeight: 600, color: '#80b0c8',
                fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                pointerEvents: 'none', zIndex: 210,
              }}>
                Close
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{
          background: '#012d42', border: '1px solid #153f53',
          borderRadius: 16, padding: '16px 24px 20px',
          display: 'flex', flexDirection: 'column', gap: 12,
          boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.24)',
        }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#ccdfe9', fontFamily: "'Inter', sans-serif", lineHeight: '20px', margin: 0 }}>
            Aborting the campaign will initiate its cancellation, followed by the completion of all updates currently in progress. Vehicles that have not yet started updating will be skipped and will remain on their current software version. This action cannot be undone.
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif", lineHeight: '22px', margin: 0 }}>
            Are you sure you want to abort this campaign?
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleClose}
              onMouseEnter={() => setCancelHovered(true)}
              onMouseLeave={() => setCancelHovered(false)}
              style={{
                padding: '10px 18px', borderRadius: 8,
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10,
                letterSpacing: 1.2, textTransform: 'uppercase',
                color: '#ccdfe9',
                background: cancelHovered ? '#013d58' : '#012d42',
                border: '1px solid #004666',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              Cancel
            </button>
            <button
              onMouseEnter={() => setAbortHovered(true)}
              onMouseLeave={() => setAbortHovered(false)}
              style={{
                padding: '10px 18px', borderRadius: 8,
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10,
                letterSpacing: 1.2, textTransform: 'uppercase',
                color: abortHovered ? '#ff6060' : '#cc4433',
                background: abortHovered ? 'rgba(180,40,40,0.35)' : 'rgba(180,40,40,0.2)',
                border: `1px solid ${abortHovered ? 'rgba(200,60,60,0.5)' : 'rgba(180,40,40,0.35)'}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              Abort
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function BackButton({ onClick, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 32, height: 32, borderRadius: 8,
          border: 'none', background: 'none',
          color: hovered ? '#ccdfe9' : 'rgba(128,176,200,0.5)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>
      {hovered && (
        <div style={{
          position: 'absolute', left: 'calc(100% + 8px)', top: '50%',
          transform: 'translateY(-50%)',
          padding: '4px 10px', borderRadius: 6,
          background: '#012d42', border: '1px solid #153f53',
          fontSize: 11, fontWeight: 600, color: '#80b0c8',
          fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 200,
          boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
          animation: 'tooltipFadeInRight 0.12s ease forwards',
        }}>
          {label ?? 'Back to Production'}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CampaignDetailView({ campaign, onBack, activeBrand, onBrandChange, onLogout, isTest, onExternalNavChange }) {
  const [activeNav, setActiveNav] = useState(isTest ? 'people' : 'aftersales');
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [configureOpen, setConfigureOpen] = useState(false);
  const [abortOpen, setAbortOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState(null);
  const [vinsOpen, setVinsOpen] = useState(false);
  const [vinsIntervalOverride, setVinsIntervalOverride] = useState(null);
  const [vinsSegmentFilter, setVinsSegmentFilter] = useState(null);
  const [vinsVehicleSegments, setVinsVehicleSegments] = useState(null);
  const [campaignSegmentActive, setCampaignSegmentActive] = useState(false);
  const [waveSegmentActive, setWaveSegmentActive] = useState(false);
  const [copyToast, setCopyToast] = useState(null); // vin string or null

  const brandId = activeBrand?.id ?? 'vw';
  const campaignFilters = getCampaignFilters(campaign, brandId);
  const dist = getCampaignDistribution(campaign, brandId);

  useEffect(() => { setSelectedCountry(null); setSelectedModel(null); setSelectedInterval(null); setWaveSegmentActive(false); }, [campaign.id]);
  useEffect(() => { setWaveSegmentActive(false); }, [activeTab]);
  useEffect(() => { setSelectedModel(null); setSelectedInterval(null); }, [brandId]);

  // ── Cascading available options derived from the distribution ────────────────
  const availableModels = selectedCountry !== null
    ? [...new Set(dist.filter(r => r.country === selectedCountry).map(r => r.model))]
    : campaignFilters.models;

  // Effective model: null if current selection is no longer in available list
  const effectiveModel = selectedModel !== null && availableModels.includes(selectedModel) ? selectedModel : null;

  const availableIntervals = (selectedCountry !== null || effectiveModel !== null)
    ? [...new Set(
        dist.filter(r =>
          (selectedCountry === null || r.country === selectedCountry) &&
          (effectiveModel === null  || r.model   === effectiveModel)
        ).map(r => r.interval)
      )]
    : campaignFilters.intervals;

  const effectiveInterval = selectedInterval !== null && availableIntervals.includes(selectedInterval) ? selectedInterval : null;

  // Sync state for stale selections (async, avoids UI flash via effective* above)
  useEffect(() => { if (effectiveModel    !== selectedModel)    setSelectedModel(effectiveModel); },    [effectiveModel,    selectedModel]);
  useEffect(() => { if (effectiveInterval !== selectedInterval) setSelectedInterval(effectiveInterval); }, [effectiveInterval, selectedInterval]);

  // ── Filtered vehicle count from distribution ─────────────────────────────────
  const totalVehiclesRaw = parseInt(String(campaign.vehicles).replace(/[\s\u00a0,]/g, ''), 10) || 0;
  const filtVehiclesNum = dist
    .filter(r =>
      (selectedCountry   === null || r.country  === selectedCountry) &&
      (effectiveModel    === null || r.model    === effectiveModel) &&
      (effectiveInterval === null || r.interval === effectiveInterval)
    )
    .reduce((sum, r) => sum + r.count, 0) || (totalVehiclesRaw > 0 && !selectedCountry && !effectiveModel && !effectiveInterval ? totalVehiclesRaw : 0);

  const hasFilter = selectedCountry !== null || effectiveModel !== null || effectiveInterval !== null;
  const filterScale = totalVehiclesRaw > 0 ? filtVehiclesNum / totalVehiclesRaw : 0;
  // Small deterministic variance per filter combo (keeps rates plausible per-slice)
  const cIdx = selectedCountry ? campaignFilters.countries.indexOf(selectedCountry) : -1;
  const mIdx = effectiveModel  ? campaignFilters.models.indexOf(effectiveModel)     : -1;
  const iIdx = effectiveInterval ? campaignFilters.intervals.indexOf(effectiveInterval) : -1;
  const fSeed = (cIdx >= 0 ? cIdx * 7 : 0) + (mIdx >= 0 ? mIdx * 13 : 0) + (iIdx >= 0 ? iIdx * 5 : 0);
  const rv = (fSeed % 11) - 5; // −5 … +5

  function handleBack() {
    onBack();
  }

  function handleShowVinsForInterval(intervalName, segFilter = null, vehicleSegs = null) {
    setVinsIntervalOverride(intervalName);
    setVinsSegmentFilter(segFilter);
    setVinsVehicleSegments(segFilter ? null : vehicleSegs);
    setVinsOpen(true);
  }

  function handleRefresh() {
    setRefreshing(true);
    setLoadStep(0);
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
    setTimeout(() => setLoadStep(1), 450);
    setTimeout(() => setLoadStep(2), 900);
    setTimeout(() => setLoaderVisible(false), 1300);
    setTimeout(() => { setRefreshing(false); setLoaderVisible(false); setLoadStep(0); }, 1600);
  }

  const animVehicles = useCountUp(filtVehiclesNum);

  if (refreshing) {
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
              {campaign.name}
            </div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: '2px solid rgba(128,176,200,0.15)', borderTopColor: '#28a0c8',
            animation: 'iteruSpin 0.85s linear infinite',
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOAD_STEPS_REFRESH.map((s, i) => (
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
  const isCreated = status === 'CREATED' || status === 'CALCULATED';
  const isActive = status === 'RUNNING';
  const isFailed = status === 'FAILED';
  const stats = getCampaignStats(campaign);

  // ── Filtered stats ───────────────────────────────────────────────────────────
  const filtVehiclesStr = animVehicles.toLocaleString('en-US').replace(/,/g, '\u00a0');
  const filtSuccessRate = isFailed ? stats.successRate : hasFilter ? Math.min(98, Math.max(70, stats.successRate + rv)) : stats.successRate;
  const filtFailureRate = isFailed ? stats.failureRate : hasFilter ? 100 - filtSuccessRate : stats.failureRate;
  const filtLaunchRate  = isFailed ? stats.launchRate : hasFilter ? Math.min(100, Math.max(78, stats.launchRate + ((fSeed % 7) - 3))) : stats.launchRate;
  const campaignVehicleSegments = isFailed ? VEHICLE_SEGMENTS_FAILED : filtLaunchRate === 100 ? VEHICLE_SEGMENTS_NO_ERRORS : VEHICLE_SEGMENTS;
  const filtDailyCars   = hasFilter ? Math.max(1, Math.round(stats.dailyCars * filterScale)) : stats.dailyCars;
  // Models/countries counts reflect cascading selections
  const filtModels = effectiveModel !== null
    ? 1
    : selectedCountry !== null
      ? availableModels.length
      : stats.models;
  const filtCountries = selectedCountry !== null
    ? 1
    : effectiveModel !== null
      ? [...new Set(dist.filter(r => r.model === effectiveModel).map(r => r.country))].length
      : stats.countries;

  return (
    <>
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #005478 0%, #004060 40%, #002233 100%)',
      backgroundColor: '#003050',
      padding: 24, gap: 24, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      <Sidebar activeNav={activeNav} onNavChange={nav => { setActiveNav(nav); if (onExternalNavChange) onExternalNavChange(nav); }} attentionCount={11} testAttentionCount={5} activeBrand={activeBrand} onBrandChange={onBrandChange} onLogout={onLogout} />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, position: 'relative' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          {/* Back button */}
          <BackButton onClick={handleBack} label={isTest ? 'Back to Tests' : 'Back to Production'} />

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

        {activeTab === 'OVERVIEW' && (<>
        {/* ── Filter bar ── */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {!isTest && (
            <FilterDropdown
              allLabel="All Countries"
              options={campaignFilters.countries}
              value={selectedCountry}
              onChange={setSelectedCountry}
              triggerWidth={168}
            />
          )}
          <FilterDropdown
            allLabel="All Models"
            options={availableModels}
            value={effectiveModel}
            onChange={setSelectedModel}
            triggerWidth={144}
          />
          {!isTest && (
            <FilterDropdown
              allLabel="All Intervals"
              options={availableIntervals}
              value={effectiveInterval}
              onChange={setSelectedInterval}
              triggerWidth={126}
            />
          )}
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          {/* Row 1: 6 small cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {isCreated
              ? <StatCard value={`-${stats.days}`} unit="days" label={`To start (${stats.startDate})`} />
              : <StatCard value={stats.days} unit="days" label={`Since start (${stats.startDate})`} />
            }
            <StatCard value={filtModels} label="Models" />
            <StatCard value={filtCountries} label="Countries" />
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
              value={isCreated ? '–' : filtDailyCars}
              unit={isCreated ? undefined : 'cars'}
              trend={isCreated ? undefined : stats.carsTrend}
              label="Updated vehicles each day"
            />
          </div>

          {/* Row 2: 3 progress cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            <ProgressCard
              value={isCreated ? '–' : `${filtLaunchRate}%`}
              trend={isCreated ? undefined : (filtLaunchRate === 100 ? 'neutral' : 'down')}
              label="Launch rate"
              barColor="linear-gradient(90deg, #28779c 0%, #28a0c8 100%)"
              barWidth={`${filtLaunchRate}%`}
              empty={isCreated}
            />
            <ProgressCard
              value={isCreated ? '–' : `${filtSuccessRate}%`}
              trend={isCreated ? undefined : (filtSuccessRate > 88 ? 'up' : 'down')}
              label="Success rate"
              barColor="linear-gradient(90deg, #28779c 0%, #28a0c8 100%)"
              barWidth={`${filtSuccessRate}%`}
              empty={isCreated}
            />
            <ProgressCard
              value={isCreated ? '–' : `${filtFailureRate}%`}
              trend={isCreated ? undefined : (filtFailureRate > 12 ? 'up' : 'down')}
              label="Failure rate"
              barColor="linear-gradient(90deg, #8b2020 0%, #cc3333 100%)"
              barWidth={`${filtFailureRate}%`}
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
              <span style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>{filtVehiclesStr}</span>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(128,176,200,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2 }}>Vehicles</div>
            </div>
            <ShowVinsButton onClick={() => { setVinsIntervalOverride(null); setVinsSegmentFilter(null); setVinsVehicleSegments(campaignVehicleSegments); setVinsOpen(true); }} disabled={campaignSegmentActive} />
          </div>

          <VehicleBar totalVehicles={filtVehiclesNum} disabled={isCreated} onShowVins={seg => { setVinsIntervalOverride(null); setVinsSegmentFilter(seg); setVinsVehicleSegments(null); setVinsOpen(true); }} noErrors={!isFailed && filtLaunchRate === 100} segmentsOverride={isFailed ? VEHICLE_SEGMENTS_FAILED : undefined} onSegmentChange={setCampaignSegmentActive} />
        </div>
        </>)}

        {!isTest && activeTab === 'WAVES' && (
          <IntervalsView
            dist={dist}
            campaignFilters={campaignFilters}
            isCreated={isCreated}
            noErrors={filtLaunchRate === 100}
            onShowVins={handleShowVinsForInterval}
            campaignId={campaign.id}
          />
        )}

        {/* ── Bottom action bar (floating) ── */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 8px', borderRadius: 14,
          background: 'rgba(1,45,66,0.75)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #153f53',
          boxShadow: '0px 8px 32px rgba(0,0,0,0.48)',
          animation: 'floatingBarEnter 0.45s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          {!isTest && (
            <>
              <BottomTab label="OVERVIEW" active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} />
              <BottomTab label="INTERVALS" active={activeTab === 'WAVES'} onClick={() => setActiveTab('WAVES')} />
              {/* Divider */}
              <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
            </>
          )}

          {/* Icon buttons */}
          <IconBtn tooltip="Campaign Parameters" onClick={() => setConfigureOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </IconBtn>
          {isActive && (
            <IconBtn tooltip="Refresh" onClick={handleRefresh}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
            </IconBtn>
          )}
          {isCreated && (
            <IconBtn tooltip="Approve campaign" approve onClick={() => setApproveOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </IconBtn>
          )}
          {isActive && (
            <IconBtn tooltip="Abort campaign" danger onClick={() => setAbortOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </IconBtn>
          )}
        </div>

        {configureOpen && <ConfigureOverlay onClose={() => setConfigureOpen(false)} />}
        {abortOpen && <AbortModal onClose={() => setAbortOpen(false)} />}
        {approveOpen && <ApproveModal onClose={() => setApproveOpen(false)} />}
        {vinsOpen && (
          <VinsModal
            campaign={campaign}
            dist={dist}
            selectedCountry={vinsIntervalOverride !== null ? null : selectedCountry}
            effectiveModel={vinsIntervalOverride !== null ? null : effectiveModel}
            effectiveInterval={vinsIntervalOverride !== null ? vinsIntervalOverride : effectiveInterval}
            segmentFilter={vinsSegmentFilter}
            vehicleSegments={vinsVehicleSegments}
            onClose={() => { setVinsOpen(false); setVinsIntervalOverride(null); setVinsSegmentFilter(null); setVinsVehicleSegments(null); }}
            onCopy={vin => setCopyToast(vin)}
            isTest={isTest}
          />
        )}
      </div>
    </div>
    {copyToast && <CopyToast key={copyToast} vin={copyToast} onDone={() => setCopyToast(null)} />}
    </>
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
