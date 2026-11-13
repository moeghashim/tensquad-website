import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ar')({
  component: ArabicHome,
})

function ArabicHome() {
  return <h1>Tensquads — العربية</h1>
}
