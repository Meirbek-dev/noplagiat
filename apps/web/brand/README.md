# Brand masters - Toraighyrov University

The four files here are the originals supplied by the Комплаенс service on
31.08.2026, closing **D10** (`docs/REQUESTS.md`). They are the source of truth
and are _not_ served: they sit outside `public/` on purpose, so nothing can link
a 1772 × 1772 master into a page by accident.

| File                         | Composition       | Ink   |
| ---------------------------- | ----------------- | ----- |
| `tou-logo-primary.png`       | emblem + wordmark | navy  |
| `tou-logo-primary-white.png` | emblem + wordmark | white |
| `tou-logo-emblem.png`        | emblem alone      | navy  |
| `tou-logo-emblem-white.png`  | emblem alone      | white |

Each master is a 1772 × 1772 canvas with the mark centred in transparent
padding. The bounding boxes of the ink are `1517 × 501` (primary, at 127, 668)
and `717 × 1140` (emblem, at 527, 348) - identical between the navy and white
files, which are the same shape in two inks.

The typeface is **Inter** (SIL OFL 1.1), the second half of D10; it ships with
the app through `@fontsource-variable/inter` and is declared in `--font-sans`
(`src/styles/globals.css`). ТЗ §8 allows «Arial/аналог», which is the fallback
in that same stack.

## Derived assets

Everything under `public/brand/` is generated from the two navy masters. The
marks are monochrome, so the ink is re-applied after resampling from the brand
constants in `src/styles/tokens.css` rather than resampled from the file -
resampling colour across a transparent edge leaves a halo, and re-inking also
guarantees the mark and the surrounding chrome are the same navy to the byte.

| Derived                | From    | Size       | Ink / field   | Used by                                                   |
| ---------------------- | ------- | ---------- | ------------- | --------------------------------------------------------- |
| `tou-lockup-white.png` | primary | 484 × 160  | white         | public masthead (a navy brand field in both colour modes) |
| `tou-emblem.png`       | emblem  | 121 × 192  | navy          | internal / admin sidebar, light mode                      |
| `tou-emblem-white.png` | emblem  | 121 × 192  | white         | internal / admin sidebar, dark mode                       |
| `icon-192.png`         | emblem  | 192 × 192  | white on navy | `manifest.json`, `any maskable`                           |
| `icon-512.png`         | emblem  | 512 × 512  | white on navy | `manifest.json`, `any maskable`                           |
| `apple-touch-icon.png` | emblem  | 180 × 180  | white on navy | iOS home screen                                           |
| `og-cover.png`         | primary | 1200 × 630 | white on navy | `og:image`                                                |
| `public/favicon.ico`   | emblem  | 16/32/48   | navy          | browser tab                                               |

The site marks are cut well above 2× the largest size the layout ever gives them
(the masthead lockup renders 48 px tall against a 160 px file), so a high-DPI
screen has pixels to spend and the header still costs ~13 KB. In the
square icons the mark fills 56 % of the edge, which keeps it inside the 80 %
maskable safe zone on Android and inside the corner radius on iOS.

One more derivative lives outside this app:
`server/crates/reports/assets/brand/tou-emblem-white.png` (161 × 256), which the
Typst template compiles into the PDF masthead (`server/crates/reports/src/pdf.rs`).

To regenerate after a brand-book update: replace the masters here, then re-cut
each row of the table above - crop to the alpha bounding box, resample the alpha
channel alone, re-ink from `--brand-navy` / white, and re-pack `favicon.ico`
from the 16/32/48 renders.
