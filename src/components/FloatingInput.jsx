import { useState, useRef } from 'react';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.636-7 10-7 10 7 10 7-3.636 7-10 7S2 12 2 12z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6.364 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.364 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function FloatingInput({ label, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [value, setValue]     = useState('');
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);

  const isPassword = type === 'password';
  const floated    = focused || value.length > 0;

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        height: 44,
        paddingRight: isPassword ? 4 : 12,
        borderRadius: 6,
        border: focused ? '1px solid #28779c' : hovered ? '1px solid #2a6a87' : '1px solid #16506c',
        background: focused ? 'rgba(0,70,102,0.24)' : hovered ? 'rgba(0,70,102,0.22)' : 'rgba(0,70,102,0.16)',
        boxShadow: focused
          ? '0px 0px 8px 0px rgba(40,119,156,0.32), inset 0px 0px 4px 0px rgba(0,0,0,0.24)'
          : '0px 1px 2px 0px rgba(0,0,0,0.12)',
        cursor: 'text',
        transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
        overflow: 'hidden',
      }}
    >
      {/* Inner: label + input stacked via absolute positioning */}
      <div style={{ position: 'relative', flex: 1, height: '100%' }}>
        {/* Label — floats from center to top */}
        <label
          style={{
            position: 'absolute',
            left: 12,
            top: floated ? 6 : '50%',
            transform: floated ? 'none' : 'translateY(-50%)',
            fontFamily: "'Inter', sans-serif",
            fontSize: floated ? 10 : 12,
            fontWeight: 500,
            lineHeight: '14px',
            color: '#80b0c8',
            opacity: floated ? 1 : 0.6,
            pointerEvents: 'none',
            transition: 'top 0.15s, font-size 0.15s, opacity 0.15s, transform 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </label>

        {/* Input — text always lives in the lower portion */}
        <input
          ref={inputRef}
          type={isPassword && !visible ? 'password' : 'text'}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={isPassword ? 'current-password' : 'username'}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: '#ffffff',
            caretColor: '#ffffff',
            /* top padding pushes text down so it doesn't overlap the floated label */
            padding: '18px 0 4px 12px',
          }}
        />
      </div>

      {/* Eye button — password only */}
      {isPassword && (
        <button
          onClick={e => { e.stopPropagation(); setVisible(v => !v); }}
          title="Pokaż / ukryj hasło"
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: visible ? '#ffffff' : '#80b0c8',
            opacity: visible ? 1 : 0.6,
            transition: 'opacity 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={e => {
            if (!visible) {
              e.currentTarget.style.opacity = 0.6;
              e.currentTarget.style.color = '#80b0c8';
            }
          }}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
}
