import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query"
import type { DehydratedState } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"

import { ApiError } from "@/lib/api"

import { routeTree } from "./routeTree.gen"

// Registers the `?lang=` locale override on the client (ARCHITECTURE.md §5.4).
import "@/lib/locale"

/**
 * A `4xx` is the server's *answer*, not a blip: an out-of-scope unit is a `403`
 * by design (`ScopeGuard::narrow`) and a malformed filter is a `422`. Retrying
 * either only delays the explanation the section is about to show - and while
 * the tab is unfocused React Query pauses a scheduled retry outright, which
 * would leave that section on its skeleton indefinitely. Server faults and
 * dropped connections still get their one retry.
 */
function retryUnlessRefused(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false
  }
  return failureCount < 1
}

export function getRouter() {
  // One client per router instance (fresh per SSR request).
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5 * 60 * 1000, retry: retryUnlessRefused },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    // The loaders fill the cache during SSR; without this the browser would
    // refetch every section on hydration and the page would flash skeletons
    // over numbers it had already rendered. The state travels as a JSON
    // string: the router's serializability check rejects `DehydratedState`
    // (its `mutationKey` is `unknown[]`), and the payload is plain JSON DTOs.
    dehydrate: () => ({ queryState: JSON.stringify(dehydrate(queryClient)) }),
    hydrate: (dehydrated: { queryState: string }) => {
      const parsed: unknown = JSON.parse(dehydrated.queryState)
      hydrate(queryClient, parsed as DehydratedState)
    },
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
