//! Attempt grouping (ADR-008 §3) - deterministic and idempotent.
//!
//! Within one `work_ref`, order rows by `(checked_at, source_check_id)` and
//! number them from 1. The ordering is computed over the **union** of the rows
//! already in the warehouse for that work and the rows in the current batch, so
//! a work whose attempts arrive in different batches still gets one continuous
//! ladder, and re-running a file yields exactly the same
//! `(source_check_id, attempt_no)` pairs.
//!
//! Applies to the CSV backfill only: the new source system assigns
//! `attempt_no` itself (ADR-010 §3).

use std::collections::{BTreeMap, HashMap};

/// The identity of one attempt inside a work's ladder.
///
/// Deduplication is on `(checked_at, source_check_id)` rather than on
/// `source_check_id` alone because ~2 % of rechecked works in the legacy export
/// reuse one report link across their attempts (fixtures/README.md), so the
/// identifier alone is not unique within a work. The pair is: two attempts of
/// one work are never recorded at the same minute.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct AttemptKey {
    pub checked_at_nanos: i128,
    pub source_check_id: String,
}

impl AttemptKey {
    #[must_use]
    pub fn new(checked_at: jiff::Timestamp, source_check_id: &str) -> Self {
        Self::from_nanos(checked_at.as_nanosecond(), source_check_id)
    }

    /// Build from raw nanoseconds - how a row read back out of `TIMESTAMPTZ`
    /// enters the ladder without a lossy round-trip through a civil datetime.
    #[must_use]
    pub fn from_nanos(checked_at_nanos: i128, source_check_id: &str) -> Self {
        Self {
            checked_at_nanos,
            source_check_id: source_check_id.to_owned(),
        }
    }
}

/// 1-based ordinals over one work's attempt ladder.
///
/// `union` may contain duplicates in any order; the result is the same either
/// way, which is exactly the idempotency property W1.5 has to prove.
#[must_use]
pub fn assign_ordinals(union: impl IntoIterator<Item = AttemptKey>) -> HashMap<AttemptKey, u32> {
    let ordered: BTreeMap<AttemptKey, ()> = union.into_iter().map(|key| (key, ())).collect();
    ordered
        .into_keys()
        .enumerate()
        .map(|(index, key)| {
            // A ladder longer than u32::MAX cannot exist; saturating keeps the
            // function total without an unwrap (workspace lints deny it).
            let ordinal = u32::try_from(index)
                .unwrap_or(u32::MAX - 1)
                .saturating_add(1);
            (key, ordinal)
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn stamp(minutes: i64) -> jiff::Timestamp {
        jiff::Timestamp::from_second(1_700_000_000 + minutes * 60).unwrap()
    }

    fn key(minutes: i64, id: &str) -> AttemptKey {
        AttemptKey::new(stamp(minutes), id)
    }

    #[test]
    fn ordinals_follow_checked_at_then_source_check_id() {
        let ordinals = assign_ordinals([key(10, "b"), key(0, "z"), key(10, "a")]);
        assert_eq!(ordinals[&key(0, "z")], 1);
        assert_eq!(
            ordinals[&key(10, "a")],
            2,
            "the tie breaks on the identifier"
        );
        assert_eq!(ordinals[&key(10, "b")], 3);
    }

    #[test]
    fn input_order_does_not_change_the_result() {
        let forward = assign_ordinals([key(0, "a"), key(5, "b"), key(9, "c")]);
        let reversed = assign_ordinals([key(9, "c"), key(5, "b"), key(0, "a")]);
        assert_eq!(forward, reversed);
    }

    #[test]
    fn re_running_a_file_yields_identical_pairs() {
        // Run 1: three rows, nothing in the warehouse.
        let batch = [key(0, "u:1"), key(30, "u:2"), key(90, "u:3")];
        let first = assign_ordinals(batch.clone());
        // Run 2: the same three rows, now also present in the warehouse.
        let union: Vec<AttemptKey> = batch.iter().cloned().chain(batch.iter().cloned()).collect();
        let second = assign_ordinals(union);
        assert_eq!(first, second);
        assert_eq!(second[&key(90, "u:3")], 3);
    }

    #[test]
    fn a_shared_report_link_still_produces_two_attempts() {
        // ~2 % of rechecked works in the legacy export reuse one report link.
        let ordinals = assign_ordinals([key(0, "u:7"), key(4320, "u:7")]);
        assert_eq!(ordinals.len(), 2);
        assert_eq!(ordinals[&key(0, "u:7")], 1);
        assert_eq!(ordinals[&key(4320, "u:7")], 2);
    }

    #[test]
    fn a_later_batch_continues_the_ladder() {
        let existing = [key(0, "u:1")];
        let batch = [key(4320, "u:2")];
        let ordinals = assign_ordinals(existing.into_iter().chain(batch));
        assert_eq!(ordinals[&key(0, "u:1")], 1);
        assert_eq!(ordinals[&key(4320, "u:2")], 2);
    }

    #[test]
    fn a_late_arriving_earlier_attempt_renumbers_the_ladder() {
        // The warehouse holds one row; a later batch supplies an *earlier*
        // attempt of the same work. The stored row must move to ordinal 2 -
        // otherwise the work would carry two `attempt_no = 1` rows and the
        // recheck rate would be wrong.
        let existing = [key(4320, "u:2")];
        let batch = [key(0, "u:1")];
        let ordinals = assign_ordinals(existing.into_iter().chain(batch));
        assert_eq!(ordinals[&key(0, "u:1")], 1);
        assert_eq!(ordinals[&key(4320, "u:2")], 2);
    }

    #[test]
    fn an_exactly_duplicated_row_collapses_to_one_attempt() {
        let ordinals = assign_ordinals([key(0, "u:1"), key(0, "u:1")]);
        assert_eq!(ordinals.len(), 1);
        assert_eq!(ordinals[&key(0, "u:1")], 1);
    }
}
