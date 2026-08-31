import { Auth, Internal } from "../api/sdk.gen"
import type {
  DepartmentsMatrix,
  DevLoginRequest,
  DevLoginResponse,
  InternalBreakdown,
  InternalEscalations,
  InternalFilterQuery,
  InternalHistogram,
  InternalRechecks,
  InternalSummary,
  InternalTimeseries,
  InternalUsage,
  InternalYoy,
  LogoutResponse,
  MeResponse,
} from "../api/types.gen"
import {
  vDepartmentsMatrix,
  vDevLoginResponse,
  vInternalBreakdown,
  vInternalEscalations,
  vInternalHistogram,
  vInternalRechecks,
  vInternalSummary,
  vInternalTimeseries,
  vInternalUsage,
  vInternalYoy,
  vLogoutResponse,
  vMeResponse,
} from "../api/valibot.gen"

import { ApiError, csrfHeaders, fetchScreened, isProblem } from "./api"
import { filenameFromDisposition } from "./download"

/**
 * Session and internal-contour calls (TZ.md §4.2 §§1–4, 6–9, §5).
 *
 * Same rules as the public seam in `api.ts`: nothing here calls `fetch`, every
 * response is parsed against the generated Valibot schema in dev and test, and
 * every screened cell stays a `ScreenedInt`/`ScreenedFloat` all the way to a
 * chart wrapper. Authorization is the server's job - these functions only make
 * the request the user's role already permits, and surface a `403` as a state
 * the page can explain (ARCHITECTURE §5.1).
 */

/**
 * Query string every filtered internal endpoint accepts: the public dimensions
 * plus `department`, `program` and `initiator` (TZ §4.3).
 */
export type InternalQuery = NonNullable<
  NonNullable<Parameters<typeof Internal.summary>[0]>["query"]
>

/** Wire names of the two export formats (contract `/api/internal/export`). */
export type ExportFormat = "pdf" | "xlsx"

/* ── Session ──────────────────────────────────────────────────────────────── */

export const authApi = {
  /**
   * Who the caller is. A `401` is not an error here - it is the anonymous
   * answer - so it resolves to `null` and the route guard redirects instead of
   * an error boundary catching a stack trace.
   */
  me: async (signal?: AbortSignal): Promise<MeResponse | null> => {
    const result = await Auth.me({ signal })
    if (result.response?.status === 401) return null
    return await fetchScreened(
      "auth/me",
      () => Promise.resolve(result),
      vMeResponse
    )
  },

  /**
   * `APP_AUTH_MODE=dev` only - mints a session without an identity provider.
   * The sign-in page that calls this is labelled «режим разработки» and the
   * endpoint 404s on any deployment running OIDC.
   */
  devLogin: (body: DevLoginRequest): Promise<DevLoginResponse> =>
    fetchScreened(
      "auth/dev-login",
      () => Auth.devLogin({ body }),
      vDevLoginResponse
    ),

  /** Ends the local session; follow `end_session_url` when the IdP sends one. */
  logout: (csrf: string): Promise<LogoutResponse> =>
    fetchScreened(
      "auth/logout",
      () => Auth.logout({ headers: csrfHeaders(csrf) }),
      vLogoutResponse
    ),
}

/* ── Internal contour ─────────────────────────────────────────────────────── */

export const internalApi = {
  summary: (
    query: InternalQuery,
    signal?: AbortSignal
  ): Promise<InternalSummary> =>
    fetchScreened(
      "internal/summary",
      () => Internal.summary({ query, signal }),
      vInternalSummary
    ),

  timeseries: (
    query: InternalQuery,
    signal?: AbortSignal
  ): Promise<InternalTimeseries> =>
    fetchScreened(
      "internal/timeseries",
      () => Internal.timeseries({ query, signal }),
      vInternalTimeseries
    ),

  workTypes: (
    query: InternalQuery,
    signal?: AbortSignal
  ): Promise<InternalBreakdown> =>
    fetchScreened(
      "internal/work-types",
      () => Internal.workTypes({ query, signal }),
      vInternalBreakdown
    ),

  histogram: (
    query: InternalQuery,
    signal?: AbortSignal
  ): Promise<InternalHistogram> =>
    fetchScreened(
      "internal/histogram",
      () => Internal.histogram({ query, signal }),
      vInternalHistogram
    ),

  yoy: (query: InternalQuery, signal?: AbortSignal): Promise<InternalYoy> =>
    fetchScreened(
      "internal/yoy",
      () => Internal.yoy({ query, signal }),
      vInternalYoy
    ),

  departmentsMatrix: (
    query: InternalQuery,
    signal?: AbortSignal
  ): Promise<DepartmentsMatrix> =>
    fetchScreened(
      "internal/departments-matrix",
      () => Internal.departmentsMatrix({ query, signal }),
      vDepartmentsMatrix
    ),

  rechecks: (
    query: InternalQuery,
    signal?: AbortSignal
  ): Promise<InternalRechecks> =>
    fetchScreened(
      "internal/rechecks",
      () => Internal.rechecks({ query, signal }),
      vInternalRechecks
    ),

  escalations: (
    query: InternalQuery,
    signal?: AbortSignal
  ): Promise<InternalEscalations> =>
    fetchScreened(
      "internal/escalations",
      () => Internal.escalations({ query, signal }),
      vInternalEscalations
    ),

  usage: (query: InternalQuery, signal?: AbortSignal): Promise<InternalUsage> =>
    fetchScreened(
      "internal/usage",
      () => Internal.usage({ query, signal }),
      vInternalUsage
    ),

  /**
   * `POST /api/internal/export` (TZ §4.4). The filters travel in the body and
   * the format in the query string; the response is the rendered file, so this
   * returns the blob and its server-chosen filename rather than JSON.
   *
   * The k-anonymity screening and the «Для служебного пользования» marking are
   * applied by the renderer - the client never post-processes the file.
   */
  export: async (
    filters: InternalFilterQuery,
    format: ExportFormat,
    locale: string,
    csrf: string
  ): Promise<{ blob: Blob; filename: string }> => {
    const { data, error, response } = await Internal.internalExport({
      body: filters,
      query: { format, locale },
      headers: csrfHeaders(csrf),
      parseAs: "blob",
    })
    if (error !== undefined || response?.ok !== true) {
      throw new ApiError(
        "internal/export",
        response?.status ?? 0,
        isProblem(error) ? error : undefined
      )
    }
    return {
      blob: data,
      filename:
        filenameFromDisposition(response.headers.get("content-disposition")) ??
        `noplagiat.${format}`,
    }
  },
}
