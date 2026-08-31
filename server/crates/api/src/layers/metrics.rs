//! Request timing for `/metrics` (ARCHITECTURE.md §8).
//!
//! Mounted once, outermost, so every contour is measured with one set of
//! labels and a route that forgets the layer cannot exist.
//!
//! The label is the **matched route** - `/api/internal/summary`, not the
//! request URI - so filter values never become label values and a scraping loop
//! cannot grow the series set. Requests that match no route are folded into a
//! single `unmatched` series for the same reason.

use std::time::Instant;

use axum::extract::{MatchedPath, Request, State};
use axum::middleware::Next;
use axum::response::Response;

use crate::state::AppState;

/// Label used for a request that matched no route.
const UNMATCHED: &str = "unmatched";

pub async fn record(State(state): State<AppState>, request: Request, next: Next) -> Response {
    let started = Instant::now();
    let response = next.run(request).await;
    // Read after the handler: `MatchedPath` is inserted by the router as the
    // request descends, so it is only there on the way out.
    let route = response
        .extensions()
        .get::<MatchedPath>()
        .map_or(UNMATCHED, |matched| matched.as_str())
        .to_owned();
    state.metrics.observe_request(
        &route,
        response.status().as_u16(),
        started.elapsed().as_secs_f64(),
    );
    response
}

/// Carry the matched path into the response so the layer above can label the
/// observation with it.
pub async fn tag_route(request: Request, next: Next) -> Response {
    let matched = request.extensions().get::<MatchedPath>().cloned();
    let mut response = next.run(request).await;
    if let Some(matched) = matched {
        response.extensions_mut().insert(matched);
    }
    response
}
