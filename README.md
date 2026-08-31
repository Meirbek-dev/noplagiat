[![CI](https://github.com/Meirbek-dev/noplagiat/actions/workflows/ci.yml/badge.svg)](https://github.com/Meirbek-dev/noplagiat/actions/workflows/ci.yml)

# Панель аналитики по антиплагиату (`noplagiat-analytics`)

Панель аналитики по антиплагиату НАО «Торайгыров университет» - веб-раздел на
портале университета `tou.edu.kz`, консолидирующий данные системы проверки на
уникальность текста `noplagiat.tou.edu.kz` (ТЗ §1.1).

## Два контура

- **Публичный контур** - доступен на портале без авторизации и содержит только
  агрегированные обезличенные данные. Каждое число проходит подавление по
  правилу k-анонимности и публикуется как сумма релизного замыкания
  (release closure).
- **Внутренний контур** - детализация для авторизованных ролей: вход через SSO
  портала (OIDC), ролевая модель RBAC с областью видимости по факультету и
  кафедре, журналирование каждого обращения, включая экспорт.

Персональные данные в систему не попадают: хранилище содержит только
непрозрачный идентификатор проверки, отметки времени, ссылки на справочники и
числовые метрики.

## Технологический стек

| Слой           | Состав                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------- |
| Бэкенд         | Rust: Axum, SQLx; крейты `domain`, `db`, `compliance`, `ingest`, `reports`, `api`           |
| Хранилище      | PostgreSQL 18: таблица фактов + материализованные представления агрегатов                   |
| Фронтенд       | TanStack Start (React 19), TanStack Router/Query/Charts, Tailwind CSS, paraglide (RU/KK/EN) |
| Контракт       | `contracts/openapi.json` генерируется из Rust, TypeScript-клиент - из контракта             |
| Инструментарий | Vite+ (`vp`), Bun, Turbo, Vitest, Playwright, k6                                            |
| Развёртывание  | Docker Compose: nginx + SSR-приложение + сервер + PostgreSQL                                |

## Быстрый старт

```bash
vp install
```

Нужны обе переменные с адресом БД: макросы `sqlx` читают `DATABASE_URL`, сервер
читает `APP_DATABASE_URL`.

```bash
export DATABASE_URL='postgres://noplagiat:noplagiat@localhost:5432/noplagiat'
export APP_DATABASE_URL="$DATABASE_URL"
export APP_INGEST_PEPPER='dev-pepper'   # только для фикстур, см. fixtures/README.md

vp run db:up             # PostgreSQL 18 через Compose, если локального экземпляра нет
vp run fixtures:gen      # детерминированные фикстуры: ~60 000 проверок, 3 учебных года
vp run seed              # загрузка фикстур в локальную БД

cargo run --manifest-path server/Cargo.toml   # API на :8080
vp run dev                                    # дашборд на :3000
```

Всё перечисленное - нативный цикл разработки: PostgreSQL, Rust и Vite запускаются
на хосте по отдельности. Полный стек в контейнерах (nginx + SSR + сервер + БД,
единственный опубликованный порт `8080`) поднимается иначе:

```bash
cp deploy/env.example deploy/.env    # задайте пароли; для локального стека APP_AUTH_MODE=dev
cd deploy && podman compose up -d --build
```

Стек собирается и проверяется под rootless podman в WSL2; `docker compose`
работает так же. Отличия podman - лимиты памяти WSL для релизной сборки Rust,
адрес DNS в `nginx.conf`, правила `.dockerignore` и подмена путей в Git Bash -
разобраны в [deploy/RUNBOOK.md](deploy/RUNBOOK.md), раздел «Podman вместо
Docker». Свежий стек поднимается с **пустым** хранилищем: как его наполнить и
почему разрезы по факультету при этом остаются пустыми - там же, в разделе
«Наполнение свежего стека данными».

Гейты проверки: `vp check` и `vp test` (фронтенд), `vp run server:test`
(бэкенд), `vp run gen:api:check` (синхронность контракта и клиента),
`vp run e2e` (Playwright).

## Документация

- [docs/TZ.md](docs/TZ.md) - нормативное техническое задание.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - инженерный источник истины.
- [docs/PLAN.md](docs/PLAN.md) - срезы, решения, график.
- [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md) - критерии приёмки ТЗ §10: команда → доказательство.
- [deploy/RUNBOOK.md](deploy/RUNBOOK.md) - эксплуатация, учения и продуктивные оговорки.
- [AGENTS.md](AGENTS.md) - правила разработки для агентов.

Лицензия: MIT ([LICENSE](LICENSE)).
