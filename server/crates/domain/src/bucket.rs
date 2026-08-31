//! Originality histogram bands (TZ §4.2 §5, ADR-008 §8).
//!
//! Five lower-inclusive bands separated by four boundaries that come from
//! `settings.histogram_buckets` (default `[50, 70, 85, 95]`). "Lower-inclusive"
//! is the whole subtlety: a work at exactly 70.00 % belongs to `70–85`, never
//! to `50–70`. Both the SQL aggregate and the reports must agree on that, so
//! the rule lives here once.

use serde::de::Error as _;
use serde::{Deserialize, Deserializer, Serialize, Serializer};

use crate::OriginalityPct;

/// Percentages are compared in hundredths of a point (0..=10_000).
const MAX_HUNDREDTHS: u16 = 10_000;
const HUNDREDTHS_PER_PERCENT: u16 = 100;

#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
pub enum BucketError {
    #[error("histogram bucket boundaries must be strictly increasing")]
    NotIncreasing,
    #[error("histogram bucket boundaries must lie between 0.00 and 100.00")]
    OutOfRange,
}

/// One of the five originality bands.
///
/// The variant names are mnemonics for the pinned default boundaries and match
/// the `agg_monthly` column names (`b_lt50`, `b_50_70`, …). The *effective*
/// edges always come from [`BucketBoundaries`]; [`BucketBoundaries::labels`]
/// renders them.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub enum Bucket {
    #[serde(rename = "b_lt50")]
    Lt50,
    #[serde(rename = "b_50_70")]
    B50To70,
    #[serde(rename = "b_70_85")]
    B70To85,
    #[serde(rename = "b_85_95")]
    B85To95,
    #[serde(rename = "b_ge95")]
    Ge95,
}

impl Bucket {
    /// All five bands, lowest first.
    pub const ALL: [Self; 5] = [
        Self::Lt50,
        Self::B50To70,
        Self::B70To85,
        Self::B85To95,
        Self::Ge95,
    ];

    /// Classify an originality value expressed in hundredths of a percent.
    ///
    /// Lower-inclusive: a value equal to a boundary falls into the band
    /// *above* it.
    #[must_use]
    pub fn classify(originality_hundredths: u16, boundaries: &BucketBoundaries) -> Self {
        let edges = boundaries.edges_hundredths();
        let index = edges
            .iter()
            .filter(|edge| originality_hundredths >= **edge)
            .count();
        Self::ALL[index]
    }

    /// Position of this band, 0 (lowest) through 4 (highest).
    #[must_use]
    pub const fn index(self) -> usize {
        match self {
            Self::Lt50 => 0,
            Self::B50To70 => 1,
            Self::B70To85 => 2,
            Self::B85To95 => 3,
            Self::Ge95 => 4,
        }
    }
}

/// The four boundaries separating the five bands, in hundredths of a percent.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct BucketBoundaries([u16; 4]);

impl BucketBoundaries {
    /// The pinned defaults of ADR-008 §8, as whole percents.
    pub const DEFAULT_PERCENT: [u16; 4] = [50, 70, 85, 95];

    /// Build from whole percents - the `settings.histogram_buckets` wire form.
    pub fn from_percent(percent: [u16; 4]) -> Result<Self, BucketError> {
        let mut hundredths = [0_u16; 4];
        for (slot, value) in hundredths.iter_mut().zip(percent) {
            *slot = value
                .checked_mul(HUNDREDTHS_PER_PERCENT)
                .ok_or(BucketError::OutOfRange)?;
        }
        Self::from_hundredths(hundredths)
    }

    pub fn from_hundredths(hundredths: [u16; 4]) -> Result<Self, BucketError> {
        if hundredths.iter().any(|edge| *edge > MAX_HUNDREDTHS) {
            return Err(BucketError::OutOfRange);
        }
        if hundredths.windows(2).any(|pair| pair[0] >= pair[1]) {
            return Err(BucketError::NotIncreasing);
        }
        Ok(Self(hundredths))
    }

    #[must_use]
    pub const fn edges_hundredths(&self) -> [u16; 4] {
        self.0
    }

    /// Classify an originality value expressed in hundredths of a percent.
    #[must_use]
    pub fn classify(&self, originality_hundredths: u16) -> Bucket {
        Bucket::classify(originality_hundredths, self)
    }

    #[must_use]
    pub fn classify_pct(&self, originality: OriginalityPct) -> Bucket {
        self.classify(originality.hundredths())
    }

    /// Display labels for the five bands, lowest first: `<50`, `50–70`, …,
    /// `≥95`. Locale-independent - the UI prefixes/suffixes them.
    #[must_use]
    pub fn labels(&self) -> [String; 5] {
        let [a, b, c, d] = self.0.map(format_edge);
        [
            format!("<{a}"),
            format!("{a}–{b}"),
            format!("{b}–{c}"),
            format!("{c}–{d}"),
            format!("≥{d}"),
        ]
    }

    /// The label of a single band.
    #[must_use]
    pub fn label(&self, bucket: Bucket) -> String {
        let mut labels = self.labels();
        std::mem::take(&mut labels[bucket.index()])
    }
}

impl Default for BucketBoundaries {
    fn default() -> Self {
        Self(Self::DEFAULT_PERCENT.map(|percent| percent * HUNDREDTHS_PER_PERCENT))
    }
}

impl Serialize for BucketBoundaries {
    /// Serializes back to the `settings.histogram_buckets` form when the edges
    /// are whole percents, and to hundredths-precision decimals otherwise.
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        if self.0.iter().all(|edge| edge % HUNDREDTHS_PER_PERCENT == 0) {
            self.0
                .map(|edge| edge / HUNDREDTHS_PER_PERCENT)
                .serialize(serializer)
        } else {
            self.0
                .map(|edge| f64::from(edge) / f64::from(HUNDREDTHS_PER_PERCENT))
                .serialize(serializer)
        }
    }
}

impl<'de> Deserialize<'de> for BucketBoundaries {
    /// Reads `settings.histogram_buckets`, e.g. `[50, 70, 85, 95]`.
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        let percent = <[u16; 4]>::deserialize(deserializer)?;
        Self::from_percent(percent).map_err(D::Error::custom)
    }
}

fn format_edge(hundredths: u16) -> String {
    let whole = hundredths / HUNDREDTHS_PER_PERCENT;
    let fraction = hundredths % HUNDREDTHS_PER_PERCENT;
    if fraction == 0 {
        whole.to_string()
    } else {
        format!("{whole}.{fraction:02}")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    #[test]
    fn defaults_match_the_settings_seed() {
        let parsed: BucketBoundaries =
            serde_json::from_str("[50, 70, 85, 95]").expect("the seeded default parses");
        assert_eq!(parsed, BucketBoundaries::default());
        assert_eq!(
            serde_json::to_string(&parsed).expect("boundaries serialize"),
            "[50,70,85,95]"
        );
    }

    #[test]
    fn boundary_values_fall_into_the_upper_band() {
        let boundaries = BucketBoundaries::default();
        assert_eq!(boundaries.classify(4_999), Bucket::Lt50);
        assert_eq!(boundaries.classify(5_000), Bucket::B50To70);
        assert_eq!(boundaries.classify(6_999), Bucket::B50To70);
        assert_eq!(boundaries.classify(7_000), Bucket::B70To85);
        assert_eq!(boundaries.classify(8_499), Bucket::B70To85);
        assert_eq!(boundaries.classify(8_500), Bucket::B85To95);
        assert_eq!(boundaries.classify(9_499), Bucket::B85To95);
        assert_eq!(boundaries.classify(9_500), Bucket::Ge95);
        assert_eq!(boundaries.classify(10_000), Bucket::Ge95);
        assert_eq!(boundaries.classify(0), Bucket::Lt50);
    }

    #[test]
    fn labels_render_the_effective_edges() {
        assert_eq!(
            BucketBoundaries::default().labels(),
            ["<50", "50–70", "70–85", "85–95", "≥95"].map(String::from)
        );
        let custom = BucketBoundaries::from_hundredths([2_550, 5_000, 7_500, 9_950])
            .expect("strictly increasing edges");
        assert_eq!(custom.label(Bucket::Lt50), "<25.50");
        assert_eq!(custom.label(Bucket::Ge95), "≥99.50");
    }

    #[test]
    fn invalid_boundary_sets_are_rejected() {
        assert_eq!(
            BucketBoundaries::from_percent([50, 50, 85, 95]),
            Err(BucketError::NotIncreasing)
        );
        assert_eq!(
            BucketBoundaries::from_percent([50, 70, 95, 85]),
            Err(BucketError::NotIncreasing)
        );
        assert_eq!(
            BucketBoundaries::from_percent([50, 70, 85, 101]),
            Err(BucketError::OutOfRange)
        );
        assert!(serde_json::from_str::<BucketBoundaries>("[50, 70, 85]").is_err());
    }

    proptest! {
        /// Every boundary value itself classifies into the band above it, for
        /// any admissible boundary set - the edge case TZ §4.2 §5 turns on.
        #[test]
        fn edges_are_lower_inclusive(
            edges in prop::collection::btree_set(1_u16..=MAX_HUNDREDTHS, 4),
        ) {
            let mut iter = edges.into_iter();
            let edges = core::array::from_fn::<u16, 4, _>(|_| iter.next().unwrap_or_default());
            let boundaries = BucketBoundaries::from_hundredths(edges)
                .expect("a sorted set of four distinct in-range edges is admissible");

            for (index, edge) in edges.iter().enumerate() {
                prop_assert_eq!(boundaries.classify(*edge), Bucket::ALL[index + 1]);
                prop_assert_eq!(boundaries.classify(edge - 1), Bucket::ALL[index]);
            }
        }

        /// Classification is monotone: a higher originality never lands in a
        /// lower band.
        #[test]
        fn classification_is_monotone(a in 0_u16..=MAX_HUNDREDTHS, b in 0_u16..=MAX_HUNDREDTHS) {
            let boundaries = BucketBoundaries::default();
            let (low, high) = if a <= b { (a, b) } else { (b, a) };
            prop_assert!(boundaries.classify(low).index() <= boundaries.classify(high).index());
        }
    }
}
