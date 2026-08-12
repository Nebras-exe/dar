/* @ds-bundle: {"format":4,"namespace":"TerraInteriorsDesignSystem_ce1783","components":[{"name":"Accordion","sourcePath":"components/core/Accordion.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"NavBar","sourcePath":"components/core/NavBar.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Accordion.jsx":"024f564c92f0","components/core/Badge.jsx":"b2dad19bb26e","components/core/Button.jsx":"d51e3b6846b6","components/core/Card.jsx":"4e36fad1028d","components/core/Input.jsx":"fd8362ff85dd","components/core/NavBar.jsx":"4be7e5b3b670","components/core/SectionHeading.jsx":"6b4b70e53cc8","components/core/Tabs.jsx":"de0188895374","components/core/Tag.jsx":"dd2a1def60ee","ui_kits/website/Homepage.jsx":"fa11c2977513"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TerraInteriorsDesignSystem_ce1783 = window.TerraInteriorsDesignSystem_ce1783 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Accordion.jsx
try { (() => {
function Accordion({
  items = []
}) {
  const [open, setOpen] = React.useState(0);
  return React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans-body)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, items.map((item, i) => React.createElement('div', {
    key: item.title,
    style: {
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, React.createElement('button', {
    onClick: () => setOpen(open === i ? -1 : i),
    style: {
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '16px 4px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 14,
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-serif-display)'
    }
  }, item.title, React.createElement('span', {
    style: {
      color: 'var(--text-eyebrow)'
    }
  }, open === i ? '−' : '+')), open === i && React.createElement('div', {
    style: {
      padding: '0 4px 16px',
      fontSize: 13,
      color: 'var(--text-secondary)',
      lineHeight: 'var(--line-normal)'
    }
  }, item.content))));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'olive',
  children
}) {
  const tones = {
    olive: {
      background: 'var(--olive-700)',
      color: 'var(--text-on-inverse)'
    },
    terracotta: {
      background: 'var(--terracotta-500)',
      color: 'var(--text-on-inverse)'
    },
    sand: {
      background: 'var(--sand-300)',
      color: 'var(--text-primary)'
    }
  };
  return React.createElement('span', {
    style: {
      ...tones[tone],
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 'var(--radius-pill)',
      padding: '4px 12px',
      fontFamily: 'var(--font-sans-body)',
      fontSize: 11,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      fontWeight: 500
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  style
}) {
  const sizes = {
    sm: {
      padding: '8px 18px',
      fontSize: 13
    },
    md: {
      padding: '12px 26px',
      fontSize: 14
    },
    lg: {
      padding: '15px 32px',
      fontSize: 15
    }
  };
  const base = {
    fontFamily: 'var(--font-sans-body)',
    fontWeight: 500,
    borderRadius: 'var(--radius-pill)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--duration-standard) var(--ease-standard), color var(--duration-standard) var(--ease-standard), border-color var(--duration-standard) var(--ease-standard)',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: '.01em',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--accent-primary)',
      color: 'var(--text-on-inverse)'
    },
    secondary: {
      background: 'var(--accent-secondary)',
      color: 'var(--text-on-inverse)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)'
    }
  };
  const hovers = {
    primary: 'var(--accent-primary-hover)',
    secondary: 'var(--accent-secondary-hover)',
    outline: 'var(--bg-surface-alt)',
    ghost: 'var(--bg-surface-alt)'
  };
  const [hover, setHover] = React.useState(false);
  const v = variants[variant];
  const st = {
    ...base,
    ...v,
    ...style
  };
  if (hover && !disabled) {
    if (variant === 'primary' || variant === 'secondary') st.background = hovers[variant];else st.background = hovers[variant];
  }
  return React.createElement('button', {
    style: st,
    disabled,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  variant = 'service',
  icon,
  image,
  eyebrow,
  title,
  description,
  meta,
  href = '#'
}) {
  if (variant === 'project') {
    return React.createElement('a', {
      href,
      style: {
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        fontFamily: 'var(--font-sans-body)'
      }
    }, React.createElement('div', {
      style: {
        borderRadius: 'var(--radius-l)',
        overflow: 'hidden',
        aspectRatio: '4/3',
        background: 'var(--sand-300)'
      }
    }, image && React.createElement('img', {
      src: image,
      alt: title,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    })), React.createElement('div', {
      style: {
        paddingTop: 10
      }
    }, React.createElement('div', {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--text-primary)'
      }
    }, title), meta && React.createElement('div', {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)'
      }
    }, meta)));
  }
  return React.createElement('div', {
    style: {
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-m)',
      boxShadow: 'var(--shadow-card)',
      padding: 'var(--space-5)',
      fontFamily: 'var(--font-sans-body)',
      transition: 'box-shadow var(--duration-standard) var(--ease-standard)'
    }
  }, icon && React.createElement('div', {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--accent-primary)',
      color: 'var(--text-on-inverse)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
      fontSize: 18
    }
  }, icon), eyebrow && React.createElement('div', {
    style: {
      fontSize: 11,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)',
      marginBottom: 6
    }
  }, eyebrow), title && React.createElement('div', {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 18,
      color: 'var(--text-primary)',
      marginBottom: 8
    }
  }, title), description && React.createElement('div', {
    style: {
      fontSize: 13,
      lineHeight: 'var(--line-normal)',
      color: 'var(--text-secondary)'
    }
  }, description));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  type = 'text',
  textarea = false,
  value,
  onChange
}) {
  const fieldStyle = {
    fontFamily: 'var(--font-sans-body)',
    fontSize: 14,
    color: 'var(--text-primary)',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-s)',
    padding: '11px 14px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color var(--duration-fast) var(--ease-standard)'
  };
  const [focus, setFocus] = React.useState(false);
  const st = {
    ...fieldStyle,
    borderColor: focus ? 'var(--border-strong)' : 'var(--border-subtle)'
  };
  const Field = textarea ? 'textarea' : 'input';
  return React.createElement('label', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans-body)'
    }
  }, label && React.createElement('span', {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, label), React.createElement(Field, {
    type: textarea ? undefined : type,
    placeholder,
    value,
    onChange,
    rows: textarea ? 4 : undefined,
    style: st,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/NavBar.jsx
try { (() => {
function NavBar({
  logo = 'terra',
  links = ['Home', 'About', 'Services', 'Projects', 'Process', 'Journal', 'Contact'],
  activeLink,
  ctaLabel = 'Book a Consultation',
  onCtaClick
}) {
  return React.createElement('nav', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 40px',
      background: 'var(--bg-surface)',
      fontFamily: 'var(--font-sans-body)'
    }
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 20,
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.1
    }
  }, React.createElement('span', null, logo), React.createElement('span', {
    style: {
      fontSize: 9,
      letterSpacing: '.25em',
      fontFamily: 'var(--font-sans-body)',
      color: 'var(--text-eyebrow)'
    }
  }, 'INTERIORS')), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 28
    }
  }, links.map(l => React.createElement('a', {
    key: l,
    href: '#',
    style: {
      fontSize: 12,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: l === activeLink ? 'var(--text-primary)' : 'var(--text-secondary)',
      textDecoration: 'none',
      fontWeight: l === activeLink ? 600 : 400
    }
  }, l))), React.createElement('button', {
    onClick: onCtaClick,
    style: {
      background: 'var(--accent-primary)',
      color: 'var(--text-on-inverse)',
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      padding: '10px 22px',
      fontSize: 13,
      fontFamily: 'var(--font-sans-body)',
      cursor: 'pointer'
    }
  }, ctaLabel));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  align = 'center'
}) {
  return React.createElement('div', {
    style: {
      textAlign: align,
      fontFamily: 'var(--font-sans-body)'
    }
  }, eyebrow && React.createElement('div', {
    style: {
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)',
      marginBottom: 10
    }
  }, eyebrow), title && React.createElement('div', {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 34,
      color: 'var(--text-primary)',
      lineHeight: 'var(--line-tight)'
    }
  }, title));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  defaultActive = 0
}) {
  const [active, setActive] = React.useState(defaultActive);
  return React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans-body)'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      gap: 24,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, tabs.map((t, i) => React.createElement('button', {
    key: t.label,
    onClick: () => setActive(i),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px 2px',
      fontSize: 13,
      color: i === active ? 'var(--text-primary)' : 'var(--text-secondary)',
      borderBottom: i === active ? '2px solid var(--accent-primary)' : '2px solid transparent',
      fontWeight: i === active ? 600 : 400
    }
  }, t.label))), React.createElement('div', {
    style: {
      padding: '18px 2px',
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 'var(--line-normal)'
    }
  }, tabs[active] && tabs[active].content));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  children,
  onRemove
}) {
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'var(--bg-surface-alt)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 12px',
      fontFamily: 'var(--font-sans-body)',
      fontSize: 13
    }
  }, children, onRemove && React.createElement('button', {
    onClick: onRemove,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      fontSize: 13,
      lineHeight: 1,
      padding: 0
    }
  }, '×'));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Homepage.jsx
try { (() => {
const {
  Button,
  Badge,
  NavBar,
  Card,
  SectionHeading,
  Accordion
} = window.TerraInteriorsDesignSystem_ce1783;
function Photo({
  ratio = '4/3',
  radius = 'var(--radius-l)',
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: ratio,
      borderRadius: radius,
      background: 'var(--sand-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-secondary)',
      fontSize: 12,
      fontFamily: 'var(--font-sans-body)'
    }
  }, label || 'photo');
}
function Icon({
  name,
  size = 18
}) {
  return /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: size,
      height: size
    }
  });
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      padding: '0 40px 70px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr',
      gap: 40,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)',
      marginBottom: 14
    }
  }, "Organic Spaces. Inspired Living."), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 48,
      lineHeight: 1.12,
      color: 'var(--text-primary)',
      margin: '0 0 18px'
    }
  }, "Beautiful interiors that ", /*#__PURE__*/React.createElement("em", null, "restore"), " and ", /*#__PURE__*/React.createElement("em", null, "inspire"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans-body)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      maxWidth: 380,
      marginBottom: 26
    }
  }, "We design wellness-inspired homes that blend natural beauty, function, and soulful living."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Explore Our Work")), /*#__PURE__*/React.createElement(Photo, {
    ratio: "16/11",
    label: "hero living room photo"
  })));
}
const SERVICES = [{
  icon: 'sofa',
  title: 'Full-Service Interior Design',
  description: 'From concept to completion, we handle every detail with care.'
}, {
  icon: 'utensils-crossed',
  title: 'Kitchen & Bath Design',
  description: 'Beautiful, functional spaces designed for everyday rituals.'
}, {
  icon: 'amphora',
  title: 'Styling & Decor',
  description: 'Curated pieces and finishing touches that bring your home to life.'
}, {
  icon: 'monitor',
  title: 'E-Design',
  description: 'Virtual design services, anywhere you are.'
}];
function WhatWeDo() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '70px 40px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "What We Do",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Thoughtful design for how ", /*#__PURE__*/React.createElement("em", null, "you"), " live.")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 20
    }
  }, SERVICES.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.title,
    variant: "service",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 18
    }),
    title: s.title,
    description: s.description
  }))));
}
const PROJECTS = [{
  title: 'Sagewood Residence',
  meta: 'Austin, Texas'
}, {
  title: 'Mossy Glen Kitchen',
  meta: 'Seattle, Washington'
}, {
  title: 'Sunset Cliffs Home',
  meta: 'San Diego, California'
}, {
  title: 'Caldera Bathroom',
  meta: 'Portland, Oregon'
}, {
  title: 'Willow Creek Retreat',
  meta: 'Napa Valley, California'
}];
function Projects() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '30px 40px 70px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)',
      marginBottom: 10
    }
  }, "Our Projects"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 30,
      color: 'var(--text-primary)'
    }
  }, "Spaces that feel like home.")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-sans-body)',
      fontSize: 13,
      color: 'var(--link-color)',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, "View All Projects ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)',
      gap: 16
    }
  }, PROJECTS.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.title,
    variant: "project",
    title: p.title,
    meta: p.meta
  }))));
}
function Founder() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '30px 40px 80px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    ratio: "4/5",
    label: "founder portrait"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)',
      marginBottom: 14
    }
  }, "Meet the Founder"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 30,
      lineHeight: 1.2,
      color: 'var(--text-primary)',
      marginBottom: 16
    }
  }, "Designing with intention. Rooted in ", /*#__PURE__*/React.createElement("em", null, "nature"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans-body)',
      fontSize: 14,
      lineHeight: 1.65,
      color: 'var(--text-secondary)',
      marginBottom: 12
    }
  }, "Hi, I'm Marisa. Terra Interiors was born from my love of natural materials, mindful living, and the belief that our homes should support our well-being."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans-body)',
      fontSize: 14,
      lineHeight: 1.65,
      color: 'var(--text-secondary)',
      marginBottom: 20
    }
  }, "Every project is a collaboration. I take the time to understand your story, your needs, and your lifestyle to create spaces that are as beautiful as they are meaningful."), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-sans-body)',
      fontSize: 13,
      color: 'var(--link-color)',
      textDecoration: 'none'
    }
  }, "More About Marisa \u2192"))));
}
const STEPS = [{
  n: '1',
  title: 'Discover',
  desc: 'We get to know you, your vision, and your space.'
}, {
  n: '2',
  title: 'Design',
  desc: 'We create a tailored design that reflects your lifestyle.'
}, {
  n: '3',
  title: 'Plan',
  desc: 'We refine every detail and bring the plan to life.'
}, {
  n: '4',
  title: 'Execute',
  desc: 'We manage and collaborate with trusted partners.'
}, {
  n: '5',
  title: 'Enjoy',
  desc: 'Move in, exhale, and love where you live.'
}];
function Process() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '70px 40px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Our Process",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "A thoughtful process. ", /*#__PURE__*/React.createElement("em", null, "Effortless"), " experience.")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, STEPS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'var(--font-sans-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'var(--accent-primary)',
      color: 'var(--text-on-inverse)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 14px',
      fontFamily: 'var(--font-serif-display)'
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      color: 'var(--text-primary)',
      marginBottom: 6
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)',
      lineHeight: 1.5,
      maxWidth: 170,
      margin: '0 auto'
    }
  }, s.desc)))));
}
const TESTIMONIALS = [{
  quote: 'Marisa completely transformed our home into a peaceful retreat. She listened so deeply and brought beauty to every little detail.',
  name: 'Jessica T.',
  loc: 'Austin, Texas'
}, {
  quote: 'The process was seamless and so enjoyable. Our space feels elevated, calm, and truly ours.',
  name: 'Daniel & Kyle',
  loc: 'Seattle, Washington'
}, {
  quote: 'Terra Interiors exceeded every expectation. Thoughtful, professional, and incredibly talented.',
  name: 'Michelle R.',
  loc: 'Napa Valley, California'
}];
function Testimonials() {
  const [i, setI] = React.useState(0);
  const t = TESTIMONIALS[i];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '70px 40px',
      maxWidth: 900,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--text-eyebrow)',
      marginBottom: 14
    }
  }, "Kind Words"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 28,
      color: 'var(--text-primary)',
      marginBottom: 30
    }
  }, "Stories from our clients."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setI((i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length),
    style: {
      background: 'none',
      border: '1px solid var(--border-subtle)',
      borderRadius: '50%',
      width: 36,
      height: 36,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      color: 'var(--text-secondary)'
    }
  }, "\u2039"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans-body)',
      fontSize: 15,
      color: 'var(--text-secondary)',
      lineHeight: 1.6,
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 16
    }
  }, "\"", t.quote, "\""), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "\u2014 ", t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-eyebrow)'
    }
  }, t.loc)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setI((i + 1) % TESTIMONIALS.length),
    style: {
      background: 'none',
      border: '1px solid var(--border-subtle)',
      borderRadius: '50%',
      width: 36,
      height: 36,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      color: 'var(--text-secondary)'
    }
  }, "\u203A")));
}
function FaqTeaser() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 40px 70px',
      maxWidth: 700,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Accordion, {
    items: [{
      title: 'How long does a project take?',
      content: 'Every project timeline is tailored to scope and complexity — we set expectations together at the Discover stage.'
    }, {
      title: 'Do you work with clients remotely?',
      content: 'Yes — our E-Design service supports clients anywhere.'
    }]
  }));
}
function ClosingCTA() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 40px 40px',
      maxWidth: 1280,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--olive-700)',
      borderRadius: 'var(--radius-blob)',
      padding: '54px 60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 30
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--sand-200)',
      marginBottom: 12
    }
  }, "Ready to Begin?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 30,
      color: 'var(--cream-white)'
    }
  }, "Let's create a space that feels like ", /*#__PURE__*/React.createElement("em", null, "you"), ".")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    style: {
      whiteSpace: 'nowrap'
    }
  }, "Book Your Consultation")));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--olive-900)',
      color: 'var(--sand-200)',
      padding: '50px 40px 26px',
      fontFamily: 'var(--font-sans-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 30
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif-display)',
      fontSize: 18,
      color: 'var(--cream-white)',
      marginBottom: 10
    }
  }, "terra ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans-body)',
      fontSize: 9,
      letterSpacing: '.25em'
    }
  }, "INTERIORS")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      maxWidth: 220
    }
  }, "Wellness-inspired interiors designed to bring beauty, balance, and meaning to your everyday."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "instagram",
    size: 16
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "facebook",
    size: 16
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "share-2",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      marginBottom: 12,
      color: 'var(--sand-400)'
    }
  }, "Quick Links"), ['About', 'Services', 'Projects', 'Process', 'Journal', 'Contact'].map(l => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      fontSize: 13,
      marginBottom: 8
    }
  }, l))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      marginBottom: 12,
      color: 'var(--sand-400)'
    }
  }, "Services"), ['Full-Service Interior Design', 'Kitchen & Bath Design', 'Styling & Decor', 'E-Design'].map(l => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      fontSize: 13,
      marginBottom: 8
    }
  }, l))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      marginBottom: 12,
      color: 'var(--sand-400)'
    }
  }, "Let's Connect"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginBottom: 8
    }
  }, "hello@terrainteriors.com"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginBottom: 8
    }
  }, "512 555 1234"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Austin, Texas"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: '30px auto 0',
      paddingTop: 18,
      borderTop: '1px solid rgba(255,255,255,0.12)',
      fontSize: 11,
      color: 'var(--sand-400)'
    }
  }, "\xA9 2026 Terra Interiors. All rights reserved."));
}
function Homepage() {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-page)'
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    activeLink: "Home"
  }), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(WhatWeDo, null), /*#__PURE__*/React.createElement(Projects, null), /*#__PURE__*/React.createElement(Founder, null), /*#__PURE__*/React.createElement(Process, null), /*#__PURE__*/React.createElement(Testimonials, null), /*#__PURE__*/React.createElement(FaqTeaser, null), /*#__PURE__*/React.createElement(ClosingCTA, null), /*#__PURE__*/React.createElement(Footer, null));
}
window.TerraHomepage = {
  Homepage
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Homepage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

})();
