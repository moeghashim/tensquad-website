import { LOCALE } from './locale'

// Brand name per build. The Arabic site is بنّاء ("builder"); the English site is tensquads.
// Always written lowercase in English, including page titles.
export const BRAND = LOCALE === 'ar' ? 'بنّاء' : 'tensquads'
export const BRAND_TITLE = BRAND

// Logo per build. English uses the "Ten · Pure" mark (Petra's capsule as the 1, the round table as the 0),
// which is wider than tall (72x64); Arabic keeps the original square mark.
export const LOGO = LOCALE === 'ar' ? { src: '/logo/logo.svg', ratio: 1 } : { src: '/logo/tensquads.svg', ratio: 72 / 64 }
export const FAVICON = LOCALE === 'ar' ? '/logo/logo.svg' : '/logo/tensquads-icon.svg'
