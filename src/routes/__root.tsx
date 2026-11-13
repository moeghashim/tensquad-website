import type { ReactNode } from 'react'
import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import appCss from '../styles/app.css?url'

const RTL_PREFIX = '/ar'

function useDocumentLocale() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isArabic = pathname === RTL_PREFIX || pathname.startsWith(`${RTL_PREFIX}/`)
  return isArabic ? { lang: 'ar', dir: 'rtl' as const } : { lang: 'en', dir: 'ltr' as const }
}

function RootDocument({ children }: { children: ReactNode }) {
  const { lang, dir } = useDocumentLocale()
  return (
    <html lang={lang} dir={dir}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Tensquads' },
      { name: 'description', content: 'A full squad of AI agents for your business.' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/logo/logo.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
})
