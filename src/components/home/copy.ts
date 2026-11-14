import { LOCALE } from '../../lib/locale'
import { ar } from './copy.ar'
import { en, type Copy } from './copy.en'

export type { Copy }

// Static selection: LOCALE is a build-time constant, so the other locale's copy is tree-shaken.
export const copy: Copy = LOCALE === 'ar' ? ar : en
