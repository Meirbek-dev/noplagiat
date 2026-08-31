/**
 * Deterministic fixture generator - slice W0.3.
 *
 *   bun fixtures/generate.ts [--scale small|load] [--seed N] [--root DIR]
 *
 * Emits SOURCE-SHAPED data, i.e. exactly the legacy vendor export dialect
 * pinned by docs/adr/008-legacy-derivation-and-hmac.md §1, so the Rust
 * importer is exercised on its real input rather than a convenient one:
 *
 *   <root>/out/<ay>/documents.csv     UTF-8 BOM, ";", RU dates, decimal comma
 *   <root>/out/<ay>/system-usage.csv  the single-row aggregate file
 *   <root>/out/<ay>/malformed.json    sidecar: exact expected rejection counts
 *   <root>/out/manifest.json          seed/scale/per-year totals
 *   <root>/dictionaries.sql           faculties/departments/programs/work types
 *   <root>/work-type-rules.sql        title-pattern → work type
 *   <root>/staff-units.csv            reviewer e-mail → faculty;department
 *
 * DETERMINISM IS THE GATE (AGENTS.md §6): no Math.random, no Date.now, no
 * environment or filesystem input feeds a value. Same seed → byte-identical
 * bytes, asserted by `bun fixtures/verify.ts`.
 *
 * NO REAL DATA. Every name, title and e-mail below is synthetically assembled
 * from syllable tables; nothing is copied from `stats/`.
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import {
  BOM,
  DEPARTMENTS,
  EMBEDDED_EOL,
  EOL,
  FACULTIES,
  INITIATOR_RULES,
  NO,
  PROGRAMS,
  REPORT_BASE,
  SCALE_TARGETS,
  SEP,
  SOURCE_HEADER,
  STATUS_DELETED,
  STATUS_NOT_DELETED,
  TEACHER_DOMAIN,
  UNASSIGNED,
  UNASSIGNED_NAME_EN,
  UNASSIGNED_NAME_KK,
  UNASSIGNED_NAME_RU,
  USAGE_HEADER,
  WORK_TYPES,
  WORK_TYPE_RULES,
  YES,
  academicYearDir,
  academicYearsFor,
  type Scale,
} from "./rules"

// ── Seeded RNG (mulberry32) ─────────────────────────────────────────────────

type Rng = () => number

function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable 32-bit hash so each stream can be seeded from (seed, label). */
function streamSeed(seed: number, label: string): number {
  let h = 2166136261 ^ seed
  for (let i = 0; i < label.length; i++) {
    h ^= label.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const int = (rng: Rng, lo: number, hi: number): number =>
  lo + Math.floor(rng() * (hi - lo + 1))

const pick = <T>(rng: Rng, xs: readonly T[]): T =>
  xs[Math.floor(rng() * xs.length)] as T

// ── Civil-date arithmetic (pure; no `Date` clock is ever read) ──────────────

type Stamp = { y: number; mo: number; d: number; h: number; mi: number }

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

function daysInMonth(y: number, mo: number): number {
  return mo === 2 && isLeap(y) ? 29 : (MONTH_DAYS[mo - 1] as number)
}

/** Howard Hinnant's days_from_civil. */
function daysFromCivil(y0: number, mo: number, d: number): number {
  const y = y0 - (mo <= 2 ? 1 : 0)
  const era = Math.floor(y / 400)
  const yoe = y - era * 400
  const doy = Math.floor((153 * (mo + (mo > 2 ? -3 : 9)) + 2) / 5) + d - 1
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy
  return era * 146097 + doe - 719468
}

function civilFromDays(z0: number): { y: number; mo: number; d: number } {
  const z = z0 + 719468
  const era = Math.floor(z / 146097)
  const doe = z - era * 146097
  const yoe = Math.floor(
    (doe -
      Math.floor(doe / 1460) +
      Math.floor(doe / 36524) -
      Math.floor(doe / 146096)) /
      365
  )
  const y = yoe + era * 400
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100))
  const mp = Math.floor((5 * doy + 2) / 153)
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1
  const mo = mp + (mp < 10 ? 3 : -9)
  return { y: y + (mo <= 2 ? 1 : 0), mo, d }
}

/** Minutes since 1970-01-01T00:00 local (+05:00) - a total sort key. */
function stampKey(s: Stamp): number {
  return daysFromCivil(s.y, s.mo, s.d) * 1440 + s.h * 60 + s.mi
}

function stampFromKey(key: number): Stamp {
  const days = Math.floor(key / 1440)
  const rem = key - days * 1440
  const c = civilFromDays(days)
  return { y: c.y, mo: c.mo, d: c.d, h: Math.floor(rem / 60), mi: rem % 60 }
}

const p2 = (n: number): string => String(n).padStart(2, "0")

/** `dd.MM.yyyy HH:mm` - the only date format the source ever emits. */
function formatStamp(s: Stamp): string {
  return `${p2(s.d)}.${p2(s.mo)}.${s.y} ${p2(s.h)}:${p2(s.mi)}`
}

/** Academic year `ay` covers Sep 1 `ay` .. Aug 31 `ay+1`. */
function monthOfAy(ay: number, offset: number): { y: number; mo: number } {
  const m0 = 9 + offset
  return m0 <= 12 ? { y: ay, mo: m0 } : { y: ay + 1, mo: m0 - 12 }
}

const AY_LAST_KEY = (ay: number): number =>
  daysFromCivil(ay + 1, 8, 31) * 1440 + 23 * 60 + 59

/** Seasonal load: exam-session peaks in Dec/Jan and May/Jun. */
const MONTH_WEIGHTS = [5, 7, 9, 14, 13, 6, 7, 10, 14, 9, 4, 2]
const MONTH_WEIGHT_TOTAL = MONTH_WEIGHTS.reduce((a, b) => a + b, 0)

function randomStampInAy(rng: Rng, ay: number): Stamp {
  const roll = rng() * MONTH_WEIGHT_TOTAL
  let acc = 0
  let offset = MONTH_WEIGHTS.length - 1
  for (let i = 0; i < MONTH_WEIGHTS.length; i++) {
    acc += MONTH_WEIGHTS[i] as number
    if (roll < acc) {
      offset = i
      break
    }
  }
  const { y, mo } = monthOfAy(ay, offset)
  // Most checks happen in office hours, but a real export also has
  // early-morning and late-evening rows - and those are exactly the rows that
  // expose a query truncating in UTC instead of the +05:00 the ADR pins. A
  // quarter of the early-morning ones are forced onto the 1st, so the *month*
  // (not just the day) differs between the two interpretations.
  const shift = rng()
  const h =
    shift < 0.04
      ? int(rng, 0, 5)
      : shift < 0.07
        ? int(rng, 21, 23)
        : int(rng, 8, 20)
  let d = int(rng, 1, daysInMonth(y, mo))
  if (h <= 5 && rng() < 0.25) d = 1
  return { y, mo, d, h, mi: int(rng, 0, 59) }
}

// ── Synthetic person names ──────────────────────────────────────────────────
// Assembled from syllables so they are name-SHAPED (the ingest PII-absence
// test needs that) while being obviously fabricated.

const STEM_RU = [
  "Ақ",
  "Бал",
  "Дос",
  "Ер",
  "Жан",
  "Қай",
  "Мұр",
  "Нұр",
  "Сал",
  "Тем",
  "Ұл",
  "Шад",
  "Айт",
  "Бек",
  "Ғаз",
  "Дәу",
]
const STEM_LAT = [
  "ak",
  "bal",
  "dos",
  "er",
  "zhan",
  "kai",
  "mur",
  "nur",
  "sal",
  "tem",
  "ul",
  "shad",
  "ait",
  "bek",
  "gaz",
  "dau",
]
const END_RU = [
  "баев",
  "ғұлов",
  "ов",
  "ев",
  "султанов",
  "бекұлы",
  "дінов",
  "жанов",
]
const END_LAT = [
  "bayev",
  "gulov",
  "ov",
  "ev",
  "sultanov",
  "bekuly",
  "dinov",
  "zhanov",
]
const FIRST_RU = ["А", "Б", "Д", "Е", "Ж", "К", "М", "Н", "С", "Т"]
const FIRST_LAT = ["a", "b", "d", "e", "zh", "k", "m", "n", "s", "t"]
const PATRON_RU = ["Қ", "С", "М", "Т", "Ж", "Б", "Н", "А"]

type Person = { nameRu: string; local: string }

function makePerson(rng: Rng): Person {
  const si = int(rng, 0, STEM_RU.length - 1)
  const ei = int(rng, 0, END_RU.length - 1)
  const fi = int(rng, 0, FIRST_RU.length - 1)
  const pi = int(rng, 0, PATRON_RU.length - 1)
  return {
    nameRu: `${STEM_RU[si]}${END_RU[ei]} ${FIRST_RU[fi]}.${PATRON_RU[pi]}.`,
    local: `${FIRST_LAT[fi]}.${STEM_LAT[si]}${END_LAT[ei]}`,
  }
}

// ── Title material (deliberately free of any work-type rule pattern) ────────

const DISCIPLINES = [
  "Теория механизмов",
  "Сопротивление материалов",
  "Электротехника",
  "Базы данных",
  "Операционные системы",
  "Дискретная математика",
  "Органическая химия",
  "Молекулярная биология",
  "Общая физика",
  "Экономическая теория",
  "Бухгалтерский учёт",
  "Гражданское право",
  "История Казахстана",
  "Методика преподавания",
  "Возрастная психология",
  "Агрохимия",
  "Ветеринарная санитария",
  "Пищевая биотехнология",
  "Архитектурное проектирование",
  "Строительные конструкции",
  "Геодезия",
  "Гидравлика",
  "Металловедение",
  "Теплотехника",
  "Микроэкономика",
  "Финансовый менеджмент",
  "Логистика",
  "Английский язык для специальных целей",
  "Казахская литература",
  "Философия науки",
  "Социология",
  "Политология",
  "Машинное обучение",
  "Компьютерные сети",
  "Веб-технологии",
  "Экология человека",
  "Почвоведение",
  "Зоогигиена",
  "Ландшафтная архитектура",
  "Сметное дело",
]

const TOPICS = [
  "Оптимизация производственных процессов на предприятии региона",
  "Цифровая трансформация управления учебным заведением",
  "Моделирование тепловых режимов промышленного оборудования",
  "Применение нейросетевых моделей в прикладных задачах",
  "Оценка экологического состояния малых рек Прииртышья",
  "Совершенствование системы внутреннего контроля организации",
  "Развитие альтернативной энергетики в северном регионе",
  "Правовое регулирование цифровых активов",
  "Формирование читательской грамотности обучающихся",
  "Диагностика профессионального выгорания специалистов",
  "Технология переработки вторичного сырья",
  "Повышение продуктивности кормовых культур",
  "Реновация исторической застройки центральной части города",
  "Расчёт несущей способности сборных конструкций",
  "Управление инвестиционной привлекательностью региона",
  "Методы контроля качества сварных соединений",
  "Автоматизация учёта материальных ресурсов",
  "Исследование коррозионной стойкости покрытий",
  "Сравнительный анализ систем налогообложения",
  "Интерактивные методы обучения в высшей школе",
  "Биоиндикация загрязнения атмосферного воздуха",
  "Разработка информационной системы поддержки решений",
  "Кластерный анализ социально-экономических показателей",
  "Энергоэффективность жилых зданий в резко континентальном климате",
  "Прогнозирование урожайности зерновых культур",
  "Защита персональных данных в информационных системах",
  "Мотивация персонала в условиях удалённой занятости",
  "Формирование коммуникативной компетенции студентов",
  "Утилизация золошлаковых отходов теплоэлектростанций",
  "Синтез и свойства функциональных полимеров",
  "Влияние микроклимата на продуктивность животных",
  "Проектирование транспортной инфраструктуры малых городов",
  "Оценка рисков в проектной деятельности",
  "Технологии предиктивного обслуживания оборудования",
  "Инклюзивная образовательная среда университета",
  "Стратегия развития агропромышленного комплекса",
  "Аудит эффективности бюджетных расходов",
  "Виртуальные лабораторные практикумы в инженерном образовании",
  "Микробиологический мониторинг питьевого водоснабжения",
  "Численное моделирование гидродинамических процессов",
  "Цифровые двойники в машиностроении",
  "Совершенствование кадастровой оценки земель",
  "Психологическая адаптация первокурсников",
  "Композиционные материалы на основе местного сырья",
  "Развитие экологического туризма",
  "Институциональные основы государственного управления",
  "Технология производства функциональных продуктов питания",
  "Автоматизированный контроль качества дорожных покрытий",
  "Анализ временных рядов финансовых показателей",
  "Профилактика академической недобросовестности в вузе",
]

/** Templates whose text triggers the intended `work_type_rules` pattern. */
const TITLE_TEMPLATES: Record<string, readonly string[]> = {
  course: [
    "Курсовая работа по дисциплине «{D}»",
    "Курсовой проект по дисциплине «{D}»",
    "Курстық жұмыс: {D}",
  ],
  thesis_bachelor: [
    "Дипломная работа на тему «{T}»",
    "Выпускная квалификационная работа: {T}",
    "Дипломный проект «{T}»",
    "Дипломдық жұмыс: {T}",
  ],
  thesis_master: [
    "Магистерская диссертация «{T}»",
    "Магистрлік диссертация: {T}",
  ],
  thesis_phd: [
    "Докторская диссертация (PhD) «{T}»",
    "Диссертация PhD: {T}",
    "Докторлық диссертация «{T}»",
  ],
  article: ["Научная статья «{T}»", "Статья ППС: {T}", "Тезисы доклада «{T}»"],
  research_report: [
    "Научно-исследовательская работа по теме «{T}»",
    "Отчет по НИР: {T}",
    "Отчёт по НИР №{N}: {T}",
  ],
  /** Matches NO rule → must classify as `other` / «иное». */
  other: [
    "Реферат «{T}»",
    "Эссе на тему «{T}»",
    "Аналитическая записка №{N}",
    "Практическая работа №{N} по предмету «{D}»",
    "Отчет о прохождении практики «{T}»",
    "Контрольная работа №{N}",
  ],
}

/** Draw a work type. `other` is common enough to be worth its own bar. */
const WORK_TYPE_MIX: readonly (readonly [string, number])[] = [
  ["course", 34],
  ["thesis_bachelor", 22],
  ["thesis_master", 9],
  ["thesis_phd", 3],
  ["article", 12],
  ["research_report", 8],
  ["other", 12],
]
const WORK_TYPE_MIX_TOTAL = WORK_TYPE_MIX.reduce((a, [, w]) => a + w, 0)

function drawWorkType(rng: Rng): string {
  const roll = rng() * WORK_TYPE_MIX_TOTAL
  let acc = 0
  for (const [code, w] of WORK_TYPE_MIX) {
    acc += w
    if (roll < acc) return code
  }
  return "other"
}

function buildTitle(rng: Rng, workType: string): string {
  const tpl = pick(rng, TITLE_TEMPLATES[workType] as readonly string[])
  let t = tpl
    .replace("{D}", pick(rng, DISCIPLINES))
    .replace("{T}", pick(rng, TOPICS))
    .replace("{N}", String(int(rng, 1, 240)))
  // A variant token keeps distinct works distinct without forbidding the
  // natural collisions the source really has (PLAN §1.4, duplicate links).
  t += ` (вариант ${int(rng, 1, 60)})`

  // Data-quality hazard #1 (PLAN §1.4): fields carrying `;` / newlines /
  // quotes. These rows are VALID - a correct importer must parse them.
  const hazard = rng()
  if (hazard < 0.0055) {
    t = t.replace(" на тему ", `${EMBEDDED_EOL}на тему `)
    if (!t.includes(EMBEDDED_EOL)) t += `${EMBEDDED_EOL}(продолжение)`
  } else if (hazard < 0.025) {
    t += "; часть 2"
  } else if (hazard < 0.028) {
    t = t.replace(/«([^»]*)»/u, '"$1"')
  }
  return t
}

function buildAuthors(rng: Rng): string {
  const a = makePerson(rng).nameRu
  // ~8 % of works are co-authored - the field then contains `;` and must be
  // quoted by the writer and unquoted by the reader.
  if (rng() < 0.08) return `${a}; ${makePerson(rng).nameRu}`
  return a
}

// ── Reviewers ───────────────────────────────────────────────────────────────

type Reviewer = {
  email: string
  name: string
  userId: number
  facultyCode: string | null
  departmentCode: string | null
  weight: number
}

/** Departments outside FAC08 - FAC08 is reserved for crafted small groups. */
const BULK_DEPARTMENTS = DEPARTMENTS.filter((d) => d.faculty_code !== "FAC08")
const SMALL_GROUP_DEPARTMENTS = DEPARTMENTS.filter(
  (d) => d.faculty_code === "FAC08"
)

/** Six reviewers whose rows are ALL crafted small groups (n = 1..k+1). */
const SMALL_GROUP_REVIEWERS: readonly Reviewer[] = [1, 2, 3, 4, 5, 6].map(
  (n) => ({
    email: `sgrp0${n}.${STEM_LAT[n]}${END_LAT[n]}@${TEACHER_DOMAIN}`,
    name: `${STEM_RU[n]}${END_RU[n]} ${FIRST_RU[n]}.${PATRON_RU[n]}.`,
    userId: 29000 + n,
    facultyCode: "FAC08",
    // Wraps: five FAC08 departments carry six crafted groups.
    departmentCode: (
      SMALL_GROUP_DEPARTMENTS[(n - 1) % SMALL_GROUP_DEPARTMENTS.length] as
        | { code: string }
        | undefined
    )?.code as string,
    weight: 1,
  })
)

/**
 * Reviewer pool for one academic year. Seeded from the academic year ONLY, so
 * `--scale small` and `--scale load` agree on who exists and `staff-units.csv`
 * is stable between them.
 *
 * Pre-2025/26 the source shows 16–20 central operator accounts and no usable
 * unit signal (PLAN §1.2) - those reviewers are deliberately left unmapped so
 * every earlier-year check lands in the `UNASSIGNED` sentinel.
 */
function buildReviewers(seed: number, ay: number): Reviewer[] {
  const rng = mulberry32(streamSeed(seed, `reviewers:${ay}`))
  const taken = new Set<string>()
  const uniq = (local: string): string => {
    let candidate = local
    let n = 2
    while (taken.has(candidate)) candidate = `${local}${n++}`
    taken.add(candidate)
    return candidate
  }

  if (ay >= 2025) {
    const out: Reviewer[] = []
    const MAPPED = 146
    const UNMAPPED = 20
    for (let i = 0; i < MAPPED + UNMAPPED; i++) {
      const p = makePerson(rng)
      const local = uniq(p.local)
      const mapped = i < MAPPED
      const dep = BULK_DEPARTMENTS[i % BULK_DEPARTMENTS.length]
      out.push({
        email: `${local}@${TEACHER_DOMAIN}`,
        name: p.nameRu,
        userId: 20000 + i,
        facultyCode: mapped ? (dep?.faculty_code ?? null) : null,
        departmentCode: mapped ? (dep?.code ?? null) : null,
        weight: 1 + Math.floor(rng() ** 3 * 40),
      })
    }
    return out
  }

  // Central operators: registrar accounts, service accounts on other domains,
  // and a few teacher accounts, per ADR-008 §5's three initiator classes.
  const size = ay === 2021 ? 16 : ay === 2022 ? 18 : ay === 2023 ? 20 : 17
  const out: Reviewer[] = []
  for (let i = 0; i < size; i++) {
    const p = makePerson(rng)
    const share = i / size
    let email: string
    if (share < 0.6) {
      const local = uniq(
        i % 2 === 0 ? `registrar.op${p2(i + 1)}` : `reg.op${p2(i + 1)}`
      )
      email = `${local}@tou.edu.kz`
    } else if (share < 0.85) {
      const local = uniq(`antiplag${p2(i + 1)}`)
      email = `${local}@${i % 2 === 0 ? "lib.tou.edu.kz" : "tou.edu.kz"}`
    } else {
      email = `${uniq(p.local)}@${TEACHER_DOMAIN}`
    }
    out.push({
      email,
      name: p.nameRu,
      userId: 10000 + (ay - 2021) * 100 + i,
      facultyCode: null,
      departmentCode: null,
      weight: 1 + Math.floor(rng() ** 2 * 12),
    })
  }
  return out
}

function cumulativeWeights(pool: readonly Reviewer[]): number[] {
  const acc: number[] = []
  let sum = 0
  for (const r of pool) {
    sum += r.weight
    acc.push(sum)
  }
  return acc
}

function drawReviewer(
  rng: Rng,
  pool: readonly Reviewer[],
  cum: readonly number[]
): Reviewer {
  const total = cum[cum.length - 1] as number
  const roll = rng() * total
  let lo = 0
  let hi = cum.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if ((cum[mid] as number) <= roll) lo = mid + 1
    else hi = mid
  }
  return pool[lo] as Reviewer
}

// ── Rows ────────────────────────────────────────────────────────────────────

type Malformed = "none" | "column_shifted" | "bad_link"

type Row = {
  key: number
  ts: Stamp
  title: string
  authors: string
  /** Percentages as integer hundredths - no float ever reaches the file. */
  originality: number
  selfCite: number
  citation: number
  match: number
  ai: number
  reviewerName: string
  reviewerEmail: string
  suspicious: boolean
  cleared: boolean
  deleted: boolean
  reportId: number
  userId: number
  malformed: Malformed
}

const sourceCheckId = (r: Row): string => `${r.userId}:${r.reportId}`

/** Originality mixture covering every histogram bucket with mass to spare. */
function drawOriginality(rng: Rng): number {
  const roll = rng()
  if (roll < 0.08) return int(rng, 1500, 4999)
  if (roll < 0.3) return int(rng, 5000, 6999)
  if (roll < 0.6) return int(rng, 7000, 8499)
  if (roll < 0.88) return int(rng, 8500, 9499)
  return int(rng, 9500, 10000)
}

/**
 * Exact bucket edges must exist in the data - TZ §4.2 §5 / W1.2's boundary
 * proptests are only meaningful if 50.00 / 70.00 / 85.00 / 95.00 are present.
 */
const BOUNDARY_VALUES = [5000, 7000, 8500, 9500]
const BOUNDARY_EVERY = 250

function derivedPercentages(
  rng: Rng,
  originality: number
): { selfCite: number; citation: number; match: number; ai: number } {
  const rest = 10000 - originality
  const citation = Math.floor(rest * (0.2 + rng() * 0.4))
  const selfCite = Math.floor((rest - citation) * (rng() * 0.4))
  const match = rest - citation - selfCite
  const ai = Math.floor(rng() ** 3 * 6000)
  return { selfCite, citation, match, ai }
}

/** Per-year share of «Удален» rows (2024/25 really is the outlier: 272/5429). */
const DELETED_SHARE: Record<number, number> = {
  2021: 0.008,
  2022: 0.01,
  2023: 0.009,
  2024: 0.05,
  2025: 0.012,
}

/** Per-year «Подозрительный документ» share, tracking PLAN §1's table. */
const SUSPICIOUS_SHARE: Record<number, number> = {
  2021: 0.037,
  2022: 0.044,
  2023: 0.035,
  2024: 0.19,
  2025: 0.56,
}

/** Column-shifted rows per year - the shape observed in 2024/25. */
const SHIFTED_ROWS: Record<number, number> = {
  2021: 3,
  2022: 2,
  2023: 3,
  2024: 4,
  2025: 5,
}
const BAD_LINK_ROWS = 2

const RECHECK_WORK_SHARE = 0.12
/** Share of multi-attempt works whose attempts reuse one report link. */
const DUPLICATE_LINK_SHARE = 0.02

type YearResult = {
  ay: number
  rows: Row[]
  importable: number
  deleted: number
  shiftedIndices: number[]
  badLinkIndices: number[]
  activeReviewers: number
  poolSize: number
}

function generateYear(seed: number, ay: number, target: number): YearResult {
  const rng = mulberry32(streamSeed(seed, `year:${ay}`))
  const pool = buildReviewers(seed, ay)
  const cum = cumulativeWeights(pool)
  const rows: Row[] = []
  let reportSeq = 1
  const nextReportId = (): number => ay * 1_000_000 + reportSeq++

  const suspiciousShare = SUSPICIOUS_SHARE[ay] ?? 0.05
  const ayLast = AY_LAST_KEY(ay)

  const pushRow = (
    ts: Stamp,
    title: string,
    authors: string,
    originality: number,
    reviewer: Reviewer,
    reportId: number,
    opts: { deleted?: boolean; forceClean?: boolean } = {}
  ): void => {
    const pct = derivedPercentages(rng, originality)
    const suspicious = opts.forceClean ? false : rng() < suspiciousShare
    const cleared = suspicious && rng() < 0.4
    rows.push({
      key: stampKey(ts),
      ts,
      title,
      authors,
      originality,
      ...pct,
      reviewerName: reviewer.name,
      reviewerEmail: reviewer.email,
      suspicious,
      cleared,
      deleted: opts.deleted ?? false,
      reportId,
      userId: reviewer.userId,
      malformed: "none",
    })
  }

  // ── 1. Crafted small groups (AY 2025/26 only) ───────────────────────────
  // Exactly n rows in (FAC08 × work type × month) for n = 1..k+1, so primary
  // AND complementary suppression have something to bite on (AGENTS.md §6).
  let importable = 0
  if (ay === 2025) {
    const specs: readonly (readonly [number, number, string])[] = [
      [1, 0, "course"],
      [2, 1, "thesis_bachelor"],
      [3, 2, "thesis_master"],
      [4, 3, "thesis_phd"],
      [5, 4, "article"],
      [6, 5, "research_report"],
    ]
    for (const [n, offset, workType] of specs) {
      const reviewer = SMALL_GROUP_REVIEWERS[n - 1] as Reviewer
      const { y, mo } = monthOfAy(ay, offset)
      for (let i = 0; i < n; i++) {
        const ts: Stamp = {
          y,
          mo,
          d: Math.min(3 + i * 3, daysInMonth(y, mo)),
          h: 9 + (i % 8),
          mi: (i * 7) % 60,
        }
        const title = `${buildTitle(rng, workType)} [контрольная группа SG-${n}-${i + 1}]`
        pushRow(
          ts,
          title,
          buildAuthors(rng),
          drawOriginality(rng),
          reviewer,
          nextReportId(),
          { forceClean: true }
        )
        importable++
      }
    }
  }

  // ── 2. Bulk works, with 2–3 attempts for a share of them ────────────────
  let boundaryCursor = 0
  while (importable < target) {
    const workType = drawWorkType(rng)
    const title = buildTitle(rng, workType)
    const authors = buildAuthors(rng)
    const reviewer = drawReviewer(rng, pool, cum)
    const first = randomStampInAy(rng, ay)

    let attempts = 1
    if (rng() < RECHECK_WORK_SHARE) attempts = rng() < 0.7 ? 2 : 3
    const sharedLink = attempts > 1 && rng() < DUPLICATE_LINK_SHARE
    const linkId = nextReportId()

    let originality = drawOriginality(rng)
    if (importable % BOUNDARY_EVERY === 0) {
      originality = BOUNDARY_VALUES[
        boundaryCursor++ % BOUNDARY_VALUES.length
      ] as number
    }

    let key = stampKey(first)
    for (let a = 0; a < attempts && importable < target; a++) {
      if (a > 0) {
        // A recheck lands 3–25 days later; if that would leave the academic
        // year the work simply has fewer attempts (keeps every work_ref
        // inside a single ingest batch - see fixtures/README.md).
        const next = key + int(rng, 3, 25) * 1440 + int(rng, -240, 240)
        if (next > ayLast) break
        key = next
        const delta = rng() < 0.75 ? int(rng, 100, 900) : -int(rng, 50, 400)
        originality = Math.max(0, Math.min(10000, originality + delta))
      }
      pushRow(
        stampFromKey(key),
        title,
        authors,
        originality,
        reviewer,
        sharedLink ? linkId : a === 0 ? linkId : nextReportId()
      )
      importable++
    }
  }

  // ── 3. «Удален» rows - excluded from facts, counted by the importer ─────
  // They are standalone works (unique titles) on purpose: attempt numbering
  // must not depend on whether deleted rows are filtered before or after
  // grouping, or ingest and this generator could disagree legitimately.
  const deletedCount = Math.round(target * (DELETED_SHARE[ay] ?? 0.01))
  for (let i = 0; i < deletedCount; i++) {
    const workType = drawWorkType(rng)
    pushRow(
      randomStampInAy(rng, ay),
      `${buildTitle(rng, workType)} [отозвано ${i + 1}]`,
      buildAuthors(rng),
      drawOriginality(rng),
      drawReviewer(rng, pool, cum),
      nextReportId(),
      { deleted: true }
    )
  }

  // ── 4. Malformed rows the importer MUST reject (PLAN §1.4) ──────────────
  const shifted = SHIFTED_ROWS[ay] ?? 3
  for (let i = 0; i < shifted; i++) {
    const reviewer = drawReviewer(rng, pool, cum)
    const before = rows.length
    pushRow(
      randomStampInAy(rng, ay),
      `${buildTitle(rng, drawWorkType(rng))} [сдвиг колонок ${i + 1}]`,
      buildAuthors(rng),
      drawOriginality(rng),
      reviewer,
      nextReportId()
    )
    ;(rows[before] as Row).malformed = "column_shifted"
  }
  for (let i = 0; i < BAD_LINK_ROWS; i++) {
    const reviewer = drawReviewer(rng, pool, cum)
    const before = rows.length
    pushRow(
      randomStampInAy(rng, ay),
      `${buildTitle(rng, drawWorkType(rng))} [битая ссылка ${i + 1}]`,
      buildAuthors(rng),
      drawOriginality(rng),
      reviewer,
      nextReportId()
    )
    ;(rows[before] as Row).malformed = "bad_link"
  }

  // Real exports arrive date-ordered; ties break on source_check_id exactly
  // like ADR-008 §3's attempt ordering.
  rows.sort((a, b) => {
    if (a.key !== b.key) return a.key - b.key
    const ka = sourceCheckId(a)
    const kb = sourceCheckId(b)
    return ka < kb ? -1 : ka > kb ? 1 : 0
  })

  const shiftedIndices: number[] = []
  const badLinkIndices: number[] = []
  const active = new Set<string>()
  rows.forEach((r, i) => {
    if (r.malformed === "column_shifted") shiftedIndices.push(i)
    else if (r.malformed === "bad_link") badLinkIndices.push(i)
    else if (!r.deleted) active.add(r.reviewerEmail)
  })

  return {
    ay,
    rows,
    importable,
    deleted: deletedCount,
    shiftedIndices,
    badLinkIndices,
    activeReviewers: active.size,
    poolSize: pool.length + (ay === 2025 ? SMALL_GROUP_REVIEWERS.length : 0),
  }
}

// ── CSV writing ─────────────────────────────────────────────────────────────

function escapeField(v: string): string {
  if (
    v.includes(SEP) ||
    v.includes('"') ||
    v.includes("\n") ||
    v.includes("\r")
  ) {
    return `"${v.replaceAll('"', '""')}"`
  }
  return v
}

/** Integer hundredths → `87,50` (decimal comma, always two places). */
function decimalComma(hundredths: number): string {
  const neg = hundredths < 0
  const s = String(Math.abs(hundredths)).padStart(3, "0")
  return `${neg ? "-" : ""}${s.slice(0, -2)},${s.slice(-2)}`
}

function reportLink(r: Row): string {
  return `${REPORT_BASE}/${r.reportId}?userId=${r.userId}`
}

function rowFields(r: Row): string[] {
  const base = [
    formatStamp(r.ts),
    r.title,
    r.authors,
    decimalComma(r.originality),
    decimalComma(r.selfCite),
    decimalComma(r.citation),
    decimalComma(r.match),
    r.reviewerName,
    r.reviewerEmail,
    r.suspicious ? YES : NO,
    r.cleared ? YES : NO,
    r.deleted ? STATUS_DELETED : STATUS_NOT_DELETED,
    reportLink(r),
    decimalComma(r.ai),
  ]
  if (r.malformed === "column_shifted") {
    // The observed defect: «Статус» is missing, so everything from column 12
    // shifts left by one and the report URL lands in the status column.
    return [...base.slice(0, 11), reportLink(r), decimalComma(r.ai), ""]
  }
  if (r.malformed === "bad_link") {
    // Non-deleted row without a parseable report link → typed rejection
    // (ADR-008 §1: never guessed).
    const broken = base.slice()
    broken[12] = r.reportId % 2 === 0 ? "" : `${REPORT_BASE}/?userId=`
    return broken
  }
  return base
}

function renderDocuments(rows: readonly Row[]): string {
  const out: string[] = [BOM + SOURCE_HEADER.map(escapeField).join(SEP)]
  for (const r of rows) out.push(rowFields(r).map(escapeField).join(SEP))
  return out.join(EOL) + EOL
}

function renderSystemUsage(y: YearResult): string {
  const checks = y.importable
  const avg = Math.round((checks / Math.max(1, y.activeReviewers)) * 100)
  const values = [
    String(y.poolSize * 4 + 100),
    String(y.activeReviewers),
    String(checks + y.deleted),
    String(checks),
    String(checks),
    decimalComma(avg),
  ]
  return (
    BOM +
    USAGE_HEADER.map(escapeField).join(SEP) +
    EOL +
    values.map(escapeField).join(SEP) +
    EOL
  )
}

// ── Dictionary / rule artefacts ─────────────────────────────────────────────

const sq = (s: string): string => `'${s.replaceAll("'", "''")}'`

/**
 * `JSON.stringify(x, null, 2)` explodes short integer arrays one-per-line,
 * which Oxfmt then collapses - leaving generated files permanently "unformatted"
 * and `vp fmt --check` permanently red. Collapse them here instead.
 */
function jsonPretty(value: unknown): string {
  const raw = JSON.stringify(value, null, 2)
  return (
    raw.replace(
      /\[\n\s*((?:-?\d+,\n\s*)*-?\d+)\n\s*\]/gu,
      (_m, body: string) => `[${body.split(/,\s*/u).join(", ")}]`
    ) + "\n"
  )
}

function renderDictionaries(): string {
  const L: string[] = [
    "-- GENERATED by fixtures/generate.ts - do not edit by hand.",
    "-- Synthetic dictionaries for the fixture warehouse (ADR-008 §10).",
    "-- Ids are identity columns: every later file resolves rows BY CODE.",
    "-- Migration 0002 inserts the same UNASSIGNED / `other` sentinels, so",
    "-- every statement is ON CONFLICT (code) DO NOTHING and the two files",
    "-- may be applied in either order.",
    "",
    "BEGIN;",
    "",
    "-- ── Faculties ──────────────────────────────────────────────────────────",
    "INSERT INTO faculties (code, name_ru, name_kk, name_en) VALUES",
  ]
  const facRows = [
    ...FACULTIES.map(
      (f) =>
        `    (${sq(f.code)}, ${sq(f.name_ru)}, ${sq(f.name_kk)}, ${sq(f.name_en)})`
    ),
    `    (${sq(UNASSIGNED)}, ${sq(UNASSIGNED_NAME_RU)}, ${sq(UNASSIGNED_NAME_KK)}, ${sq(UNASSIGNED_NAME_EN)})`,
  ]
  L.push(facRows.join(",\n"), "ON CONFLICT (code) DO NOTHING;", "")

  L.push(
    "-- ── Departments ────────────────────────────────────────────────────────",
    "INSERT INTO departments (faculty_id, code, name_ru, name_kk, name_en)",
    "SELECT f.id, d.code, d.name_ru, d.name_kk, d.name_en",
    "FROM (VALUES"
  )
  const depRows = [
    ...DEPARTMENTS.map(
      (d) =>
        `    (${sq(d.faculty_code)}, ${sq(d.code)}, ${sq(d.name_ru)}, ${sq(d.name_kk)}, ${sq(d.name_en)})`
    ),
    `    (${sq(UNASSIGNED)}, ${sq(UNASSIGNED)}, ${sq(UNASSIGNED_NAME_RU)}, ${sq(UNASSIGNED_NAME_KK)}, ${sq(UNASSIGNED_NAME_EN)})`,
  ]
  L.push(
    depRows.join(",\n"),
    ") AS d(faculty_code, code, name_ru, name_kk, name_en)",
    "JOIN faculties f ON f.code = d.faculty_code",
    "ON CONFLICT (code) DO NOTHING;",
    ""
  )

  L.push(
    "-- ── Programmes (ОП is not derivable from the legacy export; PLAN §1.1) ─",
    "INSERT INTO programs (department_id, code, name_ru, name_kk, name_en)",
    "SELECT dep.id, p.code, p.name_ru, p.name_kk, p.name_en",
    "FROM (VALUES"
  )
  L.push(
    PROGRAMS.map(
      (p) =>
        `    (${sq(p.department_code)}, ${sq(p.code)}, ${sq(p.name_ru)}, ${sq(p.name_kk)}, ${sq(p.name_en)})`
    ).join(",\n"),
    ") AS p(department_code, code, name_ru, name_kk, name_en)",
    "JOIN departments dep ON dep.code = p.department_code",
    "ON CONFLICT (code) DO NOTHING;",
    ""
  )

  L.push(
    "-- ── Work types (TZ §4.2 §3 + the `other` fallback) ─────────────────────",
    "INSERT INTO work_types (code, name_ru, name_kk, name_en, sort_order) VALUES"
  )
  L.push(
    WORK_TYPES.map(
      (w) =>
        `    (${sq(w.code)}, ${sq(w.name_ru)}, ${sq(w.name_kk)}, ${sq(w.name_en)}, ${w.sort_order})`
    ).join(",\n"),
    "ON CONFLICT (code) DO NOTHING;",
    "",
    "COMMIT;",
    ""
  )
  return L.join("\n")
}

function renderWorkTypeRules(): string {
  const L: string[] = [
    "-- GENERATED by fixtures/generate.ts - do not edit by hand.",
    "-- Title-substring → work type (ADR-008 §7). Case-insensitive match",
    "-- against norm(Название документа); first match by (priority, pattern)",
    "-- wins; no match → `other` / «иное», which therefore has no rule row.",
    "-- `work_type_rules` has no natural unique key, so re-seeding is guarded",
    "-- by NOT EXISTS rather than ON CONFLICT - running this twice is a no-op",
    "-- and it never deletes rules an administrator added.",
    "",
    "BEGIN;",
    "",
    "INSERT INTO work_type_rules (pattern, work_type_id, priority, active)",
    "SELECT r.pattern, wt.id, r.priority, TRUE",
    "FROM (VALUES",
  ]
  L.push(
    WORK_TYPE_RULES.map(
      (r) => `    (${sq(r.pattern)}, ${sq(r.work_type)}, ${r.priority})`
    ).join(",\n"),
    ") AS r(pattern, work_type_code, priority)",
    "JOIN work_types wt ON wt.code = r.work_type_code",
    "WHERE NOT EXISTS (",
    "    SELECT 1 FROM work_type_rules x",
    "    WHERE x.pattern = r.pattern AND x.work_type_id = wt.id",
    ");",
    "",
    "COMMIT;",
    ""
  )
  return L.join("\n")
}

/**
 * ADR-008 §5 defaults. Migration 0002 creates `initiator_rules` but seeds no
 * rows, so without this file every legacy row would fall through to `other`.
 */
function renderInitiatorRules(): string {
  const L: string[] = [
    "-- GENERATED by fixtures/generate.ts - do not edit by hand.",
    "-- Reviewer-e-mail → initiator role (ADR-008 §5), by priority:",
    "--   1. domain teachers.tou.edu.kz          → staff_self",
    "--   2. local part starts with registrar/reg. → registrar",
    "--   3. otherwise                            → other (implicit fallback)",
    "-- Matched against the never-persisted e-mail during parsing.",
    "",
    "BEGIN;",
    "",
    "INSERT INTO initiator_rules (pattern, initiator, priority, active)",
    "SELECT r.pattern, r.initiator::initiator_role, r.priority, TRUE",
    "FROM (VALUES",
  ]
  L.push(
    INITIATOR_RULES.map(
      (r) => `    (${sq(r.pattern)}, ${sq(r.initiator)}, ${r.priority})`
    ).join(",\n"),
    ") AS r(pattern, initiator, priority)",
    "WHERE NOT EXISTS (",
    "    SELECT 1 FROM initiator_rules x WHERE x.pattern = r.pattern",
    ");",
    "",
    "COMMIT;",
    ""
  )
  return L.join("\n")
}

/**
 * Reviewer → unit mapping consumed by `fixtures/seed.ts`, which HMACs the
 * e-mail before it ever reaches the database (ADR-008 §2). Plaintext here is
 * fine: every address is synthetic.
 */
function renderStaffUnits(seed: number): string {
  const L = ["email;faculty_code;department_code"]
  const mapped = buildReviewers(seed, 2025).filter((r) => r.facultyCode)
  const known = new Map(DEPARTMENTS.map((d) => [d.code, d.faculty_code]))
  for (const r of [...mapped, ...SMALL_GROUP_REVIEWERS]) {
    // A dangling code here becomes an FK failure three lanes downstream.
    if (known.get(r.departmentCode ?? "") !== r.facultyCode) {
      throw new Error(
        `staff-units: ${r.email} → ${String(r.facultyCode)}/${String(r.departmentCode)} is not a dictionary pair`
      )
    }
    L.push(`${r.email};${r.facultyCode};${r.departmentCode}`)
  }
  return L.join("\n") + "\n"
}

// ── Orchestration ───────────────────────────────────────────────────────────

export type GenerateOptions = {
  scale: Scale
  seed: number
  root: string
  quiet?: boolean
}

export type GenerateSummary = {
  seed: number
  scale: Scale
  years: {
    academic_year: number
    dir: string
    rows_total: number
    rows_importable: number
    rows_deleted: number
    rows_rejected_expected: number
    active_reviewers: number
  }[]
  rows_generated: number
  rows_importable: number
  rows_deleted: number
  rows_malformed: number
}

export function generate(opts: GenerateOptions): GenerateSummary {
  const outRoot = join(opts.root, "out")
  if (existsSync(outRoot)) rmSync(outRoot, { recursive: true, force: true })
  mkdirSync(outRoot, { recursive: true })

  const targets = SCALE_TARGETS[opts.scale]
  const summary: GenerateSummary = {
    seed: opts.seed,
    scale: opts.scale,
    years: [],
    rows_generated: 0,
    rows_importable: 0,
    rows_deleted: 0,
    rows_malformed: 0,
  }

  for (const ay of academicYearsFor(opts.scale)) {
    const year = generateYear(opts.seed, ay, targets[ay] as number)
    const dir = academicYearDir(ay)
    const yearDir = join(outRoot, dir)
    mkdirSync(yearDir, { recursive: true })

    writeFileSync(
      join(yearDir, "documents.csv"),
      renderDocuments(year.rows),
      "utf8"
    )
    writeFileSync(
      join(yearDir, "system-usage.csv"),
      renderSystemUsage(year),
      "utf8"
    )

    const rejected = year.shiftedIndices.length + year.badLinkIndices.length
    const sidecar = {
      academic_year: ay,
      rows_total: year.rows.length,
      rows_importable: year.importable,
      rows_deleted: year.deleted,
      rows_rejected_expected: rejected,
      row_index_base: 0,
      row_index_note:
        "0-based index over LOGICAL csv records (header excluded); a record may span several physical lines because quoted fields contain newlines",
      count: rejected,
      row_indices: [...year.shiftedIndices, ...year.badLinkIndices].sort(
        (a, b) => a - b
      ),
      rejections: {
        column_shifted: {
          count: year.shiftedIndices.length,
          row_indices: year.shiftedIndices,
          why: "«Статус» carries the report URL - the row is shifted and MUST be rejected, never guessed (PLAN §1.4)",
        },
        unparseable_report_link: {
          count: year.badLinkIndices.length,
          row_indices: year.badLinkIndices,
          why: "non-deleted row whose «Ссылка на полный отчет» yields no {userId}:{reportId} (ADR-008 §1)",
        },
      },
      valid_but_tricky:
        "rows with quoted fields containing ';' and embedded newlines are VALID and must parse",
    }
    writeFileSync(join(yearDir, "malformed.json"), jsonPretty(sidecar), "utf8")

    summary.years.push({
      academic_year: ay,
      dir,
      rows_total: year.rows.length,
      rows_importable: year.importable,
      rows_deleted: year.deleted,
      rows_rejected_expected: rejected,
      active_reviewers: year.activeReviewers,
    })
    summary.rows_generated += year.rows.length
    summary.rows_importable += year.importable
    summary.rows_deleted += year.deleted
    summary.rows_malformed += rejected
  }

  writeFileSync(join(outRoot, "manifest.json"), jsonPretty(summary), "utf8")
  writeFileSync(
    join(opts.root, "dictionaries.sql"),
    renderDictionaries(),
    "utf8"
  )
  writeFileSync(
    join(opts.root, "work-type-rules.sql"),
    renderWorkTypeRules(),
    "utf8"
  )
  writeFileSync(
    join(opts.root, "initiator-rules.sql"),
    renderInitiatorRules(),
    "utf8"
  )
  writeFileSync(
    join(opts.root, "staff-units.csv"),
    renderStaffUnits(opts.seed),
    "utf8"
  )

  if (!opts.quiet) {
    console.log(`fixtures: scale=${opts.scale} seed=${opts.seed}`)
    for (const y of summary.years) {
      console.log(
        `  ${y.dir}  rows=${y.rows_total}  importable=${y.rows_importable}` +
          `  deleted=${y.rows_deleted}  rejected=${y.rows_rejected_expected}` +
          `  active_reviewers=${y.active_reviewers}`
      )
    }
    console.log(
      `  TOTAL     rows=${summary.rows_generated}` +
        `  importable=${summary.rows_importable}` +
        `  deleted=${summary.rows_deleted}` +
        `  rejected=${summary.rows_malformed}`
    )
    console.log(`  written to ${outRoot}`)
  }
  return summary
}

export function parseArgs(argv: readonly string[]): GenerateOptions {
  let scale: Scale = "small"
  let seed = 1
  let root = "fixtures"
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--scale") {
      const v = argv[++i]
      if (v !== "small" && v !== "load") {
        throw new Error(`--scale must be small|load, got ${String(v)}`)
      }
      scale = v
    } else if (a === "--seed") {
      seed = Number(argv[++i])
      if (!Number.isInteger(seed)) throw new Error("--seed must be an integer")
    } else if (a === "--root") {
      root = String(argv[++i])
    } else if (a === "--help" || a === "-h") {
      console.log(
        "usage: bun fixtures/generate.ts [--scale small|load] [--seed N] [--root DIR]"
      )
      process.exit(0)
    } else {
      throw new Error(`unknown argument: ${String(a)}`)
    }
  }
  return { scale, seed, root }
}

if (import.meta.main) {
  generate(parseArgs(process.argv.slice(2)))
}
