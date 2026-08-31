import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { InternalShell } from "@/components/internal/InternalShell"
import { authQueries } from "@/lib/queries"
import { canUseInternal } from "@/lib/roles"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Internal contour layout and guard (TZ.md §4.1, §5).
 *
 * `beforeLoad` resolves the session once for the whole subtree and puts it in
 * the route context, so the shell and every page read the same answer without
 * a second request. Anonymous callers go to sign-in; an authenticated account
 * with no internal grant goes to the «request access» path the server itself
 * names (`MeResponse.request_access_path`).
 *
 * This is UX, not authorization: `/api/internal/*` refuses a caller without a
 * scoped role whatever the router did, and the RBAC matrix test is what proves
 * it (AGENTS.md §1.3).
 */
export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context, location }) => {
    const session = await context.queryClient.ensureQueryData(authQueries.me())

    if (session === null) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }

    // The path is the server's to choose, so it is followed as an `href`
    // rather than re-declared here - and compared against the same value, so
    // the guard cannot loop if it ever changes.
    const accessPath = session.request_access_path
    if (!canUseInternal(session.role) && location.pathname !== accessPath) {
      throw redirect({ href: accessPath })
    }

    return { session }
  },
  component: InternalLayout,
})

function InternalLayout() {
  const { session } = Route.useRouteContext()
  return (
    <InternalShell session={session} locale={getLocale()}>
      <Outlet />
    </InternalShell>
  )
}
