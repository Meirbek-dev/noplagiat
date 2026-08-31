//! The three small tables Комплаенс maintains by hand (D11): Ethics Council
//! counters, source-system usage figures the export does not carry, and the
//! coverage denominators from the registrar.
//!
//! None of them is derived from `checks`, so none of them is scoped: they carry
//! no per-unit check data. The dashboard sections that *combine* them with
//! facts live in [`crate::q`] and take a [`compliance::Scope`] there.

use sqlx::types::time::Date;

use crate::{DbError, Pool};

/// Ethics Council registry (TZ §4.2 §7, ADR-008 §9). Aggregated counters only -
/// never a case file, never a person.
pub mod ethics {
    use super::{DbError, Pool};

    #[derive(Debug, Clone, PartialEq, Eq)]
    pub struct EthicsCase {
        pub id: i64,
        pub academic_year: i16,
        pub category: String,
        pub referred: i32,
        pub reviewed_closed: i32,
    }

    /// Cases for an inclusive academic-year range, ordered for display.
    pub async fn list(
        pool: &Pool,
        from_year: i16,
        to_year: i16,
    ) -> Result<Vec<EthicsCase>, DbError> {
        let rows = sqlx::query_as!(
            EthicsCase,
            "SELECT id, academic_year, category, referred, reviewed_closed
               FROM ethics_cases
              WHERE academic_year >= $1 AND academic_year <= $2
              ORDER BY academic_year, category",
            from_year,
            to_year,
        )
        .fetch_all(pool.pg())
        .await?;
        Ok(rows)
    }

    pub async fn insert(
        pool: &Pool,
        academic_year: i16,
        category: &str,
        referred: i32,
        reviewed_closed: i32,
    ) -> Result<i64, DbError> {
        let id = sqlx::query_scalar!(
            "INSERT INTO ethics_cases (academic_year, category, referred, reviewed_closed)
             VALUES ($1, $2, $3, $4) RETURNING id",
            academic_year,
            category,
            referred,
            reviewed_closed,
        )
        .fetch_one(pool.pg())
        .await?;
        Ok(id)
    }

    pub async fn update(
        pool: &Pool,
        id: i64,
        category: &str,
        referred: i32,
        reviewed_closed: i32,
    ) -> Result<u64, DbError> {
        let result = sqlx::query!(
            "UPDATE ethics_cases
                SET category = $2, referred = $3, reviewed_closed = $4
              WHERE id = $1",
            id,
            category,
            referred,
            reviewed_closed,
        )
        .execute(pool.pg())
        .await?;
        Ok(result.rows_affected())
    }

    pub async fn delete(pool: &Pool, id: i64) -> Result<u64, DbError> {
        let result = sqlx::query!("DELETE FROM ethics_cases WHERE id = $1", id)
            .execute(pool.pg())
            .await?;
        Ok(result.rows_affected())
    }
}

/// Manually entered source-system usage figures (TZ §4.2 §8).
///
/// `avg_check_seconds` has no source in the vendor export; where no row exists
/// the UI shows «нет данных» rather than a zero (ADR-008 §9).
pub mod usage_stats {
    use super::{Date, DbError, Pool};

    #[derive(Debug, Clone, PartialEq, Eq)]
    pub struct UsageStat {
        pub period_month: Date,
        pub active_users: i32,
        pub avg_check_seconds: Option<i32>,
    }

    pub async fn list(pool: &Pool, from: Date, to: Date) -> Result<Vec<UsageStat>, DbError> {
        let rows = sqlx::query_as!(
            UsageStat,
            "SELECT period_month, active_users, avg_check_seconds
               FROM usage_stats
              WHERE period_month >= $1 AND period_month <= $2
              ORDER BY period_month",
            from,
            to,
        )
        .fetch_all(pool.pg())
        .await?;
        Ok(rows)
    }

    /// Idempotent on `period_month`.
    pub async fn upsert(
        pool: &Pool,
        period_month: Date,
        active_users: i32,
        avg_check_seconds: Option<i32>,
    ) -> Result<(), DbError> {
        sqlx::query!(
            "INSERT INTO usage_stats (period_month, active_users, avg_check_seconds)
             VALUES ($1, $2, $3)
             ON CONFLICT (period_month) DO UPDATE
                 SET active_users = EXCLUDED.active_users,
                     avg_check_seconds = EXCLUDED.avg_check_seconds",
            period_month,
            active_users,
            avg_check_seconds,
        )
        .execute(pool.pg())
        .await?;
        Ok(())
    }

    pub async fn delete(pool: &Pool, period_month: Date) -> Result<u64, DbError> {
        let result = sqlx::query!(
            "DELETE FROM usage_stats WHERE period_month = $1",
            period_month
        )
        .execute(pool.pg())
        .await?;
        Ok(result.rows_affected())
    }
}

/// Coverage denominators (TZ §4.2 §1). Coverage is hidden entirely when these
/// are absent - never estimated (ADR-008 §9).
pub mod submission_totals {
    use super::{DbError, Pool};

    #[derive(Debug, Clone, PartialEq, Eq)]
    pub struct SubmissionTotal {
        pub academic_year: i16,
        pub work_type_code: String,
        pub total_submitted: i32,
    }

    pub async fn list(
        pool: &Pool,
        from_year: i16,
        to_year: i16,
    ) -> Result<Vec<SubmissionTotal>, DbError> {
        let rows = sqlx::query_as!(
            SubmissionTotal,
            "SELECT st.academic_year, wt.code AS work_type_code, st.total_submitted
               FROM submission_totals st
               JOIN work_types wt ON wt.id = st.work_type_id
              WHERE st.academic_year >= $1 AND st.academic_year <= $2
              ORDER BY st.academic_year, wt.code",
            from_year,
            to_year,
        )
        .fetch_all(pool.pg())
        .await?;
        Ok(rows)
    }

    /// Idempotent on `(academic_year, work_type_id)`; the work type is resolved
    /// by code in SQL, so an unknown code inserts nothing rather than guessing.
    pub async fn upsert(
        pool: &Pool,
        academic_year: i16,
        work_type_code: &str,
        total_submitted: i32,
    ) -> Result<u64, DbError> {
        let result = sqlx::query!(
            "INSERT INTO submission_totals (academic_year, work_type_id, total_submitted)
             SELECT $1, wt.id, $3 FROM work_types wt WHERE wt.code = $2
             ON CONFLICT (academic_year, work_type_id) DO UPDATE
                 SET total_submitted = EXCLUDED.total_submitted",
            academic_year,
            work_type_code,
            total_submitted,
        )
        .execute(pool.pg())
        .await?;
        Ok(result.rows_affected())
    }

    pub async fn delete(
        pool: &Pool,
        academic_year: i16,
        work_type_code: &str,
    ) -> Result<u64, DbError> {
        let result = sqlx::query!(
            "DELETE FROM submission_totals st
              USING work_types wt
              WHERE wt.id = st.work_type_id
                AND st.academic_year = $1
                AND wt.code = $2",
            academic_year,
            work_type_code,
        )
        .execute(pool.pg())
        .await?;
        Ok(result.rows_affected())
    }
}
