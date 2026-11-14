import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../components/home/Home'
import { copy } from '../components/home/copy'
import { LOCALE } from '../lib/locale'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: copy.meta.title },
      { name: 'description', content: copy.meta.description },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  return <Home locale={LOCALE} />
}
