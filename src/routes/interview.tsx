import { createFileRoute } from '@tanstack/react-router'
import { Interview } from '../components/interview/Interview'
import type { Locale } from '../components/interview/data'

export const Route = createFileRoute('/interview')({
  // Optional so that /interview itself is served without a redirect; absent means English.
  validateSearch: (search: Record<string, unknown>): { lang?: 'ar' } => (search.lang === 'ar' ? { lang: 'ar' } : {}),
  head: () => ({ meta: [{ title: 'Petra · Tensquads' }] }),
  component: InterviewPage,
})

function InterviewPage() {
  const { lang } = Route.useSearch()
  const locale: Locale = lang === 'ar' ? 'ar' : 'en'
  return <Interview locale={locale} />
}
