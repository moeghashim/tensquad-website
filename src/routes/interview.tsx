import { createFileRoute } from '@tanstack/react-router'
import { Interview } from '../components/interview/Interview'

export const Route = createFileRoute('/interview')({
  head: () => ({ meta: [{ title: 'Petra · Tensquads' }] }),
  component: Interview,
})
