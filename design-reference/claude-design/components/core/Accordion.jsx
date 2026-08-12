import React from 'react';
export function Accordion({ items = [] }) {
  const [open, setOpen] = React.useState(0);
  return React.createElement('div', { style: { fontFamily: 'var(--font-sans-body)', display: 'flex', flexDirection: 'column' } },
    items.map((item, i) => React.createElement('div', { key: item.title, style: { borderBottom: '1px solid var(--border-subtle)' } },
      React.createElement('button', {
        onClick: () => setOpen(open === i ? -1 : i),
        style: { width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '16px 4px', display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-serif-display)' }
      }, item.title, React.createElement('span', { style: { color: 'var(--text-eyebrow)' } }, open === i ? '−' : '+')),
      open === i && React.createElement('div', { style: { padding: '0 4px 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 'var(--line-normal)' } }, item.content)
    ))
  );
}
