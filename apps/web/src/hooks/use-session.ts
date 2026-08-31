import { useQuery } from "@tanstack/react-query"

import type { MeResponse } from "@/api/types.gen"
import { authQueries } from "@/lib/queries"

/**
 * The current session, read from the same cache entry the route guards fill
 * during `beforeLoad`, so the shell renders the badge without a second request
 * and a sign-out invalidates both at once.
 *
 * `null` means anonymous - an answer, not a failure (see `authApi.me`).
 */
export function useSession(): MeResponse | null {
  const { data } = useQuery(authQueries.me())
  return data ?? null
}

/**
 * The double-submit CSRF token every mutating internal or admin request must
 * echo. `undefined` while the session is still loading - mutations are disabled
 * until it arrives rather than sent without it.
 */
export function useCsrfToken(): string | undefined {
  return useSession()?.csrf_token
}
