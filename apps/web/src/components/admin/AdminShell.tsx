import type { ReactNode } from "react"
import { useEffect } from "react"

import { Link, useLocation } from "@tanstack/react-router"

import type { MeResponse } from "@/api/types.gen"
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
import {
  NAV_ACTIVE_CLASS,
  UserBadge,
} from "@/components/internal/InternalShell"
import { Toaster } from "@/components/toast"
import {
  restoreUiPreferences,
  setSidebarOpen,
  useSidebarOpen,
} from "@/lib/stores"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"

/**
 * The admin area's frame (TZ.md §4.6). Holds the `Toaster` every write in the
 * area reports through, so a saved setting or a refused change is announced
 * once, in one place, instead of each page inventing its own banner.
 */

interface NavEntry {
  to: string
  label: (locale: Locale) => string
}

const AREAS: readonly NavEntry[] = [
  { to: "/admin", label: (locale) => m.admin_overview({}, { locale }) },
  { to: "/admin/sources", label: (locale) => m.admin_sources({}, { locale }) },
  {
    to: "/admin/dictionaries",
    label: (locale) => m.admin_dictionaries({}, { locale }),
  },
  { to: "/admin/roles", label: (locale) => m.admin_roles({}, { locale }) },
  {
    to: "/admin/settings",
    label: (locale) => m.admin_settings({}, { locale }),
  },
  { to: "/admin/reports", label: (locale) => m.admin_reports({}, { locale }) },
  { to: "/admin/audit", label: (locale) => m.admin_audit({}, { locale }) },
]

export function AdminShell({
  session,
  locale,
  children,
}: {
  session: MeResponse
  locale: Locale
  children: ReactNode
}) {
  const pathname = useLocation({ select: (location) => location.pathname })
  const sidebarOpen = useSidebarOpen()
  useEffect(() => {
    restoreUiPreferences()
  }, [])

  return (
    <Toaster>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <Sidebar collapsible="offcanvas">
          <SidebarHeader className="gap-1 px-3 py-3">
            {/* Same mark as the internal shell - the admin area is the same
                panel, one nav level in. */}
            <div className="flex items-center gap-2">
              <BrandEmblem className="h-6" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {m.brand_lockup({}, { locale })}
              </span>
            </div>
            <span className="text-sm leading-tight font-semibold text-primary">
              {m.admin_title({}, { locale })}
            </span>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                {m.admin_nav_areas({}, { locale })}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {AREAS.map((area) => (
                    <SidebarMenuItem key={area.to}>
                      <SidebarMenuButton
                        render={<Link to={area.to} />}
                        className={NAV_ACTIVE_CLASS}
                        title={area.label(locale)}
                        isActive={
                          area.to === "/admin"
                            ? pathname === "/admin" || pathname === "/admin/"
                            : pathname.startsWith(area.to)
                        }
                      >
                        <span className="truncate">{area.label(locale)}</span>
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
                      render={<Link to="/app" />}
                      title={m.internal_contour_title({}, { locale })}
                    >
                      {/* Wrapped so the kit's truncate rule applies: this is
                          the longest label in the sidebar and it was being cut
                          mid-word with no ellipsis. */}
                      <span className="truncate">
                        {m.internal_contour_title({}, { locale })}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            {/* The admin area used to show the identity with no way to leave
                it; the internal contour's badge already carries the sign-out,
                the end-session redirect and the cache clear. */}
            <UserBadge session={session} locale={locale} showScope={false} />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b bg-background px-4 py-2">
            <SidebarTrigger
              aria-label={m.internal_nav_toggle({}, { locale })}
            />
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm font-medium">
              {m.admin_title({}, { locale })}
            </span>
            <div className="ms-auto">
              <LocaleSwitcher active={locale} />
            </div>
          </header>
          <main className="flex flex-col gap-6 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </Toaster>
  )
}
