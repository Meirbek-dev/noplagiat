// `@tanstack/react-store` re-exports the whole core, and it is the package
// this workspace declares - importing `@tanstack/store` directly would rely on
// a transitive dependency.
import { Store, useSelector } from "@tanstack/react-store"

/**
 * Client-side UI state (TZ.md §9 - TanStack Store; ARCHITECTURE.md §5.1).
 *
 * The dashboard deliberately keeps almost nothing here. Everything the reader
 * can *name* - period, faculty, work type, status, the drill-down anchor - is
 * URL search state, because TZ §4.3 requires a filtered view to be a shareable
 * link, and server data is TanStack Query's. What is left is genuine view
 * chrome: preferences about how the frame is arranged that belong to the
 * person, not to the address.
 *
 * ── Why the sidebar lives here ────────────────────────────────────────────────
 *
 * `SidebarProvider` holds `open` in component state, and the internal contour
 * and the admin area mount *different* providers (`/app` and `/admin` are
 * separate layout routes). An administrator who collapsed the sidebar in
 * «Справочники» therefore got it back, expanded, the moment they stepped into
 * the internal analytics - the preference did not survive the navigation
 * because the component holding it unmounted. Lifting it out of the tree fixes
 * that, and lets both shells render the same choice.
 *
 * ── SSR ───────────────────────────────────────────────────────────────────────
 *
 * The store is module scope, so on the server one instance is shared by every
 * request. That is safe only because nothing mutates it during SSR: the server
 * always renders {@link DEFAULT_UI_STATE}, and the stored preference is read
 * from `localStorage` after hydration by {@link restoreUiPreferences}. Keep it
 * that way - a `setState` in a render path would leak one visitor's chrome to
 * the next.
 */

export interface UiState {
  /** Expanded (`true`) or collapsed sidebar, shared by both shells. */
  sidebarOpen: boolean
}

/** What the server renders, and what a browser with no stored choice gets. */
export const DEFAULT_UI_STATE: UiState = { sidebarOpen: true }

const SIDEBAR_KEY = "np.sidebar-open"

// Both type parameters are inferred: naming `T` explicitly would leave the
// actions map at its `never` default and the factory unusable.
export const uiStore = new Store(DEFAULT_UI_STATE, ({ setState }) => ({
  setSidebarOpen: (open: boolean) => {
    setState((state: UiState) =>
      state.sidebarOpen === open ? state : { ...state, sidebarOpen: open }
    )
    persist(SIDEBAR_KEY, open)
  },
}))

/** Subscribes a component to the sidebar preference. */
export function useSidebarOpen(): boolean {
  return useSelector(uiStore, (state) => state.sidebarOpen)
}

export function setSidebarOpen(open: boolean): void {
  uiStore.actions.setSidebarOpen(open)
}

/**
 * Adopts the stored preferences. Called from a mount effect in the shells, not
 * at module scope: reading `localStorage` while rendering would both break SSR
 * and produce markup the server did not send, which React discards as a
 * hydration mismatch.
 */
export function restoreUiPreferences(): void {
  const stored = read(SIDEBAR_KEY)
  if (stored !== undefined) uiStore.actions.setSidebarOpen(stored)
}

/**
 * `localStorage` throws outright in some configurations - Safari's private
 * mode historically, and any browser set to block site data - so a preference
 * that cannot be saved is simply not saved.
 */
function persist(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "1" : "0")
  } catch {
    /* preferences are a convenience, never a requirement */
  }
}

function read(key: string): boolean | undefined {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return undefined
    return raw === "1"
  } catch {
    return undefined
  }
}
