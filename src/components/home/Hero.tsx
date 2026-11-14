import type { CSSProperties } from 'react'
import { ALL, MASTER, WORKERS, WORKER_POS, mascot, type AgentStyle } from './agents'
import { agentText, useHome } from './context'
import { HeroScreens } from './HeroScreens'
import { MONO } from './ui'
import { useHeroLoop } from './useHeroLoop'

// Status colours shared by the message chips and the ticker.
const STATUS = {
  done: { bg: '#04b84c14', fg: '#00692a', dot: '#00a240' },
  waiting: { bg: '#fb6a2212', fg: '#923b0f', dot: '#fb6a22' },
  running: { bg: '#0285ff0a', fg: '#004f99', dot: '#0285ff' },
  planning: { bg: '#924ff70f', fg: '#6b3ab4', dot: '#924ff7' },
} as const

const N = WORKERS.length

// Table geometry (SVG viewBox 0..100). Seats sit around the table at radius 44 (WORKER_POS);
// the tabletop's edge, where progress and handoffs run, is at radius 35.
const RIM_R = 35
const seatDeg = (i: number) => -75 + 30 * i
const rad = (d: number) => (d * Math.PI) / 180
const pt = (r: number, d: number) => `${(50 + r * Math.cos(rad(d))).toFixed(2)} ${(50 + r * Math.sin(rad(d))).toFixed(2)}`
// Each seat owns a 30deg stretch of rim, with a gap either side so the segments read as twelve.
const RIM_ARCS = WORKERS.map((_, i) => `M ${pt(RIM_R, seatDeg(i) - 11)} A ${RIM_R} ${RIM_R} 0 0 1 ${pt(RIM_R, seatDeg(i) + 11)}`)
// The handoff runs along the rim from 12 o'clock (the gap right above Petra) to the seat, the short way round.
const RIM_RUNS = WORKERS.map((_, i) => {
  const d = seatDeg(i)
  const cw = d <= 90
  return `M ${pt(RIM_R, -90)} A ${RIM_R} ${RIM_R} 0 0 ${cw ? 1 : 0} ${pt(RIM_R, cw ? d : d - 360)}`
})
// Message chips sit outside the circle at their seat's height: right-half seats on the right, left-half on the left.
const CHIP_JITTER = [0, 30, 10, 38, 6, 22]
const CHIP_TILT = [-1.2, 0.8, -0.6, 1.1, -0.9, 0.5]

type Status = keyof typeof STATUS

export function Hero() {
  const { c, isAr, ls, lh, href } = useHome()
  const { t, fs, stickTop, sc, loopRef, colRef } = useHeroLoop()

  // Timeline: intro (Petra plans) -> one job per 2 ticks (handoff, report) -> finished.
  const intro = t < 2
  const finished = t >= 2 + N * 2
  const step = intro ? -1 : Math.min(N, Math.floor((t - 2) / 2))
  const half = intro ? 0 : (t - 2) % 2
  const doneCount = intro ? 0 : finished ? N : step + (half ? 1 : 0)
  const cur = !fs && !intro && !finished ? WORKERS[step] : null

  // Focus (scroll-driven): fs = 1..13 picks one of ALL.
  const F = fs ? ALL[fs - 1] : null
  const FV = F ?? MASTER
  const focusIdx = fs ? fs - 1 : -1
  const [fH1, fH2, fTools] = c.focus[(fs || 1) - 1]
  const fNum = String(fs || 1).padStart(2, '0')
  const fText = agentText(c, FV.slug)

  const request = c.hero.request
  const typedN = t === 0 ? Math.ceil(request.length / 2) : request.length

  const statusOf = (a: AgentStyle, i: number): Status => (i < doneCount ? 'done' : a.ask ? 'waiting' : 'running')
  const statusLabel = (s: Status) =>
    s === 'done' ? c.hero.statusDone : s === 'waiting' ? c.hero.statusWaiting : s === 'running' ? c.hero.statusRunning : c.hero.statusPlanning

  // Chips: every job started so far, newest brightest.
  const started = intro ? 0 : Math.min(N, step + 1)
  const chips = WORKERS.slice(0, started).map((a, i) => {
    const s = statusOf(a, i)
    const tx = agentText(c, a.slug)
    const age = Math.max(0, step - i)
    return {
      a,
      i,
      s,
      name: tx.name,
      text: s === 'done' ? (tx.done ?? '') : (tx.doing ?? ''),
      opacity: finished ? 0.85 : age === 0 ? 1 : age <= 2 ? 0.8 : 0.5,
      right: i < N / 2,
      y: WORKER_POS[i].y,
    }
  })

  // Ticker (narrow screens, where chips do not fit): the latest line from the squad.
  const petra = agentText(c, MASTER.slug)
  const ticker = intro
    ? { who: MASTER, name: petra.name, text: c.hero.splitting, s: 'planning' as Status }
    : finished
      ? { who: MASTER, name: petra.name, text: c.hero.allDoneMsg, s: 'done' as Status }
      : (() => {
          const a = WORKERS[step]
          const s = statusOf(a, step)
          const tx = agentText(c, a.slug)
          return { who: a, name: tx.name, text: s === 'done' ? (tx.done ?? '') : (tx.doing ?? ''), s }
        })()

  const progressLabel = intro ? c.hero.planning : finished ? c.hero.allDone : c.hero.jobsDone(doneCount)
  const progressPct = `${Math.round((doneCount / N) * 100)}%`

  const petraImg = (className: string, style?: CSSProperties) => (
    <img
      src={mascot(MASTER.slug)}
      alt={`${petra.name}${c.hero.listSep}${petra.role}`}
      className={className}
      style={{ animation: 'ts-bob 2.6s ease-in-out .8s infinite, ts-rise .8s cubic-bezier(.2,.9,.25,1.2) backwards', ...style }}
    />
  )

  return (
    <section ref={loopRef} aria-label={c.aria.hero} style={{ height: '800vh', position: 'relative', marginTop: 'calc(-1 * var(--hm-nav-h))' }}>
      <div className="hm-stage" style={{ top: `${-stickTop}px` }}>
        {/* Aura behind the table: takes the colour of whoever is working. */}
        <div
          aria-hidden="true"
          className="hm-aura"
          style={{
            background: fs ? FV.light : (cur ?? MASTER).light,
            opacity: fs ? 0.75 : 0.6,
          }}
        />

        <div className="hm-hero2" style={{ opacity: fs ? 0 : 1, pointerEvents: fs ? 'none' : undefined }}>
          {/* The round table. */}
          <div className="hm-table2">
            <div className="hm-disc" />
            <svg viewBox="0 0 100 100" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
              <circle cx={50} cy={50} r={RIM_R} fill="none" stroke="rgba(13,13,13,.08)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
              {WORKERS.map((a, i) =>
                i < doneCount ? (
                  <path
                    key={a.slug}
                    d={RIM_ARCS[i]}
                    pathLength={100}
                    fill="none"
                    stroke={a.base}
                    strokeWidth={0.55}
                    strokeLinecap="round"
                    strokeDasharray="100 100"
                    style={{ animation: 'ts-draw .7s cubic-bezier(.3,0,.2,1) backwards' }}
                  />
                ) : null,
              )}
              {cur && (
                <path
                  key={`run${t}`}
                  d={RIM_RUNS[step]}
                  pathLength={100}
                  fill="none"
                  stroke={cur.deep}
                  strokeWidth={0.8}
                  strokeLinecap="round"
                  strokeDasharray="12 200"
                  style={{
                    opacity: 0,
                    filter: `drop-shadow(0 0 .8px ${cur.base})`,
                    animation: `${half ? 'ts-comet-in' : 'ts-comet-out'} .9s cubic-bezier(.5,0,.25,1) .1s both`,
                  }}
                />
              )}
            </svg>

            {WORKERS.map((a, i) => {
              const on = cur === a
              const dn = i < doneCount
              const p = WORKER_POS[i]
              const tx = agentText(c, a.slug)
              return (
                <div
                  key={a.slug}
                  className="hm-seat"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: `translate(-50%,-50%) scale(${on ? 1.12 : 1})`,
                    opacity: on || dn || finished || intro ? 1 : 0.5,
                    zIndex: on ? 3 : 1,
                    animation: `ts-seat .95s cubic-bezier(.2,.9,.25,1.12) ${0.3 + i * 0.055}s backwards`,
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
                    style={{ position: 'relative', width: '100%', display: 'block', animation: `ts-bob ${on ? 0.7 : 3.2}s ease-in-out ${-i * 0.27}s infinite` }}
                  />
                  <span className={`hm-seat-name ${p.y < 50 ? 'hm-seat-name-up' : ''}`} style={{ background: on ? a.light : 'transparent' }}>
                    {tx.name}
                  </span>
                  {dn && (
                    <span className="hm-check">
                      <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8.5 6.5 12 13 4.5" />
                      </svg>
                    </span>
                  )}
                </div>
              )
            })}

            {/* On narrow screens the content sits above the table, so Petra takes the centre seat. */}
            {petraImg('hm-petra-table')}
          </div>

          {/* Inside the circle on wide screens; stacked above the table on narrow ones. */}
          <div className="hm-inner">
            {petraImg('hm-petra-in')}
            <h1 className="hm-h1" style={{ lineHeight: lh(1.02, 1.25), letterSpacing: ls('-0.04em') }}>
              {c.hero.title}
            </h1>
            <div className="hm-ask">
              <span className="hm-ask-tag">{c.hero.youAsked}</span>
              <span className="hm-ask-text">
                {request.slice(0, typedN)}
                <span className="hm-caret" />
              </span>
            </div>
            <div className="hm-progress">
              <span>{progressLabel}</span>
              <span aria-hidden="true">·</span>
              <span style={{ fontFamily: MONO }}>{progressPct}</span>
            </div>
            <div key={`tk${t}`} className="hm-ticker">
              <span className="hm-chip-tag" style={{ background: ticker.who.light }}>{ticker.name}</span>
              <span className="hm-chip-text">{ticker.text}</span>
              <span className="hm-dot" style={{ background: STATUS[ticker.s].dot }} title={statusLabel(ticker.s)} />
            </div>
            <a href={href('start')} className="hm-cta-dark">
              {c.hero.cta}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={isAr ? 'M13 8H3M7 4 3 8l4 4' : 'M3 8h10M9 4l4 4-4 4'} />
              </svg>
            </a>
            <p className="hm-fine">
              {/* Keep each item whole so a line never starts with a separator. */}
              {c.hero.fine.split(' · ').map((seg, i, all) => (
                <span key={seg}>
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {seg}
                    {i < all.length - 1 ? ' ·' : ''}
                  </span>
                  {i < all.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          </div>

          {/* Messages from the squad, floating beside the table at each agent's seat height. */}
          {chips.map((ch) => (
            <div
              key={ch.a.slug}
              className={`hm-chip ${ch.right ? 'hm-chip-r' : 'hm-chip-l'}`}
              style={
                {
                  '--y': ch.y,
                  '--jx': `${CHIP_JITTER[ch.i % 6]}px`,
                  '--tilt': `${CHIP_TILT[ch.i % 6]}deg`,
                  opacity: ch.opacity,
                } as CSSProperties
              }
            >
              <span className="hm-chip-tag" style={{ background: ch.a.light }}>
                {ch.name}
              </span>
              <span className="hm-chip-text">{ch.text}</span>
              <span className="hm-chip-status" style={{ background: STATUS[ch.s].bg, color: STATUS[ch.s].fg }}>
                {statusLabel(ch.s)}
              </span>
            </div>
          ))}
        </div>

        {/* Focus layer (scroll-driven): one agent's story on the left, its product screens on the right. */}
        <div className="hm-focus" style={{ opacity: fs ? 1 : 0 }}>
          <div className="hm-wrap" style={{ height: '100%' }}>
            <div className="hm-hero-grid" style={{ height: '100%' }}>
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                <img key={`fm${fs || 1}`} src={mascot(FV.slug)} alt="" style={{ height: 'clamp(96px,20vh,200px)', width: 'auto', display: 'block', animation: 'ts-pop .7s ease-out' }} />
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
                <div style={{ fontSize: 'clamp(26px,3.6vw,46px)', fontWeight: 700, lineHeight: lh(1.1, 1.4), letterSpacing: ls('-0.03em'), textWrap: 'balance' }}>
                  <span style={{ color: '#8f8f8f' }}>{fH1}</span>
                  <br />
                  <span style={{ color: '#0d0d0d' }}>{fH2}</span>
                </div>
                <p style={{ margin: 0, maxWidth: 440, fontSize: 'clamp(14px,1vw + 8px,17px)', lineHeight: 1.5, color: '#5d5d5d', textWrap: 'pretty' }}>{fText.why}</p>
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
              </div>
              <div ref={colRef} style={{ minWidth: 0, position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', flex: 'none', width: `${560 * sc}px`, height: `${440 * sc}px` }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: 560, height: 440, transformOrigin: '0 0', transform: `scale(${sc})` }}>
                    <HeroScreens focus={focusIdx} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
