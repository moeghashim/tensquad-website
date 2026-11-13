import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../components/home/Home'
import { copy } from '../components/home/copy'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: copy.en.meta.title },
      { name: 'description', content: copy.en.meta.description },
    ],
  }),
  component: HomeEnglish,
})

function HomeEnglish() {
  return <Home locale="en" />
}
