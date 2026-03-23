import { useState, useEffect } from 'react';
import FloatingInput from './components/FloatingInput';
import BrandGrid, { BRANDS } from './components/BrandGrid';
import VariantSelect from './components/VariantSelect';
import DashboardView from './components/DashboardView';
import './App.css';

const defaultBrand = BRANDS.find(b => b.id === 'audi');

const LOAD_STEPS = [
  'Connecting to ITERU servers',
  'Fetching campaign data',
  'Loading vehicle fleet information',
  'Synchronizing update specifications',
];

const SWITCH_STEPS = [
  'Connecting to tenant servers',
  'Loading brand configuration',
  'Preparing dashboard',
];

const LOGOUT_STEPS = [
  'Saving session data',
  'Closing active connections',
  'Terminating session',
];

function LoaderScreen({ step, visible, steps = LOAD_STEPS }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 36, pointerEvents: 'none',
    }}>
      <div style={{ textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
        <div style={{ fontSize: 24, letterSpacing: 0.5, color: '#ffffff' }}>ITERU</div>
        <div style={{ fontSize: 8, letterSpacing: 3.5, color: '#ccdfe9', opacity: 0.4, marginTop: 2 }}>PRO</div>
      </div>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '2px solid rgba(128,176,200,0.15)', borderTopColor: '#28a0c8',
        animation: 'iteruSpin 0.85s linear infinite',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: 0.2,
            color: i < step ? 'rgba(56,176,96,0.85)' : i === step ? 'rgba(204,223,233,0.9)' : 'rgba(128,176,200,0.2)',
            transition: 'color 0.35s ease',
          }}>
            <span style={{ width: 14, display: 'flex', justifyContent: 'center', fontSize: i < step ? 11 : 13 }}>
              {i < step ? '✓' : i === step ? '›' : '·'}
            </span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

function AppButton({ children, primary, fullWidth, onClick }) {
  const [hovered, setHovered] = useState(false);

  const base = {
    padding: '10px 18px', borderRadius: 8,
    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10,
    letterSpacing: 1.2, textTransform: 'uppercase', color: '#ccdfe9',
    cursor: 'pointer', transition: 'background 0.15s, box-shadow 0.15s, border-color 0.15s',
    ...(fullWidth ? { flex: 1 } : {}),
  };

  const style = primary
    ? {
        ...base,
        background: hovered ? '#005a80' : '#004666',
        border: 'none',
        boxShadow: hovered
          ? '0px 2px 8px 0px rgba(0,37,55,0.48)'
          : '0px 1px 4px 0px rgba(0,37,55,0.32)',
      }
    : {
        ...base,
        background: hovered ? '#01374f' : '#012d42',
        border: hovered ? '1px solid #1e6080' : '1px solid #004666',
      };

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

function ErrorToast({ onDone }) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 3200);
    const t2 = setTimeout(() => onDone(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 999,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', borderRadius: 12,
      background: 'rgba(40,10,10,0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(180,40,40,0.45)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.32), 0 0 0 1px rgba(180,40,40,0.12)',
      animation: hiding ? 'toastSlideOut 0.32s ease forwards' : 'toastSlideIn 0.28s ease forwards',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(180,40,40,0.25)', border: '1px solid rgba(200,60,60,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff6060" strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#ff6060', fontFamily: "'Inter', sans-serif", letterSpacing: 0.3 }}>
          Invalid credentials
        </div>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'rgba(200,60,60,0.7)', fontFamily: "'Inter', sans-serif", marginTop: 2 }}>
          Incorrect username or password. Please try again.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginVisible, setLoginVisible] = useState(true);
  const [dashVisible, setDashVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [activeBrand, setActiveBrand] = useState(defaultBrand);
  const [selectedVariant, setSelectedVariant] = useState(defaultBrand.variants[0]);
  const [switchingTenant, setSwitchingTenant] = useState(false);
  const [switchLoaderVisible, setSwitchLoaderVisible] = useState(false);
  const [switchLoadStep, setSwitchLoadStep] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutLoaderVisible, setLogoutLoaderVisible] = useState(false);
  const [logoutLoadStep, setLogoutLoadStep] = useState(0);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  function handleBrandChange(newBrand) {
    setDashVisible(false);
    setTimeout(() => {
      setSwitchingTenant(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setSwitchLoaderVisible(true)));
      setTimeout(() => setSwitchLoadStep(1), 480);
      setTimeout(() => setSwitchLoadStep(2), 960);
      setTimeout(() => setSwitchLoaderVisible(false), 1440);
      setTimeout(() => {
        setActiveBrand(newBrand);
        setSwitchingTenant(false);
        setSwitchLoadStep(0);
        requestAnimationFrame(() => requestAnimationFrame(() => setDashVisible(true)));
      }, 1800);
    }, 350);
  }
  function handleLogout() {
    setLoggingOut(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setLogoutLoaderVisible(true)));
    setTimeout(() => setLogoutLoadStep(1), 500);
    setTimeout(() => setLogoutLoadStep(2), 1100);
    setTimeout(() => setLogoutLoaderVisible(false), 1700);
    setTimeout(() => {
      setLoggedIn(false);
      setLoggingOut(false);
      setLogoutLoadStep(0);
      setDashVisible(false);
      setLoginVisible(true);
    }, 2100);
  }

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 560;

  function handleLogin() {
    if (loginUser !== 'admin' || loginPass !== 'admin') {
      setLoginError(true);
      setShowErrorToast(true);
      setToastKey(k => k + 1);
      return;
    }
    setLoginError(false);
    setLoginVisible(false);
    setTimeout(() => {
      setLoading(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setLoaderVisible(true)));
      setTimeout(() => setLoadStep(1), 700);
      setTimeout(() => setLoadStep(2), 1400);
      setTimeout(() => setLoadStep(3), 2100);
      setTimeout(() => setLoaderVisible(false), 2800);
      setTimeout(() => {
        setLoading(false);
        setLoggedIn(true);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          setDashVisible(true);
          setShowTutorial(true);
        }));
      }, 3200);
    }, 380);
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
        <LoaderScreen step={loadStep} visible={loaderVisible} />
      </div>
    );
  }

  if (loggingOut) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
        <LoaderScreen step={logoutLoadStep} visible={logoutLoaderVisible} steps={LOGOUT_STEPS} />
      </div>
    );
  }

  if (loggedIn) {
    if (switchingTenant) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
          <LoaderScreen step={switchLoadStep} visible={switchLoaderVisible} steps={SWITCH_STEPS} />
        </div>
      );
    }
    return (
      <div style={{ opacity: dashVisible ? 1 : 0, transition: 'opacity 0.4s ease', width: '100%', height: '100%' }}>
        <DashboardView activeBrand={activeBrand} onBrandChange={handleBrandChange} onLogout={handleLogout} showTutorial={showTutorial} onTutorialDone={() => setShowTutorial(false)} onShowGuide={() => setShowTutorial(true)} />
      </div>
    );
  }

  function handleBrandSelect(brand) {
    setActiveBrand(brand);
    setSelectedVariant(brand.variants[0]);
  }

  if (isMobile) {
    return (
      <div style={{
        width: '100%', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', gap: 32, textAlign: 'center',
      }}>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
          <div style={{ fontSize: 28, letterSpacing: 0.5, color: '#ffffff' }}>ITERU</div>
          <div style={{ fontSize: 14, letterSpacing: 5, color: '#ccdfe9', opacity: 0.5, marginTop: 2 }}>PRO</div>
        </div>

        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(0,70,102,0.3)', border: '1px solid rgba(21,63,83,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(128,176,200,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center', width: '100%' }}>
          <div style={{
            fontSize: 17, fontWeight: 700, color: '#ffffff',
            fontFamily: "'Inter', sans-serif", letterSpacing: 0.2,
          }}>
            Mobile not supported
          </div>
          <div style={{
            fontSize: 13, fontWeight: 400, color: 'rgba(128,176,200,0.65)',
            fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
            maxWidth: 280,
          }}>
            ITERU is designed for desktop use. Due to the complexity and density of the interface, mobile devices are not supported.
          </div>
          <div style={{
            fontSize: 12, fontWeight: 500, color: 'rgba(128,176,200,0.4)',
            fontFamily: "'Inter', sans-serif", letterSpacing: 0.3,
            marginTop: 4,
          }}>
            Please open this application on a desktop or laptop computer.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div style={{
      width: 496,
      padding: '56px 24px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 48,
      background: 'rgba(1,45,66,0.75)',
      border: '1px solid #153f53',
      borderRadius: 24,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0px 0px 16px 0px rgba(0,0,0,0.16)',
      opacity: loginVisible ? 1 : 0,
      transition: 'opacity 0.35s ease',
      animation: 'profileFadeIn 0.35s ease',
    }}>

      {/* Title */}
      <div style={{ textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
        <div style={{ fontSize: 42.647, letterSpacing: 0.853, color: '#ffffff', lineHeight: 1.3 }}>
          ITERU
        </div>
        <div style={{ fontSize: 25.588, letterSpacing: 8.188, color: '#ccdfe9', opacity: 0.5, lineHeight: 1.3, paddingLeft: 8 }}>
          PRO
        </div>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Inputs */}
        <div style={{ display: 'flex', gap: 12 }} onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}>
          <FloatingInput label="User" type="text" value={loginUser} onChange={v => { setLoginUser(v); setLoginError(false); }} error={loginError} />
          <FloatingInput label="Password" type="password" value={loginPass} onChange={v => { setLoginPass(v); setLoginError(false); }} error={loginError} />
        </div>

        {/* Brand grid */}
        <BrandGrid selected={activeBrand.id} onSelect={handleBrandSelect} />

        {/* Variant dropdown */}
        <VariantSelect
          brandName={activeBrand.name}
          variants={activeBrand.variants}
          selected={selectedVariant}
          onSelect={setSelectedVariant}
        />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <AppButton>Help</AppButton>
          <AppButton primary onClick={handleLogin}>Login</AppButton>
        </div>
      </div>

    </div>
    {showErrorToast && <ErrorToast key={toastKey} onDone={() => setShowErrorToast(false)} />}
    </>
  );
}
