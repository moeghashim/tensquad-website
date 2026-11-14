// Presentational pieces of the Petra interview. Used by both the scripted
// flow (Interview.tsx) and the OpenUI renderers (openui-library.tsx), so the
// live layer keeps the exact design styles. No window access during render.
import { createContext, useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { DIR } from '../../lib/locale'
import { LIGHT, mascotSrc, type AgentId, type Copy } from './data'
import { BRAND, LOGO, logoSize, wordSize } from '../../lib/brand'

// Runs after DOM mutations on the client; a no-op effect on the server.
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Typewriter. SSR and the first client render show the full text so the
 * server HTML contains the question; after mount it types out.
 */
export function useTyped(text: string, step = 2, speed = 22) {
  const [mounted, setMounted] = useState(false)
  const [n, setN] = useState(0)
  useIsoLayoutEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    if (!mounted || n >= text.length) return
    const id = setTimeout(() => setN((v) => Math.min(text.length, v + step)), speed)
    return () => clearTimeout(id)
  }, [mounted, n, text.length, step, speed])
  const done = !mounted || n >= text.length
  const shown = mounted ? text.slice(0, Math.min(n, text.length)) : text
  return { shown, done }
}

/** Team and actions shared by the final squad panel, scripted or live. */
export interface InterviewContextValue {
  team: AgentId[]
  restart: () => void
}
export const InterviewContext = createContext<InterviewContextValue>({
  team: ['petra'],
  restart: () => {},
})

/** Per-question answer channel used by the OpenUI input components. */
export interface AnswerContextValue {
  question: string
  answer: (value: string | string[], label: string) => void
}
export const AnswerContext = createContext<AnswerContextValue | null>(null)

const caretStyle: CSSProperties = {
  display: 'inline-block',
  width: 2,
  height: '1em',
  marginInlineStart: 2,
  verticalAlign: '-0.12em',
  background: '#0d0d0d',
  animation: 'ti-blink 1s steps(1) infinite',
}

function Caret() {
  return <span aria-hidden="true" style={caretStyle} />
}

export function Frame({
  copy,
  dots,
  stepLabel,
  history,
  stage,
  seats,
  rowAlign,
  squadLabel,
}: {
  copy: Copy
  dots: Array<{ w: string; bg: string }>
  stepLabel: string
  history: ReactNode
  stage: ReactNode
  seats: ReactNode
  rowAlign: 'center' | 'flex-end'
  squadLabel: string
}) {
  return (
    <div
      dir={DIR}
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        background: '#fcfcfc',
        color: '#282828',
        fontFamily: "Inter,'IBM Plex Sans Arabic',system-ui,sans-serif",
        fontSize: 15,
        lineHeight: '22px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <a
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#0d0d0d' }}
        >
          <img src={LOGO.src} alt="" {...logoSize(28)} />
          {LOGO.word ? <img src={LOGO.word.src} alt={BRAND} {...wordSize(28)} /> : <span style={{ fontWeight: 600, fontSize: 15 }}>{BRAND}</span>}
        </a>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginInlineStart: 'auto' }}>
          {dots.map((d, i) => (
            <span
              key={i}
              style={{
                height: 6,
                borderRadius: 999,
                transition: 'width .3s, background .3s',
                width: d.w,
                background: d.bg,
              }}
            />
          ))}
        </div>
        <a href="/" className="ti-exit">
          {copy.exit}
        </a>
      </header>

      <main style={{ flex: 1, padding: '24px 24px 56px', display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 1120,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap-reverse',
            gap: '32px 56px',
            alignItems: rowAlign,
          }}
        >
          <div style={{ flex: '1 1 400px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {history}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 44,
                  height: 44,
                  flex: 'none',
                  borderRadius: 12,
                  background: `#FBD8D0 url(${mascotSrc('petra')}) center bottom / auto 40px no-repeat`,
                }}
              />
              <span style={{ fontSize: 13, color: '#5d5d5d' }}>
                <strong style={{ color: '#0d0d0d', fontWeight: 600 }}>{copy.petra}</strong> · {copy.master}
              </span>
              <span
                style={{
                  marginInlineStart: 'auto',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 12,
                  color: '#767676',
                }}
              >
                {stepLabel}
              </span>
            </div>
            {stage}
          </div>
          <div
            className="ti-side"
            style={{
              flex: '1 1 320px',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {seats}
            <span style={{ marginTop: 16, fontSize: 13, fontWeight: 500, color: '#5d5d5d' }}>{squadLabel}</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export function QuestionBlock({ text, children }: { text: string; children?: ReactNode }) {
  const { shown, done } = useTyped(text)
  return (
    <>
      <div
        style={{
          fontSize: 'clamp(24px,3vw,36px)',
          lineHeight: 1.3,
          fontWeight: 600,
          color: '#0d0d0d',
          minHeight: '2.6em',
          textWrap: 'pretty',
        }}
      >
        {shown}
        {!done ? <Caret /> : null}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          transition: 'opacity .35s',
          opacity: done ? 1 : 0,
          pointerEvents: done ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </>
  )
}

export function History({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <>
      {items.map((x, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, lineHeight: '20px', color: '#767676' }}>{x.q}</span>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span
              style={{
                maxWidth: '85%',
                padding: '8px 14px',
                borderRadius: 18,
                background: '#ededed',
                color: '#0d0d0d',
                fontSize: 14,
                lineHeight: '20px',
              }}
            >
              {x.a}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

function chipStyle(on: boolean): CSSProperties {
  return {
    minHeight: 42,
    padding: '8px 16px',
    border: 0,
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 500,
    textAlign: 'start',
    transition: 'background .15s, color .15s',
    background: on ? '#181818' : 'rgba(13,13,13,.06)',
    color: on ? '#fff' : '#0d0d0d',
  }
}

export function Choices({
  options,
  selected = [],
  multi = false,
  onPick,
}: {
  options: Array<{ value: string; label: string }>
  selected?: string[]
  multi?: boolean
  onPick: (value: string) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const on = multi && selected.includes(o.value)
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onPick(o.value)}
            aria-pressed={multi ? on : undefined}
            style={chipStyle(on)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function ContinueBar({
  label,
  picked,
  canSend,
  onSend,
}: {
  label: string
  picked: string
  canSend: boolean
  onSend: () => void
}) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={onSend}
        style={{
          height: 46,
          padding: '0 22px',
          border: 0,
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 500,
          color: '#fff',
          transition: 'background .15s',
          background: canSend ? '#181818' : '#afafaf',
        }}
      >
        {label}
      </button>
      <span style={{ fontSize: 13, color: '#767676' }}>{picked}</span>
    </div>
  )
}

export function TextField({
  value,
  onChange,
  onSubmit,
  placeholder,
  sendLabel,
  canSend,
  suggestions,
  onSuggest,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder: string
  sendLabel: string
  canSend: boolean
  suggestions?: string[]
  onSuggest?: (s: string) => void
}) {
  return (
    <>
      {suggestions && suggestions.length > 0 ? (
        <Choices
          options={suggestions.map((s) => ({ value: s, label: s }))}
          onPick={(v) => onSuggest?.(v)}
        />
      ) : null}
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 0 0 1px rgba(13,13,13,.1), 0 12px 32px rgba(13,13,13,.06)',
          padding: 8,
          paddingInlineStart: 18,
          paddingInlineEnd: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit()
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            background: 'transparent',
            fontSize: 17,
            lineHeight: '26px',
            color: '#0d0d0d',
            padding: '8px 0',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={onSubmit}
          aria-label={sendLabel}
          style={{
            width: 44,
            height: 44,
            flex: 'none',
            border: 0,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .15s',
            background: canSend ? '#181818' : '#afafaf',
            color: '#fff',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 13V3M4 7l4-4 4 4" />
          </svg>
        </button>
      </div>
    </>
  )
}

export function TeamPanel({
  team,
  copy,
  modeLine,
  onRestart,
}: {
  team: AgentId[]
  copy: Copy
  modeLine: string
  onRestart: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 0 0 1px rgba(13,13,13,.08)', padding: '6px 16px' }}>
        {team.map((id, i) => {
          const [name, role, does] = copy.ag[id]
          return (
            <div
              key={id}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '10px 0',
                borderTop: i ? '1px solid rgba(13,13,13,.06)' : '0',
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  flex: 'none',
                  borderRadius: 10,
                  background: `${LIGHT[id]} url(${mascotSrc(id)}) center bottom / auto 36px no-repeat`,
                }}
              />
              <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#0d0d0d' }}>{name}</span>
                <span style={{ fontSize: 13, lineHeight: '18px', color: '#5d5d5d' }}>{does}</span>
              </div>
              <span style={{ flex: 'none', fontSize: 12, fontWeight: 500, color: '#5d5d5d' }}>{role}</span>
            </div>
          )
        })}
      </div>
      <div style={{ fontSize: 14, color: '#414141' }}>{modeLine}</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <a href="#" className="ti-cta">
          {copy.start}
        </a>
        <button type="button" onClick={onRestart} className="ti-again">
          {copy.again}
        </button>
      </div>
      <span style={{ fontSize: 13, color: '#767676' }}>{copy.fine}</span>
    </div>
  )
}

export function SeatRing({ squad, copy }: { squad: AgentId[]; copy: Copy }) {
  const ring: AgentId[] = [
    'machu',
    'alexandria',
    'angkor',
    'venice',
    'rio',
    'giza',
    'pisa',
    'kyoto',
    'zurich',
    'delphi',
    'greenwich',
    'sydney',
  ]
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 'min(440px, max(240px, calc(100vh - 260px)))',
        aspectRatio: '1',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          background: '#f3f3f3',
          boxShadow: 'inset 0 0 0 1px rgba(13,13,13,.06)',
        }}
      />
      <img
        src={mascotSrc('petra')}
        alt=""
        style={{ position: 'absolute', left: '36%', top: '32%', width: '28%', animation: 'ti-bob 2.6s ease-in-out infinite' }}
      />
      {ring.map((id, i) => {
        const ang = ((-75 + 30 * i) * Math.PI) / 180
        const on = squad.includes(id)
        const x = 50 + 40 * Math.cos(ang)
        const y = 50 + 40 * Math.sin(ang)
        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              width: '12%',
              aspectRatio: '300 / 370',
              transform: 'translate(-50%,-50%)',
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 10,
                height: 10,
                margin: -5,
                borderRadius: 999,
                background: 'rgba(13,13,13,.14)',
                transition: 'opacity .3s',
                opacity: on ? 0 : 1,
              }}
            />
            <div
              role="img"
              aria-label={copy.ag[id][0]}
              style={{
                position: 'absolute',
                inset: 0,
                transition: 'transform .6s cubic-bezier(.3,1.5,.5,1), opacity .4s',
                background: `url(${mascotSrc(id)}) center / contain no-repeat`,
                transform: on ? 'scale(1)' : 'scale(.3)',
                opacity: on ? 1 : 0,
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '50%',
                top: '100%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontSize: 11,
                lineHeight: '13px',
                fontWeight: 600,
                color: '#0d0d0d',
                transition: 'opacity .4s',
                opacity: on ? 1 : 0,
              }}
            >
              {copy.ag[id][0]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
