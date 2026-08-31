//! HMAC derivation of `work_ref` / `reviewer_ref` (ADR-008 §2).
//!
//! The pepper is env-only (`APP_INGEST_PEPPER`): never in the database, never
//! in Git, never logged. [`Pepper`]'s `Debug` is redacted and it has no
//! accessor that yields the secret, so it cannot leak through a `{:?}` in a
//! tracing field.
//!
//! The plaintext title, authors and reviewer e-mail enter this module and leave
//! only as 32-byte digests; callers drop them in the same scope.

use domain::{REF_LEN, ReviewerRef, WorkRef};
use hmac::{Hmac, KeyInit, Mac};
use sha2::Sha256;

use crate::error::ConfigError;
use crate::norm::norm;

/// Environment variable holding the server-side pepper (ADR-008 §2).
pub const PEPPER_ENV: &str = "APP_INGEST_PEPPER";

type HmacSha256 = Hmac<Sha256>;

/// The server-side HMAC pepper. Required in CSV mode; unused in API mode,
/// where the source supplies `attempt_no` and the unit natively (ADR-010 §4).
#[derive(Clone)]
pub struct Pepper(Vec<u8>);

impl Pepper {
    /// Build from a secret. Rejects an empty pepper: an "HMAC" keyed with
    /// nothing is a plain hash of the title, which is a dictionary attack away
    /// from being reversible.
    pub fn new(secret: &str) -> Result<Self, ConfigError> {
        if secret.is_empty() {
            return Err(ConfigError::PepperEmpty);
        }
        Ok(Self(secret.as_bytes().to_vec()))
    }

    /// Read `APP_INGEST_PEPPER`. Fails fast - an ingest that silently ran
    /// without the pepper would write references nothing else can reproduce.
    pub fn from_env() -> Result<Self, ConfigError> {
        let secret = std::env::var(PEPPER_ENV).map_err(|_| ConfigError::PepperMissing)?;
        Self::new(secret.trim_end_matches(['\r', '\n']))
    }

    /// `APP_INGEST_PEPPER` if set, otherwise `None`. Used by the scheduler,
    /// which may legitimately run API-only sources on a host with no pepper.
    pub fn from_env_optional() -> Result<Option<Self>, ConfigError> {
        match std::env::var(PEPPER_ENV) {
            Err(_) => Ok(None),
            Ok(secret) => Self::new(secret.trim_end_matches(['\r', '\n'])).map(Some),
        }
    }

    fn digest(&self, domain_separator: &str, parts: &[&str]) -> [u8; REF_LEN] {
        // `new_from_slice` only fails for key sizes HMAC cannot take; HMAC
        // accepts any key length, so this branch is unreachable - but the code
        // must still be total (no unwrap/expect: workspace lints deny both).
        let mut mac = match HmacSha256::new_from_slice(&self.0) {
            Ok(mac) => mac,
            Err(_) => return [0_u8; REF_LEN],
        };
        mac.update(domain_separator.as_bytes());
        for part in parts {
            mac.update(b"\n");
            mac.update(part.as_bytes());
        }
        mac.finalize().into_bytes().0
    }

    /// `HMAC-SHA256(pepper, "work\n" ++ norm(title) ++ "\n" ++ norm(authors))`.
    #[must_use]
    pub fn work_ref(&self, title: &str, authors: &str) -> WorkRef {
        WorkRef::from_bytes(self.digest("work", &[&norm(title), &norm(authors)]))
    }

    /// `HMAC-SHA256(pepper, "reviewer\n" ++ norm(email))`.
    #[must_use]
    pub fn reviewer_ref(&self, email: &str) -> ReviewerRef {
        ReviewerRef::from_bytes(self.digest("reviewer", &[&norm(email)]))
    }
}

impl std::fmt::Debug for Pepper {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("Pepper(<redacted>)")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Known-answer test against an independent implementation: the value below
    /// is what `node:crypto`'s `createHmac("sha256", pepper).update(...)`
    /// produces in `fixtures/seed.ts`, which is how `staff_units.email_hmac` is
    /// filled. If these two ever disagree, every unit attribution silently
    /// becomes «Не распределено».
    #[test]
    fn reviewer_ref_matches_the_fixture_seeder() {
        let pepper = Pepper::new("dev-pepper").unwrap();
        let digest = pepper.reviewer_ref("n.balgulov@teachers.tou.edu.kz");
        let hex: String = digest
            .as_bytes()
            .iter()
            .map(|b| format!("{b:02x}"))
            .collect();
        assert_eq!(
            hex, "366ba5686cfe8b73522660a4e70e1255a3de1c8ab962ec39dde835c4f609252e",
            "HMAC-SHA256(\"dev-pepper\", \"reviewer\\n\" ++ norm(email))"
        );
    }

    /// The same known-answer pinning for `work_ref`, whose two-field payload is
    /// where an off-by-one separator would hide.
    #[test]
    fn work_ref_matches_an_independent_implementation() {
        let pepper = Pepper::new("p").unwrap();
        let digest = pepper.work_ref("Дипломная работа", "Иванов И.И.");
        let hex: String = digest
            .as_bytes()
            .iter()
            .map(|b| format!("{b:02x}"))
            .collect();
        assert_eq!(
            hex, "c1049fbdfbcdd1e52c4772d2e79926fe16cb32a0d67a967ea2cb72ed2f428088",
            "HMAC-SHA256(\"p\", \"work\\n\" ++ norm(title) ++ \"\\n\" ++ norm(authors))"
        );
    }

    #[test]
    fn derivation_is_deterministic_and_normalization_sensitive() {
        let pepper = Pepper::new("p").unwrap();
        assert_eq!(
            pepper.work_ref("Дипломная работа", "Иванов И.И."),
            pepper.work_ref("  дипломная   РАБОТА ", "иванов и.и.")
        );
        assert_ne!(
            pepper.work_ref("a", "b"),
            pepper.work_ref("b", "a"),
            "the \\n separator must keep the two fields distinguishable"
        );
    }

    #[test]
    fn work_and_reviewer_domains_are_separated() {
        let pepper = Pepper::new("p").unwrap();
        // Same trailing payload, different domain separator: the digests must
        // differ, otherwise a title could collide with an e-mail.
        assert_ne!(
            pepper.work_ref("x", "").as_bytes(),
            pepper.reviewer_ref("x").as_bytes()
        );
    }

    #[test]
    fn a_different_pepper_yields_a_different_reference() {
        assert_ne!(
            Pepper::new("one").unwrap().work_ref("t", "a"),
            Pepper::new("two").unwrap().work_ref("t", "a")
        );
    }

    #[test]
    fn an_empty_pepper_is_refused() {
        assert!(matches!(Pepper::new(""), Err(ConfigError::PepperEmpty)));
    }

    #[test]
    fn debug_never_prints_the_secret() {
        let pepper = Pepper::new("super-secret-value").unwrap();
        let rendered = format!("{pepper:?}");
        assert_eq!(rendered, "Pepper(<redacted>)");
        assert!(!rendered.contains("super-secret"));
    }
}
