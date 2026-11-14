import { createFileRoute } from '@tanstack/react-router'
import { Interview } from '../components/interview/Interview'
import { BRAND_TITLE } from '../lib/brand'
import { LOCALE } from '../lib/locale'

export const Route = createFileRoute('/interview')({
  head: () => ({ meta: [{ title: `${LOCALE === 'ar' ? 'بترا' : 'Petra'} · ${BRAND_TITLE}` }] }),
  component: Interview,
})
