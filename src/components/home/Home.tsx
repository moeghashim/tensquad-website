import { useMemo } from 'react'
import { Control } from './Control'
import { Footer } from './Footer'
import { GetStarted } from './GetStarted'
import { Hero } from './Hero'
import { HowItWorks } from './HowItWorks'
import { Nav } from './Nav'
import { Pricing } from './Pricing'
import { Squad } from './Squad'
import { HomeContext, makeCtx } from './context'
import type { Locale } from '../../lib/locale'

// One homepage component for both builds. The locale (fixed at build time) picks
// direction and a few typography tweaks; the copy comes from copy.ts.
export function Home({ locale }: { locale: Locale }) {
  const ctx = useMemo(() => makeCtx(locale), [locale])
  const { isAr } = ctx
  return (
    <HomeContext.Provider value={ctx}>
      <div
        dir={isAr ? 'rtl' : undefined}
        lang={isAr ? 'ar' : undefined}
        style={{
          minHeight: '100vh',
          background: '#fcfcfc',
          color: '#282828',
          fontFamily: isAr ? "'IBM Plex Sans Arabic',Inter,system-ui,sans-serif" : 'Inter,system-ui,sans-serif',
          fontSize: 15,
          lineHeight: '22px',
          letterSpacing: isAr ? '0' : '-0.01em',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Nav />
        <Hero />
        <Squad />
        <HowItWorks />
        <Control />
        <Pricing />
        <GetStarted />
        <Footer />
      </div>
    </HomeContext.Provider>
  )
}
