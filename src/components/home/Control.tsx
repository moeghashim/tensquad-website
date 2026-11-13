import { mascot } from './agents'
import { useHome } from './context'

export function Control() {
  const { c, lh, ls } = useHome()
  return (
    <section id="control" aria-label={c.aria.control} style={{ padding: '0 24px 96px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0169cc' }}>{c.control.eyebrow}</span>
          <h2
            style={{
              margin: 0,
              fontSize: 40,
              lineHeight: lh('46px', '58px'),
              fontWeight: 700,
              letterSpacing: ls('-0.03em'),
              color: '#0d0d0d',
              textWrap: 'balance',
            }}
          >
            {c.control.title}
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {c.control.items.map((it) => (
              <li key={it.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: '#04b84c14',
                    color: '#00692a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                    marginTop: 1,
                  }}
                >
                  <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                </span>
                <span style={{ fontSize: 16, lineHeight: '24px', color: '#282828' }}>
                  <strong style={{ color: '#0d0d0d' }}>{it.title}</strong> {it.body}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 0 0 1px rgba(13,13,13,.08),0 16px 48px rgba(13,13,13,.06)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#0d0d0d' }}>{c.control.approvalHeading}</span>
              <span
                style={{
                  minWidth: 22,
                  height: 22,
                  padding: '0 7px',
                  boxSizing: 'border-box',
                  borderRadius: 999,
                  background: '#fb6a2212',
                  color: '#923b0f',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </span>
            </div>
            <div style={{ borderRadius: 12, background: '#f9f9f9', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#5d5d5d' }}>
                <img src={mascot('rio')} alt="" style={{ height: 28, width: 'auto' }} />
                {c.control.rio.who}
                <span style={{ marginInlineStart: 'auto', fontWeight: 600, color: '#0d0d0d', fontSize: 14 }}>{c.control.rio.amount}</span>
              </div>
              <div style={{ fontWeight: 500, color: '#0d0d0d' }}>{c.control.rio.title}</div>
              <div style={{ fontSize: 13, color: '#5d5d5d' }}>{c.control.rio.body}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span
                  style={{
                    height: 30,
                    padding: '0 12px',
                    fontSize: 13,
                    background: '#181818',
                    color: '#fff',
                    borderRadius: 999,
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {c.control.rio.approve}
                </span>
                <span
                  style={{
                    height: 30,
                    padding: '0 12px',
                    fontSize: 13,
                    background: 'rgba(13,13,13,.06)',
                    color: '#0d0d0d',
                    borderRadius: 999,
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {c.control.rio.decline}
                </span>
              </div>
            </div>
            <div style={{ borderRadius: 12, background: '#f9f9f9', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#5d5d5d' }}>
                <img src={mascot('kyoto')} alt="" style={{ height: 28, width: 'auto' }} />
                {c.control.kyoto.who}
                <span style={{ marginInlineStart: 'auto', fontWeight: 600, color: '#0d0d0d', fontSize: 14 }}>{c.control.kyoto.amount}</span>
              </div>
              <div style={{ fontWeight: 500, color: '#0d0d0d' }}>{c.control.kyoto.title}</div>
              <div style={{ fontSize: 13, color: '#5d5d5d' }}>{c.control.kyoto.body}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {c.control.limits.map((l) => (
              <div
                key={l.label}
                style={{
                  flex: '1 1 140px',
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 0 0 1px rgba(13,13,13,.08)',
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 12, color: '#5d5d5d' }}>{l.label}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#0d0d0d' }}>{l.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
