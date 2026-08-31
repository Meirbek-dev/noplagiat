import { ApiError } from "./api"
import { m } from "../paraglide/messages.js"
import type { Locale } from "../paraglide/runtime.js"

/**
 * RFC 7807 `type` URI of the 403 the server sends when a *unit filter* names
 * something outside the caller's scope (`ScopeGuard::narrow`, which refuses
 * rather than quietly returning no rows). A role denial uses
 * `/problems/forbidden` instead - same status, different answer, and the two
 * need different sentences: one is fixable by changing a filter, the other is
 * not fixable by the reader at all.
 */
const OUT_OF_SCOPE = "/problems/out-of-scope"

/**
 * What an internal-contour failure should say to the reader.
 *
 * The statuses that are *expected* here get a sentence in the reader's
 * language; `401` means the session has ended behind an open tab. Anything else
 * keeps the server's own `detail`, which is more useful to an administrator
 * than a generic apology.
 */
export function describeInternalError(
  error: unknown,
  locale: Locale
): string | undefined {
  if (!(error instanceof ApiError)) return undefined
  switch (error.status) {
    case 403:
      return error.problem?.type === OUT_OF_SCOPE
        ? m.error_out_of_scope({}, { locale })
        : m.error_role_denied({}, { locale })
    case 401:
      return m.error_session_expired({}, { locale })
    default:
      return undefined
  }
}

/**
 * Whether the reader can act on this failure by clearing the unit filter - the
 * one 403 that has an affordance.
 */
export function isOutOfScope(error: unknown): boolean {
  return (
    error instanceof ApiError &&
    error.status === 403 &&
    error.problem?.type === OUT_OF_SCOPE
  )
}
