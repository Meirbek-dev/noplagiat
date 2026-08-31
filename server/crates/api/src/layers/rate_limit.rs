//! Per-IP token bucket in front of the public contour (ARCHITECTURE.md §6,
//! ADR-012 §5).
//!
//! Hand-rolled rather than `tower_governor`: the whole control is one counter
//! per address behind a mutex, it needs no new dependency, and it has to be
//! deterministic in tests (a clock-free `check_at` is the reason
//! `governor`'s quota API was awkward here).

use std::collections::HashMap;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::sync::{Mutex, PoisonError};
use std::time::{Duration, Instant};

use axum::extract::{ConnectInfo, Request, State};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

use crate::error::ApiError;
use crate::state::AppState;

/// Bucket size and refill rate.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct RateLimitConfig {
    /// Requests one address may make back to back.
    pub burst: u32,
    /// Sustained rate, in requests per minute.
    pub per_minute: u32,
}

impl Default for RateLimitConfig {
    /// Generous by design: the public contour is `Cache-Control: public,
    /// max-age=3600`, so a legitimate portal visitor issues one request per
    /// section per hour. The limit exists to blunt scraping, not to shape
    /// normal traffic.
    fn default() -> Self {
        Self {
            burst: 120,
            per_minute: 600,
        }
    }
}

/// Addresses tracked before the table is swept. A sweep is O(n) and only runs
/// when the table grows past this, so steady-state cost is one hash lookup.
const SWEEP_THRESHOLD: usize = 8192;

#[derive(Debug, Clone, Copy)]
struct Bucket {
    tokens: f64,
    last_seen: Instant,
}

/// Token buckets keyed by client address.
#[derive(Debug)]
pub struct RateLimiter {
    config: RateLimitConfig,
    buckets: Mutex<HashMap<IpAddr, Bucket>>,
}

impl RateLimiter {
    #[must_use]
    pub fn new(config: RateLimitConfig) -> Self {
        Self {
            config,
            buckets: Mutex::new(HashMap::new()),
        }
    }

    #[must_use]
    pub fn config(&self) -> RateLimitConfig {
        self.config
    }

    /// Consume one token for `client`, or report the seconds until one is free.
    pub fn check(&self, client: IpAddr) -> Result<(), u64> {
        self.check_at(client, Instant::now())
    }

    /// [`Self::check`] with an injected clock, so the refill maths is testable
    /// without sleeping.
    pub fn check_at(&self, client: IpAddr, now: Instant) -> Result<(), u64> {
        let per_second = f64::from(self.config.per_minute) / 60.0;
        let capacity = f64::from(self.config.burst);

        let mut buckets = self.buckets.lock().unwrap_or_else(PoisonError::into_inner);
        if buckets.len() > SWEEP_THRESHOLD {
            let idle = Duration::from_secs(600);
            buckets.retain(|_, bucket| now.duration_since(bucket.last_seen) < idle);
        }

        let bucket = buckets.entry(client).or_insert(Bucket {
            tokens: capacity,
            last_seen: now,
        });
        let elapsed = now.duration_since(bucket.last_seen).as_secs_f64();
        bucket.tokens = (bucket.tokens + elapsed * per_second).min(capacity);
        bucket.last_seen = now;

        if bucket.tokens >= 1.0 {
            bucket.tokens -= 1.0;
            return Ok(());
        }
        let deficit = 1.0 - bucket.tokens;
        let seconds = if per_second > 0.0 {
            (deficit / per_second).ceil()
        } else {
            60.0
        };
        #[expect(
            clippy::cast_possible_truncation,
            clippy::cast_sign_loss,
            reason = "deficit < 1 token and per_second > 0 bound this to a small positive number"
        )]
        Err((seconds.max(1.0)) as u64)
    }
}

/// Client address: the gateway's `X-Forwarded-For` first hop when present,
/// otherwise the socket peer.
///
/// The deployment (ARCHITECTURE.md §8) puts nginx in front of this process and
/// keeps the Rust port private, so the forwarded header is as trustworthy as
/// the socket. A direct-to-process request has no such header and falls through
/// to the peer address.
pub fn client_address(request: &Request) -> IpAddr {
    let forwarded = request
        .headers()
        .get("x-forwarded-for")
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.split(',').next())
        .and_then(|value| value.trim().parse::<IpAddr>().ok());
    if let Some(address) = forwarded {
        return address;
    }
    if let Some(value) = request
        .headers()
        .get("x-real-ip")
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.trim().parse::<IpAddr>().ok())
    {
        return value;
    }
    request
        .extensions()
        .get::<ConnectInfo<SocketAddr>>()
        .map_or(IpAddr::V4(Ipv4Addr::UNSPECIFIED), |info| info.0.ip())
}

pub async fn limit(State(state): State<AppState>, request: Request, next: Next) -> Response {
    let client = client_address(&request);
    match state.rate_limiter.check(client) {
        Ok(()) => next.run(request).await,
        Err(retry_after_seconds) => {
            tracing::warn!(%client, "public rate limit exceeded");
            ApiError::TooManyRequests {
                retry_after_seconds,
            }
            .into_response()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_bucket_empties_and_refills_at_the_configured_rate() {
        let limiter = RateLimiter::new(RateLimitConfig {
            burst: 2,
            per_minute: 60,
        });
        let client = IpAddr::V4(Ipv4Addr::LOCALHOST);
        let start = Instant::now();

        assert_eq!(limiter.check_at(client, start), Ok(()));
        assert_eq!(limiter.check_at(client, start), Ok(()));
        assert_eq!(limiter.check_at(client, start), Err(1));

        // One token per second at 60/min.
        let later = start + Duration::from_secs(1);
        assert_eq!(limiter.check_at(client, later), Ok(()));
        assert_eq!(limiter.check_at(client, later), Err(1));
    }

    #[test]
    fn buckets_are_per_address() {
        let limiter = RateLimiter::new(RateLimitConfig {
            burst: 1,
            per_minute: 60,
        });
        let start = Instant::now();
        let first = IpAddr::V4(Ipv4Addr::new(10, 0, 0, 1));
        let second = IpAddr::V4(Ipv4Addr::new(10, 0, 0, 2));

        assert_eq!(limiter.check_at(first, start), Ok(()));
        assert_eq!(limiter.check_at(first, start), Err(1));
        assert_eq!(limiter.check_at(second, start), Ok(()));
    }
}
