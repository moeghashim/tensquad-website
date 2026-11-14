import { LOCALE } from './locale'

// Brand name per build. The Arabic site is بنّاء ("builder"); the English site is tensquads.
// Always written lowercase in English, including page titles.
export const BRAND = LOCALE === 'ar' ? 'بنّاء' : 'tensquads'
export const BRAND_TITLE = BRAND

// Logo per build.
// English: the "Ten · Pure" mark (Petra's capsule as the 1, the round table as the 0), 72x64, set next to the name.
// Arabic: the "Foundation" wordmark (بنّاء in Lalezar, coral dots). It spells the name, so it replaces the text;
// `scale` sets its height relative to the English mark's.
export const LOGO =
  LOCALE === 'ar'
    ? { src: '/logo/bannaa.svg', ratio: 1219 / 916, wordmark: true, scale: 1.45 }
    : { src: '/logo/tensquads.svg', ratio: 72 / 64, wordmark: false, scale: 1 }
export const FAVICON = LOCALE === 'ar' ? '/logo/bannaa-icon.svg' : '/logo/tensquads-icon.svg'

/** Pixel size for the logo image at a given base height. */
export const logoSize = (h: number) => {
  const height = Math.round(h * LOGO.scale)
  return { width: Math.round(height * LOGO.ratio), height }
}
