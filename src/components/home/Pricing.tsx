import { useHome } from './context'

const CARD = {
  borderRadius: 20,
  padding: 28,
  boxSizing: 'border-box' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 18,
}

export function Pricing() {
  const { c, href, lh, ls } = useHome()
  return (
    <section id="pricing" aria-label={c.aria.pricing} style={{ padding: '0 24px 96px' }}>
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0169cc' }}>{c.pricing.eyebrow}</span>
          <h2
            style={{
              margin: '8px 0 0',
              fontSize: 40,
              lineHeight: lh('46px', '58px'),
              fontWeight: 700,
              letterSpacing: ls('-0.03em'),
              color: '#0d0d0d',
            }}
          >
            {c.pricing.title}
          </h2>
          <p style={{ margin: '12px 0 0', fontSize: 17, lineHeight: '26px', color: '#5d5d5d' }}>{c.pricing.lead}</p>
        </div>

        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
            gap: 16,
            textAlign: 'start',
          }}
        >
          {c.pricing.plans.map((p, i) => {
            const dark = i === 1
            const muted = dark ? '#cdcdcd' : '#5d5d5d'
            return (
              <div
                key={p.name}
                style={
                  dark
                    ? { ...CARD, background: '#181818', color: '#fff' }
                    : { ...CARD, background: '#fff', color: '#0d0d0d', boxShadow: '0 0 0 1px rgba(13,13,13,.08)' }
                }
              >
                {dark ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, fontWeight: 600 }}>{p.name}</span>
                    <span
                      style={{
                        height: 22,
                        padding: '0 8px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,.14)',
                        fontSize: 12,
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      {p.badge}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: 17, fontWeight: 600 }}>{p.name}</span>
                )}
                <div>
                  <span style={{ fontSize: 40, lineHeight: '44px', fontWeight: 700, letterSpacing: ls('-0.03em') }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: muted }}>{c.pricing.perMonth}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: '21px', color: muted }}>{p.blurb}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a href={href(p.href)} className={dark ? 'hm-plan-dark' : 'hm-plan'}>
                  {p.cta}
                </a>
              </div>
            )
          })}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#767676' }}>{c.pricing.footnote}</p>
      </div>
    </section>
  )
}
