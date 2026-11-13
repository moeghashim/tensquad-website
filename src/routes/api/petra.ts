import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { MAX_BODY_BYTES, parseRequest, startPetraStream } from '../../lib/petra'

// POST /api/petra: streams Petra's OpenUI Lang turn as plain text.
// 503 when no ANTHROPIC_API_KEY is configured, so the client falls back to the scripted flow.
export const Route = createFileRoute('/api/petra')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = env.ANTHROPIC_API_KEY
        if (!apiKey) return json({ error: 'not configured' }, 503)

        const declared = Number(request.headers.get('content-length') ?? '0')
        if (declared > MAX_BODY_BYTES) return json({ error: 'body too large' }, 413)
        const text = await request.text()
        if (text.length > MAX_BODY_BYTES) return json({ error: 'body too large' }, 413)

        let body: unknown
        try {
          body = JSON.parse(text)
        } catch {
          return json({ error: 'invalid json' }, 400)
        }
        const parsed = parseRequest(body)
        if (!parsed.ok) return json({ error: parsed.error }, 400)

        try {
          const stream = await startPetraStream(apiKey, parsed.value, request.signal)
          return new Response(stream, {
            headers: {
              'content-type': 'text/plain; charset=utf-8',
              'cache-control': 'no-store, no-transform',
              'x-accel-buffering': 'no',
            },
          })
        } catch {
          return json({ error: 'upstream error' }, 502)
        }
      },
    },
  },
})

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}
