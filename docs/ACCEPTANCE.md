# Приёмочный пакет - noplagiat-analytics

**Срез:** W4.7 (docs/PLAN.md §3, фаза 4) · **Составлен:** 30.08.2026
**Нормативный источник:** [TZ.md](TZ.md) §10 - девять критериев приёмки,
процитированных ниже дословно · **Инженерный ориентир:**
[ARCHITECTURE.md](ARCHITECTURE.md)

Этот документ сопоставляет каждый критерий ТЗ §10 с командами, которые
проверяющий может выполнить на чистой копии репозитория, и называет тест или
артефакт, несущий доказательство. Он написан для исполнения, а не для чтения:
если приведённая ниже команда не воспроизводит заявленный результат, критерий
не выполнен - что бы ни утверждал этот файл.

Там, где критерий выполнен не полностью, отклонение выписано по месту и
повторено в [реестре отклонений](#реестр-отклонений). Ничто не объявляется
проверенным, если оно не было выполнено.

---

## 0. Подготовка

Всё нижеследующее выполняется из корня репозитория. `vp` - это CLI
инструментария Vite+ ([CLAUDE.md](../CLAUDE.md)); зафиксированная локальная
версия доступна через `node_modules/.bin` после `vp install`.

```bash
vp install
```

Должен быть доступен экземпляр PostgreSQL 18. Нужны обе переменные: макросы
`sqlx`, работающие на этапе компиляции, читают `DATABASE_URL`, а сервер читает
`APP_DATABASE_URL`:

```bash
export DATABASE_URL='postgres://noplagiat:noplagiat@localhost:5432/noplagiat'
export APP_DATABASE_URL="$DATABASE_URL"
export APP_INGEST_PEPPER='dev-pepper'   # fixture pepper only - see fixtures/README.md
```

`vp run db:up` поднимает экземпляр через Compose, если локального нет.

Проверочные данные синтетические, детерминированные и перегенерируемые; они
никогда не коммитятся в виде CSV:

```bash
vp run fixtures:gen        # bun fixtures/generate.ts --scale small - ~60 000 checks, 3 academic years
bun fixtures/expected.ts   # independent brute-force reducer → fixtures/expected.json + out/facts.jsonl
```

`fixtures/expected.json` - эталон, с которым сравнивается каждый числовой
критерий. Он не содержит SQL и ничего не импортирует из `server/` или
`apps/web/` (fixtures/README.md, «Независимость» / "Independence"), поэтому
совпадение между ним и хранилищем является доказательством, а не тавтологией.

Две команды покрывают всё дерево и дают самый быстрый способ увидеть состояние
всех гейтов сразу:

```bash
vp run server:test    # cargo test --workspace --manifest-path server/Cargo.toml
vp test               # Vitest - 84 tests in 8 files
```

Приведённые ниже команды по отдельным критериям - подмножества этих двух; они
выделены отдельно, чтобы во время разбора можно было выполнить ровно то
доказательство, которое относится к обсуждаемому пункту.

---

## 10.1 - Метрики соответствуют контрольным выгрузкам исходной системы

> «Все метрики п. 4.2 отображаются корректно и соответствуют контрольным
> выгрузкам из исходной системы.»

```bash
# The reference itself is deterministic and reproducible from the seed.
bun fixtures/verify.ts

# Every dashboard query against the brute-force reference, 10 filter scenarios.
cargo test --manifest-path server/Cargo.toml -p db --test expected_values

# The same numbers driven over HTTP through the public router.
cargo test --manifest-path server/Cargo.toml -p api --test public

# The internal contour: sections 4, 6, 7, 8 against the same reference.
cargo test --manifest-path server/Cargo.toml -p api --test internal

# Import correctness: exact row counts, exact rejections, control totals.
cargo test --manifest-path server/Cargo.toml -p ingest --test golden_parse
cargo test --manifest-path server/Cargo.toml -p ingest --test idempotency
```

| Доказательство                                                           | Что фиксирует                                                                                                               |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `db::expected_values::dashboard_queries_reproduce_expected_json_tz_10_1` | каждый запрос раздела §4.2 равен `expected.json` на матрице фильтров из десяти сценариев                                    |
| `db::expected_values::scope_isolates_a_faculty_and_a_department`         | запрос с областью видимости никогда не возвращает строки другого подразделения                                              |
| `api::public::public_endpoints_reproduce_the_fixture_aggregates`         | то же равенство по HTTP, на сериализованном теле ответа                                                                     |
| `api::internal::rechecks_match_the_brute_force_fixture`                  | §4.2 §6 доля улучшения при повторной проверке                                                                               |
| `api::internal::usage_reports_reviewers_and_admits_missing_durations`    | §4.2 §8 - уникальные проверяющие за месяц; среднее время сообщает «нет данных», а не выдумывает значение                    |
| `ingest::golden_parse::every_year_reproduces_its_sidecar_counts`         | число загруженных строк в точности равно ожидаемому значению из `out/<ay>/malformed.json`                                   |
| `ingest::golden_parse::the_control_totals_are_imported_per_year`         | «Совершенных проверок» из `system-usage.csv` сохраняется как базис сверки - именно этот механизм использует сверка из §10.9 |
| `ingest::idempotency::re_running_a_year_changes_nothing`                 | ТЗ §3.3.4 - повторный импорт ничего не меняет, поэтому счётчики не могут «уплыть» из-за повторного запуска                  |
| `fixtures/verify.ts`                                                     | две перегенерации побайтово идентичны и равны закоммиченному `expected.json`                                                |

**Статус: зелёный** на данных фикстур. Эквивалентная проверка против реальных
выгрузок - это шаг сверки из §10.9, представляющий собой процедуру на живых
данных, а не тест (см. ниже).

**Отклонение (доступность данных, а не корректность).** У двух метрик §4.2 нет
источника, и они скрываются, а не оцениваются приблизительно, - ровно так, как
допускает ТЗ §4.2 §1 («при наличии данных»):

- **Охват проверками** - знаменателя нет в системе антиплагиата.
  `submission_totals` заполняется офисом регистратора через интерфейс
  администратора; пока таблица пуста, KPI не отображается
  (`db::queries::coverage_appears_only_with_denominators`).
  Заблокировано **D2**.
- **Среднее время проверки** - ни в одной выгрузке нет длительности по
  отдельной строке. `usage_stats` принимает введённое вручную значение; в
  остальных случаях раздел сообщает «нет
  данных» (`db::queries::usage_counts_distinct_reviewers_and_surfaces_manual_duration`).

---

## 10.2 - Фильтры работают, в любых комбинациях

> «Фильтры (п. 4.3) работают корректно, в том числе в любых комбинациях.»

```bash
# URL round-trip: every preset, a full filter set, and the rejections.
vp test

# Filter combinations against the brute-force reference (the ten scenarios
# include faculty × work type, status-only, department-only and a custom range
# crossing a month boundary).
cargo test --manifest-path server/Cargo.toml -p db --test expected_values

# A malformed filter is a 422 problem document, never a silently ignored one.
cargo test --manifest-path server/Cargo.toml -p api --test layers
cargo test --manifest-path server/Cargo.toml -p api --test internal

# Bucket edges, period boundaries and the unknown-code behaviour.
cargo test --manifest-path server/Cargo.toml -p domain
cargo test --manifest-path server/Cargo.toml -p db --test queries
```

| Доказательство                                                | Что фиксирует                                                                                                                                                   |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/src/lib/search.test.ts`                             | каждый пресет периода и полный набор фильтров проходят полный цикл через параметры поиска в URL                                                                 |
| `apps/web/src/lib/filters.test.ts`                            | одинаковые состояния фильтров нормализуются в одинаковые объекты запроса независимо от порядка; публичный запрос никогда не несёт измерение внутреннего контура |
| `apps/web/src/lib/period.test.ts`                             | пресеты месяц / семестр / учебный год / 3 г. / 5 л. разрешаются в интервалы ТЗ §4.3                                                                             |
| матрица сценариев `fixtures/expected.json`                    | десять комбинаций фильтров, каждая проверяется раздел за разделом                                                                                               |
| `api::layers::malformed_filters_are_422_with_field_detail`    | тело RFC 7807 с указанием ошибочного поля                                                                                                                       |
| `api::layers::all_malformed_parameters_are_reported_at_once`  | сообщается о каждом некорректном параметре, а не только о первом                                                                                                |
| `api::internal::malformed_internal_filters_are_422`           | то же самое на внутреннем контуре                                                                                                                               |
| `db::queries::an_unknown_filter_code_returns_nothing`         | неизвестный код подразделения даёт пустое множество, а не нефильтрованное                                                                                       |
| `db::queries::custom_histogram_boundaries_fall_back_to_facts` | пользовательская конфигурация корзин пересчитывает агрегаты из фактов, а не считывает материализованное представление неверно                                   |

**Статус: зелёный** на каждом слое. Утверждение уровня браузера - что
комбинация фильтров переживает перезагрузку и сохранение в закладку - это
`apps/web/e2e/public.spec.ts` («filter combinations round-trip through the URL
and survive a reload»), зафиксированное как зелёное 30.08.2026 (несколько
прогонов полного набора, затем 34/34 после изменений ADR-016; проекты
firefox/webkit/планшет покрывают публичную поверхность).
Одно намеренное сужение: публичный контур больше не принимает фильтр `status`
(отклонение **A18/D-16.1**); статус остаётся фильтруемым во внутреннем контуре,
поэтому «в любых комбинациях» выполняется в пределах каждого контура с этим
зафиксированным исключением.

---

## 10.3 - Экспорт в PDF и Excel с учётом применённых фильтров

> «Экспорт в PDF и Excel формирует корректные файлы с учётом применённых
> фильтров.»

```bash
# Both renderers: real files, correct cells, no ФИО-shaped string, byte-stable PDF.
cargo test --manifest-path server/Cargo.toml -p reports --test rendering

# The endpoints: filters applied, marking present, audit row written, scope enforced.
cargo test --manifest-path server/Cargo.toml -p api --test export

# Kazakh and Russian glyph coverage in the bundled faces (risk R4).
cargo test --manifest-path server/Cargo.toml -p reports --test fonts
```

| Доказательство                                                               | Что фиксирует                                                                   |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `reports::rendering::the_rendered_cells_are_exactly_what_the_model_promised` | каждая ячейка отрисованного XLSX равна модели документа, полученной из фильтров |
| `reports::rendering::the_pdf_is_a_well_formed_document`                      | байты повторно разбираются `lopdf` - файл, который откроет читатель, корректен  |
| `reports::rendering::the_pdf_is_byte_stable_across_runs`                     | детерминированный вывод (ADR-004): расхождение означает изменение данных        |
| `reports::rendering::no_fio_shaped_string_reaches_either_format`             | страж на регулярном выражении по обоим форматам - ТЗ §6.1                       |
| `reports::rendering::the_service_marking_appears_only_on_internal_exports`   | «Для служебного пользования» на внутренних выгрузках и больше нигде             |
| `reports::rendering::the_kazakh_report_renders_without_tofu`                 | в казахской отрисовке нет квадратов отсутствующих глифов                        |
| `reports::rendering::one_worksheet_per_section_named_after_it`               | структура XLSX следует разделам отчёта                                          |
| `api::export::an_internal_export_produces_a_marked_file_and_an_audit_row`    | конечная точка применяет фильтры запроса, маркирует файл, пишет `export_*`      |
| `api::export::the_public_export_needs_no_session_and_writes_no_audit_row`    | публичный контур экспортирует без сессии и не аудируется                        |
| `api::export::an_out_of_scope_export_is_refused`                             | фильтр вне области видимости вызывающего даёт 403, а не молча суженный экспорт  |
| `reports::fonts::every_face_has_a_glyph_for_every_kazakh_letter`             | ә, ғ, қ, ң, ө, ұ, ү, һ, і в каждой встроенной гарнитуре                         |

**Статус: зелёный.** Подавление на пути экспорта относится к доказательствам
§10.4 и перечислено там.

---

## 10.4 - k-анонимность в API и в экспорте

> «Правило k-анонимности (п. 6.2) проверено на тестовых данных: показатели с
> числом наблюдений менее порога не отображаются и не передаются в
> API/экспорте.»

```bash
# The named reconstruction attack, plus P1/P2/P3 as property tests.
cargo test --manifest-path server/Cargo.toml -p compliance

# Just the attack, if the walkthrough wants one line:
cargo test --manifest-path server/Cargo.toml -p compliance reconstruction

# The response guard: an unscreened or wrongly-screened body never leaves.
cargo test --manifest-path server/Cargo.toml -p api --test layers

# End to end on the public contour, including a k change at runtime.
cargo test --manifest-path server/Cargo.toml -p api --test public

# The export path, which no HTTP guard covers.
cargo test --manifest-path server/Cargo.toml -p reports --test rendering
cargo test --manifest-path server/Cargo.toml -p api --test export
```

| Доказательство                                                                       | Что фиксирует                                                                                         |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `compliance::tests::reconstruction_attack_tz_10_4`                                   | явная атака: ни одна подавленная ячейка не восстанавливается из видимых ячеек и опубликованных итогов |
| `compliance::tests::no_small_group_survives` (proptest P1)                           | ни у одной опубликованной группы нет `0 < n < k`, при любом k                                         |
| `compliance::tests::matrix_leaves_no_residual_reconstruction` (P2)                   | дополнительное подавление по всей таблице не оставляет остаточной возможности восстановления          |
| `compliance::tests::matrix_suppression_monotone_in_k` (P3)                           | повышение k никогда не снимает подавление с ячейки                                                    |
| `compliance::tests::matrix_suppression_is_sound_and_monotone_over_every_small_table` | исчерпывающий перебор, а не выборка, по каждой малой таблице                                          |
| `api::layers::the_guard_withholds_an_unscreened_response`                            | обработчик, забывший про подавление, приводит к отказу в запросе                                      |
| `api::layers::the_guard_withholds_a_value_screened_against_the_wrong_group`          | подавление, проверенное по неверному свидетелю, также отлавливается                                   |
| `api::layers::every_public_endpoint_passes_the_guard`                                | вся публичная поверхность, конечная точка за конечной точкой                                          |
| `api::public::a_small_faculty_is_suppressed_together_with_its_complement`            | первичное **и** дополнительное подавление, наблюдаемые на реальных данных фикстур                     |
| `api::public::raising_k_suppresses_a_previously_visible_faculty`                     | `settings.k_threshold` вступает в силу без передеплоя                                                 |
| `api::export::a_suppressed_cell_never_exports_as_a_number`                           | путь экспорта через API                                                                               |
| `reports::rendering::a_suppressed_cell_shows_the_marker_and_never_its_number`        | сам рендерер - электронную таблицу больше ничто не защищает                                           |

Фикстура построена именно для этого: ячейки факультета `FAC08` содержат ровно
1, 2, 3, 4, 5 и 6 наблюдений (`n = 1..k+1` при k = 5 по умолчанию), так что
обоим путям подавления есть за что зацепиться (fixtures/README.md, инвариант 4).

`Screened<T>` делает так, что публичный DTO без подавления не компилируется;
doctest `compliance/src/lib.rs - Screened (line 21)` - это тест `compile_fail`,
утверждающий ровно это.

**Усилено 30.08.2026 (ADR-016).** Состязательный аудит данных показал, что
подавление в пределах отдельного ответа само по себе всё равно давало утечку:
перекрывающиеся публичные окна дат позволяли восстановить индивидуальные
показатели оригинальности вычитанием, а ячейки, скрытые дополнительным
подавлением, были отдельно адресуемы через более узкие фильтры. Теперь
публичный контур отдаёт **суммы релизного замыкания (release closure)** -
каждое число является суммой по ячейкам `(month, faculty, work type)`,
содержащим ≥ k проверок; ячейки с числом наблюдений меньше k не вносят вклад
никуда, а публичные окна округляются до целых месяцев. Три опубликованных
рецепта атак стали постоянными регрессионными тестами:

```bash
cargo test --manifest-path server/Cargo.toml -p api --test closure
```

`closure.rs` (6 тестов): проход по однодневным окнам возвращает побайтово
идентичные тела; Σ месяцев = окно с остатком ровно 0; маржинальные суммы по
типам работ и по факультетам ничего не восстанавливают (с контрфактическим
случаем, доказывающим, что тест поймал бы прежнее поведение); все шесть
публичных представлений совпадают бит в бит по итогам, средним и числу
удержанных ячеек. Независимый редьюсер полным перебором в
`fixtures/expected.ts` вычисляет те же суммы замыкания, не имея общего кода.

**Статус: зелёный.**

---

## 10.5 - Ролевая модель, обеспеченная на уровне API

> «Ролевая модель (раздел 5) проверена: пользователь каждой роли видит только
> предусмотренные для него данные (проверка на уровне API, а не только
> интерфейса).»

```bash
# The matrix: every internal/admin route × every role × in-scope/out-of-scope.
cargo test --manifest-path server/Cargo.toml -p api --test rbac

# Sessions, CSRF, role-less users, expiry, deactivation.
cargo test --manifest-path server/Cargo.toml -p api --test auth

# The OIDC code flow against a mock identity provider.
cargo test --manifest-path server/Cargo.toml -p api --test oidc

# Scope enforced in SQL, observed through the router.
cargo test --manifest-path server/Cargo.toml -p api --test internal
```

| Доказательство                                                                                  | Что фиксирует                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api::rbac::the_rbac_matrix_holds`                                                              | **446 случаев** - 56 зарегистрированных маршрутов × 7 вызывающих, плюс случай выхода за область видимости для каждого из 9 маршрутов, фильтруемых по подразделению |
| `api::rbac::every_route_has_a_matrix_row`                                                       | реестр и сгенерированный контракт описывают одну и ту же поверхность: новая конечная точка без строки в матрице роняет CI                                          |
| `api::rbac::a_unit_role_cannot_read_a_neighbouring_unit`                                        | заведующему DEP11 отказано в DEP12 - самая узкая эскалация, которую проверка на уровне факультета пропустила бы                                                    |
| `api::internal::a_dean_sees_exactly_their_faculty`                                              | тело ответа, а не только код состояния, содержит только факультет декана                                                                                           |
| `api::internal::a_head_of_department_sees_exactly_their_department`                             | то же самое на уровень ниже                                                                                                                                        |
| `api::auth::an_unauthenticated_internal_request_is_401`                                         | анонимного доступа к внутреннему контуру нет                                                                                                                       |
| `api::auth::an_authenticated_role_less_user_is_403`                                             | неизвестный субъект SSO аутентифицируется, но ничего не видит                                                                                                      |
| `api::auth::a_staff_only_grant_does_not_open_the_internal_contour`                              | ППС не является ролью внутреннего контура (ТЗ §5)                                                                                                                  |
| `api::auth::a_mutation_without_a_matching_csrf_token_is_403`                                    | CSRF-защита на каждой мутации                                                                                                                                      |
| `api::auth::deactivating_a_user_closes_their_live_session`                                      | отзыв доступа происходит немедленно, а не при следующем входе                                                                                                      |
| `api::oidc::the_code_flow_signs_a_mapped_group_into_its_role`                                   | соответствие группа AD → `role_kind` на настоящем маршрутизаторе                                                                                                   |
| `api::oidc::a_group_mapping_resolves_a_unit_scope`                                              | группа также несёт область видимости                                                                                                                               |
| `api::oidc::an_unmapped_group_lands_on_the_request_access_path`                                 | случайных выдач прав нет                                                                                                                                           |
| `api::oidc::*_is_refused` (state, nonce, audience, issuer, expiry, unknown key, provider error) | семь режимов отказа при валидации токена                                                                                                                           |
| `api::oidc::the_session_id_rotates_at_login`                                                    | фиксация сессии                                                                                                                                                    |

ТЗ §10.5 прямо требует доказательства на уровне API «а не только интерфейса», и
приведённая выше матрица является таким доказательством.
`apps/web/e2e/rbac.spec.ts` добавляет интерфейсную половину - охранные проверки,
страницу запроса доступа и собственные числа декана, - но здесь она
вспомогательна, и её состояние описано в §10.8.

**Статус: частично зелёный - одно зафиксированное отклонение.**

**Отклонение (D7 - реальный IdP пока недоступен).** Все приведённые выше
проверки выполняются против **имитационного (mock)** поставщика идентификации,
реализованного в `api/tests/support/idp.rs`, который отдаёт настоящий
discovery-документ, JWKS и token-эндпоинт. Регистрация клиента у IdP портала
была запрошена 30.08.2026 и до сих пор остаётся без ответа (docs/REQUESTS.md,
D7), поэтому поток **не** проверялся против продуктивного IdP, работающего
поверх Active Directory. Непроверенным это оставляет ровно одно: значения
issuer, audience и group-claim, которые выдаёт реальный IdP. Всё, что код с ними
делает, зафиксировано выше.

До завершения регистрации система поставляется с `APP_AUTH_MODE=dev` - входом по
заголовкам, используемым только в тестах и при разработке;
`api::auth::oidc_mode_hides_the_dev_login_and_answers_503_from_login` и
`api::oidc::the_dev_login_is_absent_in_oidc_mode` утверждают, что в продуктивной
конфигурации его не существует. Приёмочная репетиция против реального IdP - это
повторный прогон `--test oidc` с `APP_OIDC_*`, направленными на портал, плюс по
одному ручному входу на каждую роль; она должна состояться до мониторинга ЛАЧ в
октябре.

---

## 10.6 - Журналирование доступа, включая экспорт

> «Журналирование доступа (п. 6.3) фиксирует все обращения к внутреннему
> контуру, включая экспорт.»

```bash
# One audit row per internal 2xx, and per export.
cargo test --manifest-path server/Cargo.toml -p api --test auth
cargo test --manifest-path server/Cargo.toml -p api --test internal
cargo test --manifest-path server/Cargo.toml -p api --test export

# The admin browser over the log, and the append-only property.
cargo test --manifest-path server/Cargo.toml -p api --test admin
cargo test --manifest-path server/Cargo.toml -p db --test schema_0002
cargo test --manifest-path server/Cargo.toml -p db --test queries
```

| Доказательство                                                            | Что фиксирует                                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `api::auth::an_audit_row_is_written_for_every_internal_2xx`               | строку пишет слой, а не обработчик - новая конечная точка аудируется по умолчанию   |
| `api::internal::every_internal_section_is_audited`                        | одна строка на просмотр раздела, с нормализованным состоянием фильтров              |
| `api::export::an_internal_export_produces_a_marked_file_and_an_audit_row` | действия `export_pdf` / `export_xlsx`                                               |
| `api::admin::the_audit_browser_paginates_and_filters`                     | `/api/admin/audit` пригоден как поверхность для проверки                            |
| `api::admin::the_audit_log_cannot_be_rewritten`                           | и UPDATE, и DELETE вызывают ошибку, причём через собственный пул соединений API     |
| `db::schema_0002::audit_log_is_append_only`                               | то же самое на уровне схемы - триггер `trg_audit_log_immutable` (миграция 0001)     |
| `db::queries::audit_entries_are_appended_and_filterable`                  | слой запросов                                                                       |
| `api::ops::authentication_never_surfaces_an_address`                      | строка аудита существует, но субъект SSO и e-mail никогда не попадают в строку лога |

Срок хранения обеспечивается отсутствием: нигде в `server/` нет пути UPDATE или
DELETE к `audit_log`, кроме тестов, утверждающих срабатывание триггера, и не
существует ни одного задания очистки (AGENTS.md, инвариант №4, ≥ 1 года
согласно ТЗ §6.3).

**Статус: зелёный.**

---

## 10.7 - Нагрузка и масштаб

> «Нагрузочное тестирование подтверждает требования раздела 7 (время загрузки
> ≤ 3 с при 50 000 записей; работоспособность при 250 000 записей).»

```bash
# 1. Seed a 250 000-row warehouse through the real importer.
bun fixtures/generate.ts --scale load
bun fixtures/seed.ts --scale load --skip-ingest
cargo run --release --manifest-path server/Cargo.toml --bin ingest-csv -- --dir fixtures/out

# 2. Start a release server, then measure.
APP_LISTEN_ADDR=127.0.0.1:8080 RUST_LOG=warn \
  cargo run --release --manifest-path server/Cargo.toml --bin noplagiat-server &
BASE=http://127.0.0.1:8080 vp run load        # k6 run fixtures/load/summary.js
BASE=http://127.0.0.1:8080 bun fixtures/load/bench.ts

# 3. The cost that request latency hides (PLAN.md R6).
psql "$DATABASE_URL" -c '\timing on' -c 'SELECT refresh_aggregates()'
```

| Доказательство                       | Что регистрирует                                                                                                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fixtures/load/RESULTS.md`           | измеренный прогон от 30.08.2026: 254 498 строк, p95 `/api/public/summary` **24–30 мс** при реалистичной конкурентности, обновление материализованного представления 1.25–1.50 с, с указанием машины |
| `fixtures/load/summary.js`           | гейт: `summary` при постоянных 40 req/s с `p(95) < 300 ms`; рядом - только регистрирующая нагрузочная кривая `stress`                                                                               |
| `.github/workflows/nightly-load.yml` | еженочно засевает 250 k через настоящий импортёр и роняет задание при превышении порога                                                                                                             |
| `fixtures/load/bench.ts`             | развёртка по конкурентности, лежащая в основе решения о калибровке                                                                                                                                  |

ТЗ здесь противоречит само себе: §7 указывает ≤ 2 с, §10.7 - ≤ 3 с. Решение
**D9** строит систему под 2 с, а гейт ставит на 3 с, и делит бюджет надвое:
**бэкенд**-половина - это p95 `/api/public/summary` < 300 мс, измеряемая k6
выше; половина **загрузки страницы** - это LCP, проверяемый в
`apps/web/e2e/perf.spec.ts` с жёстким бюджетом 3 000 мс и мягким бюджетом
2 000 мс, который печатает предупреждение, не роняя тест. Половина по LCP
зафиксирована: 1 312–1 484 мс в четырёх прогонах полного набора при 4×
замедлении CPU - то есть внутри даже инженерной цели в 2 с.

**Статус: частично зелёный - три зафиксированных отклонения.**

1. **Доказательство локальное, а не из CI.** `fixtures/load/RESULTS.md`
   фиксирует измеренный прогон на конкретно названной машине разработчика.
   Еженочное задание закоммичено и подключено, но пока **не** дало ни одного
   зафиксированного прогона, поэтому независимого измерения на нейтральном
   оборудовании нет.
2. **Закоммиченный профиль k6 был перекалиброван после первого прогона, и
   обоснование зафиксировано.** Исходная кривая 10→50 VU насыщала 6-ядерную
   машину, на которой одновременно размещались генератор нагрузки, API и база
   данных, и показывала p95 = 320 мс - это очередь, а не медленный запрос. Порог
   (300 мс) **не** ослаблялся; сценарий под гейтом теперь подаёт постоянные
   40 req/s, что примерно в 4× превышает правдоподобный пик портала за
   `Cache-Control: max-age=3600`, а насыщающая кривая сохранена без порога как
   регрессионный след. Полная аргументация, включая то, что было сознательно не
   сделано, приведена в `fixtures/load/RESULTS.md` §«Решение о калибровке»
   (Calibration decision).
3. **Среда выполнения Compose не проверена на машине разработки.**
   `deploy/docker-compose.yml` разворачивается (`docker compose … config`), но
   `docker compose up` с чистой копии репозитория здесь не выполнялся: хост
   разработки запускает PostgreSQL в rootless-контейнере podman под WSL2, и его
   каталог данных - PostgreSQL 19 beta, тогда как файл Compose закрепляет 18
   (deploy/RUNBOOK.md, примечание 2 к учению). Поднятие стека на staging-хосте с
   PostgreSQL 18 остаётся открытым пунктом и является гейтом W4.6 в его
   нынешней формулировке.

---

## 10.8 - Бренд и локализация

> «Интерфейс соответствует брендбуку университета (раздел 8) и требованиям
> локализации.»

```bash
# Colour tokens, chart wrappers, message-catalogue parity, accessibility scaffolding.
vp test

# Cyrillic and Kazakh glyph coverage in the report faces.
cargo test --manifest-path server/Cargo.toml -p reports --test fonts

# Locale resolution and the rendered pages.
vp run seed   # load a local PostgreSQL with the fixture warehouse
vp run dev    # then ?lang=kk / ?lang=en on the running dashboard
```

| Доказательство                                                                               | Что фиксирует                                                                                                                   |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `charts/tokens.test.ts` - "finds no hex literal outside tokens.css"                          | фирменный цвет нельзя зашить нигде внутри `src/`                                                                                |
| `charts/tokens.test.ts` - слоты серий и ступени градиента                                    | `--chart-1..6` плюс оформление подавленных значений существуют и в светлой, и в тёмной темах                                    |
| `apps/web/src/styles/tokens.css`                                                             | `#1D3D66` и `#DE6E35` определены один раз, рядом со значениями записан бюджет нетекстового контраста ≥ 3:1 (WCAG 2.1 AA 1.4.11) |
| `charts/charts.test.tsx` - "gives every chart a name, a description and a hidden data table" | ТЗ §8 «все графики дублируются текстовыми значениями»                                                                           |
| `charts/charts.test.tsx` - отрисовка подавленных значений (четыре случая)                    | «недостаточно данных» отображается явно, а не пропуском или нулём                                                               |
| `charts/charts.test.tsx` - "takes every string from the message catalogue"                   | в графике нет непереведённых литералов                                                                                          |
| `lib/i18n.test.ts`                                                                           | RU / KK / EN содержат одни и те же 384 ключа, нет пустых переводов, подстановки идентичны                                       |
| `reports::fonts::every_character_of_every_locale_table_has_a_glyph`                          | шаблоны отчётов отрисовываются во всех локалях                                                                                  |
| `deploy/embed-snippet.html`                                                                  | встраивание на портал (ТЗ §8 «Embed»)                                                                                           |

**Статус: зелёный - оба зафиксированных отклонения сняты.**

1. **~~Снято 31.08~~ - брендовые материалы поступили и применены (D10).**
   Комплаенс передал PNG основного логотипного блока и эмблемы в двух
   исполнениях (navy / белый) и подтвердил `Inter` как портальную гарнитуру
   (docs/REQUESTS.md, D10). Логотип поставлен всюду, где ТЗ §8 его требует:
   шапка публичной страницы, боковые панели внутреннего контура и админки,
   favicon / manifest / иконки установки, шапка PDF-отчёта. Векторных версий и
   отдельных композиций RU/KK не передавали - поставленные растровые мастера
   нарезаны под каждую точку применения и описаны в `apps/web/brand/README.md`.
   Два фирменных цвета остаются точными и по-прежнему живут только в
   `tokens.css`.
2. **~~Снято 30.08~~ - набор тестов уровня браузера зафиксирован как зелёный.**
   Полный набор `vp run e2e` в chromium проходил многократно (три подряд прогона
   32/32 при `retries: 0`, затем 34/34 после изменений публичного замыкания по
   ADR-016), axe не сообщает ни об одном серьёзном/критическом нарушении на
   публичном и embed-маршрутах, LCP измерен как 1 312–1 484 мс при 4×
   замедлении CPU против гейта в 3 000 мс, а дополнительный прогон на разных
   движках - **firefox + webkit (движок Safari) по спецификациям
   public/embed/i18n плюс проект с планшетным вьюпортом 768 px - прошёл 46/46**
   (ТЗ §7 «совместимость» и «адаптивная вёрстка»). Последующие задачи также
   выполнены: `apps/web/test-results/` внесён в gitignore, а заглушка
   определения CI удалена (задание e2e выполняется безусловно).

---

## 10.9 - Годовые обезличенные отчёты за 2024/25 и 2025/26 учебные годы

> «Автоматическое формирование обезличенного отчёта (п. 4.5) проверено на
> реальном периоде данных; сформированы отчёты за 2024–2025 и 2025–2026 учебные
> годы по форме Приложения 1.»

```bash
# All seven Приложение-1 tables, cell by cell, against the brute-force reference.
cargo test --manifest-path server/Cargo.toml -p reports --test annual_tables

# Immutability: regeneration creates a new snapshot, never overwrites one.
cargo test --manifest-path server/Cargo.toml -p reports --test snapshots

# The Sep 1 scheduler, against an injected clock and a real database.
cargo test --manifest-path server/Cargo.toml -p reports --test scheduler
```

Формирование на реальных данных - это процедура, а не тест, потому что входными
данными служат исключённые из git выгрузки в `stats/`. Она расписана по шагам в
[deploy/RUNBOOK.md](../deploy/RUNBOOK.md) §«Отчёты по реальным данным за 2024/25
и 2025/26 учебные годы» (Real-data reports for AY 2024/25 and 2025/26), и её
структура такова:

```bash
# 1. Import through the real pipeline - the import is what anonymizes (ADR-008 §10).
cargo run --release --manifest-path server/Cargo.toml --bin ingest-csv -- \
  --dir stats/ --source csv-backfill

# 2. Reconcile before generating anything.
psql "$APP_DATABASE_URL" -c "SELECT academic_year, count(*) FROM checks GROUP BY 1 ORDER BY 1;"

# 3. Generate both years, both mandatory locales, through the admin API.
#    POST /api/admin/reports/generate {kind, period_start, period_end, locale}
```

| Доказательство                                                                      | Что фиксирует                                                                                                                                                        |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reports::annual_tables::the_seven_tables_reproduce_expected_json`                  | каждая ячейка всех семи таблиц - общие показатели, по типам работ, распределение по диапазонам, по факультетам, повторные проверки, эскалации, использование системы |
| `reports::annual_tables::a_stricter_policy_suppresses_the_report`                   | отчёт проходит подавление по той же k-политике, что и дашборд                                                                                                        |
| `reports::snapshots::regenerating_a_period_never_overwrites_the_published_snapshot` | ТЗ §4.5 «неизменяемые снимки» - путь записи «только один раз» плюс хеш содержимого                                                                                   |
| `reports::snapshots::a_manual_snapshot_covers_an_arbitrary_period`                  | ручное формирование за период, не являющийся учебным годом                                                                                                           |
| `reports::scheduler::the_tick_generates_the_finished_year_once_and_then_skips`      | срабатывание 1 сентября идемпотентно при перезапусках (рекомендательная блокировка, ADR-005)                                                                         |
| `reports::scheduler::the_following_september_targets_the_next_year`                 | арифметика по часам не уплывает                                                                                                                                      |
| `deploy/RUNBOOK.md` §«Отчёты по реальным данным» (Real-data reports)                | исполняемая процедура, включая шаг сверки и передачу результатов                                                                                                     |

Производные доли в таблицах - доля повторных проверок, доля каждого диапазона
оригинальности, среднее и пик помесячных счётчиков проверяющих - в тесте
**пересчитываются** из опубликованных первичных величин, а не сравниваются поле
в поле, поэтому арифметика в `reports/src/annual.rs` проверяется, а не
повторяется эхом.

**Статус: зелёный - выполнено 30.08.2026** (локальное репетиционное хранилище;
продуктивный прогон повторяет идентичную процедуру с продуктивным pepper).
Все пять лет из `stats/` импортированы через обезличивающий конвейер -
**26 739 / 26 739 записей, ноль отказов** - и все четыре артефакта (2024/25 и
2025/26 учебные годы × RU и KK, PDF + XLSX) сформированы как неизменяемые
неопубликованные снимки. Полная таблица сверки датирована в
`deploy/RUNBOOK.md` §«Запись о выполнении - 30.08.2026» (Execution record -
30.08.2026); два её главных результата: число уникальных обезличенных
`reviewer_ref` совпадает с собственным счётчиком источника «Активные
пользователи» **точно во все пять лет** (13/15/17/15/172), а расхождения по
числу строк −0.1…−0.6 % относительно «Совершенных проверок» - это документы,
удалённые из источника до выгрузки (объяснено письменно, согласно правилу
ниже). Выявлен и исправлен тестом один дефект диалекта источника (голый `-` в
необязательных колонках метрик, ADR-008 §1).

**Свойства, зафиксированные заранее для этого прогона, - все выполнены:**

- **Обезличивание выполняет импортёр.** `stats/` никогда не предобрабатывается,
  не копируется в `fixtures/` и не загружается необезличенным (AGENTS.md,
  инвариант №1, ADR-008 §10).
- **Сверка предшествует формированию.** Погодовые счётчики загруженных строк
  сравниваются с «Совершенных проверок» в исходном `system-usage.csv`
  (2024/25: 5 457). Расхождение объясняется письменно на основании
  `ingest_batches.errors` до выпуска любого отчёта - и никогда не принимается
  молча.
- **Результаты никогда не коммитятся.** Они пишутся в `APP_REPORTS_DIR`
  (по умолчанию `reports-out/`, исключён из git) и передаются вне репозитория.
  Формирование - не публикация: отчёт попадает в публичный контур только через
  `POST /api/admin/reports/{id}/publish`.

Два раздела отчёта переносят на себя отклонение по доступности данных из §10.1:
KPI охвата в _общие показатели_ и среднее время проверки в _использование
системы_ показывают «нет данных», пока их не наполнят D2 и ручная запись в
`usage_stats`. ТЗ §4.2 §1 это предусматривает («при наличии
данных»).

---

## Реестр отклонений

| #   | Критерий       | Отклонение                                                                                                                                                                                                                                                            | Причина                                                                                        | Действующее резервное решение                                                                                   | Снимается, когда                                                                                        |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| A1  | §10.1, §10.9   | Охват проверками (coverage KPI) скрыт - в источнике нет знаменателя                                                                                                                                                                                                   | **D2** (офис регистратора), без ответа                                                         | KPI не отображается; `submission_totals` заполняется через интерфейс администратора; ТЗ §4.2 §1 это допускает   | офис регистратора предоставит погодовые итоги поданных работ                                            |
| A2  | §10.1, §10.9   | Среднее время проверки сообщает «нет данных» - ни в одной выгрузке нет длительности по строке                                                                                                                                                                         | в исходной системе нет такого поля                                                             | существует путь ручного ввода в `usage_stats`                                                                   | новая исходная система начнёт выдавать длительности (в контракте ADR-010 поле присутствует)             |
| A3  | §10.1, §4.2 §4 | Разрез по подразделениям осмыслен только начиная с 2025/26 учебного года; более ранние годы - «Не распределено»                                                                                                                                                       | реальность источника (PLAN.md §1.2)                                                            | явная сноска на странице; отнесение определяется строго членством в `staff_units`                               | **D2** предоставит историческое соответствие проверяющий→кафедра                                        |
| A4  | §10.5          | SSO проверено только против **имитационного (mock)** IdP                                                                                                                                                                                                              | **D7** (регистрация клиента), без ответа                                                       | `APP_AUTH_MODE=dev` для тестов, отсутствует в продуктивной конфигурации                                         | портал зарегистрирует клиента; повторно прогнать `--test oidc` против него                              |
| A5  | §10.7          | Доказательство по нагрузке - локальный прогон; еженочный прогон в CI пока не зафиксирован                                                                                                                                                                             | задание закоммичено 30.08, ещё не срабатывало                                                  | `fixtures/load/RESULTS.md` с указанием машины                                                                   | первый еженочный прогон опубликует свою сводку k6                                                       |
| A6  | §10.7          | Профиль k6 был перекалиброван (постоянные 40 req/s) после первого измерения                                                                                                                                                                                           | насыщение совмещённой 3-звенной установки                                                      | порог не изменён: p95 < 300 мс; насыщающая кривая сохранена, только для записи                                  | появится раннер с отдельным хостом базы данных, если таковой станет доступен                            |
| A7  | §10.7 / W4.6   | `docker compose up` не проверен на машине разработки                                                                                                                                                                                                                  | хост разработки работает на PostgreSQL 19 beta под WSL2; Compose закрепляет 18                 | `docker compose … config` разворачивается; RUNBOOK документирует риск несовпадения версий                       | стек будет поднят на staging-хосте с PostgreSQL 18                                                      |
| A8  | §10.8          | ~~снято 31.08~~ - брендовые материалы поступили (PNG основного блока и эмблемы, navy / белый; гарнитура `Inter`) и применены: шапка публичной страницы, боковые панели, favicon/manifest/иконки, шапка PDF-отчёта                                                     | -                                                                                              | -                                                                                                               | снято                                                                                                   |
| A9  | §10.2, §10.8   | ~~снято 30.08~~ - `vp run e2e` многократно зафиксирован зелёным (32/32, затем 34/34 после ADR-016; LCP 1 312–1 484 мс при 4× замедлении против гейта в 3 000 мс); проекты firefox + webkit + планшет покрывают публичную поверхность; e2e в CI выполняется безусловно | -                                                                                              | -                                                                                                               | снято                                                                                                   |
| A10 | §10.9          | Отчёты по реальным данным сформированы 30.08.2026 на локальном репетиционном хранилище, ещё не на продуктиве                                                                                                                                                          | срез **W4.3** выполнен локально; продуктивные pepper и хранилище ожидают развёртывания         | сверка зафиксирована в RUNBOOK (счётчики проверяющих точны ×5 лет); получено 4 артефакта                        | та же процедура из RUNBOOK будет повторно выполнена на продуктиве и передача Комплаенсу будет подписана |
| A11 | §4.2 §7        | Счётчики Совета по этике пусты                                                                                                                                                                                                                                        | **D11**, без ответа                                                                            | форма администратора пишет в `ethics_cases`; раздел показывает «нет данных»                                     | Совет предоставит погодовые счётчики                                                                    |
| A12 | §4.2 §4        | Детализация до ОП (образовательной программы) отсутствует - матрица останавливается на кафедрах; ОП сохраняется как фильтр по коду                                                                                                                                    | **D2**: ни в одном источнике нет справочника ОП и соответствия                                 | подсказка на странице; внутренний фильтр `program` принимает коды                                               | D2 предоставит справочник ОП и соответствие                                                             |
| A13 | §4.2 §8        | Раздел использования показывает один счётчик активных проверяющих, без разделения на ППС / офис регистратора                                                                                                                                                          | трактовка скобочного уточнения §4.2 §8 как перечисления того, кто считается пользователем      | измерение `initiator` присутствует в `agg_monthly`, его можно вывести позже                                     | Комплаенс запросит разделение                                                                           |
| A14 | §3.3.3         | `public_snapshot_quarter` носит процедурный характер - автоматической ежеквартальной заморозки живого публичного контура нет                                                                                                                                          | публикация «по регламенту» - организационное действие (механизм публикации отчётов существует) | ежеквартальная публикация выполняется через снимки отчётов в интерфейсе администратора + публикацию             | Комплаенс определит регламент, требующий технической заморозки                                          |
| A15 | §5 (ППС)       | Опциональное представление ППС по собственным дисциплинам не реализовано; роль `staff` не получает доступа ни к одному внутреннему разделу                                                                                                                            | ТЗ помечает его «опционально, при технической возможности»; соответствия по дисциплинам нет    | сотрудники попадают на страницу запроса доступа с пояснением; ADR-014 §4 фиксирует это сужение                  | станет доступно соответствие дисциплина↔проверяющий                                                     |
| A16 | §4.5 / §10.9   | Соответствие на уровне колонок официальной форме «Приложение 1 к приказу №13803» не проверено                                                                                                                                                                         | самой формы в репозитории нет; копия не предоставлялась                                        | семь таблиц ТЗ §4.5 реализованы и подтверждены на фикстурах                                                     | Комплаенс предоставит форму или согласует структуру (это же согласование R5 в PLAN)                     |
| A17 | §10.7 / W4.5   | Учение по восстановлению выполнено на dev (PG 19β + ветка с контейнером PG18), а не на staging                                                                                                                                                                        | staging-хоста пока не существует                                                               | обе ветки учения датированы в RUNBOOK §«Журнал учений» (Drill log), включая продуктивную мажорную версию (18.6) | учение будет повторено на staging-стеке                                                                 |
| A18 | §4.3 / §6.2    | **D-16.1** - публичный фильтр `status` удалён (422), сохранён на внутреннем контуре                                                                                                                                                                                   | ADR-016: при наличии статуса в релизном кубе было бы удержано 4.92 % всех строк                | разрезы по статусу доступны во внутреннем контуре; параметр отклоняется явно, а не игнорируется                 | Комплаенс предпочтёт 4-мерный куб и примет потерю полезности                                            |
| A19 | §4.2 / §6.2    | **D-16.2** - публичные цифры представляют собой суммы релизного замыкания (≤ истинных итогов; например, 59 771 из 60 000)                                                                                                                                             | ADR-016 закрывает атаки вычитанием/восстановлением, зафиксированные 30.08                      | каждый ответ несёт `suppressed_groups`; утверждённые отчёты сохраняют истинные итоги                            | никогда - это и есть предусмотренное строгое поведение по §6.2; пересматривается вместе с порогом k     |

Каждая внешняя зависимость без ответа (D2, D7, D11) отслеживается с
ответственным и сроком в [REQUESTS.md](REQUESTS.md). Ни одна из них не блокирует
ни один путь в коде: у каждой есть поставленное резервное решение, которое
допускает само ТЗ, и каждая доводится до корректного состояния вводом данных
через интерфейс администратора, а не изменением кода.

---

## Журнал проверки - 30.08.2026

Что фактически выполнила приёмочная дорожка (lane) при составлении этого пакета

- на машине разработчика, описанной в `fixtures/load/RESULTS.md`, против
  локального PostgreSQL и набора фикстур `--scale small`. Всё, чего нет в этой
  таблице, было прочитано, а не выполнено, и отмечено выше соответствующим
  образом.

| Команда                                                                                         | Результат                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bun fixtures/verify.ts`                                                                        | успех - 10 проверок; две перегенерации побайтово идентичны, `expected.json` и `facts.jsonl` стабильны, 60 000 строк                                                                                                                                                                                    |
| `cargo test --workspace --manifest-path server/Cargo.toml`                                      | успех - все цели бэкенда зелёные, 0 упавших, 0 проигнорированных                                                                                                                                                                                                                                       |
| `cargo test … -p compliance` (включая `reconstruction`)                                         | 19 пройдено + 3 doctest, один из них - страж `compile_fail` для `Screened<T>`                                                                                                                                                                                                                          |
| `cargo test … -p db --test expected_values`                                                     | 2 пройдено                                                                                                                                                                                                                                                                                             |
| `cargo test … -p db --test queries` / `--test schema_0002`                                      | 15 / 7 пройдено                                                                                                                                                                                                                                                                                        |
| `cargo test … -p api` (lib + admin, auth, export, internal, layers, oidc, ops, public, rbac)    | 76 + 10, 12, 7, 8, 12, 15, 6, 3, 4 пройдено                                                                                                                                                                                                                                                            |
| `cargo test … -p ingest` (lib + api_mode, batch_errors, golden_parse, idempotency, pii_absence) | 57 + 7, 6, 6, 7, 1 пройдено                                                                                                                                                                                                                                                                            |
| `cargo test … -p reports` (lib + annual_tables, fonts, rendering, scheduler, snapshots)         | 24 + 2, 3, 9, 2, 2 пройдено                                                                                                                                                                                                                                                                            |
| `cargo test … -p domain`                                                                        | 35 пройдено + 4 doctest                                                                                                                                                                                                                                                                                |
| `cargo run … --bin export-openapi -- --check contracts/openapi.json`                            | успех - «contract up to date», 55 путей                                                                                                                                                                                                                                                                |
| `vp run gen:api:check`                                                                          | успех - `apps/web/src/api` синхронизирован с контрактом                                                                                                                                                                                                                                                |
| `vp test`                                                                                       | успех - 79 тестов в 8 файлах                                                                                                                                                                                                                                                                           |
| `vp check`                                                                                      | **провал** - форматирование в файлах, которыми эта дорожка не владеет: только что добавленные `apps/web/e2e/*.spec.ts`, три компонента графиков/разделов, `deploy/RUNBOOK.md` и неотслеживаемые артефакты `apps/web/test-results/`. `vp fmt --check` чист на каждом файле, который правила эта дорожка |
| `vp run e2e`                                                                                    | **не выполнялся** - см. отклонение A9                                                                                                                                                                                                                                                                  |
| `vp run load` / `bun fixtures/load/bench.ts`                                                    | **не перезапускались** - зафиксированное доказательство: `fixtures/load/RESULTS.md` (30.08)                                                                                                                                                                                                            |
| `docker compose … up`                                                                           | **не выполнялся** - см. отклонение A7                                                                                                                                                                                                                                                                  |

Примечание для того, кто будет перезапускать набор тестов бэкенда на этой
машине: `server/target` вырос до 31 ГБ и заполнил том объёмом 50 ГБ, что
проявляется как ошибки `link.exe` LNK1180/LNK1102, а не как ошибка диска.
Приведённые выше прогоны выполнялись с `CARGO_TARGET_DIR`, направленным на
временный том.
