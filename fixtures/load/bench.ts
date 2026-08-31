/**
 * A dependency-free load probe for a machine without k6 (W4.4).
 *
 *   BASE=http://127.0.0.1:8085 bun fixtures/load/bench.ts
 *
 * `summary.js` is the gate; this is the fallback evidence path. It is a smaller
 * instrument on purpose - fixed concurrency instead of ramping VUs, one process
 * instead of k6's scheduler - so it under-reports contention and its numbers are
 * a floor, not a certificate. Where both were run, `RESULTS.md` records both.
 *
 * Measured, matching the two k6 scenarios:
 *   1. `/api/public/summary`, sequential - the warm first-paint path (D9).
 *   2. `/api/public/summary`, 4-way concurrent - the same path under contention.
 *   3. `timeseries` + `histogram` with varied filters - every request a distinct
 *      cache key, so the aggregate read actually executes.
 *
 * Exit status is 1 when the D9 budget (summary p95 < 300 ms) is missed, so this
 * can gate a local check the same way k6 gates the nightly job.
 */

const BASE = (process.env.BASE ?? "http://127.0.0.1:8085").replace(/\/+$/u, "")

/** D9 / ARCHITECTURE.md §7 item 5. */
const SUMMARY_P95_BUDGET_MS = 300

const SEQUENTIAL_REQUESTS = 120
const CONCURRENT_REQUESTS = 200
const CONCURRENCY = 4
const FILTER_REQUESTS = 120
const WARMUP_REQUESTS = 10

// Kept in sync with fixtures/dictionaries.sql - see fixtures/load/README.md.
const FACULTIES = [
  "FAC01",
  "FAC02",
  "FAC03",
  "FAC04",
  "FAC05",
  "FAC06",
  "FAC07",
  "FAC08",
]
const WORK_TYPES = [
  "thesis_bachelor",
  "thesis_master",
  "thesis_phd",
  "course",
  "article",
  "research_report",
]
const STATUSES = ["accepted", "needs_revision", "rejected", "recheck"]
const PERIODS = ["year", "3y", "5y", "semester"]

type Sample = { ms: number; status: number }

type Stats = {
  n: number
  min: number
  p50: number
  p95: number
  p99: number
  max: number
  mean: number
  errors: number
}

/**
 * Deterministic so two runs on the same machine are comparable. A load probe
 * that shuffles its own filter mix between runs cannot tell a regression from
 * a different sample.
 */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0
    return state / 0x1_00_00_00_00
  }
}

const random = makeRandom(20260901)

function pick<T>(values: readonly T[]): T {
  const value = values[Math.floor(random() * values.length)]
  if (value === undefined) throw new Error("empty choice list")
  return value
}

function variedQuery(): string {
  const params = new URLSearchParams({ period: pick(PERIODS) })
  if (random() < 0.7) params.set("faculty", pick(FACULTIES))
  if (random() < 0.5) params.set("work_type", pick(WORK_TYPES))
  if (random() < 0.3) params.set("status", pick(STATUSES))
  return params.toString()
}

/**
 * A distinct client address per request, for the same reason `summary.js` sets
 * one: the public contour is rate limited to 600 requests per minute per
 * address (ADR-012 §5), keyed on the gateway's `X-Forwarded-For` first hop.
 * Without it every request here is 127.0.0.1 and the benchmark measures the
 * anti-scraping limiter answering 429 rather than the warehouse.
 *
 * This models the deployment rather than evading it: nginx stamps each real
 * visitor's address into this header (deploy/nginx.conf).
 */
let requestCounter = 0
function clientAddress(): string {
  const n = requestCounter++
  return `10.1.${Math.floor(n / 256) % 256}.${n % 256}`
}

async function timed(url: string): Promise<Sample> {
  const started = performance.now()
  let status = 0
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-Forwarded-For": clientAddress(),
      },
    })
    status = response.status
    // The body must be drained or the connection is not actually free.
    await response.arrayBuffer()
  } catch {
    status = 0
  }
  return { ms: performance.now() - started, status }
}

function percentile(sorted: readonly number[], q: number): number {
  if (sorted.length === 0) return Number.NaN
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil(q * sorted.length) - 1)
  )
  return sorted[index] ?? Number.NaN
}

function summarise(samples: readonly Sample[]): Stats {
  const ok = samples.filter((s) => s.status === 200)
  const sorted = ok.map((s) => s.ms).sort((a, b) => a - b)
  return {
    n: samples.length,
    min: sorted[0] ?? Number.NaN,
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
    max: sorted.at(-1) ?? Number.NaN,
    mean: sorted.reduce((a, b) => a + b, 0) / (sorted.length || 1),
    errors: samples.length - ok.length,
  }
}

function row(label: string, s: Stats): string {
  const f = (v: number): string => (Number.isFinite(v) ? v.toFixed(1) : "-")
  return (
    `${label.padEnd(38)}` +
    `n=${String(s.n).padStart(4)}  ` +
    `min=${f(s.min).padStart(7)}  ` +
    `p50=${f(s.p50).padStart(7)}  ` +
    `p95=${f(s.p95).padStart(7)}  ` +
    `p99=${f(s.p99).padStart(7)}  ` +
    `max=${f(s.max).padStart(8)}  ` +
    `err=${s.errors}`
  )
}

async function sequential(url: () => string, count: number): Promise<Sample[]> {
  const samples: Sample[] = []
  for (let i = 0; i < count; i++) samples.push(await timed(url()))
  return samples
}

async function concurrent(
  url: () => string,
  count: number,
  workers: number
): Promise<Sample[]> {
  const samples: Sample[] = []
  let issued = 0
  const worker = async (): Promise<void> => {
    while (issued < count) {
      issued++
      samples.push(await timed(url()))
    }
  }
  await Promise.all(Array.from({ length: workers }, worker))
  return samples
}

async function main(): Promise<void> {
  const ready = await fetch(`${BASE}/readyz`).catch(() => null)
  if (!ready || ready.status !== 200) {
    console.error(
      `${BASE}/readyz answered ${ready?.status ?? "nothing"}; ` +
        "start the release server first (fixtures/load/README.md §2)"
    )
    process.exit(2)
  }

  const checks = await fetch(`${BASE}/api/public/summary`)
  if (checks.status !== 200) {
    console.error(`GET /api/public/summary answered ${checks.status}`)
    process.exit(2)
  }

  console.log(`base   ${BASE}`)
  console.log(`bun    ${Bun.version}`)
  console.log(`when   ${new Date().toISOString()}\n`)

  const summaryUrl = (): string => `${BASE}/api/public/summary`
  await sequential(summaryUrl, WARMUP_REQUESTS)

  const seq = summarise(await sequential(summaryUrl, SEQUENTIAL_REQUESTS))
  const conc = summarise(
    await concurrent(summaryUrl, CONCURRENT_REQUESTS, CONCURRENCY)
  )
  const filtered = summarise(
    await sequential(() => {
      const endpoint = random() < 0.5 ? "timeseries" : "histogram"
      return `${BASE}/api/public/${endpoint}?${variedQuery()}`
    }, FILTER_REQUESTS)
  )

  console.log("all times in milliseconds\n")
  console.log(row("summary (sequential)", seq))
  console.log(row(`summary (${CONCURRENCY}-way concurrent)`, conc))
  console.log(row("timeseries+histogram (varied filters)", filtered))

  const worst = Math.max(seq.p95, conc.p95)
  const ok =
    worst < SUMMARY_P95_BUDGET_MS && seq.errors === 0 && conc.errors === 0
  console.log(
    `\nD9 budget: summary p95 < ${SUMMARY_P95_BUDGET_MS} ms - ` +
      `${ok ? "PASS" : "FAIL"} (worst p95 ${worst.toFixed(1)} ms)`
  )
  if (!ok) process.exit(1)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(2)
})

// Keeps this file a module rather than a script: it has no imports of its own
// (everything it needs is a global), and a script cannot carry top-level
// `await` - which the `main().catch(...)` form above also avoids.
export {}
