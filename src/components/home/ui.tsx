import type { CSSProperties, ReactNode } from 'react'
import { ALL, mascot } from './agents'

// Shared mockup primitives. Each one reproduces an inline-style pattern from the design verbatim.

export const MONO = "'JetBrains Mono',monospace"
export const SHADOW_WIN = '0 0 0 1px rgba(13,13,13,.08),0 18px 40px rgba(13,13,13,.12)'
export const SHADOW_PILL = '0 0 0 1px rgba(13,13,13,.08),0 8px 20px rgba(13,13,13,.1)'

export type Tone = 'ok' | 'warn' | 'run' | 'plan'

const TONE: Record<Tone, { bg: string; fg: string }> = {
  ok: { bg: '#04b84c14', fg: '#00692a' },
  warn: { bg: '#fb6a2212', fg: '#923b0f' },
  run: { bg: '#0285ff0a', fg: '#004f99' },
  plan: { bg: '#924ff70f', fg: '#6b3ab4' },
}

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = TONE[tone]
  return (
    <span
      style={{
        height: 20,
        padding: '0 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        background: t.bg,
        color: t.fg,
      }}
    >
      {children}
    </span>
  )
}

export function toneFor(v: string): Tone {
  return v === 'warn' ? 'warn' : 'ok'
}

// Label/value row used in the floating cards.
export function KV({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontSize: 12.5, lineHeight: '20px' }}>
      <span style={{ color: '#0d0d0d', fontWeight: 500 }}>{k}</span>
      {children}
    </div>
  )
}

export function Value({ children }: { children: ReactNode }) {
  return <span style={{ color: '#5d5d5d', textAlign: 'end' }}>{children}</span>
}

export function BarRow({ label, pct, value, color }: { label: string; pct: number; value: string; color: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '86px minmax(0,1fr) 38px', gap: 8, alignItems: 'center', fontSize: 12, color: '#282828' }}>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      <div style={{ height: 12, borderRadius: 999, background: 'rgba(13,13,13,.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: color }} />
      </div>
      <span style={{ fontFamily: MONO, fontSize: 11, color: '#0d0d0d', textAlign: 'end' }}>{value}</span>
    </div>
  )
}

export function Chip({ children, mono = false }: { children: ReactNode; mono?: boolean }) {
  return (
    <span
      style={{
        height: 20,
        padding: '0 8px',
        borderRadius: 999,
        background: 'rgba(13,13,13,.06)',
        fontFamily: mono ? MONO : undefined,
        fontSize: 10.5,
        color: '#414141',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {children}
    </span>
  )
}

export function Chrome({ label, dark = false, end }: { label: string; dark?: boolean; end?: ReactNode }) {
  const dot: CSSProperties = { width: 8, height: 8, borderRadius: 999, background: dark ? '#414141' : '#dfdfdf' }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 12px',
        borderBottom: dark ? '1px solid rgba(255,255,255,.1)' : '1px solid rgba(13,13,13,.06)',
      }}
    >
      <span style={dot} />
      <span style={dot} />
      <span style={dot} />
      <span
        style={{
          marginInlineStart: 6,
          height: 20,
          padding: '0 8px',
          borderRadius: 999,
          background: dark ? 'rgba(255,255,255,.1)' : 'rgba(13,13,13,.06)',
          color: dark ? '#ededed' : '#414141',
          fontFamily: MONO,
          fontSize: 11,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {label}
      </span>
      {end}
    </div>
  )
}

// A floating window in the 560x440 mockup box.
export function Win({
  left,
  top,
  width,
  dark = false,
  ltr = false,
  children,
}: {
  left: number
  top: number
  width: number
  dark?: boolean
  ltr?: boolean
  children: ReactNode
}) {
  return (
    <div
      dir={ltr ? 'ltr' : undefined}
      style={{
        position: 'absolute',
        left,
        top,
        width,
        borderRadius: 16,
        background: dark ? '#181818' : '#fff',
        boxShadow: SHADOW_WIN,
        overflow: 'hidden',
        textAlign: 'start',
      }}
    >
      {children}
    </div>
  )
}

export function WinBody({ children }: { children: ReactNode }) {
  return <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>{children}</div>
}

export function Title({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600, color: '#0d0d0d' }}>{children}</div>
}

// Floating status pill under a window.
export function Pill({ left, top, dot, children }: { left: number; top: number; dot: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        height: 30,
        padding: '0 12px',
        borderRadius: 999,
        background: '#fff',
        boxShadow: SHADOW_PILL,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        fontWeight: 500,
        color: '#0d0d0d',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: dot }} />
      {children}
    </div>
  )
}

// Dark-terminal row: verb column, then text with an optional coloured "ok".
export function CodeRow({ verb, verbColor, text, ok }: { verb: string; verbColor: string; text: string; ok?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '58px 1fr', gap: 8, fontFamily: MONO, fontSize: 11.5, lineHeight: '18px' }}>
      <span style={{ color: verbColor }}>{verb}</span>
      <span style={{ color: '#ededed' }}>
        {text}
        {ok ? (
          <>
            {' '}
            <span style={{ color: '#66d492' }}>{ok}</span>
          </>
        ) : null}
      </span>
    </div>
  )
}

export function InitialAvatar({ letter }: { letter: string }) {
  return (
    <span
      style={{
        width: 28,
        height: 28,
        flex: 'none',
        borderRadius: 8,
        background: '#ededed',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600,
        color: '#414141',
      }}
    >
      {letter}
    </span>
  )
}

export function MascotAvatar({ slug }: { slug: string }) {
  const light = ALL.find((a) => a.slug === slug)?.light ?? '#ededed'
  return (
    <span
      style={{
        width: 28,
        height: 28,
        flex: 'none',
        borderRadius: 8,
        background: `${light} url(${mascot(slug)}) center bottom / auto 25px no-repeat`,
      }}
    />
  )
}

export function ChatMsg({ avatar, name, time, text }: { avatar: ReactNode; name: string; time: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      {avatar}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ fontSize: 12, lineHeight: '16px', color: '#0d0d0d' }}>
          <strong style={{ fontWeight: 600 }}>{name}</strong>{' '}
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#767676' }}>{time}</span>
        </div>
        <div style={{ fontSize: 12.5, lineHeight: '18px', color: '#282828' }}>{text}</div>
      </div>
    </div>
  )
}
