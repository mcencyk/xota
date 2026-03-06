import { useState } from 'react';
import FloatingInput from './components/FloatingInput';
import BrandGrid, { BRANDS } from './components/BrandGrid';
import VariantSelect from './components/VariantSelect';
import './App.css';

const defaultBrand = BRANDS.find(b => b.id === 'vw');

function AppButton({ children, primary }) {
  const [hovered, setHovered] = useState(false);

  const base = {
    padding: '10px 18px', borderRadius: 8,
    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 10,
    letterSpacing: 1.2, textTransform: 'uppercase', color: '#ccdfe9',
    cursor: 'pointer', transition: 'background 0.15s, box-shadow 0.15s, border-color 0.15s',
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [activeBrand, setActiveBrand] = useState(defaultBrand);
  const [selectedVariant, setSelectedVariant] = useState(defaultBrand.variants[0]);

  function handleBrandSelect(brand) {
    setActiveBrand(brand);
    setSelectedVariant(brand.variants[0]);
  }

  return (
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
    }}>

      {/* Title */}
      <div style={{ textAlign: 'center', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
        <div style={{ fontSize: 42.647, letterSpacing: 0.853, color: '#ffffff', lineHeight: 1.3 }}>
          CMT
        </div>
        <div style={{ fontSize: 25.588, letterSpacing: 8.188, color: '#ccdfe9', opacity: 0.5, lineHeight: 1.3, paddingLeft: 8 }}>
          PRO
        </div>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Inputs */}
        <div style={{ display: 'flex', gap: 12 }}>
          <FloatingInput label="User" type="text" />
          <FloatingInput label="Password" type="password" />
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
          <AppButton primary>Login</AppButton>
        </div>
      </div>

    </div>
  );
}
