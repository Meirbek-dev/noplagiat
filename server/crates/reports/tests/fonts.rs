//! Font coverage - the mitigation for risk **R4** in docs/PLAN.md §6 («Kazakh
//! glyphs missing from the PDF font»).
//!
//! The committed `.ttf` files are parsed directly here, so the gate fails on the
//! *asset*, not on a rendered artefact: a font swap that drops `ә` is caught in
//! this file long before anyone looks at a PDF.

use std::path::{Path, PathBuf};

/// The nine Kazakh-specific Cyrillic letters and their capitals. Missing any one
/// of them shows as a tofu box in every Kazakh report.
const KAZAKH: [char; 18] = [
    'ә', 'ғ', 'қ', 'ң', 'ө', 'ұ', 'ү', 'һ', 'і', 'Ә', 'Ғ', 'Қ', 'Ң', 'Ө', 'Ұ', 'Ү', 'Һ', 'І',
];

fn assets() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("assets/fonts")
}

fn faces() -> Vec<(String, Vec<u8>)> {
    ["NotoSans-Regular.ttf", "NotoSans-Bold.ttf"]
        .into_iter()
        .map(|name| {
            let path = assets().join(name);
            let data =
                std::fs::read(&path).unwrap_or_else(|error| panic!("{}: {error}", path.display()));
            (name.to_owned(), data)
        })
        .collect()
}

#[test]
fn the_bundled_family_is_ofl_licensed() {
    let license = assets().join("OFL.txt");
    let text = std::fs::read_to_string(&license).expect("OFL.txt is committed next to the fonts");
    assert!(
        text.contains("SIL Open Font License, Version 1.1"),
        "the bundled licence must be the OFL text itself, not a pointer to it"
    );
}

#[test]
fn every_face_has_a_glyph_for_every_kazakh_letter() {
    for (name, data) in faces() {
        let face = ttf_parser::Face::parse(&data, 0)
            .unwrap_or_else(|error| panic!("{name} does not parse: {error}"));
        for character in KAZAKH {
            let glyph = face.glyph_index(character);
            assert!(
                glyph.is_some_and(|id| id.0 != 0),
                "{name} has no glyph for `{character}` (U+{:04X})",
                u32::from(character)
            );
        }
    }
}

/// Coverage of the alphabet is not the same as coverage of the strings we print:
/// a punctuation mark or a Latin letter inside a Kazakh phrase would still be a
/// tofu box. So every character of every phrase in every locale is checked.
#[test]
fn every_character_of_every_locale_table_has_a_glyph() {
    for (name, data) in faces() {
        let face = ttf_parser::Face::parse(&data, 0)
            .unwrap_or_else(|error| panic!("{name} does not parse: {error}"));
        for locale in reports::Locale::ALL {
            for phrase in locale.strings().all() {
                for character in phrase.chars() {
                    // Placeholders never reach the page; the substituted value is
                    // digits, separators and dictionary codes, all covered below.
                    if character == '{' || character == '}' {
                        continue;
                    }
                    assert!(
                        face.glyph_index(character).is_some_and(|id| id.0 != 0),
                        "{name} has no glyph for `{character}` (U+{:04X}) of {locale:?} phrase \
                         `{phrase}`",
                        u32::from(character)
                    );
                }
            }
        }

        // The characters number formatting introduces: digits, both decimal
        // separators, the grouping separators, the percent sign, and the en dash
        // of an academic-year label.
        for character in "0123456789.,\u{a0}%\u{2013}-/:".chars() {
            assert!(
                face.glyph_index(character).is_some_and(|id| id.0 != 0),
                "{name} has no glyph for the formatting character U+{:04X}",
                u32::from(character)
            );
        }
    }
}
