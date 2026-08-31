import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router"

import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"
import appCss from "@/styles/globals.css?url"

import tokensCss from "../styles/tokens.css?url"

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: m.app_title_full(),
      },
      /**
       * The public dashboard is meant to be found and shared - the portal
       * links to it and `robots.txt` lets it be indexed - so the page states
       * what it is and hands a card to whatever renders the link. Both strings
       * are the ones the page itself already says, localized with everything
       * else, so a preview cannot drift from the page it previews.
       *
       * `og:image` is root-relative on purpose: the deployment path on the
       * portal is decided by the host (deploy/RUNBOOK.md), so an absolute URL
       * would have to be guessed at build time and would be wrong on the day
       * it moved.
       *
       * The navy browser-chrome tint lives in `manifest.json` rather than in a
       * `theme-color` meta: brand colours are `tokens.css`'s to publish, and a
       * literal here would put one back inside `src/`.
       */
      {
        name: "description",
        content: m.footer_about_body(),
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: m.brand_lockup(),
      },
      {
        property: "og:title",
        content: m.app_title_full(),
      },
      {
        property: "og:description",
        content: m.footer_about_body(),
      },
      {
        property: "og:image",
        content: "/brand/og-cover.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "16x16 32x32 48x48",
      },
      {
        rel: "apple-touch-icon",
        href: "/brand/apple-touch-icon.png",
        sizes: "180x180",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: tokensCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="mx-auto flex w-full max-w-xl flex-col items-start gap-3 p-6 pt-16">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-xl font-semibold text-primary">
        {m.not_found_title()}
      </h1>
      <a
        href="/"
        className="text-sm font-medium text-primary underline underline-offset-2"
      >
        {m.app_error_home()}
      </a>
    </main>
  ),
  /**
   * Without this, a failure in a route's `beforeLoad` or loader - the session
   * request on `/app/*`, for instance - renders the framework's unstyled
   * English "Something went wrong!" screen with the raw error text under it.
   * The internal contour is behind sign-in, but the commission sees the same
   * frame, so the fallback is branded, localized and offers a way out.
   */
  errorComponent: () => (
    <main
      role="alert"
      className="mx-auto flex w-full max-w-xl flex-col items-start gap-3 p-6 pt-16"
    >
      <h1 className="text-xl font-semibold text-primary">
        {m.app_error_title()}
      </h1>
      <p className="text-sm text-muted-foreground">{m.app_error_body()}</p>
      <a
        href="/"
        className="text-sm font-medium text-primary underline underline-offset-2"
      >
        {m.app_error_home()}
      </a>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = useRouteContext({ from: "__root__" })
  // Resolved per request on the server (AsyncLocalStorage via
  // paraglideMiddleware) and from cookie/`?lang=` on the client.
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
