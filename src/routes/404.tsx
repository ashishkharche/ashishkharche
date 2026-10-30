import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '~/components/NotFound'

// Prerendered to /404.html, which the host serves for unknown paths.
export const Route = createFileRoute('/404')({
  head: () => ({ meta: [{ name: 'description', content: 'Page not found.' }] }),
  component: NotFound,
})
