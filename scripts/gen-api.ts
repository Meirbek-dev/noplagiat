// Regenerates the typed API client (slice W2.2).
//
//   bun scripts/gen-api.ts            → `vp run gen:api`
//   bun scripts/gen-api.ts --check    → `vp run gen:api:check`
//
// Default run: export `contracts/openapi.json` from the Rust types, then run
// `@hey-api/openapi-ts` over it into `apps/web/src/api/`.
//
// `--check` is the drift gate. It never touches the tree: it regenerates into a
// temporary directory from the *committed* contract and diffs the result
// against the committed client, so a client that no longer matches the
// contract fails CI. Contract-versus-Rust drift is a separate gate (the
// `contract` job runs `export-openapi --check`), which is why `--check` does
// not need cargo and can run in the frontend job.

import { spawnSync } from "node:child_process"
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(fileURLToPath(new URL("..", import.meta.url)))
const check = process.argv.includes("--check")
const target = join(root, "apps", "web", "src", "api")

/** Banner prepended to every generated file - AGENTS.md invariant #5. */
const BANNER = `/**
 * НЕ РЕДАКТИРОВАТЬ - сгенерировано командой \`vp run gen:api\` из
 * contracts/openapi.json, который, в свою очередь, генерируется из типов Rust API
 * (ADR-003). Правки вручную перезаписываются при следующем запуске и роняют шлюз
 * рассогласования \`gen:api:check\`. Измените типы Rust и перегенерируйте.
 */
`

const README = `# Сгенерированный клиент API - НЕ РЕДАКТИРОВАТЬ ВРУЧНУЮ

Всё в этом каталоге производится командой \`vp run gen:api\` из
\`contracts/openapi.json\`, который, в свою очередь, экспортируется из типов
Rust API (ADR-003, инвариант #5 из AGENTS.md). Измените типы Rust и
перегенерируйте; никогда не правьте файл здесь вручную. \`vp run gen:api:check\`
перегенерирует во временный каталог и падает при любом различии - он выполняется
в задании frontend в CI.

## Что генерируется

| Файл             | Содержимое                                                             |
| ---------------- | ---------------------------------------------------------------------- |
| \`types.gen.ts\`   | типы TypeScript для каждого DTO, запроса и ответа                      |
| \`sdk.gen.ts\`     | по одному типизированному фетчеру на операцию (\`summary\`, \`timeseries\`, …) |
| \`valibot.gen.ts\` | схемы Valibot для тех же форм (ADR-006 / TZ §9 - не Zod)               |
| \`client.gen.ts\`  | общий экземпляр \`@hey-api/client-fetch\`                                |
| \`client/\`, \`core/\` | рантайм fetch-клиента, поставляемый генератором                     |

## Как это использует приложение

Код приложения **не** импортирует этот каталог напрямую; он обращается через
\`src/lib/api.ts\`, который

- задаёт базовый URL (см. ниже),
- превращает ответ вне 2xx в выброшенный \`ApiError\`, несущий тело problem по
  RFC 7807, и
- проверяет ответы сгенерированными схемами Valibot **только в dev- и
  test-сборках**, доверяя серверу в продакшене (ADR-006). Поэтому нарушение
  контракта громко падает во время разработки и ничего не стоит в продакшене.

\`src/lib/queries.ts\` оборачивает каждый фетчер в фабрику \`queryOptions\`
TanStack Query, ключуемую нормализованным объектом фильтров.

Операции сгруппированы по тегу OpenAPI (\`Public.summary()\`, \`Internal.summary()\`,
…). Оба контура публикуют одни и те же идентификаторы операций, и плоские
функции различались бы числовым суффиксом, значение которого зависит от порядка в
документе, поэтому класс-тег - это стабильное имя для импорта. Один случай вообще
не является запросом fetch: опубликованный отчёт скачивается переходом по
\`GET /api/public/reports/{id}/download\`, URL которого \`src/lib/api.ts\` строит через
\`reportDownloadUrl()\` по тому же правилу origin.

## Базовый URL

Браузер всегда общается с **собственным origin**: пути уже абсолютные
(\`/api/public/summary\`), поэтому базовый URL не настраивается и CORS не задействован.

| Контур      | Кто обслуживает \`/api\`                                                         |
| ----------- | ------------------------------------------------------------------------------ |
| продакшен   | шлюз nginx (ARCHITECTURE §5.6) - оставьте \`VITE_API_BASE\` незаданной           |
| разработка  | прокси dev-сервера Vite в \`apps/web/vite.config.ts\` → \`http://localhost:8080\` |

Серверный рендеринг не может использовать относительный URL (\`fetch\` в Node
требует origin), поэтому во время SSR \`src/lib/api.ts\` разрешает его по порядку:

1. \`API_ORIGIN\` - внутренний адрес Rust API (в Compose:
   \`http://server:8080\`). Задавайте его в любом развёртывании, где SSR-контейнер
   не расположен рядом со шлюзом.
2. \`VITE_API_BASE\` - явное переопределение для обеих сторон, обычно не задано.
3. \`http://127.0.0.1:8080\` - значение по умолчанию для локальной разработки, оно же
   адрес, на который указывает прокси dev-сервера.

Переопределите цель dev-прокси через \`API_PROXY_TARGET\`, если Rust-сервер
привязан к другому адресу (\`APP_LISTEN_ADDR\` в \`server/.env\`).
`

function run(command: string, args: string[], env?: Record<string, string>) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, ...env },
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function generate(outputDirectory: string) {
  run("bunx", ["@hey-api/openapi-ts"], { OPENAPI_OUTPUT: outputDirectory })
  // `output.clean` wipes the directory, so the banner and the README are
  // re-applied on every run rather than kept in the tree.
  for (const file of walk(outputDirectory)) {
    if (!file.endsWith(".ts")) continue
    const absolute = join(outputDirectory, file)
    writeFileSync(absolute, BANNER + readFileSync(absolute, "utf8"), "utf8")
  }
  writeFileSync(join(outputDirectory, "README.md"), README, "utf8")
}

/** Every file under `directory`, as paths relative to it, sorted. */
function walk(directory: string, prefix = ""): string[] {
  const found: string[] = []
  for (const entry of readdirSync(directory).sort()) {
    const absolute = join(directory, entry)
    if (statSync(absolute).isDirectory()) {
      found.push(...walk(absolute, `${prefix}${entry}/`))
    } else {
      found.push(`${prefix}${entry}`)
    }
  }
  return found
}

if (check) {
  const scratch = mkdtempSync(join(tmpdir(), "np-gen-api-"))
  try {
    generate(scratch)

    const expected = walk(scratch)
    const actual = walk(target)
    const differences: string[] = []

    for (const file of new Set([...expected, ...actual])) {
      const inExpected = expected.includes(file)
      const inActual = actual.includes(file)
      if (!inActual) {
        differences.push(`missing from the tree: ${file}`)
        continue
      }
      if (!inExpected) {
        differences.push(`not produced by the generator: ${file}`)
        continue
      }
      const left = readFileSync(join(scratch, file), "utf8")
      const right = readFileSync(join(target, file), "utf8")
      if (left !== right) differences.push(`differs: ${file}`)
    }

    if (differences.length > 0) {
      console.error(
        `\ngen:api drift - ${relative(root, target)} does not match contracts/openapi.json:`
      )
      for (const difference of differences) console.error(`  • ${difference}`)
      console.error("\nRun `vp run gen:api` and commit the result.\n")
      process.exit(1)
    }
    console.log(`gen:api:check - ${relative(root, target)} is in sync.`)
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
} else {
  run("cargo", [
    "run",
    "--manifest-path",
    "server/Cargo.toml",
    "--bin",
    "export-openapi",
    "--",
    "contracts/openapi.json",
  ])
  generate(target)
  console.log(`gen:api - regenerated ${relative(root, target)}.`)
}
