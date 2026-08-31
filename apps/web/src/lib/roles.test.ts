import { describe, expect, it } from "vite-plus/test"

import {
  ROLE_KINDS,
  canExport,
  canUseInternal,
  isAdmin,
  isRoleKind,
} from "./roles"

/**
 * These predicates only decide what the chrome offers; the server enforces
 * TZ §5 and the RBAC matrix test is the acceptance evidence. What is asserted
 * here is that the chrome agrees with `api::rbac` - chiefly that `staff` is
 * *not* an internal role, so a lecturer is never invited into a 403.
 */
describe("canUseInternal", () => {
  it("admits the five scoped roles and refuses ППС", () => {
    expect(canUseInternal("dept_head")).toBe(true)
    expect(canUseInternal("dean")).toBe(true)
    expect(canUseInternal("ethics")).toBe(true)
    expect(canUseInternal("compliance")).toBe(true)
    expect(canUseInternal("admin")).toBe(true)
    expect(canUseInternal("staff")).toBe(false)
  })

  it("refuses an account with no grant and an unknown role name", () => {
    expect(canUseInternal(null)).toBe(false)
    expect(canUseInternal(undefined)).toBe(false)
    expect(canUseInternal("rector")).toBe(false)
  })
})

describe("canExport", () => {
  it("matches the internal contour exactly (TZ §4.4)", () => {
    for (const role of ROLE_KINDS) {
      expect(canExport(role), role).toBe(canUseInternal(role))
    }
  })
})

describe("isAdmin", () => {
  it("is the admin role and nothing else", () => {
    expect(isAdmin("admin")).toBe(true)
    expect(isAdmin("compliance")).toBe(false)
    expect(isAdmin(null)).toBe(false)
  })
})

describe("isRoleKind", () => {
  it("accepts every wire value the contract lists", () => {
    for (const role of ROLE_KINDS) expect(isRoleKind(role), role).toBe(true)
    expect(isRoleKind("")).toBe(false)
    expect(isRoleKind(null)).toBe(false)
  })
})
