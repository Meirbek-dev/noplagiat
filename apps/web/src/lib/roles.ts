import type { MeResponse, ScopeDto } from "../api/types.gen"
import { m } from "../paraglide/messages.js"
import type { Locale } from "../paraglide/runtime.js"

/**
 * The client-side reading of the RBAC matrix (TZ.md §5, `api::rbac`).
 *
 * These predicates decide what the *chrome* offers - a nav entry, an export
 * button - so that a user is not invited into a 403. They are UX only: the
 * server refuses the request regardless, and the RBAC matrix test is the
 * acceptance evidence, not this file (ARCHITECTURE §5.1).
 */

export const ROLE_KINDS = [
  "staff",
  "dept_head",
  "dean",
  "ethics",
  "compliance",
  "admin",
] as const

export type RoleKind = (typeof ROLE_KINDS)[number]

export function isRoleKind(
  value: string | null | undefined
): value is RoleKind {
  return value != null && (ROLE_KINDS as readonly string[]).includes(value)
}

/**
 * Roles that hold an internal scope. `staff` is deliberately absent: TZ §5
 * gives ППС the public contour, and `api::rbac::SCOPED` refuses them every
 * `/api/internal/*` route, so the shell must not pretend otherwise.
 */
const SCOPED_ROLES: readonly RoleKind[] = [
  "dept_head",
  "dean",
  "ethics",
  "compliance",
  "admin",
]

export function canUseInternal(role: string | null | undefined): boolean {
  return isRoleKind(role) && SCOPED_ROLES.includes(role)
}

/**
 * TZ §4.4 - export is available to every role that reaches the internal
 * contour, and to no one else.
 */
export function canExport(role: string | null | undefined): boolean {
  return canUseInternal(role)
}

export function isAdmin(role: string | null | undefined): boolean {
  return role === "admin"
}

/**
 * Roles the escalations register is for.
 *
 * TZ §5 gives «дела, переданные в Совет по этике» to the ethics council and
 * the compliance service; `/api/internal/escalations` answers a dean or a
 * head of department with a `403`. Like every predicate here this only shapes
 * the chrome - the refusal is the server's, and the RBAC matrix test is what
 * proves it.
 */
export function canSeeEscalations(role: string | null | undefined): boolean {
  return role === "ethics" || role === "compliance" || role === "admin"
}

/** `true` once the account holds at least one grant of any kind. */
export function hasAnyGrant(session: MeResponse | null): boolean {
  return session !== null && session.roles.length > 0
}

const ROLE_LABELS: Record<RoleKind, (locale: Locale) => string> = {
  staff: (locale) => m.role_staff({}, { locale }),
  dept_head: (locale) => m.role_dept_head({}, { locale }),
  dean: (locale) => m.role_dean({}, { locale }),
  ethics: (locale) => m.role_ethics({}, { locale }),
  compliance: (locale) => m.role_compliance({}, { locale }),
  admin: (locale) => m.role_admin({}, { locale }),
}

export function roleLabel(role: string | null | undefined, locale: Locale) {
  return isRoleKind(role)
    ? ROLE_LABELS[role](locale)
    : m.role_none({}, { locale })
}

/**
 * The scope as a phrase. The wire form carries dictionary *ids*, not codes
 * (`ScopeDto`), and the internal contour publishes no id→name lookup, so the
 * kind is what the badge can honestly state; the unit itself is visible in the
 * matrix the user is looking at.
 */
export function scopeLabel(
  scope: ScopeDto | null | undefined,
  locale: Locale
): string {
  switch (scope?.kind) {
    case "faculty":
      return m.scope_faculty({}, { locale })
    case "department":
      return m.scope_department({}, { locale })
    case "all":
      return m.scope_all({}, { locale })
    default:
      return m.scope_none({}, { locale })
  }
}
