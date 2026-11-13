import { ALL, mascot } from './agents'
import { agentText, useHome } from './context'

export function GetStarted() {
  const { c, href, lh, ls } = useHome()
  return (
    <section aria-label={c.aria.getStarted} style={{ padding: '0 24px 96px' }}>
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          background: '#181818',
          color: '#fff',
          borderRadius: 28,
          padding: '64px clamp(24px,4vw,48px) 0',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 20,
          overflow: 'hidden',
        }}
      >
        <h2
          style={{
            margin: 0,
            maxWidth: 700,
            fontSize: 'clamp(32px,4vw,44px)',
            lineHeight: lh(1.14, 1.4),
            fontWeight: 700,
            letterSpacing: ls('-0.03em'),
            textWrap: 'balance',
          }}
        >
          {c.getStarted.title}
        </h2>
        <p style={{ margin: 0, maxWidth: 540, fontSize: 17, lineHeight: '26px', color: '#cdcdcd' }}>{c.getStarted.lead}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={href('start')} className="hm-gs">
            {c.getStarted.primary}
          </a>
          <a href="#" className="hm-gs hm-gs-ghost">
            {c.getStarted.secondary}
          </a>
        </div>
        <div
          style={{
            marginTop: 24,
            width: '100%',
            maxWidth: 920,
            background: '#f3f3f3',
            borderRadius: '24px 24px 0 0',
            padding: '20px 16px 0',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            {ALL.map((a, i) => (
              <img
                key={a.slug}
                src={mascot(a.slug)}
                alt={agentText(c, a.slug).name}
                style={{
                  width: `${100 / 13}%`,
                  minWidth: 0,
                  display: 'block',
                  animation: `ts-bob 2.4s ease-in-out ${-i * 0.18}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
