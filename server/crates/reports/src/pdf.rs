//! PDF rendering through the `typst` crate (ADR-004, ADR-013).
//!
//! Typst is used as a *library*, not as a subprocess: [`TemplateWorld`] serves
//! exactly four files - the template compiled into the binary, the report data
//! as JSON, the brand emblem, and the two bundled fonts - and nothing else.
//! There is no filesystem access, no package resolution and no network, so a
//! rendered report depends on the input document alone.
//!
//! **Determinism.** [`World::today`] returns `None` and the template sets
//! `document(date: none)`, so `datetime.today()` cannot be reached from the
//! template. The generation date is a string in the payload, produced by the
//! caller. Rendering the same [`ReportDoc`] twice therefore yields byte-identical
//! PDFs, which is what makes the snapshot content hash meaningful.

use std::collections::BTreeSet;
use std::path::PathBuf;
use std::sync::OnceLock;

use serde::Serialize;
use typst::diag::{FileError, FileResult, SourceDiagnostic};
use typst::foundations::{Bytes, Datetime, Duration};
use typst::layout::Frame;
use typst::layout::FrameItem;
use typst::syntax::{FileId, RootedPath, Source, VirtualPath, VirtualRoot};
use typst::text::{Font, FontBook};
use typst::utils::LazyHash;
use typst::{Library, LibraryExt, World};
use typst_layout::PagedDocument;

use crate::brand;
use crate::doc::{Align, ReportDoc, RowKind};
use crate::{RenderOptions, ReportError};

/// The template, compiled into the binary so a deployment cannot lose it.
const TEMPLATE: &str = include_str!("../assets/templates/report.typ");

/// The bundled OFL font family (ADR-013). Regular and bold are enough for the
/// template; no italic face is referenced.
const FONT_REGULAR: &[u8] = include_bytes!("../assets/fonts/NotoSans-Regular.ttf");
const FONT_BOLD: &[u8] = include_bytes!("../assets/fonts/NotoSans-Bold.ttf");

/// The Toraighyrov University emblem in white, for the navy masthead (TZ §8,
/// D10). Compiled in like the template and the fonts, so a deployment cannot
/// publish an unbranded report by losing a file. Derived from the master in
/// `apps/web/brand/` - see the README there.
const LOGO: &[u8] = include_bytes!("../assets/brand/tou-emblem-white.png");

const MAIN_PATH: &str = "/main.typ";
const DATA_PATH: &str = "/data.json";
const LOGO_PATH: &str = "/logo.png";

/// A rendered PDF, together with what it actually says.
///
/// `text` is the text of the laid-out document - the very glyph runs that were
/// serialized into `bytes` - so a guard test that scans it is scanning the PDF,
/// not a re-render of it. `missing_glyphs` collects every character the bundled
/// fonts could not draw, which is how the Kazakh coverage gate (docs/PLAN.md §6
/// R4) is enforced on real output rather than on the font file alone.
#[derive(Debug, Clone)]
pub struct RenderedPdf {
    pub bytes: Vec<u8>,
    pub text: String,
    pub pages: usize,
    pub missing_glyphs: BTreeSet<char>,
}

/// Render `doc` as a PDF.
pub fn render_pdf(doc: &ReportDoc, options: &RenderOptions) -> Result<RenderedPdf, ReportError> {
    for section in &doc.sections {
        if !section.table.is_rectangular() {
            return Err(ReportError::MalformedTable);
        }
    }

    let payload = serde_json::to_vec(&Payload::build(doc, options))?;
    let world = TemplateWorld::new(payload)?;

    let compiled = typst::compile::<PagedDocument>(&world);
    let document = compiled.output.map_err(|diagnostics| {
        ReportError::Typst(describe(&diagnostics, "template did not compile"))
    })?;

    let bytes = typst_pdf::pdf(&document, &typst_pdf::PdfOptions::default())
        .map_err(|diagnostics| ReportError::Typst(describe(&diagnostics, "PDF export failed")))?;

    let mut text = String::new();
    let mut missing_glyphs = BTreeSet::new();
    for page in document.pages() {
        collect(&page.frame, &mut text, &mut missing_glyphs);
        text.push('\n');
    }
    let pages = document.pages().len();

    // Typst memoizes globally; without eviction a long-running server would keep
    // every intermediate of every report it has ever rendered.
    typst::comemo::evict(2);

    Ok(RenderedPdf {
        bytes,
        text,
        pages,
        missing_glyphs,
    })
}

/// Walk a frame in layout order, appending its text and noting `.notdef`
/// glyphs - the tofu boxes a reader would see.
fn collect(frame: &Frame, text: &mut String, missing: &mut BTreeSet<char>) {
    for (_, item) in frame.items() {
        match item {
            FrameItem::Group(group) => collect(&group.frame, text, missing),
            FrameItem::Text(run) => {
                text.push_str(&run.text);
                text.push(' ');
                for glyph in &run.glyphs {
                    if glyph.id == 0 {
                        missing
                            .extend(run.text.get(glyph.range()).into_iter().flat_map(str::chars));
                    }
                }
            }
            FrameItem::Shape(..)
            | FrameItem::Image(..)
            | FrameItem::Link(..)
            | FrameItem::Tag(..) => {}
        }
    }
}

fn describe(diagnostics: &[SourceDiagnostic], context: &str) -> String {
    let mut out = String::from(context);
    for diagnostic in diagnostics.iter().take(5) {
        out.push_str("; ");
        out.push_str(&diagnostic.message);
    }
    out
}

// ── the payload the template reads ───────────────────────────────────────────

#[derive(Serialize)]
struct Payload {
    lang: &'static str,
    organization: &'static str,
    title: String,
    subtitle: String,
    period: String,
    generated_note: String,
    /// `None` on public exports: the template then draws no watermark at all.
    marking: Option<&'static str>,
    page_of: &'static str,
    navy: String,
    orange: String,
    muted: String,
    row_tint: String,
    hairline: String,
    sections: Vec<PayloadSection>,
}

#[derive(Serialize)]
struct PayloadSection {
    title: String,
    columns: Vec<PayloadColumn>,
    rows: Vec<PayloadRow>,
    footnotes: Vec<String>,
    /// Indices of the total rows, so the template can rule them off in orange.
    total_rows: Vec<usize>,
}

#[derive(Serialize)]
struct PayloadColumn {
    header: String,
    align: &'static str,
}

#[derive(Serialize)]
struct PayloadRow {
    kind: &'static str,
    cells: Vec<String>,
}

impl Payload {
    fn build(doc: &ReportDoc, options: &RenderOptions) -> Self {
        let locale = doc.locale;
        let strings = locale.strings();
        Self {
            lang: locale.tag(),
            organization: brand::ORGANIZATION_LOCKUP,
            title: doc.title.render(locale),
            subtitle: doc.subtitle.render(locale),
            period: doc.period.render(locale),
            generated_note: doc.generated_note.render(locale),
            marking: options.internal.then_some(strings.internal_marking),
            page_of: strings.page_of,
            navy: brand::hex(brand::NAVY_RGB),
            orange: brand::hex(brand::ORANGE_RGB),
            muted: brand::hex(brand::MUTED_RGB),
            row_tint: brand::hex(brand::ROW_TINT_RGB),
            hairline: brand::hex(brand::HAIRLINE_RGB),
            sections: doc
                .sections
                .iter()
                .map(|section| PayloadSection {
                    title: section.title.render(locale),
                    columns: section
                        .table
                        .columns
                        .iter()
                        .map(|column| PayloadColumn {
                            header: column.header.render(locale),
                            align: match column.align {
                                Align::Start => "start",
                                Align::End => "end",
                            },
                        })
                        .collect(),
                    rows: section
                        .table
                        .rows
                        .iter()
                        .map(|row| PayloadRow {
                            kind: match row.kind {
                                RowKind::Data => "data",
                                RowKind::Total => "total",
                            },
                            cells: row.cells.iter().map(|cell| cell.render(locale)).collect(),
                        })
                        .collect(),
                    footnotes: section
                        .footnotes
                        .iter()
                        .map(|note| note.render(locale))
                        .collect(),
                    total_rows: section
                        .table
                        .rows
                        .iter()
                        .enumerate()
                        .filter(|(_, row)| row.kind == RowKind::Total)
                        .map(|(index, _)| index)
                        .collect(),
                })
                .collect(),
        }
    }
}

// ── the world ────────────────────────────────────────────────────────────────

/// The bundled fonts, parsed once per process.
fn fonts() -> &'static (LazyHash<FontBook>, Vec<Font>) {
    static FONTS: OnceLock<(LazyHash<FontBook>, Vec<Font>)> = OnceLock::new();
    FONTS.get_or_init(|| {
        let parsed: Vec<Font> = [FONT_REGULAR, FONT_BOLD]
            .into_iter()
            .flat_map(|data| Font::iter(Bytes::new(data)))
            .collect();
        (LazyHash::new(FontBook::from_fonts(&parsed)), parsed)
    })
}

/// A [`World`] over four in-memory files and nothing else.
struct TemplateWorld {
    library: LazyHash<Library>,
    main: FileId,
    source: Source,
    data_id: FileId,
    data: Bytes,
    logo_id: FileId,
}

impl TemplateWorld {
    fn new(payload: Vec<u8>) -> Result<Self, ReportError> {
        let main = intern(MAIN_PATH)?;
        let data_id = intern(DATA_PATH)?;
        let logo_id = intern(LOGO_PATH)?;
        Ok(Self {
            library: LazyHash::new(Library::default()),
            main,
            source: Source::new(main, TEMPLATE.to_owned()),
            data_id,
            data: Bytes::new(payload),
            logo_id,
        })
    }
}

fn intern(path: &str) -> Result<FileId, ReportError> {
    let vpath = VirtualPath::new(path).map_err(|error| ReportError::Typst(error.to_string()))?;
    Ok(RootedPath::new(VirtualRoot::Project, vpath).intern())
}

impl World for TemplateWorld {
    fn library(&self) -> &LazyHash<Library> {
        &self.library
    }

    fn book(&self) -> &LazyHash<FontBook> {
        &fonts().0
    }

    fn main(&self) -> FileId {
        self.main
    }

    fn source(&self, id: FileId) -> FileResult<Source> {
        if id == self.main {
            Ok(self.source.clone())
        } else {
            Err(not_found(id))
        }
    }

    fn file(&self, id: FileId) -> FileResult<Bytes> {
        if id == self.data_id {
            Ok(self.data.clone())
        } else if id == self.logo_id {
            Ok(Bytes::new(LOGO))
        } else if id == self.main {
            Ok(Bytes::from_string(TEMPLATE))
        } else {
            Err(not_found(id))
        }
    }

    fn font(&self, index: usize) -> Option<Font> {
        fonts().1.get(index).cloned()
    }

    /// Deliberately `None`: a report that reads the clock is not reproducible,
    /// and the generation date is passed in through the payload instead.
    fn today(&self, _offset: Option<Duration>) -> Option<Datetime> {
        None
    }
}

/// The world serves four files and refuses everything else, so a template that
/// tried to `read()` outside its bundle would fail loudly rather than pick up a
/// file from the deployment host.
fn not_found(id: FileId) -> FileError {
    FileError::NotFound(PathBuf::from(format!("{:?}", id.get())))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The bundled family must cover the nine Kazakh-specific Cyrillic letters
    /// and their capitals (docs/PLAN.md §6, risk R4). A missing glyph here is a
    /// tofu box in every Kazakh report.
    const KAZAKH: [char; 18] = [
        'ә', 'ғ', 'қ', 'ң', 'ө', 'ұ', 'ү', 'һ', 'і', 'Ә', 'Ғ', 'Қ', 'Ң', 'Ө', 'Ұ', 'Ү', 'Һ', 'І',
    ];

    #[test]
    fn the_bundled_fonts_load_and_cover_kazakh() {
        let (book, faces) = fonts();
        assert_eq!(faces.len(), 2, "regular and bold are both bundled");
        assert!(
            book.contains_family("noto sans"),
            "the family is registered"
        );

        for face in faces {
            for character in KAZAKH {
                assert!(
                    face.info().coverage.contains(u32::from(character)),
                    "{} has no glyph for `{character}`",
                    face.info().family
                );
            }
        }
    }
}
