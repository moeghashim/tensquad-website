import type { CSSProperties } from 'react'
import { ALL, MASTER, WORKERS, WORKER_POS, mascot } from './agents'
import { agentText, useHome } from './context'
import { HeroScreens } from './HeroScreens'
import { MONO } from './ui'
import { useHeroLoop } from './useHeroLoop'

// Status chip colours used by the round-table card and the feed.
const STATUS = {
  done: { bg: '#04b84c14', fg: '#00692a' },
  waiting: { bg: '#fb6a2212', fg: '#923b0f' },
  running: { bg: '#0285ff0a', fg: '#004f99' },
  planning: { bg: '#924ff70f', fg: '#6b3ab4' },
} as const

const N = WORKERS.length

export function Hero() {
  const { c, isAr, ls, lh, href } = useHome()
  const { t, fs, stickTop, sc, loopRef, colRef } = useHeroLoop()

  // Timeline. Mirrors the design's renderVals: t walks intro -> one job per 2 ticks -> finished.
  const intro = t < 2
  const finished = t >= 2 + N * 2
  const step = intro ? -1 : Math.min(N, Math.floor((t - 2) / 2))
  const half = intro ? 0 : (t - 2) % 2
  const doneCount = intro ? 0 : finished ? N : step + (half ? 1 : 0)
  const cur = !fs && !intro && !finished ? WORKERS[step] : null
  const curPos = cur ? WORKER_POS[step] : null

  // Focus (scroll-driven): fs = 1..13 picks one of ALL.
  const F = fs ? ALL[fs - 1] : null
  const FV = F ?? MASTER
  const focusIdx = fs ? fs - 1 : -1
  const fi = (fs || 1) - 1
  const [fH1, fH2, fTools] = c.focus[fi]
  const fNum = String(fs || 1).padStart(2, '0')
  const fText = agentText(c, FV.slug)

  // Card (who is talking, what they say, status chip).
  const who = F ?? cur ?? MASTER
  const whoText = agentText(c, who.slug)
  const msg = F
    ? (fText.done ?? c.hero.splitMsg)
    : cur
      ? half
        ? (agentText(c, cur.slug).done ?? '')
        : (agentText(c, cur.slug).doing ?? '')
      : intro
        ? c.hero.splitting
        : c.hero.allDoneMsg
  const st = F
    ? STATUS.done
    : cur
      ? half
        ? STATUS.done
        : cur.ask
          ? STATUS.waiting
          : STATUS.running
      : intro
        ? STATUS.planning
        : STATUS.done
  const stLabel = F
    ? c.hero.statusDone
    : cur
      ? half
        ? c.hero.statusDone
        : cur.ask
          ? c.hero.statusWaiting
          : c.hero.statusRunning
      : intro
        ? c.hero.statusPlanning
        : c.hero.statusDone

  // Typing animation for the request line.
  const request = c.hero.request
  const typedN = t === 0 ? Math.ceil(request.length / 2) : request.length

  // Feed: the three most recent jobs, newest first.
  const shown = intro ? 0 : Math.min(N, step + 1)
  const feed = WORKERS.slice(0, shown)
    .map((a, i) => {
      const dn = i < doneCount
      const tx = agentText(c, a.slug)
      return {
        key: a.slug,
        name: tx.name,
        role: tx.role,
        text: dn ? (tx.done ?? '') : (tx.doing ?? ''),
        status: dn ? c.hero.statusDone : a.ask ? c.hero.statusWaiting : c.hero.statusRunning,
        cbg: dn ? STATUS.done.bg : a.ask ? STATUS.waiting.bg : STATUS.running.bg,
        cfg: dn ? STATUS.done.fg : a.ask ? STATUS.waiting.fg : STATUS.running.fg,
        bg: `${a.light} url(${mascot(a.slug)}) center bottom / auto 32px no-repeat`,
      }
    })
    .reverse()
    .slice(0, 3)

  const progressLabel = intro ? c.hero.planning : finished ? c.hero.allDone : c.hero.jobsDone(doneCount)
  const progressPct = `${Math.round((doneCount / N) * 100)}%`

  // Round table: ring, connector lines, 12 workers, Petra, and the packet.
  const kids = (
    <>
      <div
        style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          background: F ? F.light : '#f3f3f3',
          transition: 'background 1s ease',
          boxShadow: 'inset 0 0 0 1px rgba(13,13,13,.06)',
        }}
      />
      {!fs && (
        <svg viewBox="0 0 100 100" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {WORKERS.map((a, i) => {
            const on = cur === a
            const dn = i < doneCount
            const p = WORKER_POS[i]
            return (
              <line
                key={a.slug}
                x1={50}
                y1={50}
                x2={p.x}
                y2={p.y}
                stroke={on ? a.deep : dn ? a.base : '#cdcdcd'}
                strokeWidth={on ? 2 : 1.5}
                vectorEffect="non-scaling-stroke"
                strokeDasharray={on ? '4 8' : undefined}
                strokeLinecap="round"
                style={on ? { animation: 'ts-dash .6s linear infinite' } : undefined}
              />
            )
          })}
        </svg>
      )}
      {WORKERS.map((a, i) => {
        const fo = F === a
        const on = cur === a
        const dn = i < doneCount
        const p = WORKER_POS[i]
        const tx = agentText(c, a.slug)
        return (
          <div
            key={a.slug}
            style={{
              position: 'absolute',
              left: `${fo ? 0 : p.x}%`,
              top: `${fo ? 50 : p.y}%`,
              width: fo ? '34%' : '13%',
              transform: `translate(-50%,-50%) scale(${on ? 1.12 : 1})`,
              transition:
                'transform .4s cubic-bezier(.3,1.4,.5,1), opacity .7s ease, left 1.1s cubic-bezier(.4,0,.1,1), top 1.1s cubic-bezier(.4,0,.1,1), width 1.1s cubic-bezier(.4,0,.1,1)',
              opacity: fs ? (fo ? 1 : 0) : on || dn || finished || intro ? 1 : 0.55,
              zIndex: on ? 3 : 1,
            }}
          >
            {on && (
              <span
                key={`halo${t}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '120%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: a.light,
                  animation: 'ts-halo 1.2s ease-out infinite',
                }}
              />
            )}
            <img
              src={mascot(a.slug)}
              alt={`${tx.name}${c.hero.listSep}${tx.role}`}
              style={{
                position: 'relative',
                width: '100%',
                display: 'block',
                animation: `ts-bob ${on ? 0.7 : 3.2}s ease-in-out ${-i * 0.27}s infinite`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '100%',
                transform: 'translateX(-50%)',
                opacity: fs ? 0 : 1,
                marginTop: 1,
                padding: '0 6px',
                borderRadius: 999,
                background: on ? a.light : 'transparent',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                lineHeight: '13px',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0d0d0d' }}>{tx.name}</div>
            </div>
            {dn && !fs && (
              <span
                style={{
                  position: 'absolute',
                  insetInlineEnd: '-4%',
                  top: '-2%',
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: '#00a240',
                  boxShadow: '0 0 0 2px #fcfcfc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'ts-pop .3s ease-out',
                }}
              >
                <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5 6.5 12 13 4.5" />
                </svg>
              </span>
            )}
          </div>
        )
      })}
      <img
        src={mascot('petra')}
        alt={`${agentText(c, 'petra').name}${c.hero.listSep}${agentText(c, 'petra').role}`}
        style={{
          position: 'absolute',
          left: F === MASTER ? '-17%' : '37%',
          top: F === MASTER ? '29%' : '33%',
          width: F === MASTER ? '34%' : '26%',
          opacity: fs && F !== MASTER ? 0 : 1,
          pointerEvents: 'none',
          transition:
            'left 1.1s cubic-bezier(.4,0,.1,1), top 1.1s cubic-bezier(.4,0,.1,1), width 1.1s cubic-bezier(.4,0,.1,1), opacity .7s ease',
          zIndex: 2,
          animation: 'ts-bob 2.6s ease-in-out infinite',
        }}
      />
      {cur && curPos && (
        <span
          key={`pk${t}`}
          style={
            {
              position: 'absolute',
              width: 14,
              height: 14,
              margin: -7,
              borderRadius: 999,
              background: cur.deep,
              boxShadow: '0 0 0 3px #fff',
              zIndex: 4,
              '--fx': half ? `${curPos.x}%` : '50%',
              '--fy': half ? `${curPos.y}%` : '50%',
              '--tx': half ? '50%' : `${curPos.x}%`,
              '--ty': half ? '50%' : `${curPos.y}%`,
              left: 'var(--fx)',
              top: 'var(--fy)',
              animation: 'ts-pk .8s cubic-bezier(.4,0,.2,1) forwards',
            } as CSSProperties
          }
        />
      )}
    </>
  )

  const card = (
    <div
      key={`card${step}-${half}`}
      style={{
        opacity: fs ? 0 : 1,
        transition: 'opacity .7s ease',
        width: '100%',
        maxWidth: 440,
        minHeight: 76,
        boxSizing: 'border-box',
        background: '#fff',
        borderRadius: 16,
        boxShadow: `0 0 0 2px ${who.base}`,
        padding: '10px 16px 10px 10px',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        animation: 'ts-pop .3s ease-out',
        textAlign: 'start',
      }}
    >
      <span
        style={{
          width: 52,
          height: 52,
          flex: 'none',
          borderRadius: 12,
          background: who.light,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img src={mascot(who.slug)} alt="" style={{ height: 46 }} />
      </span>
      <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0d0d0d' }}>{whoText.name}</span>
          <span style={{ fontSize: 12, color: '#5d5d5d' }}>{whoText.role}</span>
          <span
            style={{
              marginInlineStart: 'auto',
              height: 22,
              padding: '0 8px',
              borderRadius: 999,
              background: st.bg,
              color: st.fg,
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {stLabel}
          </span>
        </div>
        <div style={{ fontSize: 14, lineHeight: '20px', color: '#282828' }}>{msg}</div>
      </div>
    </div>
  )

  return (
    <section ref={loopRef} aria-label={c.aria.hero} style={{ height: '800vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          minHeight: '100vh',
          boxSizing: 'border-box',
          padding: '76px 24px 40px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          top: `${-stickTop}px`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            insetInlineEnd: '-8%',
            top: '8%',
            width: '58%',
            aspectRatio: '1',
            borderRadius: '50%',
            filter: 'blur(90px)',
            pointerEvents: 'none',
            transition: 'background 1s ease,opacity .7s ease',
            background: FV.light,
            opacity: fs ? 0.75 : 0,
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1440,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px 32px',
            alignItems: stickTop > 0 ? 'flex-end' : 'center',
          }}
        >
          {/* Left: headline, request card, CTA, and the scroll-driven focus overlay. */}
          <div style={{ flex: '1 1 340px', minWidth: 0, position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                alignItems: 'flex-start',
                transition: 'opacity .7s ease',
                opacity: fs ? 0 : 1,
                pointerEvents: fs ? 'none' : 'auto',
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(40px,5.4vw,68px)',
                  lineHeight: lh(1.04, 1.3),
                  fontWeight: 700,
                  letterSpacing: ls('-0.035em'),
                  color: '#0d0d0d',
                  textWrap: 'balance',
                }}
              >
                {c.hero.title}
              </h1>

              <div
                style={{
                  width: '100%',
                  maxWidth: 520,
                  background: '#fff',
                  borderRadius: 20,
                  boxShadow: '0 0 0 1px rgba(13,13,13,.1),0 16px 48px rgba(13,13,13,.08)',
                  padding: 16,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 500, color: '#8f8f8f' }}>{c.hero.youAsked}</div>
                <div style={{ fontSize: 17, lineHeight: '26px', color: '#0d0d0d', minHeight: 52 }}>
                  {request.slice(0, typedN)}
                  <span
                    style={{
                      display: 'inline-block',
                      width: 2,
                      height: 20,
                      marginLeft: 2,
                      verticalAlign: -3,
                      background: '#0d0d0d',
                      animation: 'ts-blink 1s steps(1) infinite',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    minHeight: 136,
                    borderTop: '1px solid rgba(13,13,13,.06)',
                    paddingTop: 12,
                  }}
                >
                  {feed.map((j) => (
                    <div key={j.key} style={{ display: 'flex', gap: 10, alignItems: 'center', minHeight: 40 }}>
                      <span style={{ width: 36, height: 36, flex: 'none', borderRadius: 10, background: j.bg }} />
                      <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 12, lineHeight: '18px', color: '#5d5d5d' }}>
                          <strong style={{ color: '#0d0d0d', fontWeight: 600 }}>{j.name}</strong> · {j.role}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            lineHeight: '18px',
                            color: '#282828',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {j.text}
                        </span>
                      </div>
                      <span
                        style={{
                          flex: 'none',
                          height: 22,
                          padding: '0 8px',
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          background: j.cbg,
                          color: j.cfg,
                        }}
                      >
                        {j.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    borderTop: '1px solid rgba(13,13,13,.06)',
                    paddingTop: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5d5d5d' }}>
                    <span>{progressLabel}</span>
                    <span style={{ fontFamily: MONO }}>{progressPct}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'rgba(13,13,13,.08)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 999,
                        background: '#181818',
                        transition: 'width .5s cubic-bezier(.3,0,.2,1)',
                        width: progressPct,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <a href={href('start')} className="hm-cta-dark">
                  {c.hero.cta}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={isAr ? 'M13 8H3M7 4 3 8l4 4' : 'M3 8h10M9 4l4 4-4 4'} />
                  </svg>
                </a>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#767676' }}>{c.hero.fine}</p>
            </div>

            {/* Focus overlay: the agent the scroll has landed on. */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'flex-start',
                pointerEvents: 'none',
                transition: 'opacity .7s ease',
                justifyContent: stickTop > 0 ? 'flex-end' : 'center',
                opacity: fs ? 1 : 0,
              }}
            >
              <img
                key={`fm${fs || 1}`}
                src={mascot(FV.slug)}
                alt=""
                style={{
                  height: 'clamp(96px,20vh,200px)',
                  width: 'auto',
                  display: 'block',
                  animation: 'ts-pop .7s ease-out',
                }}
              />
              <span
                style={{
                  height: 28,
                  paddingInline: '4px 12px',
                  borderRadius: 999,
                  background: '#fff',
                  boxShadow: '0 0 0 1px rgba(13,13,13,.08)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#0d0d0d',
                }}
              >
                <span
                  style={{
                    height: 20,
                    padding: '0 7px',
                    borderRadius: 999,
                    fontFamily: MONO,
                    fontSize: 11,
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'background .8s',
                    background: FV.light,
                  }}
                >
                  {fNum}
                </span>
                <span>{fText.name}</span>
                <span>·</span>
                <span>{fText.role}</span>
              </span>
              <div
                style={{
                  fontSize: 'clamp(26px,3.6vw,46px)',
                  fontWeight: 700,
                  lineHeight: lh(1.1, 1.4),
                  letterSpacing: ls('-0.03em'),
                  textWrap: 'balance',
                }}
              >
                <span style={{ color: '#8f8f8f' }}>{fH1}</span>
                <br />
                <span style={{ color: '#0d0d0d' }}>{fH2}</span>
              </div>
              <p
                style={{
                  margin: 0,
                  maxWidth: 440,
                  fontSize: 'clamp(14px,1vw + 8px,17px)',
                  lineHeight: 1.5,
                  color: '#5d5d5d',
                  textWrap: 'pretty',
                }}
              >
                {fText.why}
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {fTools.map((k) => (
                  <span
                    key={k}
                    style={{
                      height: 24,
                      padding: '0 10px',
                      borderRadius: 999,
                      background: '#fff',
                      boxShadow: '0 0 0 1px rgba(13,13,13,.08)',
                      fontFamily: MONO,
                      fontSize: 11.5,
                      color: '#282828',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {k}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ALL.map((a, i) => (
                  <span
                    key={a.slug}
                    style={{
                      height: 6,
                      borderRadius: 999,
                      transition: 'width .3s,background .3s',
                      width: i === fs - 1 ? '24px' : '6px',
                      background: i === fs - 1 ? '#181818' : 'rgba(13,13,13,.16)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: the round table, the request card, and the scaled product mockups. */}
          <div
            ref={colRef}
            style={{
              flex: '1 1 380px',
              minWidth: 0,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 'min(560px, max(260px, calc(100vh - 250px)))',
                aspectRatio: '1',
                marginBottom: 28,
                opacity: fs ? 0 : 1,
                transition: 'opacity .7s ease',
              }}
            >
              {kids}
            </div>
            {card}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={{ position: 'relative', flex: 'none', width: `${560 * sc}px`, height: `${440 * sc}px` }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 560,
                    height: 440,
                    transformOrigin: '0 0',
                    transform: `scale(${sc})`,
                  }}
                >
                  <HeroScreens focus={focusIdx} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
