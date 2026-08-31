import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import { AdminShell } from "@/components/admin/AdminShell"
import { authQueries } from "@/lib/queries"
import { canUseInternal, isAdmin } from "@/lib/roles"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Admin area (TZ.md §4.6): sources, dictionaries, roles, settings, reports and
 * the audit journal.
 *
 * `beforeLoad` admits administrators only. A signed-in colleague with an
 * internal role is sent to the contour they *do* have rather than to a dead
 * end; an account with no grant at all goes to the access-request path. The
 * server refuses `/api/admin/*` to everyone else regardless - this guard only
 * decides which page they land on.
 */
export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context, location }) => {
    const session = await context.queryClient.ensureQueryData(authQueries.me())

    if (session === null) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }
    if (!isAdmin(session.role)) {
      throw canUseInternal(session.role)
        ? redirect({ to: "/app" })
        : redirect({ href: session.request_access_path })
    }

    return { session }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { session } = Route.useRouteContext()
  return (
    <AdminShell session={session} locale={getLocale()}>
      <Outlet />
    </AdminShell>
  )
}
