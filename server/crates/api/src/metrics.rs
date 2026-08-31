//! Prometheus exposition for `/metrics` (ARCHITECTURE.md §8, slice W4.5).
//!
//! Hand-rolled, for the same reason the rate limiter is (ADR-012 §5): the whole
//! surface is two counters, one histogram and four gauges read from the
//! database at scrape time. `prometheus` brings protobuf and a lazy-static
//! registry; `metrics` + `metrics-exporter-prometheus` brings a second runtime
//! and an installer that fights `#[sqlx::test]`'s per-test processes. Both are
//! more machinery than a hundred lines of arithmetic and a `String`
//! (AGENTS.md §5 - prefer std over a dependency).
//!
//! # Cardinality
//!
//! `route` is the **matched path** (`/api/internal/summary`), never the request
//! URI, so a scraping loop cannot inflate the label set; filter values never
//! become labels. Statuses are grouped into `2xx`/`4xx`/`5xx` classes rather
//! than exact codes for the same reason.
//!
//! # Exposure
//!
//! The endpoint is deliberately unlayered - no session, no rate limit, no audit
//! row - so a scraper needs no cookie. Nothing it publishes is a k-anonymised
//! aggregate or an identity: request counts by matched route, ingest counters,
//! and how often suppression fired.
//!
//! **Operational note (ops lane).** `deploy/nginx.conf` currently proxies
//! `location = /metrics` to this process, so on a deployed stack the scrape is
//! reachable from the external origin. ARCHITECTURE.md §8 reserves the path at
//! the gateway for exactly this endpoint, but the gateway config should be
//! narrowed (`allow` the monitoring network, `deny all`) or the location
//! dropped before production. That file belongs to the deploy lane, not to
//! this crate.

use std::collections::BTreeMap;
use std::fmt::Write as _;
use std::sync::Mutex;
use std::sync::atomic::{AtomicU64, Ordering};

/// Latency buckets in seconds. Chosen around the TZ §7 budget (2 s) and the
/// ARCHITECTURE.md §7 p95 target for the public contour (300 ms).
pub const DURATION_BUCKETS: [f64; 9] = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 3.0];

/// Route group + status class, the only label pair this registry carries.
type Key = (&'static str, String, &'static str);

#[derive(Debug, Default)]
struct Series {
    count: u64,
    sum: f64,
    buckets: [u64; DURATION_BUCKETS.len()],
}

/// Process-wide metric state. One instance lives in [`crate::state::AppState`].
#[derive(Debug, Default)]
pub struct Metrics {
    series: Mutex<BTreeMap<Key, Series>>,
    /// TZ §6.2 - how often the k-anonymity policy actually hid something. A
    /// sudden drop to zero is the signal that suppression stopped running.
    screened_cells: AtomicU64,
    /// ADR-012 §6 - the audit write is best effort on the response path, so the
    /// failure has to be visible somewhere (TZ §6.3 is a compliance control).
    audit_write_failures: AtomicU64,
}

/// The four contours, as the `contour` label.
#[must_use]
pub fn contour_of(path: &str) -> &'static str {
    if path.starts_with("/api/public") {
        "public"
    } else if path.starts_with("/api/internal") {
        "internal"
    } else if path.starts_with("/api/admin") {
        "admin"
    } else if path.starts_with("/api/auth") {
        "auth"
    } else {
        "ops"
    }
}

#[must_use]
fn status_class(status: u16) -> &'static str {
    match status {
        100..=199 => "1xx",
        200..=299 => "2xx",
        300..=399 => "3xx",
        400..=499 => "4xx",
        _ => "5xx",
    }
}

impl Metrics {
    #[must_use]
    pub fn new() -> Self {
        Self::default()
    }

    /// Record one finished request.
    pub fn observe_request(&self, path: &str, status: u16, seconds: f64) {
        let key = (contour_of(path), path.to_owned(), status_class(status));
        let Ok(mut series) = self.series.lock() else {
            // A poisoned metrics mutex must never take a request path down.
            return;
        };
        let entry = series.entry(key).or_default();
        entry.count += 1;
        entry.sum += seconds;
        for (index, edge) in DURATION_BUCKETS.iter().enumerate() {
            if seconds <= *edge {
                entry.buckets[index] += 1;
            }
        }
    }

    /// Count cells the active [`compliance::KPolicy`] withheld.
    pub fn add_screened_cells(&self, cells: u64) {
        self.screened_cells.fetch_add(cells, Ordering::Relaxed);
    }

    pub fn record_audit_write_failure(&self) {
        self.audit_write_failures.fetch_add(1, Ordering::Relaxed);
    }

    #[must_use]
    pub fn screened_cells(&self) -> u64 {
        self.screened_cells.load(Ordering::Relaxed)
    }

    #[must_use]
    pub fn audit_write_failures(&self) -> u64 {
        self.audit_write_failures.load(Ordering::Relaxed)
    }

    /// Render the Prometheus text exposition format (version 0.0.4).
    ///
    /// `ingest` figures are passed in rather than read here: they come from the
    /// database, and a registry that owned a pool would be a registry that can
    /// block a scrape on a slow query.
    #[must_use]
    pub fn render(&self, ingest: &IngestGauges) -> String {
        let mut out = String::with_capacity(4096);

        out.push_str(
            "# HELP http_requests_total Requests handled, by contour, matched route and status class.\n\
             # TYPE http_requests_total counter\n",
        );
        let snapshot = self.snapshot();
        for ((contour, route, class), series) in &snapshot {
            let _ = writeln!(
                out,
                "http_requests_total{{contour=\"{contour}\",route=\"{}\",status=\"{class}\"}} {}",
                escape(route),
                series.count
            );
        }

        out.push_str(
            "# HELP http_request_duration_seconds Request latency, by contour and matched route.\n\
             # TYPE http_request_duration_seconds histogram\n",
        );
        // One histogram per (contour, route): the status class is a counter
        // dimension, not a latency one, so the buckets are summed over it.
        let mut by_route: BTreeMap<
            (&'static str, &str),
            (u64, f64, [u64; DURATION_BUCKETS.len()]),
        > = BTreeMap::new();
        for ((contour, route, _), series) in &snapshot {
            let entry = by_route.entry((contour, route.as_str())).or_insert((
                0,
                0.0,
                [0; DURATION_BUCKETS.len()],
            ));
            entry.0 += series.count;
            entry.1 += series.sum;
            for (slot, value) in entry.2.iter_mut().zip(series.buckets) {
                *slot += value;
            }
        }
        for ((contour, route), (count, sum, buckets)) in &by_route {
            let labels = format!("contour=\"{contour}\",route=\"{}\"", escape(route));
            for (edge, cumulative) in DURATION_BUCKETS.iter().zip(buckets) {
                let _ = writeln!(
                    out,
                    "http_request_duration_seconds_bucket{{{labels},le=\"{edge}\"}} {cumulative}"
                );
            }
            let _ = writeln!(
                out,
                "http_request_duration_seconds_bucket{{{labels},le=\"+Inf\"}} {count}"
            );
            let _ = writeln!(out, "http_request_duration_seconds_sum{{{labels}}} {sum}");
            let _ = writeln!(
                out,
                "http_request_duration_seconds_count{{{labels}}} {count}"
            );
        }

        let _ = write!(
            out,
            "# HELP ingest_batches_total Ingest batches recorded since installation.\n\
             # TYPE ingest_batches_total counter\n\
             ingest_batches_total {}\n\
             # HELP ingest_rows_rejected_total Source rows rejected into ingest_batches.errors.\n\
             # TYPE ingest_rows_rejected_total counter\n\
             ingest_rows_rejected_total {}\n\
             # HELP ingest_rows_upserted_total Source rows written to the fact table.\n\
             # TYPE ingest_rows_upserted_total counter\n\
             ingest_rows_upserted_total {}\n\
             # HELP ingest_last_success_age_seconds Age of the newest succeeded batch; -1 when none exists.\n\
             # TYPE ingest_last_success_age_seconds gauge\n\
             ingest_last_success_age_seconds {}\n\
             # HELP suppression_screened_cells_total Metric cells withheld by the k-anonymity policy (TZ 6.2).\n\
             # TYPE suppression_screened_cells_total counter\n\
             suppression_screened_cells_total {}\n\
             # HELP audit_write_failures_total Audit rows that could not be appended (TZ 6.3).\n\
             # TYPE audit_write_failures_total counter\n\
             audit_write_failures_total {}\n",
            ingest.batches,
            ingest.rows_rejected,
            ingest.rows_upserted,
            ingest.last_success_age_seconds,
            self.screened_cells(),
            self.audit_write_failures(),
        );

        out
    }

    fn snapshot(&self) -> BTreeMap<Key, Series> {
        let Ok(series) = self.series.lock() else {
            return BTreeMap::new();
        };
        series
            .iter()
            .map(|(key, value)| {
                (
                    key.clone(),
                    Series {
                        count: value.count,
                        sum: value.sum,
                        buckets: value.buckets,
                    },
                )
            })
            .collect()
    }
}

/// Warehouse figures rendered alongside the process counters.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct IngestGauges {
    pub batches: i64,
    pub rows_rejected: i64,
    pub rows_upserted: i64,
    /// Seconds since the newest succeeded batch; `-1` when there is none.
    pub last_success_age_seconds: i64,
}

impl Default for IngestGauges {
    fn default() -> Self {
        Self {
            batches: 0,
            rows_rejected: 0,
            rows_upserted: 0,
            last_success_age_seconds: -1,
        }
    }
}

/// Escape a label value per the exposition format: backslash, quote, newline.
fn escape(value: &str) -> String {
    value
        .replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn contours_are_derived_from_the_matched_path() {
        assert_eq!(contour_of("/api/public/summary"), "public");
        assert_eq!(contour_of("/api/internal/summary"), "internal");
        assert_eq!(contour_of("/api/admin/settings"), "admin");
        assert_eq!(contour_of("/api/auth/me"), "auth");
        assert_eq!(contour_of("/readyz"), "ops");
    }

    #[test]
    fn a_histogram_is_cumulative_and_carries_every_series() {
        let metrics = Metrics::new();
        metrics.observe_request("/api/public/summary", 200, 0.03);
        metrics.observe_request("/api/public/summary", 200, 0.4);
        metrics.observe_request("/api/public/summary", 422, 0.001);
        metrics.add_screened_cells(7);
        metrics.record_audit_write_failure();

        let rendered = metrics.render(&IngestGauges::default());
        assert!(
            rendered.contains(
                "http_requests_total{contour=\"public\",route=\"/api/public/summary\",status=\"2xx\"} 2"
            ),
            "{rendered}"
        );
        assert!(
            rendered.contains(
                "http_requests_total{contour=\"public\",route=\"/api/public/summary\",status=\"4xx\"} 1"
            ),
            "{rendered}"
        );
        // 0.001 and 0.03 are ≤ 0.05; 0.4 is not.
        assert!(
            rendered.contains(
                "http_request_duration_seconds_bucket{contour=\"public\",route=\"/api/public/summary\",le=\"0.05\"} 2"
            ),
            "{rendered}"
        );
        assert!(
            rendered.contains(
                "http_request_duration_seconds_bucket{contour=\"public\",route=\"/api/public/summary\",le=\"+Inf\"} 3"
            ),
            "{rendered}"
        );
        assert!(
            rendered.contains("suppression_screened_cells_total 7"),
            "{rendered}"
        );
        assert!(
            rendered.contains("audit_write_failures_total 1"),
            "{rendered}"
        );
        assert!(
            rendered.contains("ingest_last_success_age_seconds -1"),
            "a warehouse that was never fed reports -1, not 0: {rendered}"
        );
    }

    #[test]
    fn every_declared_metric_carries_help_and_type() {
        let rendered = Metrics::new().render(&IngestGauges::default());
        // All eight of ADR-014 §8 - an exposition that quietly drops one is a
        // dashboard that quietly stops alerting.
        for name in [
            "http_requests_total",
            "http_request_duration_seconds",
            "ingest_batches_total",
            "ingest_rows_rejected_total",
            "ingest_rows_upserted_total",
            "ingest_last_success_age_seconds",
            "suppression_screened_cells_total",
            "audit_write_failures_total",
        ] {
            assert!(rendered.contains(&format!("# HELP {name} ")), "{name}");
            assert!(rendered.contains(&format!("# TYPE {name} ")), "{name}");
        }
    }

    #[test]
    fn label_values_are_escaped() {
        assert_eq!(escape("a\"b\\c"), "a\\\"b\\\\c");
    }
}
