import React from 'react';
export function Badge({ tone = 'olive', children }) {
  const tones = {
    olive: { background: 'var(--olive-700)', color: 'var(--text-on-inverse)' },
    terracotta: { background: 'var(--terracotta-500)', color: 'var(--text-on-inverse)' },
    sand: { background: 'var(--sand-300)', color: 'var(--text-primary)' }
  };
  return React.createElement('span', {
    style: { ...tones[tone], display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--radius-pill)', padding: '4px 12px', fontFamily: 'var(--font-sans-body)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 500 }
  }, children);
}
