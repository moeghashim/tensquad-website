import { LOCALE } from './locale'

// Brand name per build. The Arabic site is بنّاء ("builder"); the English site is tensquads.
// Always written lowercase in English, including page titles.
export const BRAND = LOCALE === 'ar' ? 'بنّاء' : 'tensquads'
export const BRAND_TITLE = BRAND
