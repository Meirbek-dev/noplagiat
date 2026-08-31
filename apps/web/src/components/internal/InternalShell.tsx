import type { ReactNode } from "react"
import { useEffect } from "react"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"

import type { MeResponse } from "@/api/types.gen"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { BrandEmblem } from "@/components/dashboard/BrandMark"
import { LocaleSwitcher } from "@/components/dashboard/LocaleSwitcher"
import { Separator } from "@/components/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/sidebar"
import { localizedName } from "@/lib/adapters"
import { authApi } from "@/lib/api-internal"
import { internalQueries } from "@/lib/queries"
import { canSeeEscalations, roleLabel, scopeLabel } from "@/lib/roles"
import {
  restoreUiPreferences,
  setSidebarOpen,
  useSidebarOpen,
} from "@/lib/stores"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/** The active nav entry wears the brand, not a 1.5 %-lighter grey. */
export const NAV_ACTIVE_CLASS =
  "data-active:border-s-2 data-active:border-primary data-active:bg-primary/10 data-active:font-semibold data-active:text-primary"

/**
 * The internal contour's frame (TZ.md §4.1): the section sidebar, the identity
 * badge that states which role and scope the numbers on screen belong to, and
 * the sign-out.
 *
 * The badge is not decoration - an internal reader looking at «2 552 проверки»
 * needs to know whether that is the university or their own faculty, and the
 * scope is exactly what the server filtered by.
 */

interface NavEntry {
  to: string
  label: (locale: Locale) => string
  /** Roles the entry is offered to; every role when absent. */
  visible?: (role: string | null | undefined) => boolean
}

const SECTIONS: readonly NavEntry[] = [
  { to: "/app", label: (locale) => m.section_overview({}, { locale }) },
  {
    to: "/app/dynamics",
    label: (locale) => m.section_dynamics({}, { locale }),
  },
  { to: "/app/types", label: (locale) => m.section_work_types({}, { locale }) },
  { to: "/app/units", label: (locale) => m.section_units({}, { locale }) },
  {
    to: "/app/rechecks",
    label: (locale) => m.section_rechecks({}, { locale }),
  },
  {
    to: "/app/escalations",
    label: (locale) => m.section_escalations({}, { locale }),
    // TZ §5 reserves the escalations register for the ethics council and the
    // compliance service; `/api/internal/escalations` refuses everyone else.
    // Offering a dean a link to their own 403 is the shell lying about what
    // they can reach - the entry is simply not there.
    visible: canSeeEscalations,
  },
  { to: "/app/usage", label: (locale) => m.section_usage({}, { locale }) },
  { to: "/app/yoy", label: (locale) => m.section_yoy({}, { locale }) },
]

export interface InternalShellProps {
  session: MeResponse
  locale: Locale
  children: ReactNode
}

export function InternalShell({
  session,
  locale,
  children,
}: InternalShellProps) {
  const pathname = useLocation({ select: (location) => location.pathname })
  const sidebarOpen = useSidebarOpen()
  // After hydration, not during render - see `lib/stores.ts`.
  useEffect(() => {
    restoreUiPreferences()
  }, [])

  const sections = SECTIONS.filter(
    (entry) => entry.visible?.(session.role) ?? true
  )

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="gap-1 px-3 py-3">
          {/* TZ §8 puts the logo in the internal panel as well as on the public
              page. The emblem carries it in a column this narrow; the wordmark
              is the line of text beside it, which is why the mark itself is
              decorative. */}
          <div className="flex items-center gap-2">
            <BrandEmblem className="h-6" />
            <span className="text-xs font-semibold tracking-wide uppercase">
              {m.brand_lockup({}, { locale })}
            </span>
          </div>
          <span className="text-sm leading-tight font-semibold text-primary">
            {m.internal_contour_title({}, { locale })}
          </span>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {m.internal_nav_sections({}, { locale })}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sections.map((entry) => (
                  <SidebarMenuItem key={entry.to}>
                    <SidebarMenuButton
                      // Base UI's `render` slot - this kit has no `asChild`.
                      render={<Link to={entry.to} />}
                      className={NAV_ACTIVE_CLASS}
                      title={entry.label(locale)}
                      isActive={
                        entry.to === "/app"
                          ? pathname === "/app" || pathname === "/app/"
                          : pathname.startsWith(entry.to)
                      }
                    >
                      {/* The kit truncates a `<span>` child, not raw text -
                          without the wrapper a long label was cut with no
                          ellipsis at the sidebar edge. */}
                      <span className="truncate">{entry.label(locale)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              {m.internal_nav_other({}, { locale })}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link to="/" />}
                    title={m.internal_nav_public({}, { locale })}
                  >
                    <span className="truncate">
                      {m.internal_nav_public({}, { locale })}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {session.role === "admin" ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link to="/admin" />}
                      title={m.admin_title({}, { locale })}
                    >
                      <span className="truncate">
                        {m.admin_title({}, { locale })}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <UserBadge session={session} locale={locale} />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b bg-background px-4 py-2">
          <SidebarTrigger aria-label={m.internal_nav_toggle({}, { locale })} />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium">
            {m.app_title({}, { locale })}
          </span>
          <div className="ms-auto">
            <LocaleSwitcher active={locale} />
          </div>
        </header>
        <main className="flex flex-col gap-4 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

/**
 * Who you are signed in as, what that lets you see, and the way out. Shared
 * with the admin area, which had the identity block but no sign-out at all -
 * an administrator had to walk back into the internal contour to end a
 * session.
 */
export function UserBadge({
  session,
  locale,
  showScope = true,
}: {
  session: MeResponse
  locale: Locale
  /** The admin area is university-wide; the scope badge would say nothing. */
  showScope?: boolean
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  /**
   * `ScopeDto` carries dictionary *ids* and the internal contour publishes no
   * id→name lookup, so «в пределах факультета» was as much as the badge could
   * honestly say - leaving a dean reading «2 552 проверки» without knowing
   * whose 2 552 they are. The matrix, however, returns exactly the units the
   * caller's scope admits: when that is a single faculty, it *is* their
   * faculty, and it can be named. Anything else keeps the generic phrase.
   */
  const units = useQuery(internalQueries.unitOptions())
  const scoped = units.data?.faculties ?? []
  const scopeName =
    session.scope?.kind === "faculty" && scoped.length === 1 && scoped[0]
      ? localizedName(scoped[0], locale)
      : undefined

  const signOut = () => {
    void (async () => {
      const result = await authApi.logout(session.csrf_token)
      // The cached session must go before the navigation, otherwise the guard
      // on the next route reads a session the server has already destroyed.
      queryClient.clear()
      if (result.end_session_url != null && result.end_session_url !== "") {
        // RP-initiated logout: end the portal session too (ARCHITECTURE §4.2).
        window.location.assign(result.end_session_url)
        return
      }
      await navigate({ to: "/login" })
    })()
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3 text-sm">
      <span className="font-medium break-all">{session.sso_subject}</span>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">{roleLabel(session.role, locale)}</Badge>
        {showScope ? (
          <Badge variant="outline" title={scopeLabel(session.scope, locale)}>
            {scopeName ?? scopeLabel(session.scope, locale)}
          </Badge>
        ) : null}
      </div>
      <Button variant="outline" size="sm" onClick={signOut}>
        {m.logout_button({}, { locale })}
      </Button>
    </div>
  )
}
