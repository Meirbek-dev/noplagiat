//! Snapshot immutability (TZ §4.5 «неизменяемые снимки», docs/PLAN.md W4.1).
//!
//! The warehouse is deliberately left empty here: what is under test is the
//! write-once path and the `report_snapshots` bookkeeping, not the figures -
//! those are pinned in `annual_tables.rs`, and loading 60 000 fact rows a second
//! time would only make this file slow.

mod support;

use std::path::{Path, PathBuf};

use compliance::KPolicy;
use db::Pool;
use domain::AcademicYear;
use reports::{Locale, SnapshotKind, SnapshotRequest, generate_snapshot};
use sqlx::PgPool;

fn scratch(name: &str) -> PathBuf {
    let root =
        std::env::temp_dir().join(format!("noplagiat-reports-{}-{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&root);
    root
}

fn sha256_of(path: &Path) -> String {
    use sha2::{Digest as _, Sha256};
    let bytes = std::fs::read(path).unwrap_or_else(|error| panic!("{}: {error}", path.display()));
    Sha256::digest(&bytes)
        .into_iter()
        .fold(String::new(), |mut out, byte| {
            use std::fmt::Write as _;
            let _ = write!(out, "{byte:02x}");
            out
        })
}

#[sqlx::test(migrations = "../../migrations")]
async fn regenerating_a_period_never_overwrites_the_published_snapshot(
    pool: PgPool,
) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let out_dir = scratch("immutability");
    let request = SnapshotRequest::annual(
        AcademicYear(2025),
        Locale::Ru,
        KPolicy::default(),
        // The *same* instant for both runs: even then the second run must not
        // land on the first one's directory.
        "2026-09-01T03:00:00Z"
            .parse()
            .expect("the pinned timestamp parses"),
    )
    .expect("the academic year is a valid period");

    let first = generate_snapshot(&pool, &request, &out_dir)
        .await
        .expect("the first snapshot");
    assert!(first.pdf_path.exists() && first.xlsx_path.exists());
    assert_eq!(first.directory.parent(), Some(out_dir.as_path()));

    // The content hash is recorded in the file name, because `report_snapshots`
    // has no hash column and this lane does not own a migration.
    for (path, digest) in [
        (&first.pdf_path, &first.pdf_sha256),
        (&first.xlsx_path, &first.xlsx_sha256),
    ] {
        assert_eq!(&sha256_of(path), digest, "{}", path.display());
        let name = path
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or_default();
        assert!(
            name.contains(&digest[..16]),
            "{name} must carry the content hash"
        );
    }

    let before = std::fs::read(&first.pdf_path).expect("the first PDF is readable");

    let second = generate_snapshot(&pool, &request, &out_dir)
        .await
        .expect("the second snapshot");
    assert_ne!(
        first.directory, second.directory,
        "a regeneration must get its own directory"
    );
    assert_ne!(first.id, second.id, "a regeneration must get its own row");
    assert!(
        first.pdf_path.exists(),
        "the first snapshot must survive the second"
    );
    assert_eq!(
        std::fs::read(&first.pdf_path).expect("the first PDF is still readable"),
        before,
        "the first snapshot's bytes must be untouched"
    );

    // Determinism carries through: identical input, identical content hash.
    assert_eq!(first.pdf_sha256, second.pdf_sha256);
    assert_eq!(first.xlsx_sha256, second.xlsx_sha256);

    // ── the database side ───────────────────────────────────────────────────
    let rows = db::snapshots::list(&pool, false, 10, 0)
        .await
        .expect("the snapshot list");
    assert_eq!(rows.len(), 2, "one row per generation, never an update");
    for row in &rows {
        assert_eq!(row.kind, SnapshotKind::Annual.as_str());
        assert!(!row.published, "publication is a separate admin act");
        let pdf = row.pdf_path.as_deref().expect("a PDF path was recorded");
        assert!(
            out_dir.join(pdf).exists(),
            "the recorded path `{pdf}` must resolve under the output directory"
        );
    }
    let recorded: Vec<&str> = rows
        .iter()
        .filter_map(|row| row.pdf_path.as_deref())
        .collect();
    assert_ne!(recorded[0], recorded[1], "the two rows must differ");

    let _ = std::fs::remove_dir_all(&out_dir);
    Ok(())
}

/// A manual snapshot covers an arbitrary period and may be marked for internal
/// use (TZ §4.4/§4.5).
#[sqlx::test(migrations = "../../migrations")]
async fn a_manual_snapshot_covers_an_arbitrary_period(pool: PgPool) -> sqlx::Result<()> {
    let pool = Pool::for_tests(pool);
    let out_dir = scratch("manual");
    let request = SnapshotRequest {
        period: domain::Period::new(
            jiff::civil::date(2025, 11, 1),
            jiff::civil::date(2025, 11, 30),
        )
        .expect("an ordered period"),
        kind: SnapshotKind::Manual,
        locale: Locale::Kk,
        policy: KPolicy::default(),
        generated_at: "2025-12-01T00:00:00Z".parse().expect("timestamp"),
        options: reports::RenderOptions::internal(),
    };

    let record = generate_snapshot(&pool, &request, &out_dir)
        .await
        .expect("the manual snapshot");
    let name = record
        .pdf_path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or_default();
    assert!(name.starts_with("manual-2025-11-01_2025-11-30-"), "{name}");

    let rows = db::snapshots::list(&pool, false, 10, 0)
        .await
        .expect("the snapshot list");
    assert_eq!(rows.len(), 1);
    assert_eq!(rows[0].kind, SnapshotKind::Manual.as_str());

    let _ = std::fs::remove_dir_all(&out_dir);
    Ok(())
}
