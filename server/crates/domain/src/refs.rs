//! Derived, non-reversible references to a work and to a reviewer.
//!
//! Both are HMAC-SHA256 digests computed inside the ingest parser with a
//! server-side pepper (ADR-008 §2). The plaintext title, authors, reviewer name
//! and e-mail are dropped in the same function and never persisted or logged.
//!
//! These types are structurally incapable of holding text: the only
//! constructors take raw bytes, there is no `String`/`&str` constructor, no
//! `FromStr`, and no `Serialize` - a reference can never reach a response body.
//! `Debug` is redacted so a digest cannot be copied out of a log line.

use std::fmt;

use crate::ValidationError;

/// Byte length of an HMAC-SHA256 digest.
pub const REF_LEN: usize = 32;

/// Hex characters kept in redacted `Debug` output.
const DEBUG_HEX_CHARS: usize = 8;

macro_rules! digest_ref {
    ($name:ident, $field:literal, $doc:literal) => {
        #[doc = $doc]
        ///
        /// ```compile_fail
        /// // A reference must never be constructible from text.
        #[doc = concat!("let _ = domain::", stringify!($name), "::from_bytes(\"a string\");")]
        /// ```
        ///
        /// ```compile_fail
        /// // A reference must never be serializable into a response.
        #[doc = concat!("let r = domain::", stringify!($name), "::from_bytes([0_u8; 32]);")]
        /// let _ = serde_json::to_string(&r);
        /// ```
        #[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
        pub struct $name([u8; REF_LEN]);

        impl $name {
            /// The only constructor: exactly [`REF_LEN`] raw digest bytes.
            #[must_use]
            pub const fn from_bytes(bytes: [u8; REF_LEN]) -> Self {
                Self(bytes)
            }

            /// Read a digest back from a `BYTEA` column.
            pub fn try_from_slice(bytes: &[u8]) -> Result<Self, ValidationError> {
                <[u8; REF_LEN]>::try_from(bytes)
                    .map(Self)
                    .map_err(|_| ValidationError::RefLength { field: $field })
            }

            #[must_use]
            pub const fn as_bytes(&self) -> &[u8; REF_LEN] {
                &self.0
            }

            /// Owned bytes for binding to a `BYTEA` parameter.
            #[must_use]
            pub fn to_vec(self) -> Vec<u8> {
                self.0.to_vec()
            }
        }

        // Redacted: at most `DEBUG_HEX_CHARS` hex characters ever printed, so a
        // log line can distinguish two references without disclosing one.
        impl fmt::Debug for $name {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                write!(f, concat!(stringify!($name), "("))?;
                for byte in &self.0[..DEBUG_HEX_CHARS / 2] {
                    write!(f, "{byte:02x}")?;
                }
                write!(f, "…)")
            }
        }
    };
}

digest_ref!(
    WorkRef,
    "work_ref",
    "Opaque reference to a checked work: `HMAC-SHA256(pepper, \"work\\n\" ++ norm(title) ++ \"\\n\" ++ norm(authors))`."
);
digest_ref!(
    ReviewerRef,
    "reviewer_ref",
    "Opaque reference to a reviewer: `HMAC-SHA256(pepper, \"reviewer\\n\" ++ norm(email))`."
);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn debug_output_is_redacted() {
        let work = WorkRef::from_bytes([0xab; REF_LEN]);
        let reviewer = ReviewerRef::from_bytes([0x01; REF_LEN]);
        assert_eq!(format!("{work:?}"), "WorkRef(abababab…)");
        assert_eq!(format!("{reviewer:?}"), "ReviewerRef(01010101…)");
        // Never more than DEBUG_HEX_CHARS hex characters of the digest.
        assert!(format!("{work:?}").matches("ab").count() == DEBUG_HEX_CHARS / 2);
    }

    #[test]
    fn slice_constructor_enforces_digest_length() {
        assert!(WorkRef::try_from_slice(&[0_u8; REF_LEN]).is_ok());
        assert_eq!(
            WorkRef::try_from_slice(&[0_u8; 31]),
            Err(ValidationError::RefLength { field: "work_ref" })
        );
        assert_eq!(
            ReviewerRef::try_from_slice(&[]),
            Err(ValidationError::RefLength {
                field: "reviewer_ref"
            })
        );
    }

    #[test]
    fn round_trips_through_bytes() {
        let bytes = core::array::from_fn::<u8, REF_LEN, _>(|i| i as u8);
        let reference = WorkRef::from_bytes(bytes);
        assert_eq!(reference.as_bytes(), &bytes);
        assert_eq!(reference.to_vec(), bytes.to_vec());
        assert_eq!(WorkRef::try_from_slice(&reference.to_vec()), Ok(reference));
    }
}
