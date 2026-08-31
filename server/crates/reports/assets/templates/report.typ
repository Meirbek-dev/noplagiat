// Branded report template (TZ §8; ADR-004, ADR-013).
//
// Every user-visible string arrives through `data.json`, already localized and
// already screened by `reports::doc` - this file contains no Russian, no Kazakh
// and no numbers of its own, so a template change cannot alter a published
// figure. The world that serves `data.json` is `reports::pdf::TemplateWorld`.
//
// Nothing here may read a clock: `datetime.today()` would make two renders of
// the same report differ, and the generation date is passed in instead.

#let doc = json("data.json")

#let navy = rgb(doc.navy)
#let orange = rgb(doc.orange)
#let muted = rgb(doc.muted)
#let tint = rgb(doc.row_tint)
#let hairline = rgb(doc.hairline)

// Substitute values into the successive `{}` placeholders of a locale phrase,
// mirroring `reports::doc::fill`.
#let put(template, values) = {
  let parts = template.split("{}")
  let out = parts.at(0, default: "")
  for (index, value) in values.enumerate() {
    out = out + str(value) + parts.at(index + 1, default: "")
  }
  out
}

#set document(title: doc.title, author: doc.organization, date: none)

#set text(font: "Noto Sans", size: 9pt, lang: doc.lang, fill: rgb("#1A1A1A"))
#set par(justify: false, leading: 0.62em)

#set page(
  paper: "a4",
  margin: (top: 2.4cm, bottom: 1.9cm, left: 1.5cm, right: 1.5cm),

  header: context {
    set text(size: 8pt)
    grid(
      columns: (1fr, auto),
      align: (left + bottom, right + bottom),
      text(fill: navy, weight: "bold", size: 10pt, doc.organization),
      if doc.marking != none {
        text(fill: orange, weight: "bold", doc.marking)
      },
    )
    v(-0.35em)
    line(length: 100%, stroke: 1.2pt + orange)
  },

  footer: context {
    set text(size: 8pt, fill: muted)
    let current = counter(page).get().first()
    let total = counter(page).final().first()
    grid(
      columns: (1fr, auto),
      align: (left + top, right + top),
      doc.title,
      put(doc.page_of, (current, total)),
    )
  },

  // «Для служебного пользования» as a diagonal watermark on internal exports
  // (TZ §4.4). Public exports get no background at all.
  background: if doc.marking != none {
    align(center + horizon, rotate(-30deg, text(
      size: 46pt,
      weight: "bold",
      fill: orange.transparentize(88%),
      doc.marking,
    )))
  },
)

#show heading: it => block(above: 1.4em, below: 0.7em, text(
  fill: navy,
  weight: "bold",
  size: 11.5pt,
  it.body,
))

// ── masthead ─────────────────────────────────────────────────────────────────
// The emblem is the white variant of the brand mark, served to this template as
// `logo.png` by `TemplateWorld` - the only image in the bundle. It is the mark
// alone rather than the full lockup: the organization is already named in the
// running header of every page, and the wordmark beside it would repeat that.
#block(
  width: 100%,
  fill: navy,
  inset: (x: 12pt, y: 10pt),
  radius: 2pt,
  grid(
    columns: (auto, 1fr),
    column-gutter: 11pt,
    align: (horizon, horizon),
    image("logo.png", height: 34pt, alt: doc.organization),
    {
      text(fill: white, weight: "bold", size: 15pt, doc.title)
      v(0.35em)
      text(fill: white.transparentize(20%), size: 9pt, doc.subtitle)
    },
  ),
)

#v(0.5em)
#grid(
  columns: (1fr, auto),
  align: (left, right),
  text(fill: navy, weight: "bold", doc.period),
  text(fill: muted, doc.generated_note),
)
#v(-0.2em)
#line(length: 100%, stroke: 0.8pt + orange)

// ── sections ─────────────────────────────────────────────────────────────────
#let render-table(section) = {
  let columns = section.columns
  table(
    columns: columns.map(_ => auto),
    align: columns.map(column => if column.align == "end" {
      right + horizon
    } else {
      left + horizon
    }),
    inset: (x: 7pt, y: 5pt),
    fill: (x, y) => if y == 0 {
      navy
    } else if calc.odd(y) {
      tint
    } else {
      white
    },
    stroke: (x, y) => (
      bottom: 0.4pt + hairline,
      top: if section.total_rows.contains(y - 1) { 1pt + orange } else { none },
    ),
    table.header(..columns.map(column => text(
      fill: white,
      weight: "bold",
      column.header,
    ))),
    ..section
      .rows
      .map(row => row.cells.map(cell => if row.kind == "total" {
        strong(cell)
      } else {
        cell
      }))
      .flatten(),
  )
}

#for section in doc.sections {
  heading(level: 2, section.title)
  render-table(section)
  if section.footnotes.len() > 0 {
    v(0.4em)
    for note in section.footnotes {
      block(above: 0.25em, text(size: 7.5pt, fill: muted, style: "italic", note))
    }
  }
}
