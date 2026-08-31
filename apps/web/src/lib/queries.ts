import { queryOptions } from "@tanstack/react-query"

import type { AuditQuery, DictionaryKind } from "./api-admin"
import { adminApi } from "./api-admin"
import type { InternalQuery } from "./api-internal"
import { authApi, internalApi } from "./api-internal"
import type { PublicQuery } from "./api"
import { publicApi } from "./api"
import { DICTIONARY_QUERY, INTERNAL_DICTIONARY_QUERY } from "./filters"

/**
 * One query-options factory per public endpoint, keyed by the normalized
 * filter object (ARCHITECTURE.md §5.1). Route loaders call
 * `queryClient.ensureQueryData(...)` with these; sections read the same
 * options through `useSuspenseQuery`, so a section renders from cache and
 * never issues a second request.
 *
 * `staleTime` is one hour on the public contour, matching the
 * `Cache-Control: public, max-age=3600` the endpoints send (ARCHITECTURE §7).
 */
const PUBLIC_STALE_TIME = 60 * 60 * 1000

/** Sections and their cache namespaces. One request each - never a waterfall. */
export const PUBLIC_SECTIONS = [
  "summary",
  "timeseries",
  "work-types",
  "faculties",
  "histogram",
  "yoy",
  "reports",
] as const

export type PublicSection = (typeof PUBLIC_SECTIONS)[number]

function key(section: PublicSection, query: PublicQuery) {
  return ["public", section, query] as const
}

export const publicQueries = {
  summary: (query: PublicQuery) =>
    queryOptions({
      queryKey: key("summary", query),
      queryFn: ({ signal }) => publicApi.summary(query, signal),
      staleTime: PUBLIC_STALE_TIME,
    }),

  timeseries: (query: PublicQuery) =>
    queryOptions({
      queryKey: key("timeseries", query),
      queryFn: ({ signal }) => publicApi.timeseries(query, signal),
      staleTime: PUBLIC_STALE_TIME,
    }),

  workTypes: (query: PublicQuery) =>
    queryOptions({
      queryKey: key("work-types", query),
      queryFn: ({ signal }) => publicApi.workTypes(query, signal),
      staleTime: PUBLIC_STALE_TIME,
    }),

  faculties: (query: PublicQuery) =>
    queryOptions({
      queryKey: key("faculties", query),
      queryFn: ({ signal }) => publicApi.faculties(query, signal),
      staleTime: PUBLIC_STALE_TIME,
    }),

  histogram: (query: PublicQuery) =>
    queryOptions({
      queryKey: key("histogram", query),
      queryFn: ({ signal }) => publicApi.histogram(query, signal),
      staleTime: PUBLIC_STALE_TIME,
    }),

  yoy: (query: PublicQuery) =>
    queryOptions({
      queryKey: key("yoy", query),
      queryFn: ({ signal }) => publicApi.yoy(query, signal),
      staleTime: PUBLIC_STALE_TIME,
    }),

  reports: () =>
    queryOptions({
      queryKey: key("reports", {}),
      queryFn: ({ signal }) => publicApi.reports(signal),
      staleTime: PUBLIC_STALE_TIME,
    }),

  /**
   * Options for the faculty and work-type selects. Deliberately *unfiltered*:
   * the filter bar must offer every unit, not only the ones that survived the
   * current filter and k-anonymity screening.
   */
  facultyOptions: () => publicQueries.faculties(DICTIONARY_QUERY),
  workTypeOptions: () => publicQueries.workTypes(DICTIONARY_QUERY),
}

/* ── Session ──────────────────────────────────────────────────────────────── */

/**
 * `/api/auth/me` backs both route guards and the user badge, so it is short
 * lived and never retried: a 401 is an answer (`null`), not a failure, and a
 * stale session must not keep a signed-out user inside the shell.
 */
export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: ["auth", "me"] as const,
      queryFn: ({ signal }) => authApi.me(signal),
      staleTime: 60 * 1000,
      retry: false,
    }),
}

/* ── Internal contour ─────────────────────────────────────────────────────── */

/**
 * `staleTime` is five minutes on the internal contour (ARCHITECTURE §5.1):
 * the warehouse refreshes at most daily, but an internal reader is looking at
 * their own unit and expects a recent number rather than an hour-old one.
 */
const INTERNAL_STALE_TIME = 5 * 60 * 1000

export const INTERNAL_SECTIONS = [
  "summary",
  "timeseries",
  "work-types",
  "histogram",
  "yoy",
  "departments-matrix",
  "rechecks",
  "escalations",
  "usage",
] as const

export type InternalSection = (typeof INTERNAL_SECTIONS)[number]

function internalKey(section: InternalSection, query: InternalQuery) {
  return ["internal", section, query] as const
}

export const internalQueries = {
  summary: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("summary", query),
      queryFn: ({ signal }) => internalApi.summary(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  timeseries: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("timeseries", query),
      queryFn: ({ signal }) => internalApi.timeseries(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  workTypes: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("work-types", query),
      queryFn: ({ signal }) => internalApi.workTypes(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  histogram: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("histogram", query),
      queryFn: ({ signal }) => internalApi.histogram(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  yoy: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("yoy", query),
      queryFn: ({ signal }) => internalApi.yoy(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  departmentsMatrix: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("departments-matrix", query),
      queryFn: ({ signal }) => internalApi.departmentsMatrix(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  rechecks: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("rechecks", query),
      queryFn: ({ signal }) => internalApi.rechecks(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  escalations: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("escalations", query),
      queryFn: ({ signal }) => internalApi.escalations(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  usage: (query: InternalQuery) =>
    queryOptions({
      queryKey: internalKey("usage", query),
      queryFn: ({ signal }) => internalApi.usage(query, signal),
      staleTime: INTERNAL_STALE_TIME,
    }),

  /**
   * Scope-aware filter options. The internal contour publishes no unit
   * dictionary of its own, so the faculties and departments a caller may pick
   * are exactly the ones their `departments-matrix` returns - the RBAC scope
   * therefore shapes the select without the client knowing the rule.
   */
  unitOptions: () =>
    internalQueries.departmentsMatrix(INTERNAL_DICTIONARY_QUERY),
  workTypeOptions: () => internalQueries.workTypes(INTERNAL_DICTIONARY_QUERY),
}

/* ── Admin ────────────────────────────────────────────────────────────────── */

/**
 * Administrative reads are configuration, not analytics: they are small, they
 * change only when an administrator changes them, and a stale list would make
 * a just-saved edit look lost. Hence a short stale time and no background
 * revalidation surprises.
 */
const ADMIN_STALE_TIME = 30 * 1000

/** Page size for the virtualized admin lists. */
export const ADMIN_PAGE_SIZE = 500

export const adminQueries = {
  sources: () =>
    queryOptions({
      queryKey: ["admin", "sources"] as const,
      queryFn: ({ signal }) => adminApi.sources(signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  /**
   * An ingest run is asynchronous - `POST /ingest/run` answers `202` and opens
   * a batch - so the list polls itself while one is still running, and stops
   * the moment none is (contract: `RunIngestResponse`).
   */
  batches: (limit: number = ADMIN_PAGE_SIZE, offset = 0) =>
    queryOptions({
      queryKey: ["admin", "batches", { limit, offset }] as const,
      queryFn: ({ signal }) => adminApi.batches(limit, offset, signal),
      staleTime: 0,
      refetchInterval: (query) =>
        query.state.data?.items.some((batch) => batch.status === "running") ===
        true
          ? 2000
          : false,
      // An administrator who starts an import and switches tab still wants to
      // find it finished when they come back; without this the poll pauses the
      // moment the tab loses focus and the row stays «Выполняется».
      refetchIntervalInBackground: true,
    }),

  batch: (id: number) =>
    queryOptions({
      queryKey: ["admin", "batch", id] as const,
      queryFn: ({ signal }) => adminApi.batch(id, signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  dictionary: (kind: DictionaryKind) =>
    queryOptions({
      queryKey: ["admin", "dictionary", kind] as const,
      queryFn: ({ signal }) => adminApi.dictionary(kind, signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  aliases: () =>
    queryOptions({
      queryKey: ["admin", "aliases"] as const,
      queryFn: ({ signal }) => adminApi.aliases(signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  staffUnits: (limit: number = ADMIN_PAGE_SIZE, offset = 0) =>
    queryOptions({
      queryKey: ["admin", "staff-units", { limit, offset }] as const,
      queryFn: ({ signal }) => adminApi.staffUnits(limit, offset, signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  workTypeRules: () =>
    queryOptions({
      queryKey: ["admin", "work-type-rules"] as const,
      queryFn: ({ signal }) => adminApi.workTypeRules(signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  initiatorRules: () =>
    queryOptions({
      queryKey: ["admin", "initiator-rules"] as const,
      queryFn: ({ signal }) => adminApi.initiatorRules(signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  ethicsCases: () =>
    queryOptions({
      queryKey: ["admin", "ethics-cases"] as const,
      queryFn: ({ signal }) => adminApi.ethicsCases(signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  roles: (limit: number = ADMIN_PAGE_SIZE, offset = 0) =>
    queryOptions({
      queryKey: ["admin", "roles", { limit, offset }] as const,
      queryFn: ({ signal }) => adminApi.roles(limit, offset, signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  settings: () =>
    queryOptions({
      queryKey: ["admin", "settings"] as const,
      queryFn: ({ signal }) => adminApi.settings(signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  reports: (limit: number = ADMIN_PAGE_SIZE, offset = 0) =>
    queryOptions({
      queryKey: ["admin", "reports", { limit, offset }] as const,
      queryFn: ({ signal }) => adminApi.reports(limit, offset, signal),
      staleTime: ADMIN_STALE_TIME,
    }),

  audit: (query: AuditQuery) =>
    queryOptions({
      queryKey: ["admin", "audit", query] as const,
      queryFn: ({ signal }) => adminApi.audit(query, signal),
      staleTime: ADMIN_STALE_TIME,
    }),
}
