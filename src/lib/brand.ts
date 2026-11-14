import { LOCALE } from './locale'

// Brand name per build. The Arabic site is بنّاء ("builder"); the English site is tensquads.
// Always written lowercase in English, including page titles.
export const BRAND = LOCALE === 'ar' ? 'بنّاء' : 'tensquads'
export const BRAND_TITLE = BRAND

// Logo per build: a mark, then the name.
// English: the "Ten · Pure" mark (Petra's capsule as the 1, the round table as the 0), 72x64, then the name as text.
// Arabic: the brick ب tile (the letter laid in bricks, its dot the coral brick), then بنّاء in El Messiri as an
// outlined wordmark (word.scale sets its height relative to the mark).
export const LOGO =
  LOCALE === 'ar'
    ? { src: '/logo/bannaa-icon.svg', ratio: 1, word: { src: '/logo/bannaa-word.svg', ratio: 1464 / 1294, scale: 1.25 } }
    : { src: '/logo/tensquads.svg', ratio: 72 / 64, word: null }
export const FAVICON = LOCALE === 'ar' ? '/logo/bannaa-icon.svg' : '/logo/tensquads-icon.svg'

/** Pixel sizes for the mark and (Arabic) wordmark at a given base height. */
export const logoSize = (h: number) => ({ width: Math.round(h * LOGO.ratio), height: h })
export const wordSize = (h: number) => {
  const height = Math.round(h * (LOGO.word?.scale ?? 1))
  return { width: Math.round(height * (LOGO.word?.ratio ?? 1)), height }
}
