import React from 'react';
export function NavBar({ logo = 'terra', links = ['Home','About','Services','Projects','Process','Journal','Contact'], activeLink, ctaLabel = 'Book a Consultation', onCtaClick }) {
  return React.createElement('nav', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', background: 'var(--bg-surface)', fontFamily: 'var(--font-sans-body)' }
  },
    React.createElement('div', { style: { fontFamily: 'var(--font-serif-display)', fontSize: 20, color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', lineHeight: 1.1 } },
      React.createElement('span', null, logo),
      React.createElement('span', { style: { fontSize: 9, letterSpacing: '.25em', fontFamily: 'var(--font-sans-body)', color: 'var(--text-eyebrow)' } }, 'INTERIORS')
    ),
    React.createElement('div', { style: { display: 'flex', gap: 28 } },
      links.map((l) => React.createElement('a', {
        key: l, href: '#',
        style: { fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', color: l === activeLink ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: l === activeLink ? 600 : 400 }
      }, l))
    ),
    React.createElement('button', {
      onClick: onCtaClick,
      style: { background: 'var(--accent-primary)', color: 'var(--text-on-inverse)', border: 'none', borderRadius: 'var(--radius-pill)', padding: '10px 22px', fontSize: 13, fontFamily: 'var(--font-sans-body)', cursor: 'pointer' }
    }, ctaLabel)
  );
}
