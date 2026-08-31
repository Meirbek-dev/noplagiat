# Техническая архитектура - дашборд аналитики антиплагиата

**Кодовое имя проекта:** `noplagiat-analytics`
**Спецификация:** [TZ.md](TZ.md) (на русском, нормативный документ). Настоящий документ - инженерный источник истины.
**Рабочий процесс агентов:** [AGENTS.md](../AGENTS.md).

Система консолидирует записи о проверках из `noplagiat.tou.edu.kz` в хранилище данных PostgreSQL и обслуживает два контура: **публичный** анонимизированный дашборд (без аутентификации, с принудительной k-анонимностью) и **внутренний** детализированный дашборд (SSO + RBAC + журналирование аудита). Система спроектирована для автономной агентной разработки: каждая граница типизирована, каждый инвариант - это тест, а каждый модуль либо компилируется, либо падает громко и явно.

---

## 1. Контекст системы

```
┌──────────────────────┐   REST pull / CSV drop   ┌─────────────────────────────┐
│ noplagiat.tou.edu.kz │ ───────────────────────► │ Rust server + ingest worker │
│  (source of truth)   │                          │ validate → upsert → aggregate
└──────────────────────┘                          └──────────────┬──────────────┘
┌──────────────────────┐                                         ▼
│ Registrar reference  │ ─────────────────────────►  ┌────────────────────┐
│ data (faculties, …)  │                             │ PostgreSQL 18      │
└──────────────────────┘                             │ facts + aggregates │
┌──────────────────────┐                             └────────────────────┘
│ Ethics Council       │ ── aggregated counters ───────────────►▲
│ registry (manual)    │                                        │
└──────────────────────┘                                        │
                                                               │
 University proxy / TLS                                         │
          │                                                      │
          ▼                                                      │
┌──────────────────────── nginx gateway ─────────────────────────┴──┐
│ /api/*, /healthz, /readyz ──► Rust/Axum :8080                    │
│ all other paths             ──► Node/TanStack Start SSR :3000     │
└───────────────────────────────────────────────────────────────────┘
          ▲                              │
          │                              └─ public «/» · internal «/app»
 Browser / portal iframe                    · embed «/embed»
          │
          └──────────── Portal SSO (OIDC callback through /api/auth/*)
```

**Персональные данные никогда не попадают в эту систему.** Хранилище содержит только непрозрачный идентификатор проверки из источника, временные метки, ссылки на справочники и числовые метрики. Имена авторов, имена проверяющих и тексты документов остаются в системе-источнике.

---

## 2. Структура репозитория

Монорепозиторий: один разворачиваемый бинарник бэкенда + одно фронтенд-приложение. Границы выбраны так, чтобы субагенты могли работать параллельно без конфликтов слияния.

```
noplagiat/
├─ CLAUDE.md                  # Vite+ toolchain notes (existing)
├─ AGENTS.md                  # agent development guidelines
├─ package.json               # bun workspaces + turbo tasks + gen:api/server:*/seed/load scripts
├─ vite.config.ts             # Vite+ lint/fmt config (excludes generated + Rust dirs)
├─ scripts/
│  ├─ gen-api.ts              # `gen:api` / `gen:api:check` - contract → TS client
│  └─ format-staged.ts        # `vp` staged-format wrapper
├─ .github/workflows/
│  ├─ ci.yml                  # contract drift → backend → frontend → e2e (§10)
│  └─ nightly-load.yml        # 250k seed + k6 budget (§7)
├─ docs/
│  ├─ TZ.md                   # normative spec (RU)
│  ├─ ARCHITECTURE.md         # this file
│  ├─ PLAN.md                 # slices, decisions, schedule
│  ├─ ACCEPTANCE.md           # TZ §10 criterion → command → evidence
│  ├─ REQUESTS.md             # external dependency requests (D2/D7/D10/D11)
│  └─ adr/                    # architecture decision records 001–016 (NNN-title.md)
├─ server/                    # Rust workspace
│  ├─ Cargo.toml              # [workspace] + noplagiat-server binary package
│  ├─ crates/
│  │  ├─ domain/              # pure types + business rules, no I/O
│  │  ├─ db/                  # SQLx queries, migrations runner, aggregate refresh
│  │  ├─ compliance/          # Screened<T>, KPolicy, Scope, audit primitives
│  │  ├─ ingest/              # source API client, CSV importer, scheduler
│  │  ├─ reports/             # PDF/XLSX generation, annual report snapshots
│  │  └─ api/                 # Axum router, extractors, layers, OpenAPI
│  ├─ src/main.rs             # binary: config, DB pool, router, scheduler
│  ├─ src/bin/export_openapi.rs  # contract generator (+ --check CI gate)
│  ├─ src/bin/ingest_csv.rs      # one-shot CSV backfill (fixtures and `stats/`)
│  ├─ src/bin/generate_report.rs # manual annual/period report generation
│  ├─ migrations/             # sqlx migrate - 0001–0005, append-only, numbered
│  └─ .sqlx/                  # offline query metadata (committed)
├─ apps/web/                  # TanStack Start frontend (Vite+ `vp`, turbo)
│  ├─ messages/{ru,kk,en}.json  # source message catalogues (ADR-007)
│  ├─ src/
│  │  ├─ routes/              # file-based: index, embed, login, app/*, admin/*
│  │  ├─ api/                 # generated client + Valibot schemas (DO NOT EDIT)
│  │  ├─ components/charts/   # chart wrappers incl. SuppressedCell
│  │  ├─ paraglide/           # compiled messages + runtime (generated - ADR-007)
│  │  ├─ lib/                 # search/filter schemas, query options, stores
│  │  └─ styles/tokens.css    # brand tokens (the only place for brand hex)
│  └─ e2e/                    # Playwright specs (slice W2.7)
├─ contracts/
│  ├─ openapi.json            # generated from Rust - single source of truth
│  └─ ingest-source.schema.json  # the source-side ingest contract (ADR-010)
├─ fixtures/                  # deterministic seed data (see §9)
│  ├─ generate.ts expected.ts verify.ts seed.ts rules.ts  # generator + brute-force reducer
│  ├─ expected.json           # committed reference aggregates
│  ├─ out/                    # generated CSVs + facts.jsonl (gitignored)
│  └─ load/                   # k6 profile, bun bench, RESULTS.md
├─ stats/                     # REAL source exports (contain PII!) - reference
│                             # only for ingest mapping; never copied into
│                             # fixtures or the warehouse un-anonymized
└─ deploy/
   ├─ Dockerfile.server       # Rust API/worker image
   ├─ Dockerfile.web          # multi-stage TanStack Start build + Node runtime
   ├─ web-server.mjs          # Node adapter for the generated Fetch handler
   ├─ nginx.conf              # single-origin API/SSR gateway routes
   ├─ docker-compose.yml      # gateway + web + server + PostgreSQL 18
   ├─ embed-snippet.html      # portal iframe snippet (§8)
   ├─ env.example             # non-secret environment template
   └─ RUNBOOK.md              # local/staging operations and production caveats
```

Правило зависимостей между крейтами (обеспечивается `cargo`): `domain ← {db, compliance, ingest, reports} ← api`. `domain` не зависит ни от одного внутреннего крейта; `api` - единственный крейт, который знает о HTTP.

---

## 3. Модель данных (PostgreSQL)

### 3.1. Факты и справочники

```sql
-- Dictionaries (synced from registrar, mapped from source-system labels)
faculties(id PK, code UNIQUE, name_ru, name_kk, name_en, active)
departments(id PK, faculty_id FK, code UNIQUE, name_ru, name_kk, name_en, active)
programs(id PK, department_id FK, code UNIQUE, name_ru, name_kk, name_en, active)
work_types(id PK, code UNIQUE, name_ru, name_kk, name_en, sort_order)
-- source label → dictionary mapping, editable by admin
dict_aliases(id PK, kind, source_label, target_id)

-- Fact table: one row per check event (attempt)
checks(
  id BIGINT GENERATED ALWAYS AS IDENTITY PK,
  source_check_id TEXT NOT NULL,           -- opaque ID from noplagiat
  attempt_no INT NOT NULL DEFAULT 1,
  checked_at TIMESTAMPTZ NOT NULL,
  academic_year SMALLINT NOT NULL,         -- 2024 = AY 2024/25 (Sep 1 – Aug 31), derived on ingest
  work_type_id FK NOT NULL,
  faculty_id FK NOT NULL,
  department_id FK NOT NULL,
  program_id FK NULL,
  originality_pct NUMERIC(5,2) NOT NULL CHECK (0 <= originality_pct AND originality_pct <= 100),
  status check_status NOT NULL,            -- enum: accepted | needs_revision | rejected | recheck
  escalated BOOLEAN NOT NULL DEFAULT FALSE,
  initiator initiator_role NOT NULL,       -- enum: student | staff_self | registrar | other
  duration_seconds INT NULL,               -- for "usage" section
  ingest_batch_id FK NOT NULL,
  UNIQUE (source_check_id, attempt_no)     -- idempotent upsert target
)
-- Indexes: (checked_at), (academic_year), (faculty_id, department_id, checked_at),
--          (work_type_id, checked_at), (status), partial on (escalated) WHERE escalated

-- Coverage denominators (manual/registrar input, optional)
submission_totals(id PK, academic_year, work_type_id, total_submitted INT, UNIQUE(academic_year, work_type_id))

-- Ethics Council registry: aggregated counters only, entered by Compliance
ethics_cases(id PK, academic_year, category TEXT, referred INT, reviewed_closed INT)

-- Active users of the source system (for the "usage" section)
usage_stats(id PK, period_month DATE, active_users INT, avg_check_seconds INT)
```

### 3.2. Комплаенс и эксплуатация

```sql
settings(key TEXT PK, value JSONB, updated_at, updated_by)
-- keys: k_threshold (default 5), originality_threshold (default 70),
--       histogram_buckets ([50,70,85,95]), public_snapshot_quarter

users(id PK, sso_subject TEXT UNIQUE, email, display_name, active)
user_roles(user_id FK, role role_kind, scope_faculty_id FK NULL, scope_department_id FK NULL,
           PRIMARY KEY (user_id, role, scope_faculty_id, scope_department_id))
-- role_kind enum: guest (implicit) | staff | dept_head | dean | ethics | compliance | admin

audit_log(  -- APPEND-ONLY: no UPDATE/DELETE grants; retention ≥ 1 year
  id BIGINT PK, occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id FK NOT NULL, role role_kind NOT NULL,
  action TEXT NOT NULL,                    -- view | export_pdf | export_xlsx | admin_change
  section TEXT NOT NULL,                   -- dashboard section or admin area
  filters JSONB NOT NULL,                  -- normalized filter state
  ip INET NULL
)

ingest_batches(id PK, started_at, finished_at, source TEXT, mode TEXT, -- api | csv
               rows_read INT, rows_upserted INT, rows_rejected INT, errors JSONB, status TEXT)

report_snapshots(id PK, generated_at, period_start DATE, period_end DATE,
                 kind TEXT,               -- annual | manual
                 locale TEXT,             -- ru | kk | en; NULL before migration 0005
                 pdf_path TEXT, xlsx_path TEXT, published BOOLEAN DEFAULT FALSE)
```

### 3.3. Агрегаты (опора производительности)

Целевое время загрузки в 3 секунды при 50k–250k строк достигается за счёт того, что **таблица фактов никогда не сканируется на путях обработки запросов**. Одной месячной гранулярности достаточно для всех разделов дашборда:

```sql
CREATE MATERIALIZED VIEW agg_monthly AS
SELECT date_trunc('month', checked_at)::date AS month,
       academic_year, faculty_id, department_id, program_id, work_type_id, status, initiator,
       count(*)                                   AS checks,
       avg(originality_pct)                       AS avg_originality,
       count(*) FILTER (WHERE originality_pct < 50)                              AS b_lt50,
       count(*) FILTER (WHERE originality_pct >= 50 AND originality_pct < 70)    AS b_50_70,
       count(*) FILTER (WHERE originality_pct >= 70 AND originality_pct < 85)    AS b_70_85,
       count(*) FILTER (WHERE originality_pct >= 85 AND originality_pct < 95)    AS b_85_95,
       count(*) FILTER (WHERE originality_pct >= 95)                             AS b_ge95,
       count(*) FILTER (WHERE escalated)          AS escalated,
       count(*) FILTER (WHERE attempt_no > 1)     AS rechecks
FROM checks
GROUP BY 1,2,3,4,5,6,7,8;
-- UNIQUE INDEX on the full GROUP BY key → REFRESH MATERIALIZED VIEW CONCURRENTLY
```

Обновление выполняется после каждого пакета приёма данных и обходится дёшево (данные за минуты). Запросы на путях обработки сворачивают `agg_monthly` до той гранулярности, которую запрашивает фильтр; краевой случай произвольного диапазона дат (неполные месяцы) переагрегируется из `checks` только для граничных месяцев. Показатели улучшения при повторных проверках (раздел 6 дашборда) соединяют `checks` с самой собой по `(source_check_id, attempt_no)` - они предвычисляются в `agg_rechecks_yearly` тем же способом.

**Не добавляйте** слои кеширования (Redis и т. п.) до проведения замеров; Postgres + материализованные представления + HTTP-заголовок `Cache-Control` на публичных эндпоинтах - это и есть заложенный в бюджет дизайн. Пятикратное масштабирование не меняет ничего структурно.

---

## 4. Бэкенд (Rust)

### 4.1. Среда выполнения и фреймворк

- Многопоточная среда выполнения `tokio`; `axum` для HTTP; слои `tower` для сквозной функциональности; `sqlx` (Postgres, `runtime-tokio`, офлайн-режим **включён** - каталог `.sqlx/` закоммичен, поэтому CI компилируется без живой БД).
- Конфигурация только через переменные окружения (`APP_DATABASE_URL`, `APP_OIDC_*`, `APP_LISTEN_ADDR`, …), разбирается при старте в типизированный `Config`; при отсутствующих значениях - немедленное падение. `APP_PUBLIC_BASE_URL` - это внешне видимый origin шлюза, а никогда не внутренний адрес сервиса Rust или Node.
- Ошибки: `thiserror` в каждом крейте + один `ApiError` в `api`, реализующий `IntoResponse` с телом problem-ответа по RFC 7807. **Никаких `unwrap`/`expect`/`panic!` на путях обработки запросов** - линт clippy `unwrap_used` запрещён (deny) в `api`, `db`, `compliance`.

### 4.2. Топология роутера и промежуточных слоёв

```
Router
├─ /healthz, /readyz                      (no layers)
├─ /api/public/*    ── TraceLayer → RateLimit → CacheControl(public, max-age=3600)
│                      → KAnonymityGuard (response invariant check)
├─ /api/internal/*  ── TraceLayer → SessionAuth (OIDC) → RbacScope extractor
│                      → AuditLayer (writes audit_log on response)
├─ /api/admin/*     ── same as internal + RequireRole(admin)
└─ /api/auth/*      ── OIDC login/callback/logout, cookie sessions
```

- **`SessionAuth`**: проверяет сессионную cookie портального SSO (OIDC code flow) (`HttpOnly`, `Secure`, `SameSite=Lax`), загружает `users` + `user_roles` в расширение `CurrentUser`. Неизвестный SSO-субъект → аутентифицирован, но без ролей (не видит ничего внутреннего).
- **`RbacScope`** (экстрактор, а не просто слой): преобразует `CurrentUser` в значение `Scope` - `All`, `Faculty(id)`, `Department(id)` - которое крейт `db` **требует как параметр** у каждой функции внутреннего запроса. Не существует пути в коде, позволяющего запросить внутренние данные без `Scope`; фильтрация по области видимости (scope) выполняется в SQL (`WHERE faculty_id = $scope`), никогда не в постобработке.
- **`AuditLayer`**: на каждый внутренний ответ 2xx порождает задачу, вставляющую строку аудита (пользователь, действие, раздел, нормализованные фильтры, IP). Эндпоинты выгрузки выставляют `action = export_*`.
- **`KAnonymityGuard`**: эшелонированная защита. Первичное подавление происходит в доменном слое (§4.3); этот слой дополнительно десериализует публичные ответы в отладочных и тестовых сборках и утверждает, что ни одна группа не содержит `n < k`, а в релизной сборке проверяет, что обработчик выставил маркерный заголовок `x-kanon-checked: 1` (удаляемый перед отправкой). Публичный обработчик, забывший про подавление, роняет тесты, а не молча - продакшн.

### 4.3. k-анонимность как тип, а не как соглашение

Крейт `compliance` делает неподавленные данные непредставимыми в публичных ответах:

```rust
/// A metric cell that has passed k-anonymity screening.
pub enum Screened<T> { Value(T), Suppressed }   // serializes to value | "insufficient_data"

pub struct KPolicy { pub k: u32 }
impl KPolicy {
    pub fn screen<T>(&self, n: u64, value: T) -> Screened<T> { … }
}
```

- Публичные DTO в `api` строятся **только** из полей `Screened<T>`; их конструирование из сырых значений не компилируется.
- **Публичный контур публикует выпущенный (released) куб и только суммы по нему (ADR-016).** Множество публичных данных - это куб `(месяц, факультет, тип работы)` представления `agg_monthly`; ячейка считается _выпущенной_ тогда и только тогда, когда содержит не менее `k` проверок, и каждое публичное число - каждый эндпоинт, оба формата выгрузки - есть сумма по выпущенным ячейкам. Скрытая ячейка не вносит вклад ни во что, даже в итог, потому что итог, содержащий её, - это форма её передачи (ТЗ §6.2). Публичные периоды привязываются к целым месяцам, поэтому окно нельзя сдвигать по одному дню. `db::q::public_cube` отбрасывает меры скрытой ячейки внутри `db`, поэтому у слоя API в памяти нет числа меньше `k`, которое могло бы утечь.
- Поскольку более узкий публичный фильтр выбирает _подмножество тех же ячеек_, равенство `Σ items = total` выполняется на уровне передаваемых ответов, и любая арифметика на стороне клиента над публичными ответами даёт сумму уже опубликованных ячеек. Поэтому атаки разностным анализом (differencing) и атаки через маргинальные суммы закрыты по построению, а не смягчены - `crates/api/tests/closure.rs` воспроизводит три опубликованных рецепта атак и утверждает, что каждый остаток равен нулю.
- **Комплементарное подавление** - сокрытие второй наименьшей ячейки, чтобы у видимого итога никогда не оставалось ровно одного скрытого потомка - по-прежнему живёт в `compliance::suppress_table()` с property-тестами (§9) и используется **внутренним контуром** и утверждёнными статическими артефактами (годовой отчёт, снимки), которые публикуют _истинные_ итоги. На живом публичном пути оно не используется, поскольку там у видимого итога нет скрытых потомков (ADR-016 §4 фиксирует, почему два режима различаются).
- `k` берётся из `settings.k_threshold` и кешируется с TTL 60 с; его изменение вступает в силу без передеплоя.
- Выгрузка использует те же DTO - подавленные ячейки выгружаются как «недостаточно данных», никогда как числа.

### 4.4. Приём данных

- `ingest` выполняется внутри бинарника сервера как фоновая задача Tokio по cron-подобному расписанию (ночью) + запуски по команде администратора; рекомендательная блокировка (advisory lock) Postgres гарантирует единственное одновременное выполнение (single-flight).
- **Режим API**: инкрементальная выборка по курсору `(checked_at, source_check_id)`, хранимому в `settings`; повторы с экспоненциальной задержкой; строка на каждый пакет в `ingest_batches`.
- **Режим CSV** (резервный): администратор загружает файлы или кладёт их в отслеживаемый каталог; разбор через крейт `csv` в тот же валидированный доменный тип `NewCheck`.
- Валидация: неизвестные метки факультета/кафедры/типа работы разрешаются через `dict_aliases`; несопоставленные строки **отклоняются в `ingest_batches.errors`** (никогда не отбрасываются молча и не угадываются) и показываются в админском интерфейсе.
- Upsert `ON CONFLICT (source_check_id, attempt_no) DO UPDATE` → идемпотентные повторные запуски; после коммита - конкурентное обновление материализованных представлений.
- Сторожевой тест утверждает, что у структуры `NewCheck` **нет ни одного поля, способного хранить имя или текстовое тело** - инвариант отсутствия персональных данных является структурным.

### 4.5. Отчёты и выгрузка

- `reports` формирует: (а) годовой анонимизированный отчёт по форме Приложения 1 - по одному разделу на каждую таблицу формы; (б) выгрузки отфильтрованных представлений.
- XLSX через `rust_xlsxwriter`; PDF через Typst (крейт `typst`) с брендированным шаблоном (логотип, `#1D3D66`/`#DE6E35`, локализация RU/KK). Внутренние выгрузки несут водяной знак «Для служебного пользования»; публичные выгрузки никогда не содержат подавленных значений.
- Годовая генерация выполняется по расписанию (1 сентября за завершившийся учебный год) и может быть запущена вручную; результаты - неизменяемые `report_snapshots` на диске, доступные для просмотра и публикации через админский API.

### 4.6. Поверхность API (генерируемый контракт)

Все DTO выводят `serde::Serialize` + `utoipa::ToSchema`; роутер аннотирован макросами путей `utoipa`. `cargo run --bin export-openapi` записывает `contracts/openapi.json`. **CI падает, если закоммиченный файл отличается от сгенерированного.**

Поверхность составляет **55 путей**:

| Группа   | Эндпоинты (все GET, если не указано иное)                                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| public   | `/summary`, `/timeseries`, `/work-types`, `/faculties`, `/histogram`, `/yoy`, `/reports` + `/reports/{id}/download` (опубликованные снимки), `/status`, `POST /export` - все принимают `?period&from&to&faculty&work_type` (**без `status`**, а `from`/`to` привязываются к целым месяцам - ADR-016)                           |
| internal | summary/timeseries/work-types/histogram/yoy с фильтрами `?faculty&department&program` (без парного `/faculties` - детализация до подразделений выполняется через `/departments-matrix`), плюс `/rechecks`, `/escalations`, `/usage`, `POST /export` (pdf\|xlsx)                                                                |
| admin    | `settings` GET/PUT; CRUD над `dictionaries`, `aliases`, `roles`, `staff-units`, `work-type-rules`, `initiator-rules`, `ingest/sources`, `ethics-cases`, `submission-totals`, `usage-stats`; `POST /ingest/run`, `/ingest/batches`; `/audit` (с пагинацией и фильтрацией); `POST /reports/generate`, `…/publish`, `…/unpublish` |
| auth     | `/login`, `/callback`, `/logout`, `/me`, `POST /dev-login` (только при `APP_AUTH_MODE=dev`)                                                                                                                                                                                                                                    |
| ops      | `/healthz`, `/readyz` (оба в контракте); `/metrics` присутствует в маршрутизации, но намеренно не документирован - см. §8                                                                                                                                                                                                      |

Параметры запроса - типизированные структуры с `serde` + валидацией (`garde`); некорректные фильтры дают problem-ответы 422 и никогда не игнорируются молча.

---

## 5. Фронтенд (TanStack Start)

### 5.1. Маршруты

```
src/routes/
├─ __root.tsx                # shell: locale, theme, error and not-found boundaries
├─ index.tsx                 # public dashboard (sections 1,2,3,5,9 + faculty aggregate + reports)
├─ embed.tsx                 # chromeless public widget for portal iframe (postMessage height)
├─ login.tsx                 # SSO entry point (and the dev-mode login in `APP_AUTH_MODE=dev`)
├─ app/                      # internal contour - beforeLoad: require session
│  ├─ route.tsx              # layout + session guard
│  ├─ index.tsx              # overview (scoped)
│  ├─ dynamics.tsx  types.tsx  units.tsx        # sections 2,3,4 with drill-down
│  ├─ rechecks.tsx  escalations.tsx  usage.tsx  # sections 6,7,8 (role-gated)
│  ├─ yoy.tsx
│  └─ request-access.tsx     # authenticated but role-less landing
└─ admin/                    # beforeLoad: require role=admin
   ├─ route.tsx  index.tsx
   └─ sources.tsx  dictionaries.tsx  roles.tsx  settings.tsx  audit.tsx  reports.tsx
```

- **Параметры поиска в URL - это и есть состояние фильтров.** Каждый маршрут дашборда объявляет `validateSearch` с общей схемой Valibot из `lib/search.ts` (`period`, `from`, `to`, `faculty`, `department`, `program`, `workType`, `status`), которая нормализуется в запросы к API модулем `lib/filters.ts`. Фильтры можно сохранять в закладки, выгрузки сериализуют тот же объект, а SSR сразу рендерит отфильтрованное представление.
- Загрузчики маршрутов вызывают `queryClient.ensureQueryData` с опциями запроса из `src/lib/queries.ts` - по одной фабрике опций на эндпоинт, с ключом по нормализованному объекту фильтров. TanStack Query отвечает за кеширование и фоновое обновление (`staleTime` 5 мин во внутреннем контуре, 1 ч в публичном); `TanStack Store` хранит только состояние интерфейса (боковая панель, локаль, синхронизация наведения на графиках).
- Проверки в `beforeLoad` перенаправляют неаутентифицированных пользователей на SSO, а пользователей без роли - на страницу запроса доступа. Клиентские проверки существуют только ради UX - авторизацию обеспечивает сервер (§4.2); e2e-тесты проверяют и то и другое.

### 5.2. Система визуализации

Все графики отрисовываются через `@tanstack/charts`, обёрнутый один раз в `src/components/charts/`:

| Компонент              | Где используется | Примечания                                                                                                                                                                                                                                                                                |
| ---------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `KpiCard`              | раздел 1         | значение + дельта к предыдущему периоду + спарклайн                                                                                                                                                                                                                                       |
| `TimeSeries`           | разделы 2, 9     | пара линейных графиков в двух панелях (число проверок / средняя оригинальность) - форма с двумя осями существует за флагом `layout="dual-axis"`, но используется стековый вариант по умолчанию: на оси 0–100 ряд оригинальности вырождается в нечитаемую линию; наложение полос семестров |
| `GroupedBars`          | раздел 3         | количество + среднее по типу работы                                                                                                                                                                                                                                                       |
| `OriginalityHistogram` | раздел 5         | фиксированные корзины из `settings.histogram_buckets`                                                                                                                                                                                                                                     |
| `UnitHeatmap`          | раздел 4         | факультет×метрика (публичный контур) / детализация до кафедр (внутренний контур), под ним TanStack Table                                                                                                                                                                                  |
| `YoYCompare`           | раздел 9         | сгруппированные столбцы по учебным годам                                                                                                                                                                                                                                                  |
| `SuppressedCell`       | везде            | отрисовывает состояние «недостаточно данных» - _единственный_ способ отображения подавленного значения                                                                                                                                                                                    |

Обёртки графиков принимают **только сгенерированные типы API** (никогда сырой JSON), читают цвета исключительно из CSS-токенов, отрисовывают SVG с `<title>` и aria-метками, и каждая числовая точка доступна для просмотра во всплывающей подсказке. `TanStack Virtual` обеспечивает работу таблиц журнала аудита и пакетов приёма данных.

### 5.3. Дизайн-токены и оформление

`src/styles/tokens.css` определяет фирменную систему, используемую shadcn/ui и графиками:

```css
:root {
  --primary: #1d3d66; /* dark navy - headers, primary series */
  --accent: #de6e35; /* orange - highlights, active filters, deltas */
  --chart-1..--chart-6: …; /* navy/orange ramp + neutrals, AA-checked */
  --suppressed: …; /* hatched gray for "insufficient data" */
}
```

Правила: никаких hex-литералов за пределами `tokens.css` (закреплено тестом `tokens.test.ts`); стек шрифтов без засечек (`"Inter Variable", Arial, "Helvetica Neue", sans-serif` - Inter согласно D10, Arial как базовый резервный вариант по ТЗ §8); контраст по WCAG 2.1 AA; адаптивность десктоп→планшет; маршрут встраивания не содержит никаких элементов навигационного обрамления.

### 5.4. Интернационализация (i18n)

Paraglide JS (ADR-007, предписан ТЗ §7): `messages/{ru,kk,en}.json` компилируются в типизированные, поддающиеся tree-shaking функции сообщений в `src/paraglide/` (генерируются, коммитятся). Опции компилятора находятся в `project.inlang/paraglide.config.ts` и используются совместно плагином Vite и командой `vp run i18n`. Разрешение локали: переопределение через `?lang=` (стратегия `custom-lang-param` в `src/lib/locale.ts`) → cookie `locale` → предпочтение браузера → резервный RU; при SSR локаль разрешается на каждый запрос через `paraglideMiddleware` в `src/server.ts`. Паритет ключей между локалями (одинаковые ключи, отсутствие пустых строк, идентичные плейсхолдеры) закреплён тестом `src/lib/i18n.test.ts`; форматирование чисел и дат - через `Intl` с активной локалью.

### 5.5. Генерируемый клиент API

`vp run gen:api` перегенерирует `src/api/` (типизированные функции запросов + схемы ответов на **Valibot** - ТЗ §9, ADR-006) из `contracts/openapi.json`. Каталог помечен как DO-NOT-EDIT; `vp run gen:api:check` перегенерирует его во временный каталог и роняет CI при любом различии. В dev- и тестовых сборках ответы разбираются Valibot во время выполнения (нарушения контракта отлавливаются на границе), в продакшн-сборках им доверяют.

### 5.6. Среда выполнения SSR и маршрутизация в рамках одного origin

Продакшн-сборка фронтенда даёт два артефакта: `dist/client/` с неизменяемыми браузерными ресурсами и `dist/server/server.js`, экспортирующий Fetch-обработчик TanStack Start. `deploy/Dockerfile.web` собирает оба на стадии сборки в Bun, а затем запускает их в отдельном контейнере Node.js. Не имеющий зависимостей `deploy/web-server.mjs` адаптирует HTTP-запросы Node к сгенерированному Fetch-обработчику, потоково отдаёт SSR-ответы и раздаёт ресурсы из `dist/client/`; бизнес-логики приложения он не содержит.

Браузер видит только один origin. nginx направляет `/api` и `/api/*` в Rust, а все запросы страниц и ресурсов - в Node. Поэтому в развёрнутых сборках `VITE_API_BASE` остаётся незаданной. nginx сохраняет заголовки внешнего хоста и протокола, проставленные университетским прокси (с резервными значениями из прямого запроса для локального использования), и передаёт нормализованные значения, из которых строится URL SSR-запроса; входящий трафик на шлюз должен быть ограничен университетским прокси, а порт Node - закрытым. См. [ADR-009](adr/009-ssr-deployment-topology.md).

---

## 6. Сводка по безопасности и комплаенсу

| Угроза                                                           | Мера контроля                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Повторная идентификация по малым группам                         | Публичный контур: выпущенный куб из ADR-016 - ячейка с числом меньше `k` не вносит вклад ни в одно опубликованное число, поэтому разностный анализ и маргинальные суммы закрыты. Внутренний контур и статические артефакты: типизированное подавление `Screened<T>` + комплементарное подавление. Везде: `KAnonymityGuard` + property-тесты (§9) + регрессии атак в `crates/api/tests/closure.rs` |
| Утечка персональных данных в хранилище                           | В схеме нет колонок с персональными данными; структурный сторожевой тест `NewCheck`; в режиме CSV приём данных отклоняет неожиданные колонки                                                                                                                                                                                                                                                      |
| Горизонтальное повышение привилегий (декан A читает факультет B) | Параметр `Scope` обязателен для каждого внутреннего запроса; фильтрация на уровне SQL; матрица RBAC из 446 случаев поверх реального роутера                                                                                                                                                                                                                                                       |
| Внутренний доступ без аудита                                     | `AuditLayer` на всех ответах `/api/internal` + `/api/admin`; таблица только на добавление; хранение ≥ 1 года                                                                                                                                                                                                                                                                                      |
| Выгрузка в обход подавления                                      | Выгрузки переиспользуют DTO, прошедшие скрининг; эндпоинта выгрузки сырых данных не существует                                                                                                                                                                                                                                                                                                    |
| Атаки на сессии                                                  | OIDC через портальный SSO; cookie с `HttpOnly/Secure/SameSite`; CSRF-токен на изменяющих маршрутах; строгий CSP; никаких токенов в URL                                                                                                                                                                                                                                                            |
| Злоупотребление публичным API                                    | Ограничение частоты запросов + заголовки кеширования, дружественные к CDN; публичные ответы содержат только агрегаты                                                                                                                                                                                                                                                                              |

Правовое основание: Закон РК «О персональных данных и их защите» - соблюдается за счёт того, что персональные данные вообще не собираются (минимизация данных по построению).

---

## 7. Стратегия производительности (≤ 3 с при 50k, работает при 250k)

1. Пути обработки запросов читают свёртки `agg_monthly` - O(месяцы × группы), независимо от числа строк в таблице фактов.
2. Публичные эндпоинты: `Cache-Control: public, max-age=3600` (+ ETag) - между приёмами данных страница портала фактически статична.
3. SSR рендерит все разделы на сервере за один проход (загрузчики расходятся веером параллельно, по одному запросу на раздел, без каскада ожиданий); на клиенте у каждого раздела своя граница suspense/ошибки.
4. Один HTTP-запрос на раздел дашборда; разделы загружаются независимо (без каскада ожиданий).
5. Бюджеты закреплены в CI: нагрузочный тест (`/api/public/summary` p95 < 300 мс при 250k засеянных строк), Playwright измеряет LCP публичной страницы < 3 с на профиле с ограничением сети.

---

## 8. Наблюдаемость и эксплуатация

- `tracing` + JSON-логи; спаны запросов несут маршрут, роль пользователя (никогда субъект или e-mail в публичных логах) и длительность.
- `/healthz` - это проверка живости процесса Rust. `/readyz` проверяет связность с базой данных **и** свежесть приёма данных: состояние degraded (503, `status: "ingest_stale"`), когда самый свежий _успешный_ пакет старше `APP_INGEST_MAX_AGE_SECONDS` (по умолчанию 26 ч). Хранилище, в котором вообще нет успешных пакетов, считается готовым - это свежая установка, а не устаревшая (ADR-014 §9).
- `/metrics` отдаёт данные в текстовом формате Prometheus: `http_requests_total`, `http_request_duration_seconds`, `ingest_batches_total`, `ingest_rows_rejected_total`, `ingest_rows_upserted_total`, `ingest_last_success_age_seconds`, `suppression_screened_cells_total`, `audit_write_failures_total`. Метками служат контур, _сопоставленный_ маршрут и класс статуса (`2xx`/`4xx`/`5xx`), поэтому кардинальность ограничена (ADR-014 §8). Перед выходом в продакшн location на шлюзе следует сузить до сети мониторинга.
- Развёртывание: четыре сервиса Compose - `gateway` (nginx), `web` (SSR на Node/TanStack Start), `server` (API на Rust + воркер) и PostgreSQL 18. HTTP-порт публикует только шлюз. TLS терминируется на университетском прокси, который перенаправляет один внешний origin в nginx; PostgreSQL и обе среды выполнения приложения остаются приватными внутри сетей Compose.
- Резервные копии: ночной `pg_dump` + архивирование WAL, учебное восстановление описано в `deploy/RUNBOOK.md`. Миграции - только вперёд (`sqlx migrate`), сначала аддитивные (expand → migrate → contract на протяжении нескольких релизов).

---

## 9. Стратегия тестирования (страховочная сеть для агентов)

Автономная разработка безопасна только тогда, когда корректность проверяема машиной. У каждого слоя есть исполняемый гейт:

| Слой                      | Инструменты                                                                   | Что проверяется                                                                                                                                                                                                                                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Доменные правила          | `cargo test` + `proptest`                                                     | **Свойства k-анонимности**: (P1) ни одна прошедшая скрининг выходная группа не имеет `0 < n < k`; (P2) комплементарное подавление не оставляет остаточной группы `< k`, восстановимой из видимых сумм; (P3) подавление монотонно по `k`. Вывод академического года, границы корзин (граничные значения 50/70/85/95), выравнивание YoY |
| SQL                       | `#[sqlx::test]` (отдельная БД на тест, с применёнными миграциями)             | Корректность агрегатов относительно запросов полным перебором по фикстурам; фильтрация по области видимости; идемпотентный upsert; журнал аудита только на добавление (UPDATE/DELETE отозваны)                                                                                                                                        |
| Контракт API              | эталонный diff `openapi.json` + проверка расхождения сгенерированного клиента | Обработчик ↔ клиент никогда не смогут молча разойтись                                                                                                                                                                                                                                                                                 |
| HTTP                      | интеграционные тесты `axum` (`tower::ServiceExt`)                             | Редиректы аутентификации; матрица RBAC (каждая роль × каждый эндпоинт × в области видимости / вне её → 200/403); строки аудита записаны; публичные ответы проходят `KAnonymityGuard`; 422 на некорректных фильтрах                                                                                                                    |
| Модульные тесты фронтенда | Vitest (`vp test`)                                                            | Обратимость (round-trip) схемы фильтров, полнота i18n, форматтеры, отрисовка подавленной ячейки                                                                                                                                                                                                                                       |
| E2E                       | Playwright против стенда, засеянного фикстурами                               | Значения раздел за разделом совпадают с `fixtures/expected.json`; комбинации фильтров; выгрузки скачиваются, разбираются и совпадают; сообщения о высоте при встраивании; переключение RU/KK; сканирование доступности axe                                                                                                            |
| Нагрузка                  | k6 в CI (ночью)                                                               | Бюджеты §7 при 250k засеянных строк                                                                                                                                                                                                                                                                                                   |
| Отчёты                    | snapshot-тесты                                                                | Таблицы годового отчёта равны агрегатам фикстур, вычисленным полным перебором; PDF рендерится; строки, похожие на ФИО, отсутствуют во всех выходных файлах (страж на регулярном выражении)                                                                                                                                            |

**Фикстуры** (`fixtures/`): детерминированный генератор (ГПСЧ с фиксированным зерном), порождающий ~60k проверок за 3 учебных года, по 8 факультетам, 40 кафедрам и всем типам работ - включая специально сконструированные малые группы (n = 1..k+1), которые делают пути подавления наблюдаемыми, плюс `expected.json`, вычисляемый независимым скриптом полного перебора. Агенты и CI используют одинаковые фикстуры, поэтому утверждение «цифры совпадают с источником» (приёмка §10.1) проверяемо без продакшн-данных.

---

## 10. Сборка и конвейер CI

Локально = CI; по одной команде на каждый шаг (полный сценарий см. в AGENTS.md):

```
vp install                 # toolchain + deps (frontend), cargo fetch (backend)
vp check                   # fmt + lint + typecheck (frontend, Oxlint/Oxfmt/tsc)
vp test                    # Vitest
cargo fmt --check && cargo clippy --all-targets -- -D warnings
cargo test --workspace     # unit + sqlx + integration (Postgres via testcontainer/service)
vp run gen:api             # regenerate client; CI runs `vp run gen:api:check`, which fails on drift
vp run e2e                 # Playwright against compose stack with fixtures
(cd apps/web && vp build)  # production frontend build (`vp -C` exists only in the global shim)
docker compose --env-file deploy/.env -f deploy/docker-compose.yml config
                            # render/validate deployment topology (when Docker is available)
```

Порядок в CI: install → проверка расхождения контракта → fmt/clippy/test бэкенда → check/test фронтенда → сборка → e2e → (ночью) нагрузочный тест. **Для слияния требуются все зелёные гейты.** Ни один гейт нельзя пропустить, ослабить или пометить `#[ignore]`, чтобы протащить изменение - вместо этого исправляйте само изменение.

---

## 11. Записи архитектурных решений (ADR)

Нетривиальные решения фиксируются в `docs/adr/NNN-title.md` (контекст → решение → последствия). Действующие решения:

- **ADR-001** Предагрегированные материализованные представления вместо кеширования во время запроса (предсказуемый p95, отсутствие целого класса ошибок инвалидации кеша).
- **ADR-002** k-анонимность обеспечивается по построению (`Screened<T>`) + защитный слой на ответах, а не дисциплиной ревьюера.
- **ADR-003** OpenAPI генерируется из Rust; клиент фронтенда генерируется из него. Типы Rust - единственный источник истины.
- **ADR-004** Typst для PDF (детерминированно, тестируемо) вместо печати через безголовый браузер.
- **ADR-005** Планировщик внутри процесса (Tokio + рекомендательная блокировка) вместо внешнего cron - один разворачиваемый артефакт, один поток логов.
- **ADR-006** Valibot для параметров поиска, форм и схем ответов сгенерированного клиента (ТЗ §9); никакого `zod` за пределами сгенерированного каталога.
- **ADR-007** Paraglide JS для RU/KK/EN - скомпилированные функции сообщений, паритет ключей закреплён тестом.
- **ADR-008** Правила вывода для исторической загрузки (backfill) и HMAC `work_ref`/`reviewer_ref` с серверным pepper; диалект CSV и общие константы, которые читают оба потока работ.
- **ADR-009** Раздельные контейнеры API на Rust и SSR на Node/TanStack Start за единым шлюзом nginx.
- **ADR-010** Контракт приёма данных для новой системы-источника: версионированная постраничная выборка по курсору, несущая каждое поле ТЗ §3.1 и никаких персональных данных, опубликована как `contracts/ingest-source.schema.json`.
- **ADR-011** Структура конвейера приёма данных: границы модулей, где живёт SQL и какие зависимости ему разрешены.
- **ADR-012** Слой API: топология промежуточных слоёв, сессии в базе данных, защитный слой k-анонимности и самописный ограничитель частоты запросов.
- **ADR-013** Рендеринг отчётов: одна модель документа, два рендерера (Typst и `rust_xlsxwriter`) и поставляемые в комплекте шрифты под лицензией OFL.
- **ADR-014** Портальный SSO - это самописный OIDC code flow с PKCE; внутренний контур отдаёт точные числа пяти ролям с областями видимости и подвергает скринингу всё, что покидает систему в виде файла; матрица RBAC - это реестр, с которым сверяется контракт.
- **ADR-015** Расписание отчётов, нагрузочный бюджет и способ его измерения, а также развёрнутая поверхность (экспозиция `/metrics`, границы шлюза).
- **ADR-016** Публичное релизное замыкание (release closure): публичный контур публикует суммы по кубу `(месяц, факультет, тип работы)`, ограниченному ячейками не менее чем с `k` проверками, на окнах, привязанных к целым месяцам, с одним округлением до целого - что по построению закрывает атаки разностным анализом и через маргинальные суммы, убирает публичный фильтр `status` и выводит комплементарное подавление из живого публичного пути (оно остаётся для внутреннего контура и утверждённых статических артефактов).

Агенты, добавляющие зависимость, таблицу или группу эндпоинтов, обязаны добавить ADR в том же изменении (следующий свободный номер: **017**).
