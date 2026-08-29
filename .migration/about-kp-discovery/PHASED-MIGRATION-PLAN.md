# about.kaiserpermanente.org → AEM Edge Delivery — Phased Migration Plan

**Total URLs:** 836 · **Migrate:** 822 · **Caveats:** 12 · **Exclude:** 2 · **Date:** 2026-08-29
**Inputs:** `templates-map.csv`, `template-summary.json`, `block-catalog.md`

> Discovery deliverable — recommended phasing, not work in progress. Execution requires Execute mode.

## Guiding principle
A small, fully-public corporate site with one dominant content type (news). Sequence: **shared chrome
→ news track (volume) → corporate editorial → long-form reports.** No region/language complexity; no
external backends beyond an EDS query index.

## Scope
| Disposition | Templates | URLs |
|---|---|---|
| Migrate | A1, A2, A3, A4, A5, A6, A7 | 822 |
| Migrate w/ caveats | A8 | 12 |
| Exclude | A9 | 2 |

## Phase 0 — Foundation & shared chrome
**Scope:** EDS scaffolding, design tokens, header/nav/footer fragments, breadcrumb, and the authored
blocks the site needs: hero, cards/teaser, person-bio, stat-callout, document-list. Set up the
**query index** (JSON) that will power news listings and related-article cards.
**Effort:** M. **Exit gate:** chrome + core blocks + a working query index on a test page.

- [ ] Scaffold EDS project (scripts.js config)
- [ ] Extract design tokens from source
- [ ] Build header/nav/footer + breadcrumb
- [ ] Build blocks: hero, cards/teaser, person-bio, stat-callout, document-list
- [ ] Stand up the news query index

## Phase 1 — News track — **516 pages**
**Scope:** A2 press releases/articles (515) + A3 news hub/archive (1). Bulk-import articles; wire the
hub listing + related-cards to the query index.
**Depends on:** Phase 0 (chrome + index). **Effort:** L (volume). **Validation:** import → preview →
visual critique vs. source; sample QA across the 515 articles.
**Exit gate:** news hub + article template live with parity; listing/pagination works off the index.

- [ ] Build import infra (parser/transformer) for A2/A3
- [ ] Bulk-import 515 articles; populate query index
- [ ] Wire A3 hub listing + A2 related-cards
- [ ] Visual-critique vs. source; fix to parity

## Phase 2 — Corporate editorial — **306 pages**
**Scope:** A1 landings (3), A4 who-we-are (133), A5 leadership (22), A6 labor-relations (47),
A7 expertise-and-impact (101). Uses the authored blocks from Phase 0.
**Depends on:** Phase 0. **Effort:** M–L. **Exit gate:** each template passes visual QA.

- [ ] Import A4/A7 editorial; A5 bios (person block); A6 (doc-list, PDF links)
- [ ] Author A1 landings (hero + cards)
- [ ] Visual-critique sample per template

## Phase 3 — Annual reports (caveated) — **12 pages**
**Scope:** A8 long-form multi-section reports; handle charts/figures (images or embeds) and PDF
downloads.
**Depends on:** Phases 0–2. **Effort:** M (low volume, high per-page richness).
**Exit gate:** one full annual report renders with figures + PDF link intact.

- [ ] Model long-form report sections + stat callouts
- [ ] Handle charts/figures + PDF download links
- [ ] Validate one report end-to-end, then the rest

## Excluded
| Area | URLs | Strategy |
|---|---|---|
| A9 Utility (RSS, site-feedback) | 2 | Replace with EDS-native feeds/forms or retire; do not migrate as pages. |

## Effort & value summary
| Phase | Pages | Value | Effort |
|---|---|---|---|
| 0 Foundation | — | Enabling | M |
| 1 News track | 516 | **Highest** | L |
| 2 Corporate editorial | 306 | High | M–L |
| 3 Annual reports | 12 | Medium | M |
| Excluded | 2 | n/a | — |

## Per-phase backlog source
Filter `templates-map.csv`:
- Phase 1 = `template ∈ {A2, A3}`
- Phase 2 = `template ∈ {A1, A4, A5, A6, A7}`
- Phase 3 = `template = A8`
- Excluded = `template = A9`

## Open decisions
1. **Annual-report charts** — are figures images, or interactive embeds needing a block?
2. **PDF handling** — link out to existing PDFs or host in EDS DAM?
3. **mykp `about-kp` overlap** — consolidate those public pages into this site?
