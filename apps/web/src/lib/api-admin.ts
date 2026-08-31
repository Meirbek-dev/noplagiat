import { Admin } from "../api/sdk.gen"
import type {
  AdminReportsResponse,
  AliasUpsert,
  AliasesResponse,
  AuditResponse,
  BatchDetailDto,
  BatchesResponse,
  DictionaryResponse,
  DictionaryUpsert,
  EthicsCaseUpsert,
  EthicsCasesResponse,
  GenerateReportRequest,
  InitiatorRuleUpsert,
  InitiatorRulesResponse,
  RoleGrantRequest,
  RolesResponse,
  RunIngestResponse,
  SettingsResponse,
  SettingsUpdate,
  SourceUpsert,
  SourcesResponse,
  StaffUnitUpsert,
  StaffUnitsResponse,
  WorkTypeRuleUpsert,
  WorkTypeRulesResponse,
} from "../api/types.gen"
import {
  vAdminReportsResponse,
  vAliasesResponse,
  vAuditResponse,
  vBatchDetailDto,
  vBatchesResponse,
  vDictionaryResponse,
  vEthicsCasesResponse,
  vInitiatorRulesResponse,
  vRolesResponse,
  vRunIngestResponse,
  vSettingsResponse,
  vSourcesResponse,
  vStaffUnitsResponse,
  vWorkTypeRulesResponse,
} from "../api/valibot.gen"

import { csrfHeaders, fetchScreened, fetchVoid } from "./api"

/**
 * Administrative calls (TZ.md §4.6). Reads are plain `GET`s; every write
 * carries the double-submit CSRF header and is journalled server-side as an
 * `admin_change` audit row (TZ §6.3), which is why no mutation here is
 * "optimistic" - the page refetches the list the server returns.
 */

/** The four dictionaries the admin UI edits (contract path segment). */
export const DICTIONARY_KINDS = [
  "faculties",
  "departments",
  "programs",
  "work-types",
] as const

export type DictionaryKind = (typeof DICTIONARY_KINDS)[number]

/** Audit filter query (`GET /api/admin/audit`). */
export type AuditQuery = NonNullable<
  NonNullable<Parameters<typeof Admin.audit>[0]>["query"]
>

export const adminApi = {
  /* ── Ingest sources and batches ─────────────────────────────────────────── */

  sources: (signal?: AbortSignal): Promise<SourcesResponse> =>
    fetchScreened(
      "admin/sources",
      () => Admin.listSources({ signal }),
      vSourcesResponse
    ),

  createSource: (body: SourceUpsert, csrf: string): Promise<SourcesResponse> =>
    fetchScreened(
      "admin/sources",
      () => Admin.createSource({ body, headers: csrfHeaders(csrf) }),
      vSourcesResponse
    ),

  updateSource: (
    id: number,
    body: SourceUpsert,
    csrf: string
  ): Promise<SourcesResponse> =>
    fetchScreened(
      "admin/sources",
      () =>
        Admin.updateSource({ path: { id }, body, headers: csrfHeaders(csrf) }),
      vSourcesResponse
    ),

  deleteSource: (id: number, csrf: string): Promise<void> =>
    fetchVoid("admin/sources", () =>
      Admin.deleteSource({ path: { id }, headers: csrfHeaders(csrf) })
    ),

  /** `202 Accepted` - the run is asynchronous; poll the batch list for it. */
  runIngest: (sourceId: number, csrf: string): Promise<RunIngestResponse> =>
    fetchScreened(
      "admin/ingest/run",
      () =>
        Admin.runIngest({
          body: { source_id: sourceId },
          headers: csrfHeaders(csrf),
        }),
      vRunIngestResponse
    ),

  batches: (
    limit: number,
    offset: number,
    signal?: AbortSignal
  ): Promise<BatchesResponse> =>
    fetchScreened(
      "admin/batches",
      () => Admin.listBatches({ query: { limit, offset }, signal }),
      vBatchesResponse
    ),

  batch: (id: number, signal?: AbortSignal): Promise<BatchDetailDto> =>
    fetchScreened(
      "admin/batch",
      () => Admin.getBatch({ path: { id }, signal }),
      vBatchDetailDto
    ),

  /* ── Dictionaries, aliases, staff units, rules ──────────────────────────── */

  dictionary: (
    kind: DictionaryKind,
    signal?: AbortSignal
  ): Promise<DictionaryResponse> =>
    fetchScreened(
      "admin/dictionaries",
      () => Admin.listDictionary({ path: { kind }, signal }),
      vDictionaryResponse
    ),

  upsertDictionary: (
    kind: DictionaryKind,
    body: DictionaryUpsert,
    csrf: string
  ): Promise<DictionaryResponse> =>
    fetchScreened(
      "admin/dictionaries",
      () =>
        Admin.upsertDictionary({
          path: { kind },
          body,
          headers: csrfHeaders(csrf),
        }),
      vDictionaryResponse
    ),

  deleteDictionary: (
    kind: DictionaryKind,
    code: string,
    csrf: string
  ): Promise<void> =>
    fetchVoid("admin/dictionaries", () =>
      Admin.deleteDictionary({
        path: { kind, code },
        headers: csrfHeaders(csrf),
      })
    ),

  aliases: (signal?: AbortSignal): Promise<AliasesResponse> =>
    fetchScreened(
      "admin/aliases",
      () => Admin.listAliases({ signal }),
      vAliasesResponse
    ),

  upsertAlias: (body: AliasUpsert, csrf: string): Promise<AliasesResponse> =>
    fetchScreened(
      "admin/aliases",
      () => Admin.upsertAlias({ body, headers: csrfHeaders(csrf) }),
      vAliasesResponse
    ),

  deleteAlias: (id: number, csrf: string): Promise<void> =>
    fetchVoid("admin/aliases", () =>
      Admin.deleteAlias({ path: { id }, headers: csrfHeaders(csrf) })
    ),

  staffUnits: (
    limit: number,
    offset: number,
    signal?: AbortSignal
  ): Promise<StaffUnitsResponse> =>
    fetchScreened(
      "admin/staff-units",
      () => Admin.listStaffUnits({ query: { limit, offset }, signal }),
      vStaffUnitsResponse
    ),

  /**
   * The plaintext e-mail is HMAC'd and masked inside the handler and is neither
   * stored nor logged (ADR-008 §2) - the form says so, because an administrator
   * typing a colleague's address deserves to know where it goes.
   */
  upsertStaffUnit: (
    body: StaffUnitUpsert,
    csrf: string
  ): Promise<StaffUnitsResponse> =>
    fetchScreened(
      "admin/staff-units",
      () => Admin.upsertStaffUnit({ body, headers: csrfHeaders(csrf) }),
      vStaffUnitsResponse
    ),

  deleteStaffUnit: (hmac: string, csrf: string): Promise<void> =>
    fetchVoid("admin/staff-units", () =>
      Admin.deleteStaffUnit({ path: { hmac }, headers: csrfHeaders(csrf) })
    ),

  workTypeRules: (signal?: AbortSignal): Promise<WorkTypeRulesResponse> =>
    fetchScreened(
      "admin/work-type-rules",
      () => Admin.listWorkTypeRules({ signal }),
      vWorkTypeRulesResponse
    ),

  createWorkTypeRule: (
    body: WorkTypeRuleUpsert,
    csrf: string
  ): Promise<WorkTypeRulesResponse> =>
    fetchScreened(
      "admin/work-type-rules",
      () => Admin.createWorkTypeRule({ body, headers: csrfHeaders(csrf) }),
      vWorkTypeRulesResponse
    ),

  updateWorkTypeRule: (
    id: number,
    body: WorkTypeRuleUpsert,
    csrf: string
  ): Promise<WorkTypeRulesResponse> =>
    fetchScreened(
      "admin/work-type-rules",
      () =>
        Admin.updateWorkTypeRule({
          path: { id },
          body,
          headers: csrfHeaders(csrf),
        }),
      vWorkTypeRulesResponse
    ),

  deleteWorkTypeRule: (id: number, csrf: string): Promise<void> =>
    fetchVoid("admin/work-type-rules", () =>
      Admin.deleteWorkTypeRule({ path: { id }, headers: csrfHeaders(csrf) })
    ),

  initiatorRules: (signal?: AbortSignal): Promise<InitiatorRulesResponse> =>
    fetchScreened(
      "admin/initiator-rules",
      () => Admin.listInitiatorRules({ signal }),
      vInitiatorRulesResponse
    ),

  createInitiatorRule: (
    body: InitiatorRuleUpsert,
    csrf: string
  ): Promise<InitiatorRulesResponse> =>
    fetchScreened(
      "admin/initiator-rules",
      () => Admin.createInitiatorRule({ body, headers: csrfHeaders(csrf) }),
      vInitiatorRulesResponse
    ),

  updateInitiatorRule: (
    id: number,
    body: InitiatorRuleUpsert,
    csrf: string
  ): Promise<InitiatorRulesResponse> =>
    fetchScreened(
      "admin/initiator-rules",
      () =>
        Admin.updateInitiatorRule({
          path: { id },
          body,
          headers: csrfHeaders(csrf),
        }),
      vInitiatorRulesResponse
    ),

  deleteInitiatorRule: (id: number, csrf: string): Promise<void> =>
    fetchVoid("admin/initiator-rules", () =>
      Admin.deleteInitiatorRule({ path: { id }, headers: csrfHeaders(csrf) })
    ),

  /* ── Ethics register (D11) ──────────────────────────────────────────────── */

  ethicsCases: (signal?: AbortSignal): Promise<EthicsCasesResponse> =>
    fetchScreened(
      "admin/ethics-cases",
      () => Admin.listEthics({ signal }),
      vEthicsCasesResponse
    ),

  createEthicsCase: (
    body: EthicsCaseUpsert,
    csrf: string
  ): Promise<EthicsCasesResponse> =>
    fetchScreened(
      "admin/ethics-cases",
      () => Admin.createEthics({ body, headers: csrfHeaders(csrf) }),
      vEthicsCasesResponse
    ),

  deleteEthicsCase: (id: number, csrf: string): Promise<void> =>
    fetchVoid("admin/ethics-cases", () =>
      Admin.deleteEthics({ path: { id }, headers: csrfHeaders(csrf) })
    ),

  /* ── Roles and scopes ───────────────────────────────────────────────────── */

  roles: (
    limit: number,
    offset: number,
    signal?: AbortSignal
  ): Promise<RolesResponse> =>
    fetchScreened(
      "admin/roles",
      () => Admin.listRoles({ query: { limit, offset }, signal }),
      vRolesResponse
    ),

  grantRole: (body: RoleGrantRequest, csrf: string): Promise<RolesResponse> =>
    fetchScreened(
      "admin/roles",
      () => Admin.grantRole({ body, headers: csrfHeaders(csrf) }),
      vRolesResponse
    ),

  revokeRole: (body: RoleGrantRequest, csrf: string): Promise<void> =>
    fetchVoid("admin/roles", () =>
      Admin.revokeRole({ body, headers: csrfHeaders(csrf) })
    ),

  /* ── Settings ───────────────────────────────────────────────────────────── */

  settings: (signal?: AbortSignal): Promise<SettingsResponse> =>
    fetchScreened(
      "admin/settings",
      () => Admin.settings({ signal }),
      vSettingsResponse
    ),

  /**
   * A partial write: only the keys present are stored. The server invalidates
   * the response cache immediately, so a changed `k_threshold` shows up on the
   * public contour on the next request rather than after the TTL.
   */
  updateSettings: (
    body: SettingsUpdate,
    csrf: string
  ): Promise<SettingsResponse> =>
    fetchScreened(
      "admin/settings",
      () => Admin.updateSettings({ body, headers: csrfHeaders(csrf) }),
      vSettingsResponse
    ),

  /* ── Reports (TZ §4.5) ──────────────────────────────────────────────────── */

  reports: (
    limit: number,
    offset: number,
    signal?: AbortSignal
  ): Promise<AdminReportsResponse> =>
    fetchScreened(
      "admin/reports",
      () => Admin.listReports({ query: { limit, offset }, signal }),
      vAdminReportsResponse
    ),

  generateReport: (
    body: GenerateReportRequest,
    csrf: string
  ): Promise<AdminReportsResponse> =>
    fetchScreened(
      "admin/reports",
      () => Admin.generateReport({ body, headers: csrfHeaders(csrf) }),
      vAdminReportsResponse
    ),

  publishReport: (id: number, csrf: string): Promise<void> =>
    fetchVoid("admin/reports", () =>
      Admin.publishReport({ path: { id }, headers: csrfHeaders(csrf) })
    ),

  unpublishReport: (id: number, csrf: string): Promise<void> =>
    fetchVoid("admin/reports", () =>
      Admin.unpublishReport({ path: { id }, headers: csrfHeaders(csrf) })
    ),

  /* ── Audit browser (TZ §6.3) ────────────────────────────────────────────── */

  audit: (query: AuditQuery, signal?: AbortSignal): Promise<AuditResponse> =>
    fetchScreened(
      "admin/audit",
      () => Admin.audit({ query, signal }),
      vAuditResponse
    ),
}
