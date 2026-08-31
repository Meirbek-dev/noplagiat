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
  /**
   * `dev` when the API runs `APP_AUTH_MODE=dev`, which replaces the OIDC flow
   * with `POST /api/auth/dev-login`. Set it only on a development or e2e build:
   * it makes the sign-in page offer the development form, which the API 404s
   * on any deployment fronted by the portal IdP. Development builds imply it.
   */
  readonly VITE_AUTH_MODE?: string
}
