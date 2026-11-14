import { useHome } from './context'
import { BRAND } from '../../lib/brand'

export function Footer() {
  const { c } = useHome()
  return (
    <footer style={{ borderTop: '1px solid rgba(13,13,13,.06)', padding: '40px 24px 32px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 260 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#0d0d0d', textDecoration: 'none' }}>
            <img src="/logo/logo.svg" alt="" width={24} height={24} />
            {BRAND}
          </a>
          <span style={{ fontSize: 13, color: '#5d5d5d' }}>{c.footer.tagline}</span>
        </div>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0d0d0d' }}>{c.footer.product}</span>
            <a href="#squad" className="hm-foot-link">{c.footer.links.agents}</a>
            <a href="#how" className="hm-foot-link">{c.footer.links.how}</a>
            <a href="#pricing" className="hm-foot-link">{c.footer.links.pricing}</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0d0d0d' }}>{c.footer.legal}</span>
            <a href="#" className="hm-foot-link">{c.footer.links.terms}</a>
            <a href="#" className="hm-foot-link">{c.footer.links.privacy}</a>
            <a href="#" className="hm-foot-link">{c.footer.links.security}</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1440, margin: '24px auto 0', fontSize: 12, color: '#767676' }}>{c.footer.copyright}</div>
    </footer>
  )
}
