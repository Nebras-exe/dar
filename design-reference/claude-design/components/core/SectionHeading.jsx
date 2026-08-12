import React from 'react';
export function SectionHeading({ eyebrow, title, align = 'center' }) {
  return React.createElement('div', { style: { textAlign: align, fontFamily: 'var(--font-sans-body)' } },
    eyebrow && React.createElement('div', { style: { fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-eyebrow)', marginBottom: 10 } }, eyebrow),
    title && React.createElement('div', { style: { fontFamily: 'var(--font-serif-display)', fontSize: 34, color: 'var(--text-primary)', lineHeight: 'var(--line-tight)' } }, title)
  );
}
