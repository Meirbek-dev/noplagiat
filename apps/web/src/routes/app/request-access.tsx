import { Link, createFileRoute } from "@tanstack/react-router"

import { Badge } from "@/components/badge"
import { useSession } from "@/hooks/use-session"
import { roleLabel } from "@/lib/roles"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Where an authenticated account without an internal grant lands (TZ.md §5:
 * «Присвоение и отзыв ролей - по заявке руководителя подразделения,
 * согласованной с администратором системы»).
 *
 * It is a signed-in page, not an error: the person has a valid portal session
 * and needs to know what to ask for and of whom. ППС land here too - the staff
 * role is a public-contour role by design, and saying so is kinder than a 403
 * on every section.
 */
export const Route = createFileRoute("/app/request-access")({
  head: () => ({ meta: [{ title: pageTitle(m.request_access_title()) }] }),
  component: RequestAccessPage,
})

function RequestAccessPage() {
  const locale = getLocale()
  const session = useSession()

  return (
    <section
      aria-labelledby="request-access-title"
      className="flex max-w-2xl flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground"
    >
      <h1
        id="request-access-title"
        className="text-lg font-semibold text-primary"
      >
        {m.request_access_title({}, { locale })}
      </h1>

      <p className="text-sm">{m.request_access_body({}, { locale })}</p>

      <ol className="flex list-decimal flex-col gap-1 ps-5 text-sm">
        <li>{m.request_access_step_head({}, { locale })}</li>
        <li>{m.request_access_step_admin({}, { locale })}</li>
        <li>{m.request_access_step_signin({}, { locale })}</li>
      </ol>

      {session === null ? null : (
        <div className="flex flex-col gap-2 rounded border p-3 text-sm">
          <span className="text-muted-foreground">
            {m.request_access_account({}, { locale })}
          </span>
          <span className="font-medium break-all">{session.username}</span>
          <Badge variant="secondary" className="self-start">
            {roleLabel(session.role, locale)}
          </Badge>
          {session.role === "staff" ? (
            <p className="text-muted-foreground">
              {m.request_access_staff_note({}, { locale })}
            </p>
          ) : null}
        </div>
      )}

      <Link
        to="/"
        className="self-start text-sm font-medium text-primary underline"
      >
        {m.request_access_back({}, { locale })}
      </Link>
    </section>
  )
}
