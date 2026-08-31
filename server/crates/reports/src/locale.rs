//! RU/KK/EN string tables for the report templates (TZ §7 i18n).
//!
//! Every user-visible string in a rendered report comes from one of the three
//! [`Strings`] tables below - the renderers never format a sentence themselves.
//! That is what makes the anti-PII guard in [`crate::doc`] decidable: a string
//! in the output is either one of these phrases (possibly with a number or a
//! dictionary code substituted into a `{}` placeholder), a dictionary code, or a
//! rendered number.
//!
//! RU is normative (TZ is written in Russian); KK is the second mandatory
//! locale; EN is the optional third one (docs/PLAN.md W2.6).

use serde::Serialize;

/// The locale a report is rendered in.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Locale {
    Ru,
    Kk,
    En,
}

impl Locale {
    /// Every locale this crate can render, for parity tests.
    pub const ALL: [Self; 3] = [Self::Ru, Self::Kk, Self::En];

    /// BCP-47 tag, used as the Typst `text(lang: ..)` value so hyphenation and
    /// quotation marks follow the language.
    #[must_use]
    pub fn tag(self) -> &'static str {
        match self {
            Self::Ru => "ru",
            Self::Kk => "kk",
            Self::En => "en",
        }
    }

    /// Decimal separator. RU and KK write 76,47; EN writes 76.47.
    #[must_use]
    pub fn decimal_separator(self) -> char {
        match self {
            Self::Ru | Self::Kk => ',',
            Self::En => '.',
        }
    }

    /// Thousands separator. A non-breaking space keeps «20 800» on one line.
    #[must_use]
    pub fn group_separator(self) -> char {
        match self {
            Self::Ru | Self::Kk => '\u{a0}',
            Self::En => ',',
        }
    }

    #[must_use]
    pub fn strings(self) -> &'static Strings {
        match self {
            Self::Ru => &RU,
            Self::Kk => &KK,
            Self::En => &EN,
        }
    }
}

/// One locale's complete phrase table.
///
/// Fields are `&'static str` on purpose: [`crate::doc::Label::Phrase`] accepts
/// nothing else, so a runtime string read from the database cannot become a
/// heading or a row label.
#[derive(Debug)]
#[non_exhaustive]
pub struct Strings {
    // ── document chrome ────────────────────────────────────────────────────
    pub report_title: &'static str,
    pub report_subtitle: &'static str,
    /// `{}` ← the academic year, rendered as `2025–2026`.
    pub period_academic_year: &'static str,
    /// `{}` ← the first day, `{}` ← the last day of an arbitrary period.
    pub period_range: &'static str,
    /// `{}` ← the generation date.
    pub generated_on: &'static str,
    /// `{}` ← the current page, `{}` ← the page count.
    pub page_of: &'static str,
    pub internal_marking: &'static str,

    // ── cell markers ───────────────────────────────────────────────────────
    /// TZ §6.2 - what a k-anonymity-suppressed cell shows instead of a number.
    pub insufficient_data: &'static str,
    /// ADR-008 §9 - a metric with no source at all, distinct from suppression.
    pub no_data: &'static str,
    pub total: &'static str,

    // ── section headings ───────────────────────────────────────────────────
    pub section_summary: &'static str,
    pub section_work_types: &'static str,
    pub section_buckets: &'static str,
    pub section_faculties: &'static str,
    pub section_rechecks: &'static str,
    pub section_escalations: &'static str,
    pub section_usage: &'static str,

    /// Worksheet tabs: Excel caps a sheet name at 31 characters, so the long
    /// headings above cannot be reused verbatim.
    pub sheet_summary: &'static str,
    pub sheet_work_types: &'static str,
    pub sheet_buckets: &'static str,
    pub sheet_faculties: &'static str,
    pub sheet_rechecks: &'static str,
    pub sheet_escalations: &'static str,
    pub sheet_usage: &'static str,

    // ── column headers ─────────────────────────────────────────────────────
    pub column_metric: &'static str,
    pub column_value: &'static str,
    pub column_work_type: &'static str,
    pub column_checks: &'static str,
    pub column_avg_originality: &'static str,
    pub column_bucket: &'static str,
    pub column_share: &'static str,
    pub column_faculty: &'static str,
    pub column_category: &'static str,
    pub column_referred: &'static str,
    pub column_reviewed: &'static str,

    // ── row labels ─────────────────────────────────────────────────────────
    pub metric_checks_total: &'static str,
    pub metric_avg_originality: &'static str,
    /// `{}` ← the configured originality threshold in percent.
    pub metric_below_threshold: &'static str,
    pub metric_escalated: &'static str,
    pub metric_coverage: &'static str,
    pub metric_works_total: &'static str,
    pub metric_works_rechecked: &'static str,
    pub metric_recheck_share: &'static str,
    pub metric_improved_share: &'static str,
    pub metric_escalated_checks: &'static str,
    pub metric_active_reviewers_avg: &'static str,
    pub metric_active_reviewers_max: &'static str,
    pub metric_avg_check_seconds: &'static str,

    // ── footnotes ──────────────────────────────────────────────────────────
    /// `{}` ← the active k-anonymity threshold.
    pub note_k_anonymity: &'static str,
    pub note_coverage_missing: &'static str,
    pub note_ethics_separate: &'static str,
    pub note_no_duration: &'static str,
    /// Shown when the unit breakdown actually holds a unit other than the
    /// `UNASSIGNED` sentinel.
    pub note_units_since_2025: &'static str,
    /// Shown instead when every row is the sentinel: there is no breakdown yet,
    /// and claiming one exists would read as a data error.
    pub note_units_pending_mapping: &'static str,
    pub note_unassigned_unit: &'static str,

    // ── dictionary phrases ─────────────────────────────────────────────────
    pub bucket_lt50: &'static str,
    pub bucket_50_70: &'static str,
    pub bucket_70_85: &'static str,
    pub bucket_85_95: &'static str,
    pub bucket_ge95: &'static str,

    pub work_type_article: &'static str,
    pub work_type_course: &'static str,
    pub work_type_research_report: &'static str,
    pub work_type_thesis_bachelor: &'static str,
    pub work_type_thesis_master: &'static str,
    pub work_type_thesis_phd: &'static str,
    pub work_type_other: &'static str,

    pub unit_unassigned: &'static str,
    pub category_other: &'static str,
}

impl Strings {
    /// The five originality bands of TZ §4.2 §5, lowest first.
    #[must_use]
    pub fn buckets(&'static self) -> [&'static str; 5] {
        [
            self.bucket_lt50,
            self.bucket_50_70,
            self.bucket_70_85,
            self.bucket_85_95,
            self.bucket_ge95,
        ]
    }

    /// The localized name of a known work type, or `None` for a code this build
    /// does not know - the caller then falls back to printing the code itself,
    /// never to inventing a name.
    #[must_use]
    pub fn work_type(&'static self, code: &str) -> Option<&'static str> {
        Some(match code {
            "article" => self.work_type_article,
            "course" => self.work_type_course,
            "research_report" => self.work_type_research_report,
            "thesis_bachelor" => self.work_type_thesis_bachelor,
            "thesis_master" => self.work_type_thesis_master,
            "thesis_phd" => self.work_type_thesis_phd,
            "other" => self.work_type_other,
            _ => return None,
        })
    }

    /// The sentinel unit of migration 0002 gets a phrase; every real faculty is
    /// printed as its dictionary code (docs/PLAN.md §1.2).
    #[must_use]
    pub fn unit(&'static self, code: &str) -> Option<&'static str> {
        (code == "UNASSIGNED").then_some(self.unit_unassigned)
    }

    /// Every phrase in this table, for the parity and anti-PII guard tests.
    #[must_use]
    pub fn all(&'static self) -> Vec<&'static str> {
        vec![
            self.report_title,
            self.report_subtitle,
            self.period_academic_year,
            self.period_range,
            self.generated_on,
            self.page_of,
            self.internal_marking,
            self.insufficient_data,
            self.no_data,
            self.total,
            self.section_summary,
            self.section_work_types,
            self.section_buckets,
            self.section_faculties,
            self.section_rechecks,
            self.section_escalations,
            self.section_usage,
            self.sheet_summary,
            self.sheet_work_types,
            self.sheet_buckets,
            self.sheet_faculties,
            self.sheet_rechecks,
            self.sheet_escalations,
            self.sheet_usage,
            self.column_metric,
            self.column_value,
            self.column_work_type,
            self.column_checks,
            self.column_avg_originality,
            self.column_bucket,
            self.column_share,
            self.column_faculty,
            self.column_category,
            self.column_referred,
            self.column_reviewed,
            self.metric_checks_total,
            self.metric_avg_originality,
            self.metric_below_threshold,
            self.metric_escalated,
            self.metric_coverage,
            self.metric_works_total,
            self.metric_works_rechecked,
            self.metric_recheck_share,
            self.metric_improved_share,
            self.metric_escalated_checks,
            self.metric_active_reviewers_avg,
            self.metric_active_reviewers_max,
            self.metric_avg_check_seconds,
            self.note_k_anonymity,
            self.note_coverage_missing,
            self.note_ethics_separate,
            self.note_no_duration,
            self.note_units_since_2025,
            self.note_units_pending_mapping,
            self.note_unassigned_unit,
            self.bucket_lt50,
            self.bucket_50_70,
            self.bucket_70_85,
            self.bucket_85_95,
            self.bucket_ge95,
            self.work_type_article,
            self.work_type_course,
            self.work_type_research_report,
            self.work_type_thesis_bachelor,
            self.work_type_thesis_master,
            self.work_type_thesis_phd,
            self.work_type_other,
            self.unit_unassigned,
            self.category_other,
        ]
    }
}

static RU: Strings = Strings {
    report_title: "Отчёт по обеспечению академической честности",
    report_subtitle: "Обезличенный отчёт по форме Приложения 1 к приказу № 13803",
    period_academic_year: "Учебный год {}",
    period_range: "Период: {} - {}",
    generated_on: "Сформирован {}",
    page_of: "Стр. {} из {}",
    internal_marking: "Для служебного пользования",

    insufficient_data: "недостаточно данных",
    no_data: "нет данных",
    total: "Итого",

    section_summary: "1. Общие показатели",
    section_work_types: "2. Распределение по типам работ",
    section_buckets: "3. Распределение по диапазонам оригинальности",
    section_faculties: "4. Распределение по факультетам",
    section_rechecks: "5. Повторные проверки",
    section_escalations: "6. Эскалации",
    section_usage: "7. Использование системы",

    sheet_summary: "1. Общие показатели",
    sheet_work_types: "2. Типы работ",
    sheet_buckets: "3. Диапазоны",
    sheet_faculties: "4. Факультеты",
    sheet_rechecks: "5. Повторные проверки",
    sheet_escalations: "6. Эскалации",
    sheet_usage: "7. Использование",

    column_metric: "Показатель",
    column_value: "Значение",
    column_work_type: "Тип работы",
    column_checks: "Проверок",
    column_avg_originality: "Средняя оригинальность, %",
    column_bucket: "Диапазон оригинальности",
    column_share: "Доля, %",
    column_faculty: "Факультет",
    column_category: "Категория",
    column_referred: "Передано",
    column_reviewed: "Рассмотрено",

    metric_checks_total: "Всего проверок",
    metric_avg_originality: "Средняя оригинальность, %",
    metric_below_threshold: "Доля работ ниже порога {} %, %",
    metric_escalated: "Случаи эскалации",
    metric_coverage: "Охват проверками, %",
    metric_works_total: "Работ всего",
    metric_works_rechecked: "Работ с повторной проверкой",
    metric_recheck_share: "Доля работ с повторной проверкой, %",
    metric_improved_share: "Доля повторных проверок с улучшением, %",
    metric_escalated_checks: "Проверки с признаком эскалации",
    metric_active_reviewers_avg: "Активных пользователей в месяц (среднее)",
    metric_active_reviewers_max: "Активных пользователей в месяц (максимум)",
    metric_avg_check_seconds: "Среднее время выполнения проверки, с",

    note_k_anonymity: "Ячейки с числом наблюдений менее {} скрыты правилом \
                       k-анонимности (ТЗ п. 6.2).",
    note_coverage_missing: "Охват проверками не рассчитан: сведения о числе сданных работ \
                            в системе отсутствуют (ТЗ п. 4.2 §1).",
    note_ethics_separate: "Счётчики Совета по этике ведутся вручную и не суммируются \
                           с числом проверок (ADR-008 §9).",
    note_no_duration: "Среднее время выполнения проверки отсутствует в источнике данных \
                       (ADR-008 §9).",
    note_units_since_2025: "Разбивка по подразделениям доступна с 2025/26 учебного года.",
    note_units_pending_mapping: "Разбивка по подразделениям станет доступна после загрузки \
                                 сопоставления рецензентов и подразделений.",
    note_unassigned_unit: "«Не распределено» - проверки, для которых подразделение \
                           инициатора не сопоставлено.",

    bucket_lt50: "менее 50 %",
    bucket_50_70: "от 50 % до 70 %",
    bucket_70_85: "от 70 % до 85 %",
    bucket_85_95: "от 85 % до 95 %",
    bucket_ge95: "95 % и выше",

    work_type_article: "Статья ППС",
    work_type_course: "Курсовая работа",
    work_type_research_report: "Отчёт о НИР",
    work_type_thesis_bachelor: "Выпускная квалификационная работа",
    work_type_thesis_master: "Магистерская диссертация",
    work_type_thesis_phd: "Докторская диссертация (PhD)",
    work_type_other: "Иное",

    unit_unassigned: "Не распределено",
    category_other: "Иная категория",
};

static KK: Strings = Strings {
    report_title: "Академиялық адалдықты қамтамасыз ету жөніндегі есеп",
    report_subtitle: "№ 13803 бұйрыққа 1-қосымша нысаны бойынша дербестендірілмеген есеп",
    period_academic_year: "{} оқу жылы",
    period_range: "Кезең: {} - {}",
    generated_on: "{} жасалды",
    page_of: "{} / {} бет",
    internal_marking: "Қызметтік пайдалану үшін",

    insufficient_data: "деректер жеткіліксіз",
    no_data: "дерек жоқ",
    total: "Барлығы",

    section_summary: "1. Жалпы көрсеткіштер",
    section_work_types: "2. Жұмыс түрлері бойынша бөлу",
    section_buckets: "3. Түпнұсқалық диапазондары бойынша бөлу",
    section_faculties: "4. Факультеттер бойынша бөлу",
    section_rechecks: "5. Қайталама тексерулер",
    section_escalations: "6. Эскалациялар",
    section_usage: "7. Жүйені пайдалану",

    sheet_summary: "1. Жалпы көрсеткіштер",
    sheet_work_types: "2. Жұмыс түрлері",
    sheet_buckets: "3. Диапазондар",
    sheet_faculties: "4. Факультеттер",
    sheet_rechecks: "5. Қайталама тексеру",
    sheet_escalations: "6. Эскалациялар",
    sheet_usage: "7. Жүйені пайдалану",

    column_metric: "Көрсеткіш",
    column_value: "Мәні",
    column_work_type: "Жұмыс түрі",
    column_checks: "Тексерулер",
    column_avg_originality: "Орташа түпнұсқалық, %",
    column_bucket: "Түпнұсқалық диапазоны",
    column_share: "Үлесі, %",
    column_faculty: "Факультет",
    column_category: "Санат",
    column_referred: "Жіберілді",
    column_reviewed: "Қаралды",

    metric_checks_total: "Барлық тексерулер",
    metric_avg_originality: "Орташа түпнұсқалық, %",
    metric_below_threshold: "{} % шегінен төмен жұмыстар үлесі, %",
    metric_escalated: "Эскалация жағдайлары",
    metric_coverage: "Тексерумен қамту, %",
    metric_works_total: "Барлық жұмыстар",
    metric_works_rechecked: "Қайта тексерілген жұмыстар",
    metric_recheck_share: "Қайта тексерілген жұмыстар үлесі, %",
    metric_improved_share: "Көрсеткіші жақсарған қайталама тексерулер үлесі, %",
    metric_escalated_checks: "Эскалация белгісі бар тексерулер",
    metric_active_reviewers_avg: "Айына белсенді пайдаланушылар (орташа)",
    metric_active_reviewers_max: "Айына белсенді пайдаланушылар (ең көбі)",
    metric_avg_check_seconds: "Тексерудің орташа орындалу уақыты, с",

    note_k_anonymity: "Бақылау саны {} мәнінен аз ұяшықтар k-анонимділік ережесімен \
                       жасырылған (ТТ 6.2-т.).",
    note_coverage_missing: "Тексерумен қамту есептелмеді: тапсырылған жұмыстар саны туралы \
                            мәліметтер жүйеде жоқ (ТТ 4.2-т. §1).",
    note_ethics_separate: "Этика кеңесінің есептегіштері қолмен жүргізіледі және тексерулер \
                           санымен қосылмайды (ADR-008 §9).",
    note_no_duration: "Тексерудің орташа орындалу уақыты дереккөзде жоқ (ADR-008 §9).",
    note_units_since_2025: "Бөлімшелер бойынша бөлу 2025/26 оқу жылынан бастап қолжетімді.",
    note_units_pending_mapping: "Бөлімшелер бойынша бөлу рецензенттер мен бөлімшелердің \
                                 сәйкестігі жүктелгеннен кейін қолжетімді болады.",
    note_unassigned_unit: "«Бөлінбеген» - бастамашының бөлімшесі сәйкестендірілмеген \
                           тексерулер.",

    bucket_lt50: "50 %-дан төмен",
    bucket_50_70: "50 %-дан 70 %-ға дейін",
    bucket_70_85: "70 %-дан 85 %-ға дейін",
    bucket_85_95: "85 %-дан 95 %-ға дейін",
    bucket_ge95: "95 % және жоғары",

    work_type_article: "ПОҚ мақаласы",
    work_type_course: "Курстық жұмыс",
    work_type_research_report: "ҒЗЖ есебі",
    work_type_thesis_bachelor: "Дипломдық жұмыс",
    work_type_thesis_master: "Магистрлік диссертация",
    work_type_thesis_phd: "Докторлық диссертация (PhD)",
    work_type_other: "Өзгесі",

    unit_unassigned: "Бөлінбеген",
    category_other: "Өзге санат",
};

static EN: Strings = Strings {
    report_title: "Academic integrity report",
    report_subtitle: "Anonymized report following the Annex 1 form of order No. 13803",
    period_academic_year: "Academic year {}",
    period_range: "Period: {} - {}",
    generated_on: "Generated on {}",
    page_of: "Page {} of {}",
    internal_marking: "For internal use only",

    insufficient_data: "insufficient data",
    no_data: "no data",
    total: "Total",

    section_summary: "1. Headline figures",
    section_work_types: "2. Breakdown by work type",
    section_buckets: "3. Distribution by originality band",
    section_faculties: "4. Breakdown by faculty",
    section_rechecks: "5. Rechecks",
    section_escalations: "6. Escalations",
    section_usage: "7. System usage",

    sheet_summary: "1. Headline figures",
    sheet_work_types: "2. Work types",
    sheet_buckets: "3. Originality bands",
    sheet_faculties: "4. Faculties",
    sheet_rechecks: "5. Rechecks",
    sheet_escalations: "6. Escalations",
    sheet_usage: "7. System usage",

    column_metric: "Metric",
    column_value: "Value",
    column_work_type: "Work type",
    column_checks: "Checks",
    column_avg_originality: "Mean originality, %",
    column_bucket: "Originality band",
    column_share: "Share, %",
    column_faculty: "Faculty",
    column_category: "Category",
    column_referred: "Referred",
    column_reviewed: "Reviewed",

    metric_checks_total: "Checks in total",
    metric_avg_originality: "Mean originality, %",
    metric_below_threshold: "Share below the {} % threshold, %",
    metric_escalated: "Escalations",
    metric_coverage: "Check coverage, %",
    metric_works_total: "Works in total",
    metric_works_rechecked: "Works rechecked",
    metric_recheck_share: "Share of works rechecked, %",
    metric_improved_share: "Share of rechecks that improved, %",
    metric_escalated_checks: "Checks flagged for escalation",
    metric_active_reviewers_avg: "Monthly active reviewers (mean)",
    metric_active_reviewers_max: "Monthly active reviewers (peak)",
    metric_avg_check_seconds: "Mean check duration, s",

    note_k_anonymity: "Cells backed by fewer than {} observations are hidden by the \
                       k-anonymity rule (TZ §6.2).",
    note_coverage_missing: "Check coverage is not computed: the number of submitted works \
                            is not held by the system (TZ §4.2 §1).",
    note_ethics_separate: "Ethics Council counters are maintained by hand and are never \
                           added to the check counts (ADR-008 §9).",
    note_no_duration: "Mean check duration has no source in the upstream data (ADR-008 §9).",
    note_units_since_2025: "The breakdown by unit is available from academic year 2025/26.",
    note_units_pending_mapping: "The breakdown by unit becomes available once the mapping of \
                                 reviewers to units has been loaded.",
    note_unassigned_unit: "«Unassigned» covers checks whose initiating unit could not be \
                           resolved.",

    bucket_lt50: "below 50 %",
    bucket_50_70: "50 % to 70 %",
    bucket_70_85: "70 % to 85 %",
    bucket_85_95: "85 % to 95 %",
    bucket_ge95: "95 % and above",

    work_type_article: "Staff article",
    work_type_course: "Coursework",
    work_type_research_report: "Research report",
    work_type_thesis_bachelor: "Bachelor thesis",
    work_type_thesis_master: "Master dissertation",
    work_type_thesis_phd: "PhD dissertation",
    work_type_other: "Other",

    unit_unassigned: "Unassigned",
    category_other: "Other category",
};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_locale_fills_every_slot() {
        for locale in Locale::ALL {
            let phrases = locale.strings().all();
            assert_eq!(phrases.len(), RU.all().len(), "{locale:?}: table arity");
            for phrase in phrases {
                assert!(!phrase.trim().is_empty(), "{locale:?}: an empty phrase");
            }
        }
    }

    /// A `{}` placeholder that exists in RU must exist in the other locales too,
    /// or the substituted value silently disappears from a translated report.
    #[test]
    fn placeholder_arity_matches_across_locales() {
        let arity = |s: &str| s.matches("{}").count();
        for (index, russian) in RU.all().into_iter().enumerate() {
            for locale in [Locale::Kk, Locale::En] {
                let other = locale.strings().all()[index];
                assert_eq!(
                    arity(russian),
                    arity(other),
                    "{locale:?}: placeholder arity of `{russian}` vs `{other}`"
                );
            }
        }
    }

    #[test]
    fn known_dictionary_codes_resolve_and_unknown_ones_do_not() {
        for locale in Locale::ALL {
            let strings = locale.strings();
            assert!(strings.work_type("thesis_phd").is_some());
            assert!(strings.work_type("FAC01").is_none());
            assert_eq!(strings.unit("UNASSIGNED"), Some(strings.unit_unassigned));
            assert_eq!(strings.unit("FAC01"), None);
            assert_eq!(strings.buckets().len(), 5);
        }
    }
}
