/**
 * Local seeding orchestrator for the fixture warehouse (W0.3, ADR-008 §10).
 *
 *   bun fixtures/seed.ts [--scale small|load] [--seed N]
 *                        [--force] [--reset] [--skip-ingest]
 *
 * Steps:
 *   1. generate the fixtures if `fixtures/out/` is missing (or `--force`)
 *   2. `psql -f fixtures/dictionaries.sql` and `fixtures/work-type-rules.sql`
 *   3. load `fixtures/staff-units.csv` into `staff_units`, HMACing each
 *      e-mail here so no plaintext address ever reaches the database
 *   4. run the CSV ingest CLI once per academic year
 *   5. create the fixture accounts through the `manage-users` CLI (ADR-017)
 *   6. print a summary
 *
 * Environment:
 *   APP_DATABASE_URL  default postgres://noplagiat:noplagiat@localhost:5432/noplagiat
 *   APP_INGEST_PEPPER default "dev-pepper" (warned about - production requires
 *                     a real pepper; ADR-008 §2: env only, never in Git/DB/logs)
 */

import { spawnSync } from "node:child_process"
import { createHmac } from "node:crypto"
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { FIXTURE_ACCOUNTS, FIXTURE_PASSWORD } from "./accounts"
import { generate } from "./generate"
import {
  SCALE_TARGETS,
  academicYearDir,
  academicYearsFor,
  norm,
  type Scale,
} from "./rules"

const ROOT = "fixtures"
const DEFAULT_DB = "postgres://noplagiat:noplagiat@localhost:5432/noplagiat"
const DEFAULT_PEPPER = "dev-pepper"

// ── ADR-008 §2 ──────────────────────────────────────────────────────────────

/** `reviewer_ref` = HMAC-SHA256(pepper, "reviewer\n" ++ norm(email)). */
function reviewerRef(pepper: string, email: string): string {
  return createHmac("sha256", pepper)
    .update(`reviewer\n${norm(email)}`)
    .digest("hex")
}

/**
 * `first char of the local part + "***" + last 4 chars of the local part`
 * (just `first + "***"` when the local part is shorter than 6), `@`, domain.
 * Example: `z***v.vn@teachers.tou.edu.kz`.
 */
function maskedLabel(email: string): string {
  const at = email.lastIndexOf("@")
  const local = at < 0 ? email : email.slice(0, at)
  const domain = at < 0 ? "" : email.slice(at + 1)
  const head = local.slice(0, 1)
  const masked =
    local.length < 6 ? `${head}***` : `${head}***${local.slice(-4)}`
  return `${masked}@${domain}`
}

// ── Shell helpers ───────────────────────────────────────────────────────────

const sq = (s: string): string => `'${s.replaceAll("'", "''")}'`

function run(
  cmd: string,
  args: string[],
  env: NodeJS.ProcessEnv
): { ok: boolean; message: string } {
  const r = spawnSync(cmd, args, {
    env: { ...process.env, ...env },
    stdio: ["ignore", "inherit", "inherit"],
    encoding: "utf8",
  })
  if (r.error) {
    const code = (r.error as NodeJS.ErrnoException).code
    return {
      ok: false,
      message:
        code === "ENOENT"
          ? `\`${cmd}\` is not on PATH`
          : `${cmd}: ${r.error.message}`,
    }
  }
  if (r.status !== 0) {
    return {
      ok: false,
      message: `${cmd} exited with status ${String(r.status)}`,
    }
  }
  return { ok: true, message: "" }
}

function psqlFile(db: string, file: string): { ok: boolean; message: string } {
  return run("psql", [db, "-v", "ON_ERROR_STOP=1", "-q", "-f", file], {})
}

// ── Steps ───────────────────────────────────────────────────────────────────

type Options = {
  scale: Scale
  seed: number
  force: boolean
  reset: boolean
  skipIngest: boolean
}

function parseArgs(argv: readonly string[]): Options {
  const o: Options = {
    scale: "small",
    seed: 1,
    force: false,
    reset: false,
    skipIngest: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--scale") {
      const v = argv[++i]
      if (v !== "small" && v !== "load") {
        throw new Error(`--scale must be small|load, got ${String(v)}`)
      }
      o.scale = v
    } else if (a === "--seed") {
      o.seed = Number(argv[++i])
      if (!Number.isInteger(o.seed))
        throw new Error("--seed must be an integer")
    } else if (a === "--force") o.force = true
    else if (a === "--reset") o.reset = true
    else if (a === "--skip-ingest") o.skipIngest = true
    else if (a === "--help" || a === "-h") {
      console.log(
        "usage: bun fixtures/seed.ts [--scale small|load] [--seed N] [--force] [--reset] [--skip-ingest]"
      )
      process.exit(0)
    } else throw new Error(`unknown argument: ${String(a)}`)
  }
  return o
}

/** Emits INSERTs whose only reviewer trace is an HMAC plus a masked label. */
function buildStaffUnitsSql(pepper: string): { sql: string; rows: number } {
  const text = readFileSync(join(ROOT, "staff-units.csv"), "utf8")
  const lines = text.split(/\r?\n/u).filter((l) => l.trim() !== "")
  const values: string[] = []
  for (const line of lines.slice(1)) {
    const [email, faculty, department] = line.split(";")
    if (!email || !faculty || !department) continue
    values.push(
      `    ('\\x${reviewerRef(pepper, email)}'::bytea,\n` +
        `     (SELECT id FROM faculties WHERE code = ${sq(faculty)}),\n` +
        `     (SELECT id FROM departments WHERE code = ${sq(department)}),\n` +
        `     ${sq(maskedLabel(email))})`
    )
  }
  const sql = [
    "-- GENERATED by fixtures/seed.ts - contains HMACs and masked labels only.",
    "-- No plaintext reviewer e-mail is ever written here (ADR-008 §2).",
    "BEGIN;",
    "INSERT INTO staff_units (email_hmac, faculty_id, department_id, masked_label)",
    "VALUES",
    values.join(",\n"),
    "ON CONFLICT (email_hmac) DO UPDATE SET",
    "    faculty_id    = EXCLUDED.faculty_id,",
    "    department_id = EXCLUDED.department_id,",
    "    masked_label  = EXCLUDED.masked_label;",
    "COMMIT;",
    "",
  ].join("\n")
  return { sql, rows: values.length }
}

function main(): void {
  const opts = parseArgs(process.argv.slice(2))
  const db = process.env.APP_DATABASE_URL ?? DEFAULT_DB
  const pepper = process.env.APP_INGEST_PEPPER ?? DEFAULT_PEPPER
  if (!process.env.APP_INGEST_PEPPER) {
    console.warn(
      `! APP_INGEST_PEPPER is unset - falling back to "${DEFAULT_PEPPER}".\n` +
        "  Fine for local fixtures; production MUST set a real pepper (ADR-008 §2)."
    )
  }
  console.log(`db     ${db.replace(/\/\/[^@]*@/u, "//***@")}`)
  console.log(`scale  ${opts.scale} (seed ${opts.seed})\n`)

  const problems: string[] = []
  const note = (s: string): void => {
    console.warn(`  ! ${s}`)
    problems.push(s)
  }

  // 1 - fixtures
  if (opts.force || !existsSync(join(ROOT, "out", "manifest.json"))) {
    console.log("1/6 generating fixtures")
    generate({ scale: opts.scale, seed: opts.seed, root: ROOT })
  } else {
    console.log("1/6 fixtures already present (pass --force to regenerate)")
  }

  // 2 - dictionaries and rules
  console.log("\n2/6 dictionaries and rules")
  const resetSql = join(ROOT, "reset.sql")
  if (opts.reset) {
    // reset.sql drops the whole `public` schema, so the migrations have to be
    // re-applied before any dictionary INSERT can land.
    if (!existsSync(resetSql)) {
      note("--reset given but fixtures/reset.sql does not exist yet")
    } else {
      const r = psqlFile(db, resetSql)
      if (!r.ok) note(`reset.sql: ${r.message}`)
      else {
        console.log("  reset.sql applied (schema dropped)")
        const m = run(
          "sqlx",
          ["migrate", "run", "--source", "server/migrations"],
          { DATABASE_URL: db }
        )
        if (!m.ok) {
          console.error(
            `  ! ${m.message}\n` +
              "    the schema is now EMPTY - re-apply the migrations " +
              "(`sqlx migrate run --source server/migrations`) before seeding"
          )
          process.exit(1)
        }
        console.log("  migrations re-applied")
      }
    }
  }
  for (const f of [
    "dictionaries.sql",
    "work-type-rules.sql",
    "initiator-rules.sql",
  ]) {
    const r = psqlFile(db, join(ROOT, f))
    if (!r.ok) note(`${f}: ${r.message}`)
    else console.log(`  ${f} applied`)
  }

  // 3 - staff units (HMAC computed here; the DB never sees an address)
  console.log("\n3/6 staff units")
  const { sql, rows } = buildStaffUnitsSql(pepper)
  const tmp = join(tmpdir(), "noplagiat-staff-units.sql")
  writeFileSync(tmp, sql, "utf8")
  const su = psqlFile(db, tmp)
  rmSync(tmp, { force: true })
  if (!su.ok) note(`staff_units: ${su.message}`)
  else console.log(`  ${rows} reviewer mappings upserted`)

  // 4 - ingest
  console.log("\n4/6 CSV ingest")
  const years = academicYearsFor(opts.scale)
  if (opts.skipIngest) {
    console.log("  skipped (--skip-ingest)")
  } else {
    for (const ay of years) {
      const dir = join(ROOT, "out", academicYearDir(ay))
      const r = run(
        "cargo",
        [
          "run",
          "--manifest-path",
          "server/Cargo.toml",
          "--bin",
          "ingest-csv",
          "--",
          "--dir",
          dir,
        ],
        { APP_DATABASE_URL: db, APP_INGEST_PEPPER: pepper }
      )
      if (!r.ok) {
        note(
          `ingest ${academicYearDir(ay)}: ${r.message} ` +
            "(the `ingest-csv` binary lands with slice W1.5 - until then this step is expected to fail)"
        )
        break
      }
      console.log(`  ${academicYearDir(ay)} ingested`)
    }
  }

  // 5 - accounts (ADR-017: nothing in the HTTP surface creates one)
  console.log("\n5/6 accounts")
  // The password travels in the environment, never in argv: the CLI refuses
  // `--password` precisely so it cannot land in a shell history or `ps` output.
  const manageUsers = (...args: string[]): { ok: boolean; message: string } =>
    run(
      "cargo",
      [
        "run",
        "--quiet",
        "--manifest-path",
        "server/Cargo.toml",
        "--bin",
        "manage-users",
        "--",
        ...args,
      ],
      { APP_DATABASE_URL: db, APP_ADMIN_PASSWORD: FIXTURE_PASSWORD }
    )

  for (const account of Object.values(FIXTURE_ACCOUNTS)) {
    const args = ["create-user", "--username", account.username]
    if (account.role !== null) args.push("--role", account.role)
    if ("faculty" in account) args.push("--faculty", account.faculty)
    if ("department" in account) args.push("--department", account.department)

    const created = manageUsers(...args)
    // `create-user` refuses a name that already exists, which is what a
    // repeated seed hits. Re-set the password instead, so a database that has
    // been seeded before still signs in with the fixture credentials.
    if (!created.ok) {
      const reset = manageUsers("set-password", "--username", account.username)
      if (!reset.ok) {
        note(`account ${account.username}: ${created.message}`)
        continue
      }
    }
    console.log(`  ${account.username} (${account.role ?? "no role"})`)
  }
  console.log(
    "  fixture accounts share a well-known password - never seed a real deployment this way"
  )

  // 6 - summary
  console.log("\n6/6 summary")
  const targets = SCALE_TARGETS[opts.scale]
  const manifest = JSON.parse(
    readFileSync(join(ROOT, "out", "manifest.json"), "utf8")
  ) as {
    years: {
      dir: string
      rows_total: number
      rows_importable: number
      rows_deleted: number
      rows_rejected_expected: number
    }[]
  }
  for (const y of manifest.years) {
    console.log(
      `  ${y.dir}  rows=${y.rows_total}  importable=${y.rows_importable}` +
        `  deleted=${y.rows_deleted}  must-reject=${y.rows_rejected_expected}`
    )
  }
  console.log(
    `  expected total facts: ${years.reduce((a, y) => a + (targets[y] ?? 0), 0)}`
  )
  console.log(
    "  compare aggregates against fixtures/expected.json (bun fixtures/expected.ts)"
  )

  if (problems.length > 0) {
    console.error(`\nseed finished with ${problems.length} problem(s)`)
    process.exit(1)
  }
  console.log("\nseed complete")
}

main()
