import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import { defineConfig, devices } from "@playwright/test"

/**
 * E2E harness (PLAN.md W2.7; ARCHITECTURE §9 "E2E" row).
 *
 * The suite is acceptance evidence for TZ §10 - §10.1/§10.2 (the numbers and
 * the filters), §10.3 (exports), §10.5's UI half, and §10.8 (brand/localization
 * plus the WCAG scan). Its assertions are compared against
 * `fixtures/expected.json`, which is computed by an independent brute-force
 * reducer, so "the page shows the right number" is machine-checkable.
 *
 * ── Why this config spawns both servers ───────────────────────────────────────
 *
 * `vp run e2e` is a single command on a developer's machine and in CI, and the
 * CI runner has nothing running when the job starts. Driving an
 * already-running dev stack would therefore need a second, CI-only path - so
 * the config owns both processes instead:
 *
 *   1. the Rust API (`cargo run`, warm build ⇒ instant), and
 *   2. the **production** frontend build served by `vp preview`.
 *
 * Preview, not `vp dev`, for two reasons. `perf.spec.ts` measures LCP against
 * the D9 budget, and a budget measured against unbundled dev ESM would be
 * meaningless. And Vite resolves `preview.proxy` from `server.proxy`
 * (`resolvePreviewOptions`), so `/api` reaches the Rust server on the same
 * origin exactly as it does in dev and behind nginx in production
 * (ARCHITECTURE §5.6) - no CORS anywhere, in any environment.
 *
 * ── Ports ─────────────────────────────────────────────────────────────────────
 *
 * Deliberately *not* 3000/8080: a developer running `vp dev` and `cargo run`
 * keeps those, and a stale listener on 8080 must not silently answer the
 * suite. Override with `E2E_WEB_PORT` / `E2E_API_PORT`.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const webRoot = path.resolve(here, "..")
const repoRoot = path.resolve(webRoot, "../..")

const webPort = Number(process.env.E2E_WEB_PORT ?? 3100)
const apiPort = Number(process.env.E2E_API_PORT ?? 8082)

export const baseURL = `http://localhost:${String(webPort)}`
const apiOrigin = `http://127.0.0.1:${String(apiPort)}`

/**
 * `vp` lives in the root `node_modules/.bin`. Spelling it out keeps the suite
 * independent of whether the caller's PATH happens to carry it - CI puts it
 * there, a bare `playwright test` from a shell may not.
 */
const vp = path.join(
  repoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vp.exe" : "vp"
)
const quoted = (value: string) => `"${value}"`

export default defineConfig({
  testDir: here,
  testMatch: /.*\.spec\.ts$/,

  // Assertions here wait on a section's query, an SSR round trip and a chart
  // mount; the default 5 s is tight for the throttled and export paths.
  timeout: 60_000,
  expect: { timeout: 15_000 },

  // No retries, deliberately (AGENTS.md §1.7). A retried flake is a defect
  // that stays hidden; every wait in this suite is on a response or a locator,
  // never on a sleep.
  retries: 0,
  workers: process.env.CI ? 1 : 2,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),

  // `apps/web/playwright-report/` is the path the CI job uploads on failure.
  reporter: [
    ["list"],
    [
      "html",
      { outputFolder: path.join(webRoot, "playwright-report"), open: "never" },
    ],
  ],
  outputDir: path.join(webRoot, "test-results"),

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    // TZ §7: the interface language is Russian by default; a locale-specific
    // test sets `?lang=` or the cookie itself.
    locale: "ru-RU",
    timezoneId: "Asia/Almaty",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // TZ §7 «Совместимость»: актуальные Chrome, Firefox, Edge, Safari and
    // «адаптивная вёрстка (десктоп, планшет)». Chromium carries the full
    // functional suite (Edge shares the engine); Firefox and WebKit (Safari's
    // engine) run the browser-sensitive public surface - rendering, filters,
    // embed messaging, locale switching. Auth/admin/export/a11y/perf specs
    // exercise server logic and stay single-engine by design.
    {
      name: "firefox",
      testMatch: /(public|embed|i18n)\.spec\.ts$/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testMatch: /(public|embed|i18n)\.spec\.ts$/,
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "tablet",
      testMatch: /public\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
    },
  ],

  webServer: [
    {
      // `cwd: server` so the binary finds `server/.env` exactly as it does
      // under `cargo run` by hand. `APP_AUTH_MODE=dev` mounts
      // `POST /api/auth/dev-login`, which is how `rbac.spec.ts` becomes each
      // role without an identity provider.
      command: "cargo run --quiet --bin noplagiat-server",
      cwd: path.join(repoRoot, "server"),
      url: `${apiOrigin}/healthz`,
      env: {
        APP_LISTEN_ADDR: `127.0.0.1:${String(apiPort)}`,
        APP_AUTH_MODE: "dev",
        APP_INGEST_PEPPER: process.env.APP_INGEST_PEPPER ?? "dev-pepper",
        RUST_LOG: process.env.RUST_LOG ?? "warn",
      },
      // A warm `cargo run` is instant; a cold one compiles the workspace.
      timeout: 300_000,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      // Always rebuilt, never reused: a preview server left over from an
      // earlier run would serve the previous bundle and quietly test code that
      // is no longer in the tree.
      command: `${quoted(vp)} build && ${quoted(vp)} preview --port ${String(webPort)} --strictPort`,
      cwd: webRoot,
      url: baseURL,
      env: {
        // Two different hops, both of which have to find the Rust server.
        // `API_PROXY_TARGET` is where the preview server forwards the
        // browser's `/api` calls; `API_ORIGIN` is what the SSR renderer -
        // a third party between browser and Rust - resolves as the API
        // origin, since Node's `fetch` cannot take a relative URL
        // (`lib/api.ts` `resolveBaseUrl`). Without the second one SSR falls
        // back to `127.0.0.1:8080` and every loader renders an error.
        API_PROXY_TARGET: apiOrigin,
        API_ORIGIN: apiOrigin,
        // `import.meta.env.DEV` is false in a production bundle, so the
        // sign-in page would otherwise hide the development form that
        // `rbac.spec.ts` documents (`routes/login.tsx`).
        VITE_AUTH_MODE: "dev",
      },
      timeout: 300_000,
      // `E2E_REUSE_WEB=1` keeps a preview server between runs while iterating
      // on a spec. Never set in CI, and never the default: it is exactly the
      // switch that would let a stale bundle pass the gate.
      reuseExistingServer: process.env.E2E_REUSE_WEB === "1",
      stdout: "pipe",
      stderr: "pipe",
    },
  ],
})
