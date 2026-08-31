/**
 * The local accounts the fixture stack is seeded with (ADR-017).
 *
 * Authentication is a login name and a password created by `manage-users`, so
 * an e2e run needs accounts to exist before it can sign in as anybody.
 * `fixtures/seed.ts` creates exactly this list; `apps/web/e2e/support.ts` signs
 * in as it. One module, so a role added on one side cannot silently go missing
 * on the other.
 *
 * Deliberately no imports and no Node APIs: this file is read by Bun (the
 * seeder) and by Playwright (the suite), under two different tsconfigs.
 */

/**
 * The password every fixture account holds.
 *
 * Not a secret and not a production value: it exists only in a fixture
 * database, and the seeder prints a warning when it creates accounts with it.
 * Long enough to clear `api::auth::password::MIN_PASSWORD_LENGTH`.
 */
export const FIXTURE_PASSWORD = "fixture-password-e2e"

export interface FixtureAccount {
  /** Login name typed at the sign-in form. */
  username: string
  /** `null` mints the role-less account the request-access page is for. */
  role: string | null
  /** Faculty dictionary code - required for `dean`. */
  faculty?: string
  /** Department dictionary code - required for `dept_head`. */
  department?: string
}

/**
 * Stable login names, so a repeated seed reuses the rows rather than
 * accumulating them.
 */
export const FIXTURE_ACCOUNTS = {
  deanFac03: { username: "e2e-dean-fac03", role: "dean", faculty: "FAC03" },
  headDep11: {
    username: "e2e-head-dep11",
    role: "dept_head",
    department: "DEP11",
  },
  staff: { username: "e2e-staff", role: "staff" },
  roleless: { username: "e2e-roleless", role: null },
  admin: { username: "e2e-admin", role: "admin" },
} as const satisfies Record<string, FixtureAccount>
