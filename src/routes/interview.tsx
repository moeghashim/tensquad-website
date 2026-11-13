import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/interview')({
  component: Interview,
})

function Interview() {
  return <h1>Interview</h1>
}
