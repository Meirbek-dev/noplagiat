import { createFileRoute } from "@tanstack/react-router"
import * as v from "valibot"

import {
  AliasesPanel,
  DictionaryPanel,
  InitiatorRulesPanel,
  StaffUnitsPanel,
  WorkTypeRulesPanel,
} from "@/components/admin/DictionaryPanels"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { DICTIONARY_KINDS } from "@/lib/api-admin"
import { adminQueries } from "@/lib/queries"
import { pageTitle } from "@/lib/head"
import { m } from "@/paraglide/messages.js"
import type { Locale } from "@/paraglide/runtime.js"
import { getLocale } from "@/paraglide/runtime.js"

/**
 * Dictionaries and the mappings around them (TZ.md §4.6): the four unit
 * dictionaries, the source-label aliases that keep the ingest naming aligned
 * with them, the reviewer→unit table, and the two derivation rule sets.
 *
 * The open tab is a search param, so a link to «правила типов работ» opens on
 * that tab rather than on the first one.
 */
const TABS = [
  "faculties",
  "departments",
  "programs",
  "work-types",
  "aliases",
  "staff-units",
  "work-type-rules",
  "initiator-rules",
] as const

type TabId = (typeof TABS)[number]

const searchSchema = v.object({
  tab: v.optional(v.picklist(TABS), "faculties"),
})

export const Route = createFileRoute("/admin/dictionaries")({
  head: () => ({ meta: [{ title: pageTitle(m.admin_dictionaries()) }] }),
  validateSearch: searchSchema,
  loader: async ({ context }) => {
    await Promise.allSettled(
      DICTIONARY_KINDS.map((kind) =>
        context.queryClient.ensureQueryData(adminQueries.dictionary(kind))
      )
    )
  },
  component: DictionariesPage,
})

const TAB_LABELS: Record<TabId, (locale: Locale) => string> = {
  faculties: (locale) => m.dict_tab_faculties({}, { locale }),
  departments: (locale) => m.dict_tab_departments({}, { locale }),
  programs: (locale) => m.dict_tab_programs({}, { locale }),
  "work-types": (locale) => m.dict_tab_work_types({}, { locale }),
  aliases: (locale) => m.aliases_title({}, { locale }),
  "staff-units": (locale) => m.staff_units_title({}, { locale }),
  "work-type-rules": (locale) => m.work_type_rules_title({}, { locale }),
  "initiator-rules": (locale) => m.initiator_rules_title({}, { locale }),
}

function DictionariesPage() {
  const locale = getLocale()
  const { tab } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <Tabs
      value={tab}
      onValueChange={(next) => {
        if (typeof next !== "string") return
        void navigate({ search: { tab: asTabId(next) } })
      }}
    >
      {/* Eight tabs wrap onto two rows. The kit grows each trigger to fill its
          row, so the two that landed on row two stretched to 565px each while
          row one held six at ~150px - the same control at four different
          widths. Sizing them to their labels and packing from the start keeps
          the two rows reading as one strip. */}
      <TabsList className="h-auto flex-wrap justify-start [&>*]:grow-0">
        {TABS.map((id) => (
          <TabsTrigger key={id} value={id}>
            {TAB_LABELS[id](locale)}
          </TabsTrigger>
        ))}
      </TabsList>

      {DICTIONARY_KINDS.map((kind) => (
        <TabsContent key={kind} value={kind}>
          <DictionaryPanel kind={kind} locale={locale} />
        </TabsContent>
      ))}

      <TabsContent value="aliases">
        <AliasesPanel locale={locale} />
      </TabsContent>
      <TabsContent value="staff-units">
        <StaffUnitsPanel locale={locale} />
      </TabsContent>
      <TabsContent value="work-type-rules">
        <WorkTypeRulesPanel locale={locale} />
      </TabsContent>
      <TabsContent value="initiator-rules">
        <InitiatorRulesPanel locale={locale} />
      </TabsContent>
    </Tabs>
  )
}

function asTabId(value: string): TabId {
  return (TABS as readonly string[]).includes(value)
    ? (value as TabId)
    : "faculties"
}
