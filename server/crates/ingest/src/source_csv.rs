//! The legacy vendor export dialect, pinned by ADR-008 §1.
//!
//! UTF-8 **with BOM**, `;` delimiter, RFC-4180 quoting (fields carry `;` and
//! embedded newlines), decimal comma, `dd.MM.yyyy HH:mm` read at a fixed
//! +05:00, booleans «Да»/else. The header is a contract: any mismatch rejects
//! the whole batch rather than shifting silently into the wrong columns.

use std::fs::File;
use std::io::{BufReader, Read};
use std::path::Path;

use crate::error::{BatchError, SourceError};

/// UTF-8 byte-order mark. Present in every observed export.
const BOM: [u8; 3] = [0xEF, 0xBB, 0xBF];

/// The ADR-008 §1 column contract of `documents.csv`, in order.
pub const DOCUMENTS_HEADER: [&str; 14] = [
    "Дата загрузки документа",
    "Название документа",
    "Авторы",
    "Оригинальность",
    "Самоцитирование",
    "Цитирование",
    "Совпадение",
    "Проверяющий",
    "Email проверяющего",
    "Подозрительный документ",
    "Отметка о подозрительности снята",
    "Статус",
    "Ссылка на полный отчет",
    "ИИ-контент",
];

/// The `system-usage.csv` column contract (ADR-008 §1).
pub const USAGE_HEADER: [&str; 6] = [
    "Пользователи на конец периода",
    "Активные пользователи",
    "Документы в Хранилище",
    "Документы в Индексе",
    "Совершенных проверок",
    "Среднее число проверок",
];

/// Positions inside a `documents.csv` record.
pub mod col {
    pub const CHECKED_AT: usize = 0;
    pub const TITLE: usize = 1;
    pub const AUTHORS: usize = 2;
    pub const ORIGINALITY: usize = 3;
    pub const SELF_CITATION: usize = 4;
    pub const CITATION: usize = 5;
    pub const MATCH: usize = 6;
    pub const REVIEWER_EMAIL: usize = 8;
    pub const SUSPICIOUS: usize = 9;
    pub const SUSPICION_CLEARED: usize = 10;
    pub const STATUS: usize = 11;
    pub const REPORT_LINK: usize = 12;
    pub const AI_CONTENT: usize = 13;
}

/// «Статус» values. Anything else means the row is shifted (PLAN §1.4).
pub const STATUS_NOT_DELETED: &str = "Не удален";
pub const STATUS_DELETED: &str = "Удален";

/// Build a `;`-delimited RFC-4180 reader over `inner`, stripping a leading BOM.
///
/// `flexible(false)`: a record with the wrong field count is an error we can
/// see and reject, not a row silently padded with empty strings.
pub fn reader<R: Read + 'static>(inner: R) -> Result<csv::Reader<Box<dyn Read>>, std::io::Error> {
    let mut head = [0_u8; BOM.len()];
    let mut inner = inner;
    let read = read_exact_or_eof(&mut inner, &mut head)?;
    let stripped: Box<dyn Read> = if read == BOM.len() && head == BOM {
        Box::new(inner)
    } else {
        Box::new(std::io::Read::chain(
            std::io::Cursor::new(head[..read].to_vec()),
            inner,
        ))
    };

    Ok(csv::ReaderBuilder::new()
        .delimiter(b';')
        .quoting(true)
        .double_quote(true)
        .flexible(false)
        // The header row is read explicitly so record indices stay 0-based over
        // *logical* records with the header excluded - the numbering the
        // fixture sidecar uses.
        .has_headers(false)
        .from_reader(stripped))
}

/// Open `path` as a documents/usage reader.
pub fn open(path: &Path) -> Result<csv::Reader<Box<dyn Read>>, SourceError> {
    let file = File::open(path).map_err(|source| SourceError::Io {
        path: path.display().to_string(),
        source,
    })?;
    reader(BufReader::new(file)).map_err(|source| SourceError::Io {
        path: path.display().to_string(),
        source,
    })
}

fn read_exact_or_eof<R: Read>(reader: &mut R, buffer: &mut [u8]) -> std::io::Result<usize> {
    let mut filled = 0;
    while filled < buffer.len() {
        match reader.read(&mut buffer[filled..]) {
            Ok(0) => break,
            Ok(n) => filled += n,
            Err(error) if error.kind() == std::io::ErrorKind::Interrupted => {}
            Err(error) => return Err(error),
        }
    }
    Ok(filled)
}

/// Assert the header equals the contract, column for column.
///
/// The batch is rejected wholesale on any mismatch (ADR-008 §1). The observed
/// text is never echoed into the error - only the position and the *expected*
/// label, both constants (AGENTS.md invariant #1).
pub fn check_header(
    record: &csv::StringRecord,
    contract: &[&'static str],
) -> Result<(), BatchError> {
    if record.len() != contract.len() {
        return Err(BatchError::HeaderColumnCount {
            expected: contract.len(),
            actual: record.len(),
        });
    }
    for (index, expected) in contract.iter().enumerate() {
        let actual = record.get(index).unwrap_or_default().trim();
        if actual != *expected {
            return Err(BatchError::HeaderMismatch {
                index,
                expected: expected as &'static str,
            });
        }
    }
    Ok(())
}

/// Read the header of an opened documents file and validate it.
pub fn read_documents_header(reader: &mut csv::Reader<Box<dyn Read>>) -> Result<(), SourceError> {
    let mut header = csv::StringRecord::new();
    if !reader.read_record(&mut header)? {
        return Err(SourceError::Batch(BatchError::EmptyFile));
    }
    check_header(&header, &DOCUMENTS_HEADER)?;
    Ok(())
}

/// The single aggregate row of `system-usage.csv` (ADR-008 §1).
///
/// `user-intensity.csv` is deliberately absent from this module: it carries
/// ФИО and is **never** imported.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct ControlTotals {
    pub users_total: Option<i32>,
    pub active_users: Option<i32>,
    pub storage_documents: Option<i32>,
    pub index_documents: Option<i32>,
    pub checks_total: Option<i32>,
    /// «Среднее число проверок» in hundredths. The column is `NUMERIC(10,1)`,
    /// so Postgres rounds on assignment - parsing keeps both digits so the
    /// rounding happens once, in one place.
    pub avg_checks_hundredths: Option<i32>,
}

/// Parse `system-usage.csv`.
pub fn read_control_totals(path: &Path) -> Result<ControlTotals, SourceError> {
    let mut reader = open(path)?;
    let mut header = csv::StringRecord::new();
    if !reader.read_record(&mut header)? {
        return Err(SourceError::Batch(BatchError::EmptyFile));
    }
    if check_header(&header, &USAGE_HEADER).is_err() {
        return Err(SourceError::Batch(BatchError::UsageHeaderMismatch));
    }

    let mut row = csv::StringRecord::new();
    if !reader.read_record(&mut row)? {
        return Err(SourceError::Batch(BatchError::UsageRowMissing));
    }

    let integer = |index: usize| -> Option<i32> {
        row.get(index)
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .and_then(|value| value.replace([' ', '\u{a0}'], "").parse::<i32>().ok())
    };

    Ok(ControlTotals {
        users_total: integer(0),
        active_users: integer(1),
        storage_documents: integer(2),
        index_documents: integer(3),
        checks_total: integer(4),
        avg_checks_hundredths: row
            .get(5)
            .and_then(|value| crate::row::parse_decimal(value, 2).ok().flatten()),
    })
}

#[cfg(test)]
mod tests {
    use std::io::Cursor;

    use super::*;

    fn records(body: &str) -> Vec<Result<csv::StringRecord, csv::Error>> {
        let mut reader = reader(Cursor::new(body.as_bytes().to_vec())).unwrap();
        reader.records().collect()
    }

    #[test]
    fn a_leading_bom_is_stripped_before_the_first_field() {
        let mut with_bom = Vec::from(BOM);
        with_bom.extend_from_slice("a;b\r\n".as_bytes());
        let mut reader = reader(Cursor::new(with_bom)).unwrap();
        let mut record = csv::StringRecord::new();
        assert!(reader.read_record(&mut record).unwrap());
        assert_eq!(record.get(0), Some("a"), "the BOM must not join column 0");
    }

    #[test]
    fn a_file_without_a_bom_still_reads_its_first_bytes() {
        let mut reader = reader(Cursor::new(b"ab;c\r\n".to_vec())).unwrap();
        let mut record = csv::StringRecord::new();
        assert!(reader.read_record(&mut record).unwrap());
        assert_eq!(record.get(0), Some("ab"));
    }

    #[test]
    fn a_one_byte_file_shorter_than_the_bom_is_not_truncated() {
        let mut reader = reader(Cursor::new(b"x".to_vec())).unwrap();
        let mut record = csv::StringRecord::new();
        assert!(reader.read_record(&mut record).unwrap());
        assert_eq!(record.get(0), Some("x"));
    }

    #[test]
    fn quoted_fields_may_contain_the_delimiter_and_newlines() {
        let parsed = records("\"Иванов И.И.; Петров П.П.\";\"строка\nвторая\";x\r\n");
        assert_eq!(parsed.len(), 1);
        let record = parsed[0].as_ref().unwrap();
        assert_eq!(record.get(0), Some("Иванов И.И.; Петров П.П."));
        assert_eq!(record.get(1), Some("строка\nвторая"));
        assert_eq!(record.len(), 3);
    }

    #[test]
    fn escaped_double_quotes_survive() {
        let parsed = records("\"a\"\"b\";c\r\n");
        assert_eq!(parsed[0].as_ref().unwrap().get(0), Some("a\"b"));
    }

    #[test]
    fn an_unequal_field_count_is_an_error_and_iteration_continues() {
        // `flexible(false)` so the shift is visible; the reader must keep going
        // so one bad record does not truncate the batch.
        let parsed = records("a;b;c\r\na;b\r\na;b;c\r\n");
        assert_eq!(parsed.len(), 3);
        assert!(parsed[0].is_ok());
        assert!(
            matches!(
                parsed[1].as_ref().unwrap_err().kind(),
                csv::ErrorKind::UnequalLengths { .. }
            ),
            "a short record must surface as UnequalLengths"
        );
        assert!(
            parsed[2].is_ok(),
            "iteration must resume after a bad record"
        );
    }

    #[test]
    fn the_header_contract_is_checked_column_for_column() {
        let good = csv::StringRecord::from(DOCUMENTS_HEADER.to_vec());
        assert_eq!(check_header(&good, &DOCUMENTS_HEADER), Ok(()));

        let mut swapped = DOCUMENTS_HEADER.to_vec();
        swapped.swap(1, 2);
        let record = csv::StringRecord::from(swapped);
        assert_eq!(
            check_header(&record, &DOCUMENTS_HEADER),
            Err(BatchError::HeaderMismatch {
                index: 1,
                expected: DOCUMENTS_HEADER[1]
            })
        );

        let short = csv::StringRecord::from(DOCUMENTS_HEADER[..13].to_vec());
        assert_eq!(
            check_header(&short, &DOCUMENTS_HEADER),
            Err(BatchError::HeaderColumnCount {
                expected: 14,
                actual: 13
            })
        );
    }
}
