//! Fills the RFC 7807 `instance` member on every problem response.
//!
//! Keeping this in one layer means no call site - handler, extractor rejection,
//! guard, or router fallback - has to thread the request path through to the
//! place the error is built.

use axum::extract::Request;
use axum::http::header;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

use crate::error::{PROBLEM_CONTENT_TYPE, Problem};
use crate::layers::{buffer_body, rebuild};

pub async fn fill_instance(request: Request, next: Next) -> Response {
    let instance = request.uri().path().to_owned();
    let response = next.run(request).await;

    let is_problem = response
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .is_some_and(|value| value.starts_with(PROBLEM_CONTENT_TYPE));
    if !is_problem {
        return response;
    }

    let Ok((parts, body)) = buffer_body(response).await else {
        // A problem body that cannot even be buffered: emit the bare minimum
        // rather than recursing into the error path.
        return crate::error::ApiError::Internal("problem body could not be buffered")
            .into_response();
    };

    let Ok(mut problem) = serde_json::from_slice::<Problem>(&body) else {
        return rebuild(parts, body);
    };
    if problem.instance.is_none() {
        problem.instance = Some(instance);
    }
    match serde_json::to_vec(&problem) {
        Ok(rendered) => rebuild(parts, rendered.into()),
        Err(error) => {
            tracing::error!(%error, "problem document could not be re-serialized");
            rebuild(parts, body)
        }
    }
}
