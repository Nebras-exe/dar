const { Button, Badge, NavBar, Card, SectionHeading, Accordion } = window.TerraInteriorsDesignSystem_ce1783;

function Photo({ ratio = '4/3', radius = 'var(--radius-l)', label }) {
  return (
    <div style={{ aspectRatio: ratio, borderRadius: radius, background: 'var(--sand-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-sans-body)' }}>
      {label || 'photo'}
    </div>
  );
}

function Icon({ name, size = 18 }) {
  return <i data-lucide={name} style={{ width: size, height: size }}></i>;
}

function Hero() {
  return (
    <section style={{ position: 'relative', padding: '0 40px 70px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-eyebrow)', marginBottom: 14 }}>Organic Spaces. Inspired Living.</div>
          <h1 style={{ fontFamily: 'var(--font-serif-display)', fontSize: 48, lineHeight: 1.12, color: 'var(--text-primary)', margin: '0 0 18px' }}>Beautiful interiors that <em>restore</em> and <em>inspire</em>.</h1>
          <p style={{ fontFamily: 'var(--font-sans-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: 380, marginBottom: 26 }}>We design wellness-inspired homes that blend natural beauty, function, and soulful living.</p>
          <Button variant="primary" size="lg">Explore Our Work</Button>
        </div>
        <Photo ratio="16/11" label="hero living room photo" />
      </div>
    </section>
  );
}

const SERVICES = [
  { icon: 'sofa', title: 'Full-Service Interior Design', description: 'From concept to completion, we handle every detail with care.' },
  { icon: 'utensils-crossed', title: 'Kitchen & Bath Design', description: 'Beautiful, functional spaces designed for everyday rituals.' },
  { icon: 'amphora', title: 'Styling & Decor', description: 'Curated pieces and finishing touches that bring your home to life.' },
  { icon: 'monitor', title: 'E-Design', description: 'Virtual design services, anywhere you are.' },
];

function WhatWeDo() {
  return (
    <section style={{ padding: '70px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <SectionHeading eyebrow="What We Do" title={<>Thoughtful design for how <em>you</em> live.</>} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        {SERVICES.map((s) => (
          <Card key={s.title} variant="service" icon={<Icon name={s.icon} size={18} />} title={s.title} description={s.description} />
        ))}
      </div>
    </section>
  );
}

const PROJECTS = [
  { title: 'Sagewood Residence', meta: 'Austin, Texas' },
  { title: 'Mossy Glen Kitchen', meta: 'Seattle, Washington' },
  { title: 'Sunset Cliffs Home', meta: 'San Diego, California' },
  { title: 'Caldera Bathroom', meta: 'Portland, Oregon' },
  { title: 'Willow Creek Retreat', meta: 'Napa Valley, California' },
];

function Projects() {
  return (
    <section style={{ padding: '30px 40px 70px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 30 }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-eyebrow)', marginBottom: 10 }}>Our Projects</div>
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: 30, color: 'var(--text-primary)' }}>Spaces that feel like home.</div>
        </div>
        <a href="#" style={{ fontFamily: 'var(--font-sans-body)', fontSize: 13, color: 'var(--link-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>View All Projects <Icon name="arrow-right" size={14} /></a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
        {PROJECTS.map((p) => <Card key={p.title} variant="project" title={p.title} meta={p.meta} />)}
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section style={{ padding: '30px 40px 80px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 60, alignItems: 'center' }}>
        <Photo ratio="4/5" label="founder portrait" />
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-eyebrow)', marginBottom: 14 }}>Meet the Founder</div>
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: 30, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 16 }}>Designing with intention. Rooted in <em>nature</em>.</div>
          <p style={{ fontFamily: 'var(--font-sans-body)', fontSize: 14, lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: 12 }}>Hi, I'm Marisa. Terra Interiors was born from my love of natural materials, mindful living, and the belief that our homes should support our well-being.</p>
          <p style={{ fontFamily: 'var(--font-sans-body)', fontSize: 14, lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: 20 }}>Every project is a collaboration. I take the time to understand your story, your needs, and your lifestyle to create spaces that are as beautiful as they are meaningful.</p>
          <a href="#" style={{ fontFamily: 'var(--font-sans-body)', fontSize: 13, color: 'var(--link-color)', textDecoration: 'none' }}>More About Marisa →</a>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: '1', title: 'Discover', desc: 'We get to know you, your vision, and your space.' },
  { n: '2', title: 'Design', desc: 'We create a tailored design that reflects your lifestyle.' },
  { n: '3', title: 'Plan', desc: 'We refine every detail and bring the plan to life.' },
  { n: '4', title: 'Execute', desc: 'We manage and collaborate with trusted partners.' },
  { n: '5', title: 'Enjoy', desc: 'Move in, exhale, and love where you live.' },
];

function Process() {
  return (
    <section style={{ padding: '70px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <SectionHeading eyebrow="Our Process" title={<>A thoughtful process. <em>Effortless</em> experience.</>} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        {STEPS.map((s) => (
          <div key={s.n} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-sans-body)' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--text-on-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontFamily: 'var(--font-serif-display)' }}>{s.n}</div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 170, margin: '0 auto' }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { quote: 'Marisa completely transformed our home into a peaceful retreat. She listened so deeply and brought beauty to every little detail.', name: 'Jessica T.', loc: 'Austin, Texas' },
  { quote: 'The process was seamless and so enjoyable. Our space feels elevated, calm, and truly ours.', name: 'Daniel & Kyle', loc: 'Seattle, Washington' },
  { quote: 'Terra Interiors exceeded every expectation. Thoughtful, professional, and incredibly talented.', name: 'Michelle R.', loc: 'Napa Valley, California' },
];

function Testimonials() {
  const [i, setI] = React.useState(0);
  const t = TESTIMONIALS[i];
  return (
    <section style={{ padding: '70px 40px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-eyebrow)', marginBottom: 14 }}>Kind Words</div>
      <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: 28, color: 'var(--text-primary)', marginBottom: 30 }}>Stories from our clients.</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center' }}>
        <button onClick={() => setI((i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} style={{ background: 'none', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--text-secondary)' }}>‹</button>
        <div style={{ fontFamily: 'var(--font-sans-body)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 560 }}>
          <p style={{ marginBottom: 16 }}>"{t.quote}"</p>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>— {t.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-eyebrow)' }}>{t.loc}</div>
        </div>
        <button onClick={() => setI((i + 1) % TESTIMONIALS.length)} style={{ background: 'none', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--text-secondary)' }}>›</button>
      </div>
    </section>
  );
}

function FaqTeaser() {
  return (
    <section style={{ padding: '0 40px 70px', maxWidth: 700, margin: '0 auto' }}>
      <Accordion items={[
        { title: 'How long does a project take?', content: 'Every project timeline is tailored to scope and complexity — we set expectations together at the Discover stage.' },
        { title: 'Do you work with clients remotely?', content: 'Yes — our E-Design service supports clients anywhere.' },
      ]} />
    </section>
  );
}

function ClosingCTA() {
  return (
    <section style={{ padding: '0 40px 40px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ background: 'var(--olive-700)', borderRadius: 'var(--radius-blob)', padding: '54px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30 }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--sand-200)', marginBottom: 12 }}>Ready to Begin?</div>
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: 30, color: 'var(--cream-white)' }}>Let's create a space that feels like <em>you</em>.</div>
        </div>
        <Button variant="secondary" size="lg" style={{ whiteSpace: 'nowrap' }}>Book Your Consultation</Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--olive-900)', color: 'var(--sand-200)', padding: '50px 40px 26px', fontFamily: 'var(--font-sans-body)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 30 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: 18, color: 'var(--cream-white)', marginBottom: 10 }}>terra <span style={{ fontFamily: 'var(--font-sans-body)', fontSize: 9, letterSpacing: '.25em' }}>INTERIORS</span></div>
          <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 220 }}>Wellness-inspired interiors designed to bring beauty, balance, and meaning to your everyday.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Icon name="instagram" size={16} /><Icon name="facebook" size={16} /><Icon name="share-2" size={16} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--sand-400)' }}>Quick Links</div>
          {['About', 'Services', 'Projects', 'Process', 'Journal', 'Contact'].map((l) => <div key={l} style={{ fontSize: 13, marginBottom: 8 }}>{l}</div>)}
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--sand-400)' }}>Services</div>
          {['Full-Service Interior Design', 'Kitchen & Bath Design', 'Styling & Decor', 'E-Design'].map((l) => <div key={l} style={{ fontSize: 13, marginBottom: 8 }}>{l}</div>)}
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--sand-400)' }}>Let's Connect</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>hello@terrainteriors.com</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}>512 555 1234</div>
          <div style={{ fontSize: 13 }}>Austin, Texas</div>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: '30px auto 0', paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.12)', fontSize: 11, color: 'var(--sand-400)' }}>© 2026 Terra Interiors. All rights reserved.</div>
    </footer>
  );
}

function Homepage() {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); }, []);
  return (
    <div style={{ background: 'var(--bg-page)' }}>
      <NavBar activeLink="Home" />
      <Hero />
      <WhatWeDo />
      <Projects />
      <Founder />
      <Process />
      <Testimonials />
      <FaqTeaser />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

window.TerraHomepage = { Homepage };
