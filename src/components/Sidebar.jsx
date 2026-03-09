import { useState } from 'react';

const base = import.meta.env.BASE_URL;

// ─── Icons from Figma — wszystkie w viewBox 24×24, vectorEffect="non-scaling-stroke"
// stroke="currentColor" dziedziczy kolor z NavIcon (active/hover/normal)

const NSS = { vectorEffect: 'non-scaling-stroke' }; // shorthand

// Car + wink face (AfterSales) — viewBox 24×28 (wyższy bo 2 warstwy)
const AfterSalesIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Car — skalowany równomiernie do szerokości 22, wyśrodkowany */}
    <g transform="translate(0,1) scale(0.6471)">
      <path {...NSS} d="M5.36761 14.7143H3.91174C2.31028 14.7143 1 13.3429 1 11.6667V8.72571C1 7.70476 1.48044 6.76 2.29572 6.19619L5.36761 4.04762L7.42039 1.89905C7.97362 1.32 8.70156 1 9.47317 1H20.1592C20.9309 1 21.6734 1.32 22.212 1.89905L27.1765 7.09524L30.8016 8.04C32.0974 8.37524 33 9.59429 33 10.9962V13.1905C33 14.0286 32.3449 14.7143 31.5441 14.7143H30.0883" />
    </g>
    {/* Wink circle — wyśrodkowany u dołu */}
    <circle {...NSS} cx="12" cy="21" r="6.5" />
    <line {...NSS} x1="9.2" y1="20" x2="11" y2="20" />
    <line {...NSS} x1="14.5" y1="19.5" x2="14.5" y2="20.6" />
    <path {...NSS} d="M9.5 22.8C10.1 24 11 24.6 12 24.6C13 24.6 13.9 24 14.5 22.8" />
  </svg>
);

// Car + magnifying glass (Search/Vehicles) — skalowany równomiernie
const SearchCarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0,0) scale(0.706)">
      <path {...NSS} d="M5.36761 14.7143H3.91174C2.31028 14.7143 1 13.3429 1 11.6667V8.72571C1 7.70476 1.48044 6.76 2.29572 6.19619L5.36761 4.04762L7.42039 1.89905C7.97362 1.32 8.70156 1 9.47317 1H20.1592C20.9309 1 21.6734 1.32 22.212 1.89905L27.1765 7.09524L30.8016 8.04C32.0974 8.37524 33 9.59429 33 10.9962V13.1905C33 14.0286 32.3449 14.7143 31.5441 14.7143H30.0883" />
      <path {...NSS} d="M22.9199 20.3008L26 23.381" />
      <path {...NSS} d="M25.1111 14.9621C25.1111 19.149 21.7284 22.5432 17.5556 22.5432C13.3827 22.5432 10 19.149 10 14.9621C10 10.7752 13.3827 7.38098 17.5556 7.38098C21.7284 7.38098 25.1111 10.7752 25.1111 14.9621Z" />
    </g>
  </svg>
);

// Car + settings gear — oba skalowane równomiernie
const SettingsCarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Car — scale(0.6471) żeby zmieścić 34→22 */}
    <g transform="translate(0,1) scale(0.6471)">
      <path {...NSS} d="M5.36761 14.7143H3.91174C2.31028 14.7143 1 13.3429 1 11.6667V8.72571C1 7.70476 1.48044 6.76 2.29572 6.19619L5.36761 4.04762L7.42039 1.89905C7.97362 1.32 8.70156 1 9.47317 1H20.1592C20.9309 1 21.6734 1.32 22.212 1.89905L27.1765 7.09524L30.8016 8.04C32.0974 8.37524 33 9.59429 33 10.9962V13.1905C33 14.0286 32.3449 14.7143 31.5441 14.7143H30.0883" />
    </g>
    {/* Gears — scale(0.9) żeby zmieścić 18.57→16.7, translate do prawego dolnego rogu */}
    <g transform="translate(4,9) scale(0.9)">
      <path {...NSS} d="M11.9868 10C11.9868 11.4912 10.7779 12.7 9.28675 12.7C7.79559 12.7 6.58675 11.4912 6.58675 10C6.58675 8.50883 7.79559 7.3 9.28675 7.3C10.7779 7.3 11.9868 8.50883 11.9868 10Z" />
      <path {...NSS} d="M11.497 2.23079C11.252 1.49577 10.5642 1 9.78939 1H8.78412C8.00935 1 7.3215 1.49577 7.07649 2.23079L6.73118 3.26672C6.00188 3.54367 5.32924 3.93572 4.73546 4.42067L3.66353 4.20131C2.90449 4.04599 2.13121 4.39379 1.74382 5.06477L1.24119 5.93535C0.8538 6.60633 0.939228 7.44991 1.45327 8.0296L2.17851 8.84746C2.11813 9.22273 2.08675 9.6077 2.08675 10C2.08675 10.3923 2.11813 10.7773 2.17851 11.1525L1.45327 11.9704C0.939228 12.5501 0.8538 13.3937 1.24119 14.0646L1.74382 14.9352C2.13121 15.6062 2.90449 15.954 3.66353 15.7987L4.73546 15.5793C5.32924 16.0643 6.00188 16.4563 6.73118 16.7333L7.07649 17.7692C7.3215 18.5042 8.00935 19 8.78412 19H9.78939C10.5642 19 11.252 18.5042 11.497 17.7692L11.8423 16.7333C12.5716 16.4563 13.2442 16.0643 13.8379 15.5794L14.91 15.7988C15.669 15.9541 16.4423 15.6063 16.8297 14.9354L17.3323 14.0648C17.7197 13.3938 17.6343 12.5502 17.1202 11.9705L16.395 11.1526C16.4554 10.7773 16.4868 10.3923 16.4868 10C16.4868 9.6077 16.4554 9.22273 16.395 8.84746L17.1202 8.0296C17.6343 7.44991 17.7197 6.60633 17.3323 5.93535L16.8297 5.06477C16.4423 4.39379 15.669 4.04599 14.91 4.20131L13.838 4.42067C13.2443 3.93572 12.5716 3.54367 11.8423 3.26672L11.497 2.23079Z" />
    </g>
  </svg>
);

// Bell (pixelpf — skalowany równomiernie do 24×24)
const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(2.1,1) scale(1.01)">
      <path {...NSS} d="M11.8851 21H7.88506M10.8851 1L8.88506 1M3.88506 8V9C3.88506 9.78149 3.88506 10.2343 3.9217 10.5897L2.95273 11.823C1.64857 13.4828 0.996485 14.3127 1.00001 15.0101C1.00308 15.6167 1.28131 16.1892 1.7564 16.5664C2.30259 17 3.35804 17 5.46895 17L14.3012 17C16.4121 17 17.4675 17 18.0137 16.5664C18.4888 16.1892 18.767 15.6167 18.7701 15.0101C18.7736 14.3127 18.1216 13.4828 16.8174 11.823L15.8484 10.5897C15.8851 10.2343 15.8851 9.78148 15.8851 9V8C15.8851 7.07099 15.8851 6.60649 15.8235 6.21783C15.4846 4.07837 13.8067 2.40042 11.6672 2.06156C11.2786 2 10.8141 2 9.88506 2C8.95606 2 8.49155 2 8.10289 2.06156C5.96343 2.40042 4.28548 4.07837 3.94662 6.21783C3.88506 6.60649 3.88506 7.07099 3.88506 8Z" />
    </g>
  </svg>
);

// Calendar with download arrow
const CalendarDownIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Body — skalowany równomiernie scale(0.88): 26→22.9 */}
    <g transform="translate(0.5,0.5) scale(0.88)">
      <path {...NSS} d="M1 11.6667C1 6.00981 1 4.51472 2.75736 2.75736C4.51472 1 7.34315 1 13 1C18.6569 1 21.4853 1 23.2426 2.75736C25 4.51472 25 6.00981 25 11.6667C25 17.3235 25 20.1519 23.2426 21.9093C21.4853 23.6667 18.6569 23.6667 13 23.6667C7.34315 23.6667 4.51472 23.6667 2.75736 21.9093C1 20.1519 1 17.3235 1 11.6667Z" />
      <line {...NSS} x1="1" y1="7" x2="25" y2="7" />
      <line {...NSS} x1="7.5" y1="0" x2="7.5" y2="4" />
      <line {...NSS} x1="18.5" y1="0" x2="18.5" y2="4" />
      <line {...NSS} x1="13" y1="10" x2="13" y2="18" />
      <path {...NSS} d="M10 15.5L13 19L16 15.5" />
    </g>
  </svg>
);

// Chevron right — viewBox dopasowany do proporcji ścieżki
const ChevronRightIcon = () => (
  <svg width="22" height="22" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18L10 10L2 2" />
  </svg>
);

// Klasyczne koło zębate (setting-6-gears z Figmy, skalowane do 24×24)
const GearIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(2.1,2) scale(1.07)">
      <path {...NSS} d="M11.9868 10C11.9868 11.4912 10.7779 12.7 9.28675 12.7C7.79559 12.7 6.58675 11.4912 6.58675 10C6.58675 8.50883 7.79559 7.3 9.28675 7.3C10.7779 7.3 11.9868 8.50883 11.9868 10Z" />
      <path {...NSS} d="M11.497 2.23079C11.252 1.49577 10.5642 1 9.78939 1H8.78412C8.00935 1 7.3215 1.49577 7.07649 2.23079L6.73118 3.26672C6.00188 3.54367 5.32924 3.93572 4.73546 4.42067L3.66353 4.20131C2.90449 4.04599 2.13121 4.39379 1.74382 5.06477L1.24119 5.93535C0.8538 6.60633 0.939228 7.44991 1.45327 8.0296L2.17851 8.84746C2.11813 9.22273 2.08675 9.6077 2.08675 10C2.08675 10.3923 2.11813 10.7773 2.17851 11.1525L1.45327 11.9704C0.939228 12.5501 0.8538 13.3937 1.24119 14.0646L1.74382 14.9352C2.13121 15.6062 2.90449 15.954 3.66353 15.7987L4.73546 15.5793C5.32924 16.0643 6.00188 16.4563 6.73118 16.7333L7.07649 17.7692C7.3215 18.5042 8.00935 19 8.78412 19H9.78939C10.5642 19 11.252 18.5042 11.497 17.7692L11.8423 16.7333C12.5716 16.4563 13.2442 16.0643 13.8379 15.5794L14.91 15.7988C15.669 15.9541 16.4423 15.6063 16.8297 14.9354L17.3323 14.0648C17.7197 13.3938 17.6343 12.5502 17.1202 11.9705L16.395 11.1526C16.4554 10.7773 16.4868 10.3923 16.4868 10C16.4868 9.6077 16.4554 9.22273 16.395 8.84746L17.1202 8.0296C17.6343 7.44991 17.7197 6.60633 17.3323 5.93535L16.8297 5.06477C16.4423 4.39379 15.669 4.04599 14.91 4.20131L13.838 4.42067C13.2443 3.93572 12.5716 3.54367 11.8423 3.26672L11.497 2.23079Z" />
    </g>
  </svg>
);

const Divider = () => (
  <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />
);

function NavIcon({ icon, active, badge, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 48, height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 12,
        background: active ? '#004666' : hovered ? 'rgba(0,70,102,0.3)' : 'transparent',
        boxShadow: active ? '0px 1px 4px 0px rgba(0,37,55,0.32)' : 'none',
        color: active ? '#ffffff' : hovered ? '#80b0c8' : 'rgba(128,176,200,0.5)',
        transition: 'background 0.15s, color 0.15s',
        position: 'relative',
      }}>
        {icon}
        {badge != null && (
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 18, height: 18, borderRadius: 9,
            background: '#cc4422',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700, color: '#fff',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 2px 6px rgba(180,40,20,0.55), 0 1px 2px rgba(0,0,0,0.3)',
          }}>
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ activeNav, onNavChange, attentionCount }) {
  return (
    <div style={{
      width: 80,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      background: '#012d42',
      border: '1px solid #004666',
      borderRadius: 24,
      boxShadow: '0px 0px 12px 0px rgba(0,30,45,0.32)',
      overflow: 'hidden',
    }}>
      {/* Logo + GVU PRO */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8, paddingTop: 24, paddingBottom: 12,
      }}>
        <img
          src={base + 'assets/vw.svg'}
          alt="VW"
          style={{ width: 32, height: 32, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
        />
        <div style={{ textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
          <div style={{ fontSize: 13, letterSpacing: 0.3, color: '#ffffff', lineHeight: '16px' }}>GVU</div>
          <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#ccdfe9', opacity: 0.5, lineHeight: '12px' }}>PRO</div>
        </div>
      </div>

      <Divider />

      <NavIcon icon={<AfterSalesIcon />} active={activeNav === 'aftersales'} badge={attentionCount} onClick={() => onNavChange('aftersales')} />
      <NavIcon icon={<SearchCarIcon />} active={activeNav === 'people'} onClick={() => onNavChange('people')} />
      <NavIcon icon={<SettingsCarIcon />} active={activeNav === 'settings'} onClick={() => onNavChange('settings')} />

      <Divider />

      <NavIcon icon={<BellIcon />} active={activeNav === 'bell'} badge={1} onClick={() => onNavChange('bell')} />
      <NavIcon icon={<CalendarDownIcon />} active={activeNav === 'calendar'} onClick={() => onNavChange('calendar')} />

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      <Divider />

      <NavIcon icon={<ChevronRightIcon />} onClick={() => {}} />
      <NavIcon icon={<GearIcon />} onClick={() => {}} />

      {/* Avatar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px 0 16px',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: '#004666',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#80b0c8',
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
        }}>
          MC
        </div>
      </div>
    </div>
  );
}
