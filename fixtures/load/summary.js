// k6 load test for the public contour (docs/PLAN.md W4.4, ARCHITECTURE.md §7,
// PLAN.md D9). Run against a 250 000-row warehouse - see fixtures/load/README.md.
//
//   BASE=http://127.0.0.1:8080 k6 run fixtures/load/summary.js
//
// Two scenarios, because they measure two different things:
//
//   `summary`  - the budget scenario and THE GATE. One URL, no query string.
//                Constant arrival rate calibrated to plausible portal traffic
//                (see RESULTS.md 30.08.2026 «Calibration decision»): the public
//                contour is behind `Cache-Control: max-age=3600`, so ~10 000
//                students refreshing hourly is well under 10 req/s; 40 req/s is
//                that with 4× headroom. D9 governs the latency at this arrival
//                rate: p(95) < 300 ms.
//   `filters`  - the cold scenario. Timeseries and histogram with *varied*
//                filter query strings, so each request is a distinct cache key
//                and the aggregate read is actually executed. This is what
//                proves the warehouse holds up at 250 k rows (TZ §7
//                «рост объёма данных минимум в 5 раз»); it gets a looser
//                budget because it is deliberately uncacheable.
//   `stress`   - record-only saturation ramp (the original 10→50 VU profile).
//                NO threshold: on a co-located runner it measures queueing at
//                machine saturation (~215 req/s on 6 shared cores), not the
//                warehouse; its numbers land in the JSON artifact as a
//                regression trace. Measured service time at 250 k rows is
//                21–30 ms - the SLO with a threshold here would gate the CI
//                runner's core count, not the code.
//
// Thresholds are `abortOnFail: false` but non-zero-exit: k6 returns 99 when a
// threshold is crossed, which is what makes the nightly job fail rather than
// merely report (PLAN.md W4.4 gate).

import { check } from "k6"
import http from "k6/http"
import { Trend } from "k6/metrics"

const BASE = (__ENV.BASE || "http://127.0.0.1:8080").replace(/\/+$/, "")

// Kept in sync with fixtures/dictionaries.sql; `crates/api/src/query.rs`
// rejects an unknown code with 422, so a stale value here fails loudly rather
// than quietly measuring an error path.
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

export const options = {
  discardResponseBodies: false,
  // k6's default trend stats stop at p(95); p(99) is what shows a long tail
  // that a p(95) budget would pass over.
  summaryTrendStats: ["min", "med", "avg", "p(95)", "p(99)", "max"],
  scenarios: {
    summary: {
      executor: "constant-arrival-rate",
      exec: "summary",
      rate: 40,
      timeUnit: "1s",
      duration: "3m",
      preAllocatedVUs: 20,
      maxVUs: 60,
      tags: { scenario: "summary" },
    },
    filters: {
      executor: "ramping-vus",
      exec: "filters",
      startVUs: 5,
      stages: [
        { duration: "2m", target: 20 },
        { duration: "1m", target: 20 },
      ],
      gracefulRampDown: "10s",
      tags: { scenario: "filters" },
    },
    stress: {
      executor: "ramping-vus",
      exec: "summary",
      startVUs: 10,
      stages: [
        { duration: "2m", target: 50 },
        { duration: "1m", target: 50 },
      ],
      gracefulRampDown: "10s",
      // Record-only: no threshold keys reference this scenario.
      tags: { scenario: "stress" },
      startTime: "3m10s",
    },
  },
  thresholds: {
    // ARCHITECTURE.md §7 item 5 / PLAN.md D9. The gate.
    "http_req_duration{scenario:summary}": ["p(95)<300"],
    // The uncacheable aggregate reads. Generous next to the summary budget on
    // purpose: this is not a user-facing first paint, it is a stress probe.
    "http_req_duration{scenario:filters}": ["p(95)<1000"],
    // A 4xx/5xx would make the duration numbers meaningless.
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
}

const summaryLatency = new Trend("summary_latency", true)
const filterLatency = new Trend("filter_latency", true)

function pick(values) {
  return values[Math.floor(Math.random() * values.length)]
}

/**
 * A query string distinct enough to miss every cache layer.
 *
 * Built by hand: k6's runtime is goja, which has no `URLSearchParams` and no
 * `URL`. `encodeURIComponent` is there, and the values are dictionary codes
 * anyway, so this is the whole of it.
 */
function variedFilters() {
  const pairs = [["period", pick(PERIODS)]]
  // Roughly two thirds of requests narrow further, so the mix looks like a
  // dashboard being driven rather than a single hot query.
  if (Math.random() < 0.7) pairs.push(["faculty", pick(FACULTIES)])
  if (Math.random() < 0.5) pairs.push(["work_type", pick(WORK_TYPES)])
  if (Math.random() < 0.3) pairs.push(["status", pick(STATUSES)])
  return pairs.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")
}

/**
 * A distinct client address per iteration.
 *
 * The public contour is rate limited to 600 requests per minute per address
 * (`RateLimitConfig::default`, ADR-012 §5), keyed on the gateway's
 * `X-Forwarded-For` first hop. Without this header every virtual user is
 * 127.0.0.1, one address, and the test measures the anti-scraping limiter
 * instead of the warehouse: a 3-minute run at 70 VUs answers 429 to 99.97 % of
 * requests in ~1 ms and reports a p95 that means nothing.
 *
 * Setting it is not cheating the budget - it is modelling the deployment.
 * In production nginx terminates many distinct visitors and stamps each one's
 * address here (deploy/nginx.conf), so 30 000 requests a second from one host
 * is a *less* faithful model of load than 30 000 distinct addresses. The
 * limiter itself is covered by its own tests in `crates/api`.
 */
function clientAddress() {
  return (
    `10.${__VU % 256}.` + `${Math.floor(__ITER / 256) % 256}.${__ITER % 256}`
  )
}

function headers(endpoint) {
  return {
    headers: { "X-Forwarded-For": clientAddress() },
    tags: { endpoint },
  }
}

function measure(response, trend, name) {
  trend.add(response.timings.duration)
  check(response, {
    [`${name}: 200`]: (r) => r.status === 200,
    [`${name}: json body`]: (r) =>
      (r.headers["Content-Type"] || "").includes("application/json"),
  })
}

export function summary() {
  const response = http.get(`${BASE}/api/public/summary`, headers("summary"))
  measure(response, summaryLatency, "summary")
}

export function filters() {
  const query = variedFilters()
  const endpoint = Math.random() < 0.5 ? "timeseries" : "histogram"
  const response = http.get(
    `${BASE}/api/public/${endpoint}?${query}`,
    headers(endpoint)
  )
  measure(response, filterLatency, endpoint)
}

/** Fail fast and legibly when BASE points at nothing, or at the wrong stack. */
export function setup() {
  const probe = http.get(`${BASE}/readyz`)
  if (probe.status !== 200) {
    throw new Error(
      `${BASE}/readyz answered ${probe.status}; start the server before running the load test`
    )
  }
  return { base: BASE }
}

export function handleSummary(data) {
  return {
    "k6-summary.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  }
}

/** A compact console summary; k6's own is written to the JSON artifact. */
function textSummary(data) {
  const lines = ["", `load test against ${BASE}`, ""]
  for (const [name, metric] of Object.entries(data.metrics)) {
    if (!name.startsWith("http_req_duration") && !name.endsWith("_latency")) {
      continue
    }
    const v = metric.values || {}
    if (v["p(95)"] === undefined) continue
    lines.push(
      `${name.padEnd(34)} ` +
        `p50=${(v.med ?? 0).toFixed(1)}ms ` +
        `p95=${v["p(95)"].toFixed(1)}ms ` +
        `p99=${(v["p(99)"] ?? 0).toFixed(1)}ms ` +
        `max=${(v.max ?? 0).toFixed(1)}ms`
    )
  }
  const requests = data.metrics.http_reqs?.values?.count ?? 0
  const failed = data.metrics.http_req_failed?.values?.rate ?? 0
  lines.push(
    "",
    `requests=${requests} failed=${(failed * 100).toFixed(2)}%`,
    ""
  )
  return lines.join("\n")
}
