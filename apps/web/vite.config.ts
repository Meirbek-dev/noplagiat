import { defineConfig, lazyPlugins } from "vite-plus"
import { devtools } from "@tanstack/devtools-vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

/**
 * Development serves the API on the same origin as the app, so the browser
 * never crosses an origin and no CORS configuration exists anywhere. In
 * production nginx does the same thing (ARCHITECTURE §5.6), which is why
 * `VITE_API_BASE` stays unset in both. Point `API_PROXY_TARGET` elsewhere when
 * the Rust server is bound to another address (`APP_LISTEN_ADDR`).
 */
const apiTarget = process.env.API_PROXY_TARGET ?? "http://127.0.0.1:8080"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    proxy: {
      "/api": { target: apiTarget, changeOrigin: true },
    },
  },
  plugins: lazyPlugins(() => [
    // Compiles `messages/{ru,kk,en}.json` into `src/paraglide/`.
    // Compiler options live in `project.inlang/paraglide.config.ts` so the
    // CLI (`vp run i18n`) produces byte-identical output.
    paraglideVitePlugin({ project: "./project.inlang" }),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    // React Compiler auto-memoises components and hooks, so the tree no
    // longer depends on hand-written `memo`/`useMemo`/`useCallback`. This is
    // the oxc-backed compiler (`oxc-transform-react`, an optional peer of
    // `@vitejs/plugin-react`) rather than the Babel plugin: it runs inside the
    // existing Rust transform instead of adding a second JS pass. The plugin
    // only compiles the client environment, so the SSR bundle is untouched.
    viteReact({ compiler: true }),
  ]),
})

export default config
