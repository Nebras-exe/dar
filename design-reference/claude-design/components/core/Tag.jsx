import React from 'react';
export function Tag({ children, onRemove }) {
  return React.createElement('span', {
    style: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-surface-alt)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', padding: '6px 12px', fontFamily: 'var(--font-sans-body)', fontSize: 13 }
  }, children, onRemove && React.createElement('button', {
    onClick: onRemove,
    style: { border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1, padding: 0 }
  }, '×'));
}
