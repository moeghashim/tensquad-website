// Build-time locale. Each deployment is one language: Vite replaces
// import.meta.env.VITE_SITE_LOCALE with a literal, so LOCALE folds to a constant
// and the other language's copy is tree-shaken out of the bundle.
// Keep this a plain expression (no helper call) so the bundler can fold it.
export type Locale = 'en' | 'ar'

const RAW: string | undefined = import.meta.env.VITE_SITE_LOCALE

export const LOCALE: Locale =
  RAW === undefined || RAW === '' || RAW === 'en'
    ? 'en'
    : RAW === 'ar'
      ? 'ar'
      : (() => {
          throw new Error(`VITE_SITE_LOCALE must be "en" or "ar", got ${JSON.stringify(RAW)}`)
        })()

export const DIR: 'rtl' | 'ltr' = LOCALE === 'ar' ? 'rtl' : 'ltr'
