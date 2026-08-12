import React from 'react';
export function Tabs({ tabs = [], defaultActive = 0 }) {
  const [active, setActive] = React.useState(defaultActive);
  return React.createElement('div', { style: { fontFamily: 'var(--font-sans-body)' } },
    React.createElement('div', { style: { display: 'flex', gap: 24, borderBottom: '1px solid var(--border-subtle)' } },
      tabs.map((t, i) => React.createElement('button', {
        key: t.label, onClick: () => setActive(i),
        style: {
          background: 'none', border: 'none', cursor: 'pointer', padding: '10px 2px', fontSize: 13,
          color: i === active ? 'var(--text-primary)' : 'var(--text-secondary)',
          borderBottom: i === active ? '2px solid var(--accent-primary)' : '2px solid transparent',
          fontWeight: i === active ? 600 : 400
        }
      }, t.label))
    ),
    React.createElement('div', { style: { padding: '18px 2px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 'var(--line-normal)' } }, tabs[active] && tabs[active].content)
  );
}
