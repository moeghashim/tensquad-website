import { useHome } from './context'

export function Nav() {
  const { c, href } = useHome()
  return (
    <nav
      aria-label={c.aria.site}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        background: 'rgba(252,252,252,.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(13,13,13,.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '12px clamp(24px,3vw,48px)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <a
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#0d0d0d', marginInlineEnd: 8 }}
        >
          <img src="/logo/logo.svg" alt="" width={30} height={30} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>tensquads</span>
        </a>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <a href="#squad" className="hm-navlink">{c.nav.agents}</a>
          <a href="#how" className="hm-navlink">{c.nav.how}</a>
          <a href="#control" className="hm-navlink">{c.nav.control}</a>
          <a href="#pricing" className="hm-navlink">{c.nav.pricing}</a>
        </div>
        <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="#" className="hm-navlink">{c.nav.signIn}</a>
          <a href={href('start')} className="hm-start">{c.nav.start}</a>
        </div>
      </div>
    </nav>
  )
}
