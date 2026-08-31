/// <reference types="vite/client" />

/**
 * Typed environment surface. Vite's own `ImportMetaEnv` carries an `any` index
 * signature; declaring the keys we read keeps `no-any` honest at the call site.
 */
interface ImportMetaEnv {
  /**
   * Absolute API origin override. Normally **unset**: the browser talks to its
   * own origin (`/api`, served by nginx in production and by the dev-server
   * proxy in development). See `src/api/README.md`.
   */
  readonly VITE_API_BASE?: string
}
