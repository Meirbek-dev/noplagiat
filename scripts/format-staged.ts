// Pre-commit formatter for staged files (invoked by `vp staged`, see
// vite.config.ts). `vp fmt` errors when every path it receives is excluded by
// its ignore rules, which happens whenever a lint-staged chunk consists only
// of generated files (paraglide, generated API client, contracts). This
// wrapper drops those paths first and succeeds on an empty remainder.

const IGNORED: RegExp[] = [
  /^contracts\//,
  /^apps\/web\/src\/api\//,
  /^apps\/web\/src\/paraglide\//,
  /routeTree\.gen\.ts$/,
  /^server\/target\//,
  /^server\/\.sqlx\//,
  /^fixtures\/out\//,
  /^stats\//,
  /^node_modules\//,
]

const root = new URL("..", import.meta.url).pathname.replace(/^\/(\w:)/, "$1")

const files = process.argv
  .slice(2)
  .map((p) => p.replaceAll("\\", "/"))
  .map((p) => {
    const normalizedRoot = root.replaceAll("\\", "/").replace(/\/$/, "")
    return p.startsWith(normalizedRoot) ? p.slice(normalizedRoot.length + 1) : p
  })
  .filter((p) => !IGNORED.some((re) => re.test(p)))

if (files.length === 0) {
  process.exit(0)
}

// Chunk to stay under the Windows command-line length limit.
const CHUNK = 40
for (let i = 0; i < files.length; i += CHUNK) {
  const chunk = files.slice(i, i + CHUNK)
  const proc = Bun.spawnSync(["vp", "fmt", "--write", ...chunk], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  })
  const out =
    new TextDecoder().decode(proc.stdout) +
    new TextDecoder().decode(proc.stderr)
  if (proc.exitCode !== 0) {
    // A chunk of binary/unknown-format files (fonts, .typ templates) leaves
    // oxfmt with zero targets - that is not a formatting failure.
    if (out.includes("Expected at least one target file")) {
      continue
    }
    console.error(out)
    process.exit(proc.exitCode ?? 1)
  }
}
