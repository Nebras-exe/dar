import React from 'react';
export function Input({ label, placeholder, type = 'text', textarea = false, value, onChange }) {
  const fieldStyle = {
    fontFamily: 'var(--font-sans-body)', fontSize: 14, color: 'var(--text-primary)',
    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-s)',
    padding: '11px 14px', width: '100%', boxSizing: 'border-box', outline: 'none',
    transition: 'border-color var(--duration-fast) var(--ease-standard)'
  };
  const [focus, setFocus] = React.useState(false);
  const st = { ...fieldStyle, borderColor: focus ? 'var(--border-strong)' : 'var(--border-subtle)' };
  const Field = textarea ? 'textarea' : 'input';
  return React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans-body)' } },
    label && React.createElement('span', { style: { fontSize: 12, color: 'var(--text-secondary)' } }, label),
    React.createElement(Field, { type: textarea ? undefined : type, placeholder, value, onChange, rows: textarea ? 4 : undefined, style: st, onFocus: () => setFocus(true), onBlur: () => setFocus(false) })
  );
}
