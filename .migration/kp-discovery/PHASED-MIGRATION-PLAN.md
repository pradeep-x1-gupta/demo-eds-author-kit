# Kaiser Permanente → AEM Edge Delivery — Phased Migration Plan

**Domain:** `healthy.kaiserpermanente.org` (English) · **Priority region:** Northern California
**Total mapped URLs:** 127,518 · **Classification confidence:** ~98% · **Date:** 2026-08-29
**Inputs:** `templates-map.json/csv`, `template-summary.json`, `block-catalog.md`, `MIGRATION-ANALYSIS.md`

---

## Guiding principle

**Shared chrome → NorCal pilot (prove templates) → replicate across regions → dynamic/at-scale
tracks → localization.** Region and language are *content variables*, not new templates — the same
10-template set repeats across all 8 regions and the Spanish/Chinese mirrors. Migration value is
concentrated in ~7% of URLs (authored editorial + landing); the bulk (providers, encyclopedias,
departments) is data-driven and is integrated/ingested, not hand-authored.

## Scope at a glance (from the URL→template mapping)

| Disposition | Templates | URLs | Phase |
|---|---|---|---|
| **Migrate** | T1, T2, T3, T9 | 12,439 | 0/1/3/5 |
| **Migrate w/ caveats** | T4, T7, T8 | 38,577 | 2/3/4 |
| **Exclude (integrate/link)** | T5, T6, T10 | 76,490 | — |
| Review | T0 | 12 | triage |

---

## Phase 0 — Foundation & shared chrome
**Scope:** EDS project scaffolding, design tokens, and the shared global chrome (header, mega-menu,
footer, site search, breadcrumb) as reusable fragments. Build the authored blocks the pilot needs:
hero, cards, comparison-table.
**Depends on:** design tokens extracted from source; block-collection references.
**Effort:** M (2–3 wks). One-time, reused by every later phase and region.
**Entry gate:** repo + tokens ready. **Exit gate:** chrome + core blocks render on a test page with
visual parity to source header/footer.

- [ ] Scaffold EDS project (scripts.js config: hostnames, locales, linkBlocks, components)
- [ ] Extract design tokens (color, type, spacing) from source
- [ ] Build header + mega-menu + footer fragments; site search; breadcrumb
- [ ] Build authored blocks: hero, cards, comparison-table
- [ ] Validate chrome on a throwaway test page (visual critique vs. source)

## Phase 1 — NorCal pilot (high value, stateless) — **1,566 pages**
**Scope:** prove the full authored-template set in the priority region.
- T1 Region home/front-door — 2
- T2 Health-wellness editorial — 1,227
- T3 Marketing/landing — 322 (keep embedded bill-pay/eligibility forms as widgets)
- T9 Legal/utility — 15

**Depends on:** Phase 0. **Effort:** L (editorial volume — bulk import + spot authoring).
**Validation:** import → preview → visual critique vs. original per template; sample-based QA across
the 1,227 editorial pages.
**Exit gate:** all four templates live in NorCal with visual parity; import pipeline (parsers +
transformers) proven and repeatable.

- [ ] Build import infrastructure (parsers/transformers) for T1–T3, T9
- [ ] Bulk-import T2 editorial (1,227); spot-QA sample
- [ ] Import T1, T3, T9; keep T3 forms as integrated widgets
- [ ] Visual-critique each template vs. source; fix to parity

## Phase 2 — NorCal facilities (caveated) — **1,516 pages**
**Scope:** T4 facility landings for NorCal. Landing shell authored; hours/address/services/department
links rendered by a **facility-data block** fed from a feed/API.
**Depends on:** Phase 1 pipeline + a facility-data feed. **Effort:** M–L (block + data integration).
**Exit gate:** one NorCal facility page live with **live data** (hours/services correct), then batch.

- [ ] Build facility-data block (hours/address/services/departments from feed)
- [ ] Author facility landing shell template; wire the block
- [ ] Pilot one facility end-to-end with live data; then batch-import 1,516
- [ ] Validate data freshness + visual parity

## Phase 3 — Region replication — **~15,194 pages**
**Scope:** roll the proven templates across the other 7 regions (content variables only, no new
templates). Counts (all non-NorCal, non-global):
- T2 editorial — 7,348 · T4 facilities — 5,560 · T3 landing — 2,167 · T9 legal — 105 · T1 homes — 14

**Depends on:** Phases 1–2 (templates + facility block proven). **Effort:** L (volume; parallelizable
per region). **Exit gate:** each region passes template-level visual QA; batch per region.

- [ ] Replicate T1–T4 + T9 per region using NorCal templates
- [ ] Batch by region (SoCal, CO, OR-WA largest); reuse facility-data feed
- [ ] Per-region visual critique sample; fix regressions

## Phase 4 — Encyclopedias (at-scale, caveated) — **31,478 pages**
**Scope:** T7 health encyclopedia (9,338) + T8 drug encyclopedia (22,140), global (non-region).
**Decision required:** ingest vs. link-out. If ingested → **automated bulk import from the
syndication feed**, never hand authoring.
**Depends on:** ingest decision + feed access. **Effort:** M if link-out; XL if full ingest.
**Exit gate:** decision recorded (ADR); if ingesting, pipeline validated on a sample.

- [ ] Decide ingest-vs-link (record as ADR); confirm syndication licensing
- [ ] If ingest: build automated feed importer; validate sample; bulk-run
- [ ] If link-out: ensure nav/search deep-links resolve to the syndication platform

## Phase 5 — Localization
**Scope:** fold in Spanish (`espanol.kaiserpermanente.org/es/`) and Chinese (`zh`) as locales of the
proven templates — the sitemaps mirror the English structure 1:1.
**Depends on:** English templates stable (Phases 1–3). **Effort:** M per locale (translation +
locale routing). **Exit gate:** locale routing + a NorCal locale sample live.

- [ ] Enumerate Spanish/Chinese sitemaps into the mapping (deferred from Part A)
- [ ] Configure EDS locales; wire relative-link auto-localization
- [ ] Migrate NorCal locale sample; then replicate per the English phase order

## Excluded — integrate or link, do **not** migrate as pages
| Area | URLs | Strategy |
|---|---|---|
| T6 Provider/clinician directory | 58,092 | Provider-search service; integrate/link. NorCal physicians already `Disallow`ed. |
| T5 Facility department listings | 16,957 | Facility DB; render dynamically or keep in source. Optionally reuse Phase 2 facility-data block. |
| T10 Member portal (secure) | 1,441 | Authenticated app; out of scope for public authored platform. |
| T0 Unclassified | 12 | Triage (domain root, cache-manager, Hawaii `nmp` microsite, 1 stale 410). |

---

## Sequencing & dependency graph
```
Phase 0 (chrome + blocks)
      └─> Phase 1 (NorCal authored templates)  ──> Phase 3 (region replication)
                    └─> Phase 2 (facility-data block + NorCal facilities) ──> Phase 3 (facilities)
Phase 4 (encyclopedias)   — parallel track, gated on ingest decision
Phase 5 (localization)    — after Phases 1–3 stable
Excluded (T5/T6/T10)      — integration/link work, scheduled alongside relevant phases
```

## Effort & value summary
| Phase | Pages | Value | Effort | Notes |
|---|---|---|---|---|
| 0 Foundation | — | Enabling | M | One-time; reused everywhere |
| 1 NorCal pilot | 1,566 | **Highest** | L | Proves templates + pipeline |
| 2 NorCal facilities | 1,516 | High | M–L | Needs facility-data feed |
| 3 Region replication | 15,194 | High | L | Parallel per region |
| 4 Encyclopedias | 31,478 | Medium | M–XL | Ingest-vs-link decision |
| 5 Localization | (mirror) | Medium | M/locale | ES + ZH |
| Excluded | 76,490 | n/a | — | Integrate/link only |

## Per-phase backlog source
The authoritative page-level backlog is `templates-map.csv` — filter by `template` + `region`:
- Phase 1 = `template ∈ {T1,T2,T3,T9}` AND `region = northern-california`
- Phase 2 = `template = T4` AND `region = northern-california`
- Phase 3 = `template ∈ {T1,T2,T3,T4,T9}` AND `region ∉ {northern-california, (none)}`
- Phase 4 = `template ∈ {T7,T8}` AND `region = (none)`
- Excluded = `disposition = exclude`

## Open decisions
1. **Encyclopedia ingest vs. link-out** (Phase 4) — blocks 31k pages; needs licensing + feed answer.
2. **Facility-data feed source** (Phase 2) — API/feed for hours/services must be identified.
3. **Provider directory ownership** (T6) — confirm it stays in a directory service, not EDS.
4. **Localization depth** (Phase 5) — full ES/ZH parity or NorCal-only initially.
