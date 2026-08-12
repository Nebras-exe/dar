import React from 'react';
export function Card({ variant = 'service', icon, image, eyebrow, title, description, meta, href = '#' }) {
  if (variant === 'project') {
    return React.createElement('a', { href, style: { display: 'block', textDecoration: 'none', color: 'inherit', fontFamily: 'var(--font-sans-body)' } },
      React.createElement('div', { style: { borderRadius: 'var(--radius-l)', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--sand-300)' } },
        image && React.createElement('img', { src: image, alt: title, style: { width: '100%', height: '100%', objectFit: 'cover' } })
      ),
      React.createElement('div', { style: { paddingTop: 10 } },
        React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' } }, title),
        meta && React.createElement('div', { style: { fontSize: 12, color: 'var(--text-secondary)' } }, meta)
      )
    );
  }
  return React.createElement('div', {
    style: { background: 'var(--bg-surface)', borderRadius: 'var(--radius-m)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-5)', fontFamily: 'var(--font-sans-body)', transition: 'box-shadow var(--duration-standard) var(--ease-standard)' }
  },
    icon && React.createElement('div', { style: { width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--text-on-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 18 } }, icon),
    eyebrow && React.createElement('div', { style: { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-eyebrow)', marginBottom: 6 } }, eyebrow),
    title && React.createElement('div', { style: { fontFamily: 'var(--font-serif-display)', fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 } }, title),
    description && React.createElement('div', { style: { fontSize: 13, lineHeight: 'var(--line-normal)', color: 'var(--text-secondary)' } }, description)
  );
}
