import { useEffect, useRef, useState } from 'react'

// Port of the design's DCLogic: a timer walks the round table and a scroll listener
// maps the 800vh hero section to a focused agent (fs = 1..13, 0 = none).
// Everything touching window/document runs inside effects, so SSR never reaches it.

export interface HeroLoopState {
  t: number // timeline tick, 0..30
  fs: number // focused ALL-index + 1, or 0
  stickTop: number // scroll distance the sticky stage overhangs, px
  sc: number // scale factor for the 560x440 screen mockups
}

const TICK_MS = 1300
const T_MAX = 2 + 24 + 4
const FOCUS_COUNT = 14 // 0..13 buckets across the scroll range

export function useHeroLoop() {
  const [s, setS] = useState<HeroLoopState>({ t: 0, fs: 0, stickTop: 0, sc: 0.7 })
  const loopRef = useRef<HTMLElement>(null)
  const colRef = useRef<HTMLDivElement>(null)
  // Scroll handler reads the latest state without re-binding listeners on every render.
  const latest = useRef(s)

  useEffect(() => {
    latest.current = s
  }, [s])

  useEffect(() => {
    // Phones get a plain hero: no pinned stage and no scroll-driven agent stories (see .hm-hero-sec).
    const mobile = window.matchMedia('(max-width: 899px)')
    const onScroll = () => {
      const el = loopRef.current
      if (!el) return
      const cur = latest.current
      if (mobile.matches) {
        if (cur.fs || cur.stickTop) setS((prev) => ({ ...prev, fs: 0, stickTop: 0 }))
        return
      }
      const vh = window.innerHeight
      let d = cur.stickTop
      if (!cur.fs) {
        const first = el.firstElementChild as HTMLElement | null
        d = Math.max(0, (first?.offsetHeight ?? 0) - vh)
      }
      const r = el.getBoundingClientRect()
      const p = Math.max(0, Math.min(0.999, (-r.top - d) / Math.max(1, r.height - d - vh)))
      const fs = Math.floor(p * FOCUS_COUNT)
      const col = colRef.current
      const sc = col ? Math.max(0.4, Math.min(1.15, col.clientWidth / 560, (vh - 150) / 440)) : 0.7
      if (fs !== cur.fs || d !== cur.stickTop || Math.abs(sc - cur.sc) > 0.005) {
        setS((prev) => ({ ...prev, fs, stickTop: d, sc }))
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    mobile.addEventListener('change', onScroll)
    return () => {
      mobile.removeEventListener('change', onScroll)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const iv = window.setInterval(
      () => setS((prev) => (prev.fs ? prev : { ...prev, t: prev.t >= T_MAX ? 0 : prev.t + 1 })),
      TICK_MS,
    )
    return () => window.clearInterval(iv)
  }, [])

  return { ...s, loopRef, colRef }
}
