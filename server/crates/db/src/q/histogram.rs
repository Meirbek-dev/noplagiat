//! TZ §4.2 §5 - the originality histogram.
//!
//! Bands are lower-inclusive (`domain::Bucket`): a work at exactly 70.00 %
//! belongs to `70–85`, never to `50–70`.

use compliance::Scope;
use domain::{BucketBoundaries, Filters};

use super::{agg_query, fact_query};
use crate::{DbError, Pool};

/// The five band counts, lowest first. **Pre-suppression** - see the
/// [module docs](super).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct HistogramRow {
    pub lt50: i64,
    pub b50_70: i64,
    pub b70_85: i64,
    pub b85_95: i64,
    pub ge95: i64,
}

impl HistogramRow {
    /// The five counts in `domain::Bucket::ALL` order.
    #[must_use]
    pub fn counts(&self) -> [i64; 5] {
        [self.lt50, self.b50_70, self.b70_85, self.b85_95, self.ge95]
    }

    #[must_use]
    pub fn total(&self) -> i64 {
        self.counts().iter().sum()
    }
}

/// Band counts under the currently configured boundaries.
pub async fn histogram(
    pool: &Pool,
    filters: &Filters,
    scope: Scope,
) -> Result<HistogramRow, DbError> {
    let boundaries = crate::settings::histogram_buckets(pool).await?;
    let binds = super::binds(pool, filters, scope).await?;

    // `agg_monthly` carries one FILTER column per ADR-008 §8 default band. When
    // an administrator moves an edge those columns answer a different question,
    // so the only exact source is the fact table. This is the documented
    // exception (b) of ARCHITECTURE.md §3.3.
    if boundaries != BucketBoundaries::default() {
        let [first, second, third, fourth] = boundaries.edges_hundredths().map(edge_text);
        let row = fact_query!(
            r#"SELECT count(*) FILTER (WHERE f.originality_pct < $12::text::numeric)
                          AS "lt50!",
                      count(*) FILTER (WHERE f.originality_pct >= $12::text::numeric
                                         AND f.originality_pct < $13::text::numeric)
                          AS "b50_70!",
                      count(*) FILTER (WHERE f.originality_pct >= $13::text::numeric
                                         AND f.originality_pct < $14::text::numeric)
                          AS "b70_85!",
                      count(*) FILTER (WHERE f.originality_pct >= $14::text::numeric
                                         AND f.originality_pct < $15::text::numeric)
                          AS "b85_95!",
                      count(*) FILTER (WHERE f.originality_pct >= $15::text::numeric)
                          AS "ge95!"
                 FROM fact_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) f"#,
            binds,
            first.as_str(),
            second.as_str(),
            third.as_str(),
            fourth.as_str(),
        )
        .fetch_one(pool.pg())
        .await?;

        return Ok(HistogramRow {
            lt50: row.lt50,
            b50_70: row.b50_70,
            b70_85: row.b70_85,
            b85_95: row.b85_95,
            ge95: row.ge95,
        });
    }

    let row = agg_query!(
        r#"SELECT coalesce(sum(c.b_lt50), 0)::bigint  AS "lt50!",
                  coalesce(sum(c.b_50_70), 0)::bigint AS "b50_70!",
                  coalesce(sum(c.b_70_85), 0)::bigint AS "b70_85!",
                  coalesce(sum(c.b_85_95), 0)::bigint AS "b85_95!",
                  coalesce(sum(c.b_ge95), 0)::bigint  AS "ge95!"
             FROM agg_cells($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) c"#,
        binds
    )
    .fetch_one(pool.pg())
    .await?;

    Ok(HistogramRow {
        lt50: row.lt50,
        b50_70: row.b50_70,
        b70_85: row.b70_85,
        b85_95: row.b85_95,
        ge95: row.ge95,
    })
}

/// Hundredths of a percent rendered as the exact decimal PostgreSQL parses into
/// `NUMERIC(5,2)`. Going through text rather than `f64` keeps a boundary such
/// as 70.00 exactly on the edge, which is the whole point of a lower-inclusive
/// band.
pub(crate) fn edge_text(hundredths: u16) -> String {
    format!("{}.{:02}", hundredths / 100, hundredths % 100)
}

#[cfg(test)]
mod tests {
    use super::edge_text;

    #[test]
    fn edges_render_as_exact_two_decimal_literals() {
        assert_eq!(edge_text(7_000), "70.00");
        assert_eq!(edge_text(9_950), "99.50");
        assert_eq!(edge_text(0), "0.00");
        assert_eq!(edge_text(10_000), "100.00");
    }
}
