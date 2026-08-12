import React from 'react';
export function Button({ variant = 'primary', size = 'md', disabled = false, children, onClick, style }) {
  const sizes = { sm: { padding: '8px 18px', fontSize: 13 }, md: { padding: '12px 26px', fontSize: 14 }, lg: { padding: '15px 32px', fontSize: 15 } };
  const base = {
    fontFamily: 'var(--font-sans-body)', fontWeight: 500, borderRadius: 'var(--radius-pill)',
    border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--duration-standard) var(--ease-standard), color var(--duration-standard) var(--ease-standard), border-color var(--duration-standard) var(--ease-standard)',
    opacity: disabled ? 0.5 : 1, letterSpacing: '.01em', ...sizes[size]
  };
  const variants = {
    primary: { background: 'var(--accent-primary)', color: 'var(--text-on-inverse)' },
    secondary: { background: 'var(--accent-secondary)', color: 'var(--text-on-inverse)' },
    outline: { background: 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--text-primary)' }
  };
  const hovers = {
    primary: 'var(--accent-primary-hover)', secondary: 'var(--accent-secondary-hover)',
    outline: 'var(--bg-surface-alt)', ghost: 'var(--bg-surface-alt)'
  };
  const [hover, setHover] = React.useState(false);
  const v = variants[variant];
  const st = { ...base, ...v, ...style };
  if (hover && !disabled) {
    if (variant === 'primary' || variant === 'secondary') st.background = hovers[variant];
    else st.background = hovers[variant];
  }
  return React.createElement('button', {
    style: st, disabled, onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false)
  }, children);
}
