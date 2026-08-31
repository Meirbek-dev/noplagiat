import { defineConfig } from "vite-plus"

export default defineConfig({
  test: {
    /**
     * `apps/web/e2e/*.spec.ts` are Playwright tests, not Vitest ones: they own
     * their runner and their config (`apps/web/e2e/playwright.config.ts`) and
     * run through `vp run e2e`. Vitest's default `**\/*.spec.ts` glob would
     * otherwise collect them and fail on `test.describe()`.
     *
     * The list restates Vitest's own defaults because naming `exclude`
     * replaces them rather than adding to them.
     */
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{turbo,vite,vitest}.config.*",
      "apps/*/e2e/**",
    ],
  },
  staged: {
    // Wrapper tolerates chunks made up entirely of formatter-ignored
    // generated files - plain `vp format` errors on an empty target set.
    "*": "bun scripts/format-staged.ts",
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    // Generated, DO-NOT-EDIT output: a lint finding there cannot be fixed
    // without hand-editing a file `vp run gen:api` overwrites. The same
    // directories are excluded from formatting below.
    ignorePatterns: ["apps/web/src/api/", "apps/web/src/paraglide/"],
  },
  fmt: {
    endOfLine: "lf",
    semi: false,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "es5",
    printWidth: 80,
    sortPackageJson: false,
    sortTailwindcss: {
      stylesheet: "apps/web/src/styles/globals.css",
      functions: ["cn", "cva"],
    },
    ignorePatterns: [
      "dist/",
      "node_modules/",
      "server/target/",
      "server/.sqlx/",
      "contracts/",
      "apps/web/src/api/",
      "apps/web/src/paraglide/",
      "**/routeTree.gen.ts",
      ".turbo/",
      ".output/",
      ".nitro/",
      ".tanstack/",
      ".vinxi/",
      "coverage/",
      "pnpm-lock.yaml",
      ".pnpm-store/",
    ],
  },
})
