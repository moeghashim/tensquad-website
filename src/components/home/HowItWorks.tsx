import { useHome } from './context'

export function HowItWorks() {
  const { c, lh, ls } = useHome()
  return (
    <section id="how" aria-label={c.aria.how} style={{ padding: '0 24px 96px' }}>
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          background: '#f3f3f3',
          borderRadius: 28,
          padding: '56px clamp(24px,4vw,48px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0169cc' }}>{c.how.eyebrow}</span>
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
            {c.how.title}
          </h2>
        </div>
        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: 24,
          }}
        >
          {c.how.steps.map((s, i) => (
            <li key={s.title} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: '#181818',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: ls('-0.02em'), color: '#0d0d0d' }}>{s.title}</span>
              <span style={{ fontSize: 15, lineHeight: '23px', color: '#5d5d5d' }}>{s.body}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
