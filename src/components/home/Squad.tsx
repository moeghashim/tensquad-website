import type { CSSProperties } from 'react'
import { ALL, TILTS, mascot } from './agents'
import { agentText, useHome } from './context'

export function Squad() {
  const { c, lh, ls } = useHome()
  const tiles = ALL.map((a, i) => ({ ...a, ...agentText(c, a.slug), tilt: `rotate(${TILTS[i % 5]}deg)` }))
  return (
    <section id="squad" aria-label={c.aria.agents} style={{ padding: '72px 24px 96px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(40px,6.4vw,84px)',
              fontWeight: 700,
              lineHeight: lh(1.04, 1.35),
              letterSpacing: ls('-0.035em'),
            }}
          >
            <span style={{ color: '#8f8f8f' }}>{c.squad.titleA}</span>
            <br />
            <span style={{ color: '#0d0d0d' }}>{c.squad.titleB}</span>
          </h2>
          <p style={{ margin: '20px 0 0', maxWidth: 760, fontSize: 19, lineHeight: '28px', color: '#5d5d5d', textWrap: 'pretty' }}>
            {c.squad.lead}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(138px,1fr))', gap: '36px 16px' }}>
          {tiles.map((a) => (
            <div key={a.slug} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
              <div
                role="img"
                aria-label={a.name}
                className="hm-tile"
                style={
                  {
                    width: 120,
                    height: 120,
                    borderRadius: 30,
                    boxShadow: '0 14px 28px rgba(13,13,13,.1)',
                    marginBottom: 12,
                    background: `${a.light} url(${mascot(a.slug)}) center bottom / auto 84% no-repeat`,
                    '--tilt': a.tilt,
                  } as CSSProperties
                }
              />
              <span style={{ fontSize: 20, lineHeight: '26px', fontWeight: 600, color: '#0d0d0d' }}>{a.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: '18px', color: '#5d5d5d' }}>
                {a.role}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {c.squad.cards.map((card, i) => (
            <div
              key={card.tag}
              style={{
                borderRadius: 24,
                background: ['#e7efff', '#ece3ff', '#fee7c2', '#fff'][i],
                boxShadow: '0 0 0 1px rgba(13,13,13,.06)',
                padding: 20,
                boxSizing: 'border-box',
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <span
                style={{
                  alignSelf: 'flex-start',
                  height: 26,
                  padding: '0 10px',
                  borderRadius: 999,
                  background: 'rgba(13,13,13,.06)',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 12,
                  color: '#282828',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {card.tag}
              </span>
              <div
                style={{
                  marginTop: 'auto',
                  fontSize: 'clamp(20px,2.2vw,30px)',
                  fontWeight: 700,
                  color: '#0d0d0d',
                  lineHeight: lh(1.12, 1.4),
                  letterSpacing: ls('-0.03em'),
                }}
              >
                {card.lines[0]}
                <br />
                {card.lines[1]}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {card.chips.map((chip) => (
                  <span
                    key={chip}
                    style={{
                      height: 26,
                      padding: '0 10px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,.8)',
                      boxShadow: '0 0 0 1px rgba(13,13,13,.06)',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 12,
                      color: '#282828',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
