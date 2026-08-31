//! `norm(s)` - the single normalization used by every derivation rule.
//!
//! ADR-008 §2: Unicode NFC → trim → collapse internal whitespace runs to a
//! single space → lowercase. The whole attempt-grouping and work-type story
//! rides on this being byte-identical to `fixtures/rules.ts::norm`, which is a
//! second, independent implementation of the same three lines.

use unicode_normalization::UnicodeNormalization;

/// Normalize a source string for hashing and rule matching.
///
/// The input is plaintext read out of the export; the output is used only as
/// HMAC input or as a rule-matching subject and is dropped in the same scope.
#[must_use]
pub fn norm(value: &str) -> String {
    let composed: String = value.nfc().collect();
    let mut out = String::with_capacity(composed.len());
    for (index, word) in composed.split_whitespace().enumerate() {
        if index > 0 {
            out.push(' ');
        }
        out.push_str(word);
    }
    out.to_lowercase()
}

/// «Да» → true, anything else (including empty and «Нет») → false,
/// case-insensitive and trimmed (ADR-008 §1).
#[must_use]
pub fn parse_yes(value: &str) -> bool {
    norm(value) == "да"
}

/// Masked reviewer label for `staff_units` (ADR-008 §2): first character of the
/// local part + `***` + its last 4 characters (just first + `***` when the
/// local part is shorter than 6) + `@` + the full domain.
///
/// The only human-readable artefact ingest ever produces, and it is masked by
/// construction so an administrator can maintain the mapping without the
/// warehouse holding a staff directory.
#[must_use]
pub fn masked_label(email: &str) -> String {
    let (local, domain) = match email.rfind('@') {
        Some(at) => (&email[..at], &email[at + 1..]),
        None => (email, ""),
    };
    let head: String = local.chars().take(1).collect();
    let masked = if local.chars().count() < 6 {
        format!("{head}***")
    } else {
        let tail: String = {
            let chars: Vec<char> = local.chars().collect();
            chars[chars.len() - 4..].iter().collect()
        };
        format!("{head}***{tail}")
    };
    format!("{masked}@{domain}")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normalization_matches_the_adr_008_definition() {
        assert_eq!(norm("  Дипломная   Работа\n№12 "), "дипломная работа №12");
        assert_eq!(norm("ABC"), "abc");
        assert_eq!(norm(""), "");
        assert_eq!(norm("   "), "");
        // Tabs and non-breaking runs collapse to exactly one space.
        assert_eq!(norm("a\t\t b"), "a b");
    }

    #[test]
    fn nfc_composition_happens_before_lowercasing() {
        // U+0418 U+0306 (И + combining breve) composes to Й, then lowercases.
        let decomposed = "\u{0418}\u{0306}";
        assert_eq!(norm(decomposed), "й");
        assert_eq!(norm("Й"), norm(decomposed));
    }

    #[test]
    fn yes_is_the_only_true_value() {
        assert!(parse_yes("Да"));
        assert!(parse_yes(" да "));
        assert!(parse_yes("ДА"));
        assert!(!parse_yes("Нет"));
        assert!(!parse_yes(""));
        assert!(!parse_yes("Yes"));
    }

    #[test]
    fn masked_labels_follow_adr_008_section_2() {
        assert_eq!(
            masked_label("zaripov.vn@teachers.tou.edu.kz"),
            "z***v.vn@teachers.tou.edu.kz"
        );
        // Short local parts keep no tail at all.
        assert_eq!(masked_label("abc@tou.edu.kz"), "a***@tou.edu.kz");
        assert_eq!(masked_label("abcde@tou.edu.kz"), "a***@tou.edu.kz");
        assert_eq!(masked_label("abcdef@tou.edu.kz"), "a***cdef@tou.edu.kz");
        // Multi-byte local parts are sliced by character, never by byte.
        assert_eq!(masked_label("ұлықбек@tou.edu.kz"), "ұ***қбек@tou.edu.kz");
    }
}
