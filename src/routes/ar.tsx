import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../components/home/Home'
import { copy } from '../components/home/copy'

export const Route = createFileRoute('/ar')({
  head: () => ({
    meta: [
      { title: copy.ar.meta.title },
      { name: 'description', content: copy.ar.meta.description },
    ],
  }),
  component: HomeArabic,
})

function HomeArabic() {
  return <Home locale="ar" />
}
