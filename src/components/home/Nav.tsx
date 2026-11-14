import { useEffect, useState } from 'react'
import { useHome } from './context'
import { BRAND, LOGO, logoSize } from '../../lib/brand'

// Quiet nav: transparent over the hero, a hairline and frosted backdrop only once the page scrolls.
export function Nav() {
  const { c, href } = useHome()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <nav aria-label={c.aria.site} className="hm-nav" data-scrolled={scrolled ? '' : undefined}>
      <div className="hm-nav-inner hm-wrap">
        <a href="/" className="hm-brand">
          <img src={LOGO.src} alt={LOGO.wordmark ? BRAND : ''} {...logoSize(26)} />
          {!LOGO.wordmark && <span>{BRAND}</span>}
        </a>
        <div className="hm-nav-links">
          <a href="#squad" className="hm-navlink">{c.nav.agents}</a>
          <a href="#how" className="hm-navlink">{c.nav.how}</a>
          <a href="#control" className="hm-navlink">{c.nav.control}</a>
          <a href="#pricing" className="hm-navlink">{c.nav.pricing}</a>
        </div>
        <div className="hm-nav-actions">
          <a href="#" className="hm-navlink">{c.nav.signIn}</a>
          <a href={href('start')} className="hm-start">{c.nav.start}</a>
        </div>
      </div>
    </nav>
  )
}
