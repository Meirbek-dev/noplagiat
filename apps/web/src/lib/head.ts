import { m } from "../paraglide/messages.js"
import { getLocale } from "../paraglide/runtime.js"

/**
 * The `<title>` of a page inside the dashboard.
 *
 * The root route declares the site title, which every route inherits - so
 * without this every tab, bookmark and history entry in the product reads
 * «Дашборд антиплагиата - Toraighyrov University», and a reader with the
 * public page, the internal contour and the admin panel open at once cannot
 * tell them apart. A route that names a page prefixes it instead.
 *
 * `getLocale()` resolves per request on the server (paraglide's
 * `AsyncLocalStorage`) and from the cookie / `?lang=` on the client, exactly as
 * it does inside a component, so the title follows the chosen locale.
 */
export function pageTitle(page: string): string {
  return `${page} - ${m.app_title({}, { locale: getLocale() })}`
}
