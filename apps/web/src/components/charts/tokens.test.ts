import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vite-plus/test"

/**
 * ARCHITECTURE.md §5.3 / AGENTS.md TS conventions: colours come from
 * `tokens.css` only. This is the gate - a hex literal anywhere else under
 * `src/` fails the build, so a chart can never hard-code a colour that dark
 * mode and the contrast budget do not know about.
 */
const SRC = fileURLToPath(new URL("../../", import.meta.url))
const TOKENS = join(SRC, "styles", "tokens.css")

/** Generated output and the token file itself are the only exceptions. */
const EXCLUDED_DIRS = new Set(["paraglide", "node_modules"])
const EXCLUDED_FILES = new Set([TOKENS, join(SRC, "routeTree.gen.ts")])
const EXTENSIONS = [".ts", ".tsx", ".css"]

/**
 * `#rgb`, `#rrggbb`, `#rrggbbaa` - but not a fragment identifier (`url(#id)`,
 * `href="#anchor"`), which is why a word boundary and a colour-length check are
 * both required.
 */
const HEX =
  /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?![0-9a-zA-Z_-])/g

function walk(directory: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry)
    if (statSync(full).isDirectory()) {
      if (EXCLUDED_DIRS.has(entry)) continue
      found.push(...walk(full))
      continue
    }
    if (!EXTENSIONS.some((extension) => entry.endsWith(extension))) continue
    if (EXCLUDED_FILES.has(full)) continue
    found.push(full)
  }
  return found
}

describe("colour tokens", () => {
  it("finds no hex literal outside tokens.css", () => {
    const offenders: string[] = []
    for (const file of walk(SRC)) {
      const source = readFileSync(file, "utf8")
      for (const [index, line] of source.split(/\r?\n/).entries()) {
        const matches = line.match(HEX)
        if (!matches) continue
        offenders.push(
          `${relative(SRC, file).split(sep).join("/")}:${String(index + 1)} → ${matches.join(", ")}`
        )
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([])
  })

  it("defines the six series slots and the five ramp steps in both modes", () => {
    const tokens = readFileSync(TOKENS, "utf8")
    const light = tokens.slice(
      tokens.indexOf(":root {"),
      tokens.indexOf(".dark {")
    )
    const dark = tokens.slice(tokens.indexOf(".dark {"))
    for (const slot of [1, 2, 3, 4, 5, 6]) {
      expect(light, `light --chart-${String(slot)}`).toContain(
        `--chart-${String(slot)}:`
      )
      expect(dark, `dark --chart-${String(slot)}`).toContain(
        `--chart-${String(slot)}:`
      )
    }
    for (const step of [1, 2, 3, 4, 5]) {
      expect(light, `light --chart-seq-${String(step)}`).toContain(
        `--chart-seq-${String(step)}:`
      )
      expect(dark, `dark --chart-seq-${String(step)}`).toContain(
        `--chart-seq-${String(step)}:`
      )
    }
    // the hatch treatment used by every suppressed cell
    expect(light).toContain("--suppressed-hatch:")
    expect(dark).toContain("--suppressed-hatch:")
  })

  it("republishes the palette under the names @tanstack/charts reads", () => {
    const tokens = readFileSync(TOKENS, "utf8")
    for (const slot of [1, 2, 3, 4, 5, 6]) {
      expect(tokens).toContain(
        `--ts-chart-${String(slot)}: var(--chart-${String(slot)});`
      )
    }
  })
})
