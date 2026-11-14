import { LOCALE } from './locale'

// Brand name per build. The Arabic site is بنّاء ("builder"); the English site is tensquads.
export const BRAND = LOCALE === 'ar' ? 'بنّاء' : 'tensquads'
// Title-case form for page titles.
export const BRAND_TITLE = LOCALE === 'ar' ? 'بنّاء' : 'Tensquads'
