//! The two brand colours of TZ §8, defined once for both renderers.
//!
//! `apps/web/src/styles/tokens.css` holds the same two values for the browser;
//! these are the server-side copies used by the XLSX and PDF templates. There is
//! no third place: every fill, rule and accent in this crate resolves to one of
//! the constants below.

/// Тёмно-синий - the primary brand colour (TZ §8).
pub const NAVY_RGB: u32 = 0x1D_3D_66;

/// Оранжевый - the accent colour (TZ §8).
pub const ORANGE_RGB: u32 = 0xDE_6E_35;

/// Table header text, and the paper the report is printed on.
pub const WHITE_RGB: u32 = 0xFF_FF_FF;

/// Footnote and secondary-text grey. Contrast against white is 5.7:1, above the
/// WCAG AA 4.5:1 floor TZ §8 sets for text.
pub const MUTED_RGB: u32 = 0x5A_63_6E;

/// Zebra fill for the body rows of a table, derived from [`NAVY_RGB`] at ~4 %.
pub const ROW_TINT_RGB: u32 = 0xF2_F5_F9;

/// Rule between table rows.
pub const HAIRLINE_RGB: u32 = 0xD6_DC_E4;

/// The brand colour as the `#rrggbb` literal both Typst and CSS understand.
#[must_use]
pub fn hex(rgb: u32) -> String {
    format!("#{rgb:06X}")
}

/// The organization, as it is written in the running header of every report and
/// in the first cell of every workbook.
///
/// It stays a *string* even now that Комплаенс has supplied the logo files
/// (D10): the PDF draws the emblem in its masthead - `assets/brand/` and
/// `pdf.rs` - while the running header and the XLSX name the organization in
/// text, which is what a reader searching or copying out of an export needs.
pub const ORGANIZATION_LOCKUP: &str = "Toraighyrov University";

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn brand_colours_render_as_the_tz_8_literals() {
        assert_eq!(hex(NAVY_RGB), "#1D3D66");
        assert_eq!(hex(ORANGE_RGB), "#DE6E35");
    }
}
