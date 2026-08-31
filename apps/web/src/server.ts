import handler, { createServerEntry } from "@tanstack/react-start/server-entry"

import { paraglideMiddleware } from "@/paraglide/server.js"

// Registers the `?lang=` override strategy before the first locale lookup.
import "@/lib/locale"

/**
 * SSR entry. `paraglideMiddleware` resolves the request locale once and puts it
 * into AsyncLocalStorage, so `getLocale()` and every `m.*()` call render the
 * right language during concurrent requests (ARCHITECTURE.md §5.4).
 */
export default createServerEntry({
  fetch: (request) =>
    paraglideMiddleware(request, () => handler.fetch(request)),
})
