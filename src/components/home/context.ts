import { createContext, useContext } from 'react'
import { LOCALE, type Locale } from '../../lib/locale'
import { copy, type Copy } from './copy'

export interface HomeCtx {
  locale: Locale
  isAr: boolean
  c: Copy
  // Letter-spacing and line-height differ in the Arabic design; logical properties
  // (margin-inline-*, insetInlineEnd, textAlign start) handle the RTL flip.
  ls: (en: string) => string
  lh: (en: string | number, ar: string | number) => string | number
  href: (path: string) => string
}

export function makeCtx(locale: Locale): HomeCtx {
  const isAr = locale === 'ar'
  return {
    locale,
    isAr,
    c: copy,
    ls: (en) => (isAr ? '0' : en),
    lh: (en, ar) => (isAr ? ar : en),
    href: (path) => {
      // Onboarding CTAs go to the interview; in-page anchors pass through; placeholders stay '#'.
      if (path === 'start') return '/interview'
      if (path.startsWith('#')) return path
      return '#'
    },
  }
}

export const HomeContext = createContext<HomeCtx>(makeCtx(LOCALE))

export function useHome() {
  return useContext(HomeContext)
}

export interface AgentText {
  name: string
  role: string
  why: string
  doing?: string
  done?: string
}

// Per-agent copy keyed by mascot slug. Master (petra) has no doing/done lines.
export function agentText(c: Copy, slug: string): AgentText {
  return (c.agents as Record<string, AgentText>)[slug]
}
