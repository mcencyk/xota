import { useState } from 'react';
import { BRANDS } from './BrandGrid';

const base = import.meta.env.BASE_URL;

// ─── Icons from Figma — wszystkie w viewBox 24×24, vectorEffect="non-scaling-stroke"
// stroke="currentColor" dziedziczy kolor z NavIcon (active/hover/normal)

const NSS = { vectorEffect: 'non-scaling-stroke' }; // shorthand

// Grid (Overview)
const GridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path {...NSS} d="M1 3C1 1.89543 1.89543 1 3 1H6C7.10457 1 8 1.89543 8 3V6C8 7.10457 7.10457 8 6 8H3C1.89543 8 1 7.10457 1 6V3Z" />
    <path {...NSS} d="M12 3C12 1.89543 12.8954 1 14 1H17C18.1046 1 19 1.89543 19 3V6C19 7.10457 18.1046 8 17 8H14C12.8954 8 12 7.10457 12 6V3Z" />
    <path {...NSS} d="M1 14C1 12.8954 1.89543 12 3 12H6C7.10457 12 8 12.8954 8 14V17C8 18.1046 7.10457 19 6 19H3C1.89543 19 1 18.1046 1 17V14Z" />
    <path {...NSS} d="M12 14C12 12.8954 12.8954 12 14 12H17C18.1046 12 19 12.8954 19 14V17C19 18.1046 18.1046 19 17 19H14C12.8954 19 12 18.1046 12 17V14Z" />
  </svg>
);

// Atom (Criterions)
const AtomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path {...NSS} d="M15.4708 15.4708C14.0329 16.9086 12.5047 18.0975 10.9996 18.9996M6.52845 6.52846C7.96629 5.09062 9.49453 3.90172 10.9996 2.99961M10.9996 18.9996C9.49454 18.0975 7.96629 16.9086 6.52846 15.4708C5.09063 14.0329 3.90173 12.5047 2.99962 10.9996M10.9996 18.9996C14.6642 21.1961 18.1915 21.6924 19.9419 19.9419C21.6924 18.1915 21.1961 14.6642 18.9996 10.9996M10.9996 18.9996C7.33501 21.1961 3.80774 21.6924 2.0573 19.9419C0.306863 18.1915 0.803135 14.6642 2.99962 10.9996M18.9996 10.9996C18.0975 9.49453 16.9086 7.96629 15.4708 6.52846C14.0329 5.09062 12.5047 3.90172 10.9996 2.99961M18.9996 10.9996C21.1961 7.335 21.6924 3.80773 19.9419 2.0573C18.1915 0.306864 14.6642 0.803134 10.9996 2.99961M10.9996 2.99961C7.33501 0.803134 3.80774 0.306864 2.05731 2.0573C0.306872 3.80773 0.803141 7.335 2.99962 10.9996M12.1107 10.9996C12.1107 11.6133 11.6133 12.1107 10.9996 12.1107C10.386 12.1107 9.8885 11.6133 9.8885 10.9996C9.8885 10.386 10.386 9.8885 10.9996 9.8885C11.6133 9.8885 12.1107 10.386 12.1107 10.9996Z" />
  </svg>
);

// Clipboard (Reports)
const ClipboardIcon = () => (
  <svg width="20" height="24" viewBox="0 0 18 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path {...NSS} d="M4.42857 3.22222C2.53502 3.22222 1 4.71461 1 6.55556V17.6667C1 19.5076 2.53502 21 4.42857 21H13.5714C15.465 21 17 19.5076 17 17.6667V6.55556C17 4.71461 15.465 3.22222 13.5714 3.22222H12.4286M12.4286 3.22222V2.11111C12.4286 1.49746 11.9169 1 11.2857 1H6.71429C6.0831 1 5.57143 1.49746 5.57143 2.11111V4.33333C5.57143 4.94698 6.0831 5.44444 6.71429 5.44444H11.2857C11.9169 5.44444 12.4286 4.94698 12.4286 4.33333V3.22222Z" />
  </svg>
);

// Bell (Notifications)
const BellIcon = () => (
  <svg width="22" height="24" viewBox="0 0 19.7701 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path {...NSS} d="M11.8851 21H7.88506M10.8851 1L8.88506 1M3.88506 8V9C3.88506 9.78149 3.88506 10.2343 3.9217 10.5897L2.95273 11.823C1.64857 13.4828 0.996485 14.3127 1.00001 15.0101C1.00308 15.6167 1.28131 16.1892 1.7564 16.5664C2.30259 17 3.35804 17 5.46895 17L14.3012 17C16.4121 17 17.4675 17 18.0137 16.5664C18.4888 16.1892 18.767 15.6167 18.7701 15.0101C18.7736 14.3127 18.1216 13.4828 16.8174 11.823L15.8484 10.5897C15.8851 10.2343 15.8851 9.78148 15.8851 9V8C15.8851 7.07099 15.8851 6.60649 15.8235 6.21783C15.4846 4.07837 13.8067 2.40042 11.6672 2.06156C11.2786 2 10.8141 2 9.88506 2C8.95606 2 8.49155 2 8.10289 2.06156C5.96343 2.40042 4.28548 4.07837 3.94662 6.21783C3.88506 6.60649 3.88506 7.07099 3.88506 8Z" />
  </svg>
);

// Calendar (Scheduled Updates)
const CalendarIcon = () => (
  <svg width="22" height="24" viewBox="0 0 20 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path {...NSS} d="M1 9.88889V16.5556C1 19.0102 3.01472 21 5.5 21H14.5C16.9853 21 19 19.0102 19 16.5556V9.88889M1 9.88889V7.66667C1 5.21207 3.01472 3.22222 5.5 3.22222H14.5C16.9853 3.22222 19 5.21207 19 7.66667V9.88889M1 9.88889H19M5.5 1V5.44444M14.5 1V5.44444" />
  </svg>
);

// Sliders Vertical (System Settings)
const SlidersIcon = () => (
  <svg width="20" height="24" viewBox="0 0 18 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path {...NSS} d="M4 11V21M14 11V1M7 4C7 5.65685 5.65685 7 4 7C2.34315 7 1 5.65685 1 4C1 2.34315 2.34315 1 4 1C5.65685 1 7 2.34315 7 4ZM17 18C17 16.3431 15.6569 15 14 15C12.3431 15 11 16.3431 11 18C11 19.6569 12.3431 21 14 21C15.6569 21 17 19.6569 17 18Z" />
  </svg>
);

const Divider = () => (
  <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />
);

function NavIcon({ icon, active, badge, label, onClick }) {
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
        {hovered && label && (
          <div style={{
            position: 'absolute', left: 'calc(100% + 8px)', top: '50%',
            padding: '4px 10px', borderRadius: 6,
            background: '#012d42', border: '1px solid #153f53',
            fontSize: 11, fontWeight: 600, color: '#80b0c8',
            fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
            pointerEvents: 'none', zIndex: 200,
            boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
            animation: 'tooltipFadeInRight 0.12s ease forwards',
          }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile settings row ─────────────────────────────────────────────────────
function SettingsRow({ label, value }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        height: 32, padding: '0 12px', borderRadius: 6,
        background: hovered ? 'rgba(0,70,102,0.38)' : 'rgba(0,70,102,0.24)',
        cursor: 'pointer', transition: 'background 0.15s',
      }}
    >
      <span style={{
        flex: 1, fontSize: 12, fontWeight: 500, color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 10, fontWeight: 700, color: '#ccdfe9',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: 1.2, textTransform: 'uppercase',
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── Brand tile for profile overlay ──────────────────────────────────────────
function ProfileBrandTile({ brand, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(brand.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px 16px', borderRadius: 16, cursor: 'pointer',
        background: active ? '#00354d' : hovered ? '#013d58' : '#012d42',
        border: active ? '2px solid #28779c' : hovered ? '2px solid #1e6080' : '2px solid transparent',
        boxShadow: active
          ? '0px 0px 8px 0px rgba(40,119,156,0.32), inset 0px 0px 4px 0px rgba(0,0,0,0.24)'
          : '0px 0px 2px 0px rgba(0,0,0,0.24)',
        transition: 'all 0.15s',
        boxSizing: 'border-box',
      }}
    >
      <img
        src={base + brand.logo}
        alt={brand.name}
        style={{
          maxWidth: Math.round(brand.logoSize.maxWidth * 0.75),
          maxHeight: Math.round(brand.logoSize.maxHeight * 0.75),
          width: '100%', height: '100%', objectFit: 'contain',
          filter: 'brightness(0) invert(1)',
        }}
      />
    </div>
  );
}

function CloseButton({ onClose }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClose}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 24, height: 24,
          background: 'none', border: 'none', padding: 0,
          cursor: 'pointer',
          color: hovered ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.15s',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
          pointerEvents: 'none', zIndex: 110,
        }}>
          Close
        </div>
      )}
    </div>
  );
}

// ─── Profile overlay ──────────────────────────────────────────────────────────
function ProfileOverlay({ onClose, activeBrand: activeBrandProp, onBrandChange }) {
  const [localBrandId, setLocalBrandId] = useState(activeBrandProp?.id ?? 'audi');
  const [closing, setClosing] = useState(false);
  const brandRows = [BRANDS.slice(0, 2), BRANDS.slice(2, 4), BRANDS.slice(4, 6)];

  function handleClose() {
    setClosing(true);
  }

  function handleSwitchTenant() {
    const selected = BRANDS.find(b => b.id === localBrandId);
    if (selected && onBrandChange) onBrandChange(selected);
    setClosing(true);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
        }}
      />
      {/* Panel */}
      <div
        onAnimationEnd={() => { if (closing) onClose(); }}
        style={{
          position: 'fixed',
          left: 120,
          bottom: 24,
          width: 316,
          background: 'rgba(1,45,66,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #153f53',
          borderRadius: 24,
          boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.24)',
          animation: closing
            ? 'profileFadeOut 0.18s ease forwards'
            : 'profileFadeIn 0.22s ease',
          padding: '24px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          zIndex: 100,
          maxHeight: 'calc(100vh - 48px)',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >

        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
          <CloseButton onClose={handleClose} />
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, flexShrink: 1, minHeight: 0 }}>

        {/* Avatar + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* Avatar with blurred decorative blobs */}
          <div style={{ position: 'relative', width: 108, height: 108 }}>
            {/* Decorative blur blobs */}
            <div style={{
              position: 'absolute', top: -6, left: -3,
              width: 99, height: 99, borderRadius: 24,
              background: 'rgba(40,119,156,0.28)',
              filter: 'blur(12px)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', top: 38, left: 63,
              width: 64, height: 64, borderRadius: 16,
              background: 'rgba(40,119,156,0.22)',
              filter: 'blur(12px)', pointerEvents: 'none',
            }} />
            {/* Avatar circle */}
            <div style={{
              position: 'relative',
              width: 108, height: 108, borderRadius: 32,
              background: 'linear-gradient(135deg, #005478 0%, #003050 100%)',
              border: '1px solid rgba(40,119,156,0.4)',
              boxShadow: '0px 0px 32px 0px rgba(0,0,0,0.32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 32, fontWeight: 700, color: 'rgba(204,223,233,0.85)',
                fontFamily: "'Inter', sans-serif", letterSpacing: 1,
              }}>
                JS
</span>
            </div>
          </div>

          {/* Name + role */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{
              fontSize: 20, fontWeight: 600, color: '#ffffff',
              fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.4,
              whiteSpace: 'nowrap',
            }}>
              John Smith
            </span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#ccdfe9',
              fontFamily: "'Montserrat', sans-serif", letterSpacing: 0.06,
              whiteSpace: 'nowrap',
            }}>
              System Admin
            </span>
          </div>
        </div>

        {/* Settings list */}
        <div style={{
          background: '#012d42', border: '1px solid #153f53', borderRadius: 16,
          boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.24)',
          padding: 12, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <SettingsRow label="Password" value="CHANGE" />
          <SettingsRow label="Language" value="ENGLISH" />
          <SettingsRow label="Licenses" value="SHOW" />
        </div>

        {/* Brand grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {brandRows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 8 }}>
              {row.map(brand => (
                <ProfileBrandTile
                  key={brand.id}
                  brand={brand}
                  active={localBrandId === brand.id}
                  onClick={setLocalBrandId}
                />
              ))}
            </div>
          ))}
        </div>
        </div>{/* end scrollable */}

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0 }}>
          <ProfileButton disabled={localBrandId === activeBrandProp?.id} onClick={handleSwitchTenant}>Switch Tenant</ProfileButton>
          <ProfileButton primary onClick={handleClose}>Logout</ProfileButton>
        </div>
      </div>
    </>
  );
}

function ProfileButton({ children, primary, disabled, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 18px', borderRadius: 8,
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 10, fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: 1.2, textTransform: 'uppercase',
        transition: 'background 0.15s, box-shadow 0.15s, border-color 0.15s, opacity 0.15s',
        opacity: disabled ? 0.35 : 1,
        ...(primary ? {
          color: '#ccdfe9',
          background: hovered ? '#005a80' : '#004666',
          border: 'none',
          boxShadow: hovered
            ? '0px 2px 8px 0px rgba(0,37,55,0.48)'
            : '0px 1px 4px 0px rgba(0,37,55,0.32)',
        } : {
          color: disabled ? 'rgba(128,176,200,0.6)' : '#ccdfe9',
          background: hovered ? '#01374f' : '#012d42',
          border: hovered ? '1px solid #1e6080' : '1px solid #004666',
        }),
      }}
    >
      {children}
    </button>
  );
}

function AvatarButton({ profileOpen, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 40, height: 40, borderRadius: 10,
          background: profileOpen || hovered ? '#005a80' : '#004666',
          border: profileOpen ? '2px solid #28779c' : '2px solid transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#80b0c8',
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          boxShadow: profileOpen ? '0px 0px 8px 0px rgba(40,119,156,0.32)' : 'none',
          transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
          boxSizing: 'border-box',
        }}
      >
        JS
      </div>
      {hovered && !profileOpen && (
        <div style={{
          position: 'absolute', left: 'calc(100% + 8px)', top: '50%',
          padding: '4px 10px', borderRadius: 6,
          background: '#012d42', border: '1px solid #153f53',
          fontSize: 11, fontWeight: 600, color: '#80b0c8',
          fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 200,
          boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
          animation: 'tooltipFadeInRight 0.12s ease forwards',
        }}>
          User Profile
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ activeNav, onNavChange, attentionCount, activeBrand, onBrandChange }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <div style={{
        width: 80,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        background: '#012d42',
        border: '1px solid #004666',
        borderRadius: 24,
        boxShadow: '0px 0px 12px 0px rgba(0,30,45,0.32)',
        overflow: 'visible',
      }}>
        {/* Logo + GVU PRO */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, paddingTop: 24, paddingBottom: 12,
        }}>
          <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {activeBrand ? (
              <img
                src={base + activeBrand.logo}
                alt={activeBrand.name}
                style={{
                  maxWidth: Math.round(activeBrand.logoSize.maxWidth * 0.62),
                  maxHeight: Math.round(activeBrand.logoSize.maxHeight * 0.62),
                  width: '100%', height: '100%', objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            ) : (
              <img
                src={base + 'assets/vw.svg'}
                alt="VW"
                style={{ width: 32, height: 32, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
            )}
          </div>
          <div style={{ textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            <div style={{ fontSize: 13, letterSpacing: 0.3, color: '#ffffff', lineHeight: '16px' }}>GVU</div>
            <div style={{ fontSize: 8, letterSpacing: 2.5, color: '#ccdfe9', opacity: 0.5, lineHeight: '12px' }}>PRO</div>
          </div>
        </div>

        <Divider />

        <NavIcon icon={<GridIcon />} active={activeNav === 'aftersales'} badge={attentionCount} label="Overview" onClick={() => onNavChange('aftersales')} />
        <NavIcon icon={<AtomIcon />} active={activeNav === 'people'} label="Test Updates" onClick={() => onNavChange('people')} />
        <NavIcon icon={<ClipboardIcon />} active={activeNav === 'settings'} label="Reports" onClick={() => onNavChange('settings')} />

        <Divider />

        <NavIcon icon={<BellIcon />} active={activeNav === 'bell'} badge={1} label="Notifications" onClick={() => onNavChange('bell')} />
        <NavIcon icon={<CalendarIcon />} active={activeNav === 'calendar'} label="Scheduled Updates" onClick={() => onNavChange('calendar')} />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        <Divider />

        <NavIcon icon={<SlidersIcon />} label="System Settings" onClick={() => {}} />

        {/* Avatar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px 0 16px',
        }}>
          <AvatarButton profileOpen={profileOpen} onClick={() => setProfileOpen(o => !o)} />
        </div>
      </div>

      {profileOpen && <ProfileOverlay onClose={() => setProfileOpen(false)} activeBrand={activeBrand} onBrandChange={onBrandChange} />}
    </>
  );
}
