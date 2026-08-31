//! Reporting periods: the quick picks of TZ §4.3 resolved to concrete,
//! inclusive date ranges.
//!
//! Semester boundaries are pinned by ADR-008 §8 (autumn 01.09–31.01, spring
//! 01.02–31.08 with summer folded into spring) and are runtime-editable via
//! `settings.semester_boundaries`, so every resolver takes a
//! [`SemesterBoundaries`] value rather than hard-coding the defaults.
//!
//! The academic year itself is **not** configurable: it is Sep 1 – Aug 31 by
//! definition (ADR-008 §8) and is materialized in `checks.academic_year`.

use std::fmt;
use std::str::FromStr;

use jiff::Span;
use jiff::civil::Date;
use serde::de::Error as _;
use serde::{Deserialize, Deserializer, Serialize, Serializer};

use crate::AcademicYear;

/// September 1 - the fixed start of an academic year.
const ACADEMIC_YEAR_START_MONTH: i8 = 9;
const ACADEMIC_YEAR_START_DAY: i8 = 1;
const ACADEMIC_YEAR_END_MONTH: i8 = 8;
const ACADEMIC_YEAR_END_DAY: i8 = 31;

/// A non-leap year used to validate month/day pairs, so that every
/// [`MonthDay`] is a real calendar date in *every* year.
const VALIDATION_YEAR: i16 = 2023;

#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
pub enum PeriodError {
    #[error("period start must not be after its end")]
    InvertedRange,
    #[error("date arithmetic left the supported calendar range")]
    OutOfCalendarRange,
    #[error("the spring boundary must fall earlier in the calendar year than the autumn boundary")]
    InvalidSemesterBoundaries,
    #[error("a boundary must be a MM-DD calendar day that exists in every year")]
    InvalidMonthDay,
}

/// A month/day pair that exists in every calendar year (so, never Feb 29).
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct MonthDay {
    month: i8,
    day: i8,
}

impl MonthDay {
    pub fn new(month: i8, day: i8) -> Result<Self, PeriodError> {
        Date::new(VALIDATION_YEAR, month, day)
            .map(|_| Self { month, day })
            .map_err(|_| PeriodError::InvalidMonthDay)
    }

    #[must_use]
    pub const fn month(self) -> i8 {
        self.month
    }

    #[must_use]
    pub const fn day(self) -> i8 {
        self.day
    }

    /// Place this month/day in `year`. Only fails outside jiff's calendar range.
    pub fn in_year(self, year: i16) -> Result<Date, PeriodError> {
        Date::new(year, self.month, self.day).map_err(|_| PeriodError::OutOfCalendarRange)
    }
}

impl fmt::Display for MonthDay {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:02}-{:02}", self.month, self.day)
    }
}

impl FromStr for MonthDay {
    type Err = PeriodError;

    /// Parses the `settings.semester_boundaries` wire form `"MM-DD"`.
    fn from_str(value: &str) -> Result<Self, Self::Err> {
        let (month, day) = value.split_once('-').ok_or(PeriodError::InvalidMonthDay)?;
        let month: i8 = month.parse().map_err(|_| PeriodError::InvalidMonthDay)?;
        let day: i8 = day.parse().map_err(|_| PeriodError::InvalidMonthDay)?;
        Self::new(month, day)
    }
}

impl Serialize for MonthDay {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.collect_str(self)
    }
}

impl<'de> Deserialize<'de> for MonthDay {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        let raw = String::deserialize(deserializer)?;
        raw.parse().map_err(D::Error::custom)
    }
}

/// The two semesters of an academic year.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Semester {
    Autumn,
    Spring,
}

/// Runtime-editable semester boundaries (`settings.semester_boundaries`).
///
/// The invariant `spring_start < autumn_start` (as calendar days) is what makes
/// the two semesters tile the year exactly: autumn runs from `autumn_start` to
/// the day before the next `spring_start`, spring from `spring_start` to the
/// day before that year's `autumn_start`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub struct SemesterBoundaries {
    autumn_start: MonthDay,
    spring_start: MonthDay,
}

impl SemesterBoundaries {
    pub fn new(autumn_start: MonthDay, spring_start: MonthDay) -> Result<Self, PeriodError> {
        if spring_start >= autumn_start {
            return Err(PeriodError::InvalidSemesterBoundaries);
        }
        Ok(Self {
            autumn_start,
            spring_start,
        })
    }

    #[must_use]
    pub const fn autumn_start(self) -> MonthDay {
        self.autumn_start
    }

    #[must_use]
    pub const fn spring_start(self) -> MonthDay {
        self.spring_start
    }

    /// The semester containing `date`, and its inclusive range.
    pub fn semester_of(self, date: Date) -> Result<(Semester, Period), PeriodError> {
        let year = date.year();
        let autumn = self.autumn_start.in_year(year)?;
        let spring = self.spring_start.in_year(year)?;

        if date >= autumn {
            let end = day_before(self.spring_start.in_year(year + 1)?)?;
            Ok((Semester::Autumn, Period::new(autumn, end)?))
        } else if date >= spring {
            let end = day_before(autumn)?;
            Ok((Semester::Spring, Period::new(spring, end)?))
        } else {
            let start = self.autumn_start.in_year(year - 1)?;
            let end = day_before(spring)?;
            Ok((Semester::Autumn, Period::new(start, end)?))
        }
    }
}

impl Default for SemesterBoundaries {
    /// ADR-008 §8: autumn 01.09, spring 01.02.
    fn default() -> Self {
        Self {
            autumn_start: MonthDay {
                month: ACADEMIC_YEAR_START_MONTH,
                day: ACADEMIC_YEAR_START_DAY,
            },
            spring_start: MonthDay { month: 2, day: 1 },
        }
    }
}

impl<'de> Deserialize<'de> for SemesterBoundaries {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        #[derive(Deserialize)]
        #[serde(deny_unknown_fields)]
        struct Raw {
            autumn_start: MonthDay,
            spring_start: MonthDay,
        }

        let raw = Raw::deserialize(deserializer)?;
        Self::new(raw.autumn_start, raw.spring_start).map_err(D::Error::custom)
    }
}

fn day_before(date: Date) -> Result<Date, PeriodError> {
    date.yesterday()
        .map_err(|_| PeriodError::OutOfCalendarRange)
}

/// An inclusive date range. Both ends are days, not instants: the db lane
/// widens them to `[from 00:00, to+1 day 00:00)` in the university time zone.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
pub struct Period {
    from: Date,
    to: Date,
}

impl Period {
    pub fn new(from: Date, to: Date) -> Result<Self, PeriodError> {
        if from > to {
            return Err(PeriodError::InvertedRange);
        }
        Ok(Self { from, to })
    }

    #[must_use]
    pub const fn start(self) -> Date {
        self.from
    }

    #[must_use]
    pub const fn end(self) -> Date {
        self.to
    }

    #[must_use]
    pub fn contains(self, date: Date) -> bool {
        self.from <= date && date <= self.to
    }

    /// Academic year of the period start - the YoY alignment key.
    #[must_use]
    pub fn academic_year(self) -> AcademicYear {
        AcademicYear::from_date(self.from)
    }

    /// Whether this range covers whole calendar months only.
    ///
    /// Every preset except `custom` resolves to a month-aligned range, and the
    /// public contour snaps every request to one ([`Self::snap_to_months`],
    /// ADR-016 §1), so this is the ordinary case rather than the exception.
    #[must_use]
    pub fn is_month_aligned(self) -> bool {
        self.from == self.from.first_of_month() && self.to == self.to.last_of_month()
    }

    /// Widen to whole months: `from` down to the 1st of its month, `to` up to
    /// the last day of its month (ADR-016 §1).
    ///
    /// Infallible: `from <= to` implies `first_of_month(from) <=
    /// last_of_month(to)`, and neither operation can leave the calendar range
    /// of a date that is already in it.
    #[must_use]
    pub fn snap_to_months(self) -> Self {
        Self {
            from: self.from.first_of_month(),
            to: self.to.last_of_month(),
        }
    }

    /// Shift both ends by whole years.
    ///
    /// A **month-aligned** range shifts to the same calendar months, keeping
    /// their *true* lengths: Feb 1 – Feb 28 2025 shifted back a year is
    /// Feb 1 – Feb **29** 2024, not Feb 1 – Feb 28. Comparing a 28-day February
    /// against a 29-day one is the whole point of «год к году»; dropping the
    /// leap day would silently understate the earlier period by one day.
    ///
    /// A range that is **not** month-aligned (only an internal custom range can
    /// be one, since the public contour snaps) shifts endpoint by endpoint with
    /// Feb 29 clamped to Feb 28, because there is no other date that both
    /// exists in every year and preserves the range's length.
    pub fn shift_years(self, years: i16) -> Result<Self, PeriodError> {
        if self.is_month_aligned() {
            let from = shift_month_start(self.from, years)?;
            let to = shift_month_start(self.to.first_of_month(), years)?.last_of_month();
            return Self::new(from, to);
        }
        let span = Span::new()
            .try_years(years)
            .map_err(|_| PeriodError::OutOfCalendarRange)?;
        let from = self
            .from
            .checked_add(span)
            .map_err(|_| PeriodError::OutOfCalendarRange)?;
        let to = self
            .to
            .checked_add(span)
            .map_err(|_| PeriodError::OutOfCalendarRange)?;
        Self::new(from, to)
    }

    /// The same period one year earlier - the comparison range of TZ §4.2 §9.
    pub fn previous_year(self) -> Result<Self, PeriodError> {
        self.shift_years(-1)
    }
}

/// The first day of `day`'s month, `years` years away.
fn shift_month_start(day: Date, years: i16) -> Result<Date, PeriodError> {
    let year = day
        .year()
        .checked_add(years)
        .ok_or(PeriodError::OutOfCalendarRange)?;
    Date::new(year, day.month(), 1).map_err(|_| PeriodError::OutOfCalendarRange)
}

/// Quick period picks of TZ §4.3.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "preset", rename_all = "snake_case")]
pub enum PeriodPreset {
    /// The calendar month containing the reference date.
    Month,
    /// The semester containing the reference date (ADR-008 §8).
    Semester,
    /// Sep 1 – Aug 31 of the academic year containing the reference date.
    AcademicYear,
    /// The reference academic year and the two preceding ones.
    ThreeYears,
    /// The reference academic year and the four preceding ones.
    FiveYears,
    /// An arbitrary inclusive range supplied by the caller.
    Custom { from: Date, to: Date },
}

impl PeriodPreset {
    /// Resolve to a concrete inclusive range, relative to `reference`.
    pub fn resolve(
        self,
        reference: Date,
        boundaries: SemesterBoundaries,
    ) -> Result<Period, PeriodError> {
        match self {
            Self::Month => Period::new(reference.first_of_month(), reference.last_of_month()),
            Self::Semester => boundaries.semester_of(reference).map(|(_, period)| period),
            Self::AcademicYear => academic_year_span(reference, 0),
            Self::ThreeYears => academic_year_span(reference, 2),
            Self::FiveYears => academic_year_span(reference, 4),
            Self::Custom { from, to } => Period::new(from, to),
        }
    }
}

/// `preceding` academic years back from the one containing `reference`,
/// through the end of the reference academic year.
fn academic_year_span(reference: Date, preceding: i16) -> Result<Period, PeriodError> {
    let AcademicYear(year) = AcademicYear::from_date(reference);
    let start_year = year
        .checked_sub(preceding)
        .ok_or(PeriodError::OutOfCalendarRange)?;
    let end_year = year.checked_add(1).ok_or(PeriodError::OutOfCalendarRange)?;
    let from = Date::new(
        start_year,
        ACADEMIC_YEAR_START_MONTH,
        ACADEMIC_YEAR_START_DAY,
    )
    .map_err(|_| PeriodError::OutOfCalendarRange)?;
    let to = Date::new(end_year, ACADEMIC_YEAR_END_MONTH, ACADEMIC_YEAR_END_DAY)
        .map_err(|_| PeriodError::OutOfCalendarRange)?;
    Period::new(from, to)
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    fn date(year: i16, month: i8, day: i8) -> Date {
        Date::new(year, month, day).expect("test date is a valid calendar day")
    }

    /// Any calendar day in a range wide enough to cover the 5-year presets.
    fn any_date() -> impl Strategy<Value = Date> {
        (2005_i16..2100, 1_i8..=12, 1_i8..=31)
            .prop_filter_map("valid calendar day", |(y, m, d)| Date::new(y, m, d).ok())
    }

    /// Any range of whole calendar months - the shape every preset and every
    /// public request resolves to. Deliberately generates *every* month, so
    /// February and the leap boundary are hit rather than hoped for.
    fn any_month_aligned_period() -> impl Strategy<Value = Period> {
        (2005_i16..2090, 1_i8..=12, 0_i32..40).prop_filter_map(
            "valid whole-month range",
            |(year, month, extra_months)| {
                let from = Date::new(year, month, 1).ok()?;
                let to = from
                    .checked_add(Span::new().months(extra_months))
                    .ok()?
                    .last_of_month();
                Period::new(from, to).ok()
            },
        )
    }

    /// Whole months covered by a month-aligned range.
    fn month_span(period: Period) -> i32 {
        i32::from(period.end().year() - period.start().year()) * 12
            + i32::from(period.end().month() - period.start().month())
            + 1
    }

    #[test]
    fn default_boundaries_match_adr_008() {
        let boundaries = SemesterBoundaries::default();
        assert_eq!(boundaries.autumn_start().to_string(), "09-01");
        assert_eq!(boundaries.spring_start().to_string(), "02-01");
    }

    #[test]
    fn boundaries_deserialize_from_settings_json() {
        let parsed: SemesterBoundaries =
            serde_json::from_str(r#"{"autumn_start":"09-01","spring_start":"02-01"}"#)
                .expect("pinned settings default parses");
        assert_eq!(parsed, SemesterBoundaries::default());
    }

    #[test]
    fn boundaries_reject_a_non_tiling_configuration() {
        let september = MonthDay::new(9, 1).expect("valid month-day");
        let october = MonthDay::new(10, 1).expect("valid month-day");
        assert_eq!(
            SemesterBoundaries::new(september, october),
            Err(PeriodError::InvalidSemesterBoundaries)
        );
        assert!(
            serde_json::from_str::<SemesterBoundaries>(
                r#"{"autumn_start":"09-01","spring_start":"10-01"}"#
            )
            .is_err()
        );
    }

    #[test]
    fn month_day_rejects_days_missing_from_some_years() {
        assert!(MonthDay::new(2, 29).is_err());
        assert!(MonthDay::new(2, 28).is_ok());
        assert!("13-01".parse::<MonthDay>().is_err());
        assert!("09".parse::<MonthDay>().is_err());
    }

    #[test]
    fn presets_resolve_to_the_pinned_ranges() {
        let boundaries = SemesterBoundaries::default();
        let reference = date(2026, 2, 15);

        assert_eq!(
            PeriodPreset::Month.resolve(reference, boundaries),
            Period::new(date(2026, 2, 1), date(2026, 2, 28))
        );
        assert_eq!(
            PeriodPreset::Semester.resolve(reference, boundaries),
            Period::new(date(2026, 2, 1), date(2026, 8, 31))
        );
        assert_eq!(
            PeriodPreset::AcademicYear.resolve(reference, boundaries),
            Period::new(date(2025, 9, 1), date(2026, 8, 31))
        );
        assert_eq!(
            PeriodPreset::ThreeYears.resolve(reference, boundaries),
            Period::new(date(2023, 9, 1), date(2026, 8, 31))
        );
        assert_eq!(
            PeriodPreset::FiveYears.resolve(reference, boundaries),
            Period::new(date(2021, 9, 1), date(2026, 8, 31))
        );
        assert_eq!(
            PeriodPreset::Custom {
                from: date(2024, 1, 2),
                to: date(2024, 3, 4),
            }
            .resolve(reference, boundaries),
            Period::new(date(2024, 1, 2), date(2024, 3, 4))
        );
    }

    #[test]
    fn autumn_semester_spans_the_new_year() {
        let boundaries = SemesterBoundaries::default();
        let (semester, period) = boundaries
            .semester_of(date(2026, 1, 20))
            .expect("january is inside the autumn semester");
        assert_eq!(semester, Semester::Autumn);
        assert_eq!(period.start(), date(2025, 9, 1));
        assert_eq!(period.end(), date(2026, 1, 31));
    }

    /// ADR-016 §1: the public contour widens every request to whole months.
    #[test]
    fn snapping_widens_a_ragged_range_to_whole_months() {
        let snapped = Period::new(date(2025, 10, 15), date(2025, 11, 14))
            .expect("ordered")
            .snap_to_months();
        assert_eq!(snapped.start(), date(2025, 10, 1));
        assert_eq!(snapped.end(), date(2025, 11, 30));
        assert!(snapped.is_month_aligned());

        // February, both ways round.
        let leap = Period::new(date(2024, 2, 10), date(2024, 2, 20))
            .expect("ordered")
            .snap_to_months();
        assert_eq!(
            (leap.start(), leap.end()),
            (date(2024, 2, 1), date(2024, 2, 29))
        );

        // Already aligned ranges are fixed points.
        let aligned = Period::new(date(2025, 9, 1), date(2026, 8, 31)).expect("ordered");
        assert_eq!(aligned.snap_to_months(), aligned);
    }

    /// The leap-year defect: a month-aligned period keeps whole months, so the
    /// comparison window carries February's *true* length in its own year.
    #[test]
    fn a_month_aligned_previous_year_keeps_the_true_month_lengths() {
        let february_2025 = Period::new(date(2025, 2, 1), date(2025, 2, 28)).expect("ordered");
        let previous = february_2025.previous_year().expect("in range");
        assert_eq!(previous.start(), date(2024, 2, 1));
        assert_eq!(
            previous.end(),
            date(2024, 2, 29),
            "February 2024 has 29 days; the comparison window must too"
        );

        // And back the other way: a leap February compares against a 28-day one.
        let february_2024 = Period::new(date(2024, 2, 1), date(2024, 2, 29)).expect("ordered");
        let previous = february_2024.previous_year().expect("in range");
        assert_eq!(
            (previous.start(), previous.end()),
            (date(2023, 2, 1), date(2023, 2, 28))
        );

        // A range ending in February but starting earlier behaves the same.
        let winter = Period::new(date(2024, 12, 1), date(2025, 2, 28)).expect("ordered");
        let previous = winter.previous_year().expect("in range");
        assert_eq!(
            (previous.start(), previous.end()),
            (date(2023, 12, 1), date(2024, 2, 29))
        );
    }

    /// A ragged range (internal contour only) shifts endpoint by endpoint, with
    /// Feb 29 clamped to Feb 28 - there is no other date that exists in every
    /// year.
    #[test]
    fn a_ragged_previous_year_clamps_february_29() {
        let leap_day = Period::new(date(2024, 2, 29), date(2024, 3, 15)).expect("ordered");
        assert!(!leap_day.is_month_aligned());
        let previous = leap_day.previous_year().expect("in range");
        assert_eq!(
            (previous.start(), previous.end()),
            (date(2023, 2, 28), date(2023, 3, 15))
        );
    }

    #[test]
    fn custom_period_rejects_an_inverted_range() {
        assert_eq!(
            PeriodPreset::Custom {
                from: date(2026, 3, 1),
                to: date(2026, 2, 1),
            }
            .resolve(date(2026, 3, 1), SemesterBoundaries::default()),
            Err(PeriodError::InvertedRange)
        );
    }

    proptest! {
        /// The two semesters tile the calendar: every day belongs to exactly one
        /// semester, and adjacent semesters meet with no gap and no overlap.
        #[test]
        fn semesters_tile_the_calendar(reference in any_date()) {
            let boundaries = SemesterBoundaries::default();
            let (semester, period) = boundaries
                .semester_of(reference)
                .expect("bounded dates stay in range");
            prop_assert!(period.contains(reference));

            let next_day = period.end().tomorrow().expect("bounded dates stay in range");
            let (next_semester, next_period) = boundaries
                .semester_of(next_day)
                .expect("bounded dates stay in range");
            prop_assert_ne!(semester, next_semester);
            prop_assert_eq!(next_period.start(), next_day);

            let previous_day = period.start().yesterday().expect("bounded dates stay in range");
            let (previous_semester, previous_period) = boundaries
                .semester_of(previous_day)
                .expect("bounded dates stay in range");
            prop_assert_ne!(semester, previous_semester);
            prop_assert_eq!(previous_period.end(), previous_day);
        }

        /// A resolved period is never inverted, whichever preset produced it.
        #[test]
        fn resolved_periods_are_ordered(
            reference in any_date(),
            preset in prop_oneof![
                Just(PeriodPreset::Month),
                Just(PeriodPreset::Semester),
                Just(PeriodPreset::AcademicYear),
                Just(PeriodPreset::ThreeYears),
                Just(PeriodPreset::FiveYears),
            ],
        ) {
            let period = preset
                .resolve(reference, SemesterBoundaries::default())
                .expect("bounded dates stay in range");
            prop_assert!(period.start() <= period.end());
            prop_assert!(period.contains(reference));
        }

        /// YoY alignment: shifting a resolved academic-year or semester period
        /// back one year yields exactly the period one year earlier would have
        /// resolved to. This is what makes «год к году» comparable.
        #[test]
        fn year_over_year_alignment(reference in any_date()) {
            let boundaries = SemesterBoundaries::default();
            let previous_reference = reference
                .checked_add(Span::new().years(-1))
                .expect("bounded dates stay in range");

            for preset in [PeriodPreset::AcademicYear, PeriodPreset::Semester] {
                let shifted = preset
                    .resolve(reference, boundaries)
                    .expect("bounded dates stay in range")
                    .previous_year()
                    .expect("bounded dates stay in range");
                let resolved = preset
                    .resolve(previous_reference, boundaries)
                    .expect("bounded dates stay in range");
                prop_assert_eq!(shifted, resolved);
            }
        }

        /// A whole-month range shifted by whole years stays whole months, keeps
        /// its month count, and lands on the same calendar months - including
        /// across every February. The pre-ADR-016 implementation added a
        /// `jiff` year span to both endpoints, which turned Feb 1 – Feb 28 2025
        /// into Feb 1 – Feb 28 2024 and lost the leap day.
        #[test]
        fn month_aligned_shifts_stay_month_aligned(
            period in any_month_aligned_period(),
            years in -5_i16..=5,
        ) {
            let shifted = period.shift_years(years).expect("bounded dates stay in range");
            prop_assert!(shifted.is_month_aligned());
            prop_assert_eq!(shifted.start().month(), period.start().month());
            prop_assert_eq!(shifted.end().month(), period.end().month());
            prop_assert_eq!(shifted.start().year(), period.start().year() + years);
            prop_assert_eq!(shifted.start().day(), 1);
            prop_assert_eq!(shifted.end(), shifted.end().last_of_month());
            prop_assert_eq!(month_span(shifted), month_span(period));
            // Round trip: shifting back recovers the original range exactly,
            // leap day included.
            prop_assert_eq!(
                shifted.shift_years(-years).expect("bounded dates stay in range"),
                period
            );
        }

        /// Snapping widens to whole months, never narrows, and is idempotent.
        #[test]
        fn snapping_widens_to_whole_months(first in any_date(), second in any_date()) {
            let (from, to) = if first <= second { (first, second) } else { (second, first) };
            let period = Period::new(from, to).expect("ordered by construction");
            let snapped = period.snap_to_months();

            prop_assert!(snapped.is_month_aligned());
            prop_assert!(snapped.start() <= period.start());
            prop_assert!(snapped.end() >= period.end());
            prop_assert!(snapped.contains(period.start()));
            prop_assert!(snapped.contains(period.end()));
            prop_assert_eq!(snapped.snap_to_months(), snapped);
            // Snapping only ever adds days from the two boundary months.
            prop_assert_eq!(snapped.start(), period.start().first_of_month());
            prop_assert_eq!(snapped.end(), period.end().last_of_month());
        }

        /// The academic year of a resolved academic-year period is the academic
        /// year of its reference date - the join key for `checks.academic_year`.
        #[test]
        fn academic_year_period_keeps_its_key(reference in any_date()) {
            let period = PeriodPreset::AcademicYear
                .resolve(reference, SemesterBoundaries::default())
                .expect("bounded dates stay in range");
            prop_assert_eq!(period.academic_year(), AcademicYear::from_date(reference));
            prop_assert_eq!(
                period.previous_year().expect("bounded dates stay in range").academic_year(),
                AcademicYear(AcademicYear::from_date(reference).0 - 1)
            );
        }
    }
}
