import { defineConfig } from "@hey-api/openapi-ts"

/**
 * Removes `format: "int64"` everywhere in a schema, recursively.
 *
 * Why: `Screened<i64>` is `oneOf: [integer(int64), "insufficient_data"]`. The
 * Valibot plugin renders an int64 as `pipe(union([number, string, bigint]),
 * transform(BigInt), …)`, whose *string* member swallows the suppression
 * marker and then throws a raw `SyntaxError` from `BigInt("insufficient_data")`
 * instead of failing that union branch - so every suppressed count crashed
 * response validation (ADR-002 cells are the normal case, not an edge one).
 *
 * Dropping the format keeps the schema in agreement with the TypeScript the
 * same generator emits (`ScreenedInt = number | SuppressedMarker`) and with
 * the wire, where serde writes an i64 as a JSON number. The domain's counts
 * are check tallies, orders of magnitude below `Number.MAX_SAFE_INTEGER`.
 */
function dropInt64Format(node: unknown): void {
  if (Array.isArray(node)) {
    for (const item of node) dropInt64Format(item)
    return
  }
  if (typeof node !== "object" || node === null) return
  const record = node as Record<string, unknown>
  if (record.format === "int64") delete record.format
  for (const value of Object.values(record)) dropInt64Format(value)
}

/**
 * Generates `apps/web/src/api/` from `contracts/openapi.json` (ADR-003: the
 * Rust types are the single source of truth; the contract itself is exported
 * by `cargo run --bin export-openapi`). Drive it through `bun
 * scripts/gen-api.ts`, i.e. `vp run gen:api`; `vp run gen:api:check`
 * regenerates into a temporary directory and fails on drift.
 *
 * Valibot - not Zod - is the one runtime-validation vocabulary (ADR-006 /
 * TZ §9). The SDK is generated *without* an always-on validator: response
 * parsing is applied by `apps/web/src/lib/api.ts`, which validates in dev and
 * test builds and trusts the server in production ones.
 *
 * `OPENAPI_INPUT` / `OPENAPI_OUTPUT` exist so the drift check can point the
 * same config at a scratch directory; nothing else may set them.
 */
export default defineConfig({
  input: {
    // Must stay `./`-prefixed: an unprefixed two-segment path is parsed as a
    // Hey API registry shorthand (`organization/project`), not as a file.
    path: process.env.OPENAPI_INPUT ?? "./contracts/openapi.json",
  },
  parser: {
    patch: {
      schemas: (_name, schema) => {
        dropInt64Format(schema)
      },
    },
  },
  output: {
    path: process.env.OPENAPI_OUTPUT ?? "apps/web/src/api",
    clean: true,
    // Oxfmt ignores this directory (root vite.config.ts `fmt.ignorePatterns`),
    // so the generator's own output must be byte-stable between runs - that is
    // exactly what the drift check compares.
    postProcess: [],
  },
  plugins: [
    {
      name: "@hey-api/client-fetch",
      // No baked-in server URL: `src/lib/api.ts` sets the base URL at runtime
      // (same-origin `/api` in the browser, an absolute origin during SSR).
      baseUrl: false,
    },
    "@hey-api/typescript",
    {
      name: "valibot",
      definitions: true,
      requests: true,
      responses: true,
    },
    {
      name: "@hey-api/sdk",
      // Validation is opt-in per environment - see `src/lib/api.ts`.
      validator: false,
      // Group by OpenAPI tag (`public`, `internal`, `admin`, `auth`). The two
      // contours deliberately expose the same operation ids - `summary`,
      // `timeseries`, … - so flat functions would be disambiguated by a
      // generated numeric suffix whose value depends on document order.
      // `Public.summary()` is stable no matter what the api lane adds next.
      operations: { strategy: "byTags", methods: "static" },
    },
  ],
})
