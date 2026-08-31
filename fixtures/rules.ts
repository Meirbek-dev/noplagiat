/**
 * Shared, single-source-of-truth constants for the fixture lane.
 *
 * Imported by BOTH `generate.ts` (which emits source-shaped CSV) and
 * `expected.ts` (the independent brute-force reducer) so the two cannot
 * drift. Everything here is *data* - dictionaries, rule patterns, thresholds
 * and the CSV dialect - plus `norm()`, which must be bit-identical on both
 * sides. Derivation *logic* (status ladder, buckets, attempt grouping) is
 * deliberately NOT shared: `expected.ts` reimplements it, so a logic bug has
 * to be made twice to go unnoticed.
 *
 * Pinned by docs/adr/008-legacy-derivation-and-hmac.md. Do not "improve" a
 * value here without amending the ADR - the Rust ingest/SQL lanes are
 * compared numerically against these fixtures.
 */

// ── CSV dialect (ADR-008 §1) ────────────────────────────────────────────────

export const BOM = "﻿"
export const SEP = ";"
/** Record separator written by the generator (RFC-4180). */
export const EOL = "\r\n"
/** Newline used *inside* quoted fields, so the two are distinguishable. */
export const EMBEDDED_EOL = "\n"

/** Exactly these 14 columns, in order. Any mismatch rejects the batch. */
export const SOURCE_HEADER = [
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
] as const

export const USAGE_HEADER = [
  "Пользователи на конец периода",
  "Активные пользователи",
  "Документы в Хранилище",
  "Документы в Индексе",
  "Совершенных проверок",
  "Среднее число проверок",
] as const

export const STATUS_NOT_DELETED = "Не удален"
export const STATUS_DELETED = "Удален"
export const YES = "Да"
export const NO = "Нет"

export const REPORT_BASE = "https://noplagiat.tou.edu.kz/report/full"

/**
 * Naive source timestamps are interpreted at this fixed offset for all years
 * (ADR-008 §1). Month / academic-year / semester bucketing therefore happens
 * on the *local* civil date, which is exactly what the CSV already carries.
 */
export const TZ_OFFSET = "+05:00"

// ── Thresholds and boundaries (ADR-008 §4, §8; migration 0001 settings) ─────

export const ORIGINALITY_THRESHOLD = 70
export const HISTOGRAM_BUCKETS = [50, 70, 85, 95] as const
export const K_THRESHOLD = 5

/** Autumn Sep 1 – Jan 31, spring Feb 1 – Aug 31 (summer folded into spring). */
export const SEMESTER_AUTUMN_START_MONTH = 9
export const SEMESTER_SPRING_START_MONTH = 2

/** Academic year Sep 1 – Aug 31; AcademicYear(2024) = AY 2024/25. */
export const ACADEMIC_YEAR_START_MONTH = 9

// ── Dictionary sentinels (ADR-008 §6) ───────────────────────────────────────

export const UNASSIGNED = "UNASSIGNED"
export const UNASSIGNED_NAME_RU = "Не распределено"
export const UNASSIGNED_NAME_KK = "Бөлінбеген"
export const UNASSIGNED_NAME_EN = "Unassigned"

// ── Dictionaries ────────────────────────────────────────────────────────────

export type DictRow = {
  code: string
  name_ru: string
  name_kk: string
  name_en: string
}

export type FacultyRow = DictRow
export type DepartmentRow = DictRow & { faculty_code: string }
export type ProgramRow = DictRow & { department_code: string }
export type WorkTypeRow = DictRow & { sort_order: number }

/**
 * Eight faculties (ARCHITECTURE §9). FAC08 is deliberately kept out of the
 * bulk reviewer pool: every one of its rows is a crafted small group of size
 * 1..k+1, so k-anonymity suppression paths are observable.
 */
export const FACULTIES: readonly FacultyRow[] = [
  {
    code: "FAC01",
    name_ru: "Инженерная академия",
    name_kk: "Инженерлік академия",
    name_en: "Engineering Academy",
  },
  {
    code: "FAC02",
    name_ru: "Факультет компьютерных наук",
    name_kk: "Компьютерлік ғылымдар факультеті",
    name_en: "Faculty of Computer Science",
  },
  {
    code: "FAC03",
    name_ru: "Факультет естественных наук",
    name_kk: "Жаратылыстану ғылымдары факультеті",
    name_en: "Faculty of Natural Sciences",
  },
  {
    code: "FAC04",
    name_ru: "Гуманитарно-педагогический факультет",
    name_kk: "Гуманитарлық-педагогикалық факультет",
    name_en: "Faculty of Humanities and Education",
  },
  {
    code: "FAC05",
    name_ru: "Факультет экономики и права",
    name_kk: "Экономика және құқық факультеті",
    name_en: "Faculty of Economics and Law",
  },
  {
    code: "FAC06",
    name_ru: "Аграрно-технологический факультет",
    name_kk: "Аграрлық-технологиялық факультет",
    name_en: "Faculty of Agriculture and Technology",
  },
  {
    code: "FAC07",
    name_ru: "Архитектурно-строительный факультет",
    name_kk: "Сәулет-құрылыс факультеті",
    name_en: "Faculty of Architecture and Construction",
  },
  {
    code: "FAC08",
    name_ru: "Факультет искусства и спорта",
    name_kk: "Өнер және спорт факультеті",
    name_en: "Faculty of Arts and Sport",
  },
]

/** Five departments per faculty → 40 real departments (ARCHITECTURE §9). */
const DEPARTMENT_SEEDS: readonly (readonly [string, string, string])[] = [
  // FAC01
  [
    "Машиностроение и стандартизация",
    "Машина жасау және стандарттау",
    "Mechanical Engineering and Standardisation",
  ],
  ["Электроэнергетика", "Электр энергетикасы", "Electric Power Engineering"],
  ["Транспортная техника", "Көлік техникасы", "Transport Engineering"],
  ["Металлургия", "Металлургия", "Metallurgy"],
  [
    "Автоматизация и телекоммуникации",
    "Автоматтандыру және телекоммуникация",
    "Automation and Telecommunications",
  ],
  // FAC02
  ["Вычислительная техника", "Есептеу техникасы", "Computer Engineering"],
  ["Информационные системы", "Ақпараттық жүйелер", "Information Systems"],
  ["Программная инженерия", "Бағдарламалық инженерия", "Software Engineering"],
  ["Кибербезопасность", "Киберқауіпсіздік", "Cybersecurity"],
  ["Прикладная математика", "Қолданбалы математика", "Applied Mathematics"],
  // FAC03
  ["Биология и экология", "Биология және экология", "Biology and Ecology"],
  [
    "Химия и химические технологии",
    "Химия және химиялық технологиялар",
    "Chemistry and Chemical Technology",
  ],
  [
    "Физика и приборостроение",
    "Физика және аспап жасау",
    "Physics and Instrumentation",
  ],
  ["География и туризм", "География және туризм", "Geography and Tourism"],
  ["Геология и разведка", "Геология және барлау", "Geology and Exploration"],
  // FAC04
  [
    "Педагогика и методика",
    "Педагогика және әдістеме",
    "Pedagogy and Teaching Methods",
  ],
  ["Казахская филология", "Қазақ филологиясы", "Kazakh Philology"],
  ["Иностранная филология", "Шетел филологиясы", "Foreign Philology"],
  ["История и археология", "Тарих және археология", "History and Archaeology"],
  [
    "Психология и социальная работа",
    "Психология және әлеуметтік жұмыс",
    "Psychology and Social Work",
  ],
  // FAC05
  ["Экономика и финансы", "Экономика және қаржы", "Economics and Finance"],
  ["Учёт и аудит", "Есеп және аудит", "Accounting and Audit"],
  [
    "Менеджмент и маркетинг",
    "Менеджмент және маркетинг",
    "Management and Marketing",
  ],
  ["Юриспруденция", "Құқықтану", "Jurisprudence"],
  [
    "Государственное управление",
    "Мемлекеттік басқару",
    "Public Administration",
  ],
  // FAC06
  ["Агрономия", "Агрономия", "Agronomy"],
  ["Ветеринария", "Ветеринария", "Veterinary Medicine"],
  [
    "Технология пищевых производств",
    "Тағам өндірісінің технологиясы",
    "Food Production Technology",
  ],
  ["Зоотехния", "Зоотехния", "Animal Science"],
  ["Землеустройство", "Жерге орналастыру", "Land Management"],
  // FAC07
  ["Архитектура", "Сәулет", "Architecture"],
  ["Строительство", "Құрылыс", "Civil Engineering"],
  ["Дизайн среды", "Орта дизайны", "Environmental Design"],
  ["Инженерные системы", "Инженерлік жүйелер", "Building Services Engineering"],
  ["Градостроительство", "Қала құрылысы", "Urban Planning"],
  // FAC08 - reserved for crafted small groups
  ["Музыкальное образование", "Музыкалық білім", "Music Education"],
  ["Изобразительное искусство", "Бейнелеу өнері", "Fine Arts"],
  ["Физическая культура", "Дене шынықтыру", "Physical Education"],
  ["Спортивные дисциплины", "Спорт пәндері", "Sport Disciplines"],
  ["Театр и режиссура", "Театр және режиссура", "Theatre and Directing"],
]

export const DEPARTMENTS: readonly DepartmentRow[] = DEPARTMENT_SEEDS.map(
  (seed, i) => ({
    code: `DEP${String(i + 1).padStart(2, "0")}`,
    faculty_code: `FAC${String(Math.floor(i / 5) + 1).padStart(2, "0")}`,
    name_ru: `Кафедра «${seed[0]}»`,
    name_kk: `«${seed[1]}» кафедрасы`,
    name_en: `Department of ${seed[2]}`,
  })
)

/**
 * A handful of programmes only. ОП is not derivable from the legacy export
 * (PLAN §1.1), so no fixture check carries a `program_id`; these rows exist
 * so the dictionary and its filter surface are non-empty.
 */
export const PROGRAMS: readonly ProgramRow[] = [
  {
    code: "PROG01",
    department_code: "DEP01",
    name_ru: "6B07101 - Машиностроение",
    name_kk: "6B07101 - Машина жасау",
    name_en: "6B07101 - Mechanical Engineering",
  },
  {
    code: "PROG02",
    department_code: "DEP08",
    name_ru: "6B06103 - Программная инженерия",
    name_kk: "6B06103 - Бағдарламалық инженерия",
    name_en: "6B06103 - Software Engineering",
  },
  {
    code: "PROG03",
    department_code: "DEP11",
    name_ru: "6B05101 - Биология",
    name_kk: "6B05101 - Биология",
    name_en: "6B05101 - Biology",
  },
  {
    code: "PROG04",
    department_code: "DEP17",
    name_ru: "6B01701 - Казахский язык и литература",
    name_kk: "6B01701 - Қазақ тілі мен әдебиеті",
    name_en: "6B01701 - Kazakh Language and Literature",
  },
  {
    code: "PROG05",
    department_code: "DEP21",
    name_ru: "6B04101 - Экономика",
    name_kk: "6B04101 - Экономика",
    name_en: "6B04101 - Economics",
  },
  {
    code: "PROG06",
    department_code: "DEP26",
    name_ru: "6B08101 - Агрономия",
    name_kk: "6B08101 - Агрономия",
    name_en: "6B08101 - Agronomy",
  },
]

/** TZ §4.2 §3 work types plus the `other` («иное») fallback. */
export const WORK_TYPES: readonly WorkTypeRow[] = [
  {
    code: "course",
    name_ru: "Курсовая работа",
    name_kk: "Курстық жұмыс",
    name_en: "Course paper",
    sort_order: 10,
  },
  {
    code: "thesis_bachelor",
    name_ru: "Дипломная работа (ВКР)",
    name_kk: "Дипломдық жұмыс",
    name_en: "Bachelor thesis",
    sort_order: 20,
  },
  {
    code: "thesis_master",
    name_ru: "Магистерская диссертация",
    name_kk: "Магистрлік диссертация",
    name_en: "Master thesis",
    sort_order: 30,
  },
  {
    code: "thesis_phd",
    name_ru: "Докторская диссертация (PhD)",
    name_kk: "Докторлық диссертация (PhD)",
    name_en: "PhD thesis",
    sort_order: 40,
  },
  {
    code: "article",
    name_ru: "Статья ППС",
    name_kk: "ПОҚ мақаласы",
    name_en: "Faculty article",
    sort_order: 50,
  },
  {
    code: "research_report",
    name_ru: "Научно-исследовательская работа (НИР)",
    name_kk: "Ғылыми-зерттеу жұмысы",
    name_en: "Research report",
    sort_order: 60,
  },
  {
    code: "other",
    name_ru: "Иное",
    name_kk: "Өзге",
    name_en: "Other",
    sort_order: 90,
  },
]

export const WORK_TYPE_CODES = WORK_TYPES.map((w) => w.code)

// ── Work-type rules (ADR-008 §7) ────────────────────────────────────────────

export type WorkTypeRule = {
  /** Lower-cased substring matched against `norm(title)`. */
  pattern: string
  work_type: string
  priority: number
}

/**
 * First match wins, ordered by (priority ASC, pattern ASC). Patterns are
 * plain case-insensitive substrings over the normalized title; `other` is the
 * implicit fallback and therefore has no rule row.
 */
export const WORK_TYPE_RULES: readonly WorkTypeRule[] = [
  { pattern: "докторская диссертация", work_type: "thesis_phd", priority: 10 },
  { pattern: "диссертация phd", work_type: "thesis_phd", priority: 11 },
  { pattern: "докторлық диссертация", work_type: "thesis_phd", priority: 12 },
  {
    pattern: "магистерская диссертация",
    work_type: "thesis_master",
    priority: 20,
  },
  {
    pattern: "магистрлік диссертация",
    work_type: "thesis_master",
    priority: 21,
  },
  {
    pattern: "выпускная квалификационная работа",
    work_type: "thesis_bachelor",
    priority: 30,
  },
  {
    pattern: "дипломная работа",
    work_type: "thesis_bachelor",
    priority: 31,
  },
  { pattern: "дипломный проект", work_type: "thesis_bachelor", priority: 32 },
  { pattern: "дипломдық жұмыс", work_type: "thesis_bachelor", priority: 33 },
  { pattern: "курсовая работа", work_type: "course", priority: 40 },
  { pattern: "курсовой проект", work_type: "course", priority: 41 },
  { pattern: "курстық жұмыс", work_type: "course", priority: 42 },
  { pattern: "научная статья", work_type: "article", priority: 50 },
  { pattern: "статья ппс", work_type: "article", priority: 51 },
  { pattern: "тезисы доклада", work_type: "article", priority: 52 },
  {
    pattern: "научно-исследовательская работа",
    work_type: "research_report",
    priority: 60,
  },
  { pattern: "отчет по нир", work_type: "research_report", priority: 61 },
  { pattern: "отчёт по нир", work_type: "research_report", priority: 62 },
]

/** Rule-evaluation order: priority ascending, then pattern ascending. */
export const WORK_TYPE_RULES_ORDERED: readonly WorkTypeRule[] = [
  ...WORK_TYPE_RULES,
].sort((a, b) =>
  a.priority !== b.priority
    ? a.priority - b.priority
    : a.pattern < b.pattern
      ? -1
      : a.pattern > b.pattern
        ? 1
        : 0
)

// ── Initiator rules (ADR-008 §5) ────────────────────────────────────────────

export const TEACHER_DOMAIN = "teachers.tou.edu.kz"
export const REGISTRAR_PREFIXES = ["registrar", "reg."] as const

export type InitiatorRule = {
  /** Human-readable rule id, mirrored into `initiator_rules.pattern`. */
  pattern: string
  initiator: "staff_self" | "registrar" | "other"
  priority: number
}

export const INITIATOR_RULES: readonly InitiatorRule[] = [
  { pattern: `@${TEACHER_DOMAIN}`, initiator: "staff_self", priority: 10 },
  { pattern: "^registrar", initiator: "registrar", priority: 20 },
  { pattern: "^reg\\.", initiator: "registrar", priority: 21 },
]

// ── Normalization (ADR-008 §2) ──────────────────────────────────────────────

/**
 * `norm(s)` = Unicode NFC → trim → collapse internal whitespace runs to a
 * single space → lowercase. Must be identical in the Rust parser; the whole
 * attempt-grouping and work-type story rides on it.
 */
export function norm(s: string): string {
  return s.normalize("NFC").trim().replace(/\s+/gu, " ").toLowerCase()
}

// ── Scale presets ───────────────────────────────────────────────────────────

export type Scale = "small" | "load"

/**
 * Academic-year start year → number of *importable* checks (non-deleted,
 * well-formed) the generator must emit for that year.
 */
export const SCALE_TARGETS: Record<Scale, Record<number, number>> = {
  small: { 2023: 19_200, 2024: 20_000, 2025: 20_800 },
  load: {
    2021: 48_000,
    2022: 49_000,
    2023: 50_000,
    2024: 51_000,
    2025: 52_000,
  },
}

export function academicYearsFor(scale: Scale): number[] {
  return Object.keys(SCALE_TARGETS[scale])
    .map((k) => Number(k))
    .sort((a, b) => a - b)
}

/** `2024` → `"2024-2025"`, the on-disk directory name. */
export function academicYearDir(ay: number): string {
  return `${ay}-${ay + 1}`
}

// ── Exact-arithmetic rounding helpers ───────────────────────────────────────

/**
 * Half-up rounding of `num / den` to 4 decimal places, in integer arithmetic
 * so the result never depends on binary-float association order.
 */
export function ratio4(num: number, den: number): number {
  if (den === 0) return 0
  const scaled = num * 10_000
  const q = Math.floor(scaled / den)
  const r = scaled - q * den
  const rounded = r * 2 >= den ? q + 1 : q
  return rounded / 10_000
}

/**
 * Mean of values expressed in integer hundredths (originality has exactly two
 * decimals in the source), rounded half-up to 4 dp.
 */
export function meanFromHundredths(
  sumHundredths: number,
  count: number
): number {
  if (count === 0) return 0
  return ratio4(sumHundredths, count * 100)
}
