# Kaiser Permanente → AEM Edge Delivery — Discovery Report

**Domain:** `healthy.kaiserpermanente.org` (English) · **Priority region:** Northern California
**Date:** 2026-08-29 · **Scope:** Discovery & analysis only (no migration performed)
**Total URLs inventoried:** 127,518 · **Classification confidence:** ~98%

> This is a **discovery deliverable**. It inventories the site, maps every URL to a template, and
> recommends a migration approach. Nothing has been built or migrated. The phasing below is a
> recommendation for a future engagement, not work in progress.

---

## 1. Executive summary

The English domain enumerates to **127,518 unique URLs** across 8 regions plus two large syndicated
encyclopedias. Content falls into **10 recurring templates**. Migration value is concentrated in a
minority of pages — authored editorial and landing content (~12,400 URLs, ~1,566 in NorCal) — while
the bulk of the URL count is data-driven (providers ~58k, encyclopedias ~31k, facility departments
~17k) and should be integrated or ingested, not hand-authored.

- **Migrate (~12,439 URLs):** region homes, health-wellness editorial, marketing/landing, legal.
- **Migrate with caveats (~38,577 URLs):** facility landings (data-fed), encyclopedias (bulk ingest).
- **Exclude / integrate (~76,490 URLs):** provider directory, facility departments, member portal.

**Recommended first move:** shared chrome (Phase 0) → NorCal authored-template pilot (Phase 1), ~1,566
high-value stateless pages that prove the template set and import pipeline end-to-end.

## 2. Method

- **robots.txt** captured; 32 declared sitemaps enumerated (region, facility, department, doctor,
  health/drug encyclopedia). NorCal `/physicians/` is `Disallow`ed and excluded.
- **URL inventory** built by fetching every sitemap, deduping to 127,518 unique URLs.
- **Template classification** via a deterministic path-pattern rule set (T1–T10), validated against a
  stratified sample of live pages (browser UA + cookie jar to clear the region redirect).
- **Block analysis** on representative NorCal sample pages per public template.

## 3. URL inventory

### By region
| Region | URLs |
|---|---|
| southern-california | 35,487 |
| global (incl. encyclopedias) | 32,848 |
| colorado | 19,381 |
| oregon-washington | 13,256 |
| **northern-california (priority)** | **8,117** |
| georgia | 6,792 |
| hawaii | 5,941 |
| washington | 3,338 |
| maryland-virginia-washington-dc | 2,358 |

## 4. Template map (all 127,518 URLs)

| Template | URLs | Disposition |
|---|---|---|
| T6 Provider / clinician profile | 58,092 | exclude (dynamic) |
| T8 Drug encyclopedia | 22,155 | migrate w/ caveats (ingest) |
| T5 Facility department listing | 16,957 | exclude (dynamic) |
| T2 Health-wellness editorial | 9,516 | **migrate** |
| T7 Health encyclopedia | 9,346 | migrate w/ caveats (ingest) |
| T4 Facility landing | 7,076 | migrate w/ caveats (data-fed) |
| T3 Marketing / landing | 2,772 | **migrate** |
| T10 Member portal (secure) | 1,441 | exclude (auth) |
| T9 Legal / utility | 134 | **migrate** |
| T1 Region home / front-door | 17 | **migrate** |
| T0 Unclassified | 12 | triage |

Validation confirmed every production template (title/content matched assignment). Unclassified is
0.01% (domain root, cache-manager, Hawaii `nmp` microsite, one stale 410). **NorCal has 0 provider
profiles** — consistent with the robots.txt disallow.

Page-level data: `templates-map.csv` (spreadsheet) and `templates-map.json` (full metadata).

## 5. Block model (summary)

- **Shared global chrome** (header, mega-menu, footer, search, breadcrumb) appears on every page →
  build once, reuse across all regions/languages.
- **New authored blocks:** hero, cards, comparison-table.
- **New dynamic integration:** facility-data block (hours/address/services from a feed) — unlocks T4.
- **Integrations/ingests, not authored:** provider directory (T6), encyclopedias (T7/T8).

Full detail in `block-catalog.md` and `template-analysis/T1–T9.json`.

## 6. Recommended phasing (for a future migration engagement)

| Phase | Scope | Pages |
|---|---|---|
| 0 | Foundation & shared chrome | — |
| 1 | NorCal pilot: T1+T2+T3+T9 | 1,566 |
| 2 | NorCal facilities (T4, data-fed) | 1,516 |
| 3 | Region replication (7 regions) | ~15,194 |
| 4 | Encyclopedias (ingest-vs-link) | 31,478 |
| 5 | Localization (ES + ZH) | mirror |
| — | Excluded (T5/T6/T10) | 76,490 |

Full phasing, dependencies, gates, and per-phase backlog rules in `PHASED-MIGRATION-PLAN.md`.

## 7. Open decisions (carry into any migration engagement)

1. **Encyclopedia ingest vs. link-out** — governs 31,478 pages; needs licensing + feed answer.
2. **Facility-data feed source** — API for hours/services (Phase 2 dependency).
3. **Provider directory ownership** — confirm T6 stays in a directory service, not EDS.
4. **Localization depth** — full ES/ZH parity vs. NorCal-only initially.

## 8. Deliverables index

| File | Contents |
|---|---|
| `DISCOVERY-REPORT.md` | This consolidated report / handover |
| `robots-findings.md` | robots.txt directives + sitemap inventory |
| `urls-all.json` | 127,518 unique URLs |
| `inventory-summary.json` | per-sitemap / per-region / per-area counts |
| `templates-map.csv` / `.json` | every URL → template (sheet + machine-readable) |
| `template-summary.json` | template × region pivot + T0 list |
| `classification-validation.md` | validation sample + confidence |
| `block-catalog.md` | per-template block model |
| `template-analysis/T1–T9.json` | raw structural outlines |
| `MIGRATION-ANALYSIS.md` | suitability matrix + reasoning |
| `PHASED-MIGRATION-PLAN.md` | detailed phased plan + backlog rules |
