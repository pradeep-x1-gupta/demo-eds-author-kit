# Kaiser Permanente EDS Migration — Template Mapping & Phased Migration Plan

## Status of prior work (complete)

Discovery already ran and produced, in the migration workspace:
- `robots-findings.md` — robots.txt directives + full 32-sitemap inventory
- `urls-all.json` — **127,518** unique English URLs
- `inventory-summary.json` — per-sitemap, per-region, per-area counts
- `MIGRATION-ANALYSIS.md` — template catalog (T1–T10), suitability matrix, sequencing

This plan builds on that: (1) map **every** URL in `urls-all.json` to a template in a sheet/JSON, and (2) produce a detailed phased migration plan across all regions and templates.

> Execution requires **Execute mode**. This artifact defines scope, method, and deliverables.

## Part A — Full URL → Template mapping (all 127,518 URLs)

**Method:** deterministic, rule-based classifier (path-pattern rules derived from the T1–T10 catalog). Fetching 127k pages is neither feasible nor necessary — the sitemap path structure is highly regular, so classification is by pattern with a validation sample to confirm accuracy.

### Template rule set (path patterns → template)
| ID | Template | Match rule (pathname) |
|---|---|---|
| T1 | Region home / front-door | `/{region}/front-door` or `/{region}` (region root) |
| T2 | Health-wellness editorial | `/{region}/health-wellness/…` (excl. encyclopedias) |
| T3 | Marketing / landing | `/{region}/(shop-plans|get-care|learn|support|new-members)/…` |
| T4 | Facility landing | `/{region}/facilities/{slug}` (no `/departments/`) |
| T5 | Facility department listing | `/{region}/facilities/{slug}/departments/…` |
| T6 | Provider / clinician profile | `/{region}/(physicians|clinicians|provider)/…` |
| T7 | Health encyclopedia | `/health-wellness/health-encyclopedia/…` or healthenc sitemap |
| T8 | Drug encyclopedia | `/health-wellness/drug-encyclopedia/…` or drugenc sitemap |
| T9 | Legal / utility | `/(privacy|termsconditions|legal-regulatory|language-assistance|accessibility)…` |
| T10 | Member portal (secure) | `/pages/securepages/…`, `/mychartma`, `/*sign-on*`, OAuth |
| T0 | Unclassified (review) | anything matching no rule above |

### Steps
- [ ] Read `urls-all.json` and the source sitemap kind for each URL (region/facility/department/doctor/encyclopedia tags already captured per sitemap).
- [ ] Apply the rule set; attach `{ url, region, template, templateName, area, sourceSitemap }` to every URL.
- [ ] Route any URL matching no rule into **T0 (Unclassified)** for manual review; iterate rules until T0 is < 1% of total.
- [ ] **Validate accuracy:** fetch a stratified sample (5–10 URLs per template, browser UA + cookie jar to clear the region redirect) and confirm the rendered page matches its assigned template; record a confidence % per template.
- [ ] Emit outputs (below); print a template × region pivot table for review.

### Part A deliverables
- [ ] `templates-map.json` — every URL with its template assignment and metadata (machine-readable).
- [ ] `templates-map.csv` — same data as a spreadsheet (URL, region, template, template name, area, source sitemap) for easy sorting/filtering.
- [ ] `template-summary.json` + a pivot table — URL counts per **template × region**, plus T0 review list.

## Part B — Template-level deep (block-level) analysis

**Method:** for each public template, analyze representative sample pages to capture section/block structure (NorCal-first, since it's the priority region). Data-driven templates (T5, T6) get one sample to document their dynamic-block shape; excluded templates (T10) are documented, not decomposed.

- [ ] T1 Region home — 1 NorCal sample (+1 other region to confirm reuse).
- [ ] T2 Health-wellness editorial — 2–3 NorCal samples (article depth variants).
- [ ] T3 Marketing/landing — 2–3 NorCal samples (shop-plans, get-care, support), noting embedded forms/widgets.
- [ ] T4 Facility landing — 1–2 NorCal samples; identify DB-fed regions (hours/services/map).
- [ ] T5 Facility department — 1 sample; document as dynamic block, not authored.
- [ ] T7 Health encyclopedia + T8 Drug encyclopedia — 1 sample each; document syndication/ingest shape.
- [ ] T9 Legal/utility — 1 sample.
- [ ] Identify shared **global chrome** (header, mega-menu, footer) as a cross-template dependency.
- [ ] Produce a per-template **block catalog** (sections, blocks, content model, dynamic vs. authored).

### Part B deliverables
- [ ] `template-analysis/{Tn}.json` — section/block breakdown per analyzed template.
- [ ] `block-catalog.md` — consolidated block inventory across templates, with authored-vs-dynamic tags.

## Part C — Phased migration plan (all regions, all templates)

Sequencing principle: **shared chrome → NorCal pilot (prove templates) → replicate across regions → dynamic/at-scale tracks → excluded areas integrated, not migrated.** Region and language are content variables, not new templates.

- [ ] **Phase 0 — Foundation & shared chrome.** Header, mega-menu, footer as reusable fragments; design tokens; EDS project scaffolding. Gate: chrome renders on a test page.
- [ ] **Phase 1 — NorCal pilot (high value, stateless).** T1 front-door → T2 editorial (~1,230) → T3 marketing (~400) → T9 legal (~10). Gate: full template set proven end-to-end in NorCal with visual parity.
- [ ] **Phase 2 — Facilities (caveated).** Build facility-data block (hours/services/map from feed); migrate T4 landing shells (NorCal ~1,516 first). Gate: one facility page live with live data.
- [ ] **Phase 3 — Region replication.** Roll T1–T4 + T9 across the remaining 7 regions (content variables only). Batches per region; reuse NorCal templates.
- [ ] **Phase 4 — Encyclopedias (at-scale, caveated).** Decide ingest-vs-link for T7 (~9,337) and T8 (~22,139); if ingested, automated bulk import, not hand authoring.
- [ ] **Phase 5 — Localization.** Fold in Spanish (`espanol./es/`) and Chinese (`zh`) mirrors as locales of the proven templates.
- [ ] **Excluded (integrate, do not migrate):** T6 providers (~58k), T5 departments (~17k), T10 member portal — document integration/link strategy per phase.
- [ ] For each phase: page count, template(s), dependencies, effort estimate, entry/exit gates, and validation approach (visual critique vs. original).

### Part C deliverables
- [ ] `PHASED-MIGRATION-PLAN.md` — phases with scope, page counts, dependencies, sequencing, effort, and gates.
- [ ] Per-phase migration backlog derived from `templates-map.csv` (which URLs belong to which phase).

## Checklist

- [ ] Confirm scope: map only `urls-all.json` (English, 127,518) in Part A; Spanish/Chinese deferred to Phase 5
- [ ] Build rule-based template classifier from the T1–T10 catalog
- [ ] Classify every URL; drive Unclassified (T0) below 1% by iterating rules
- [ ] Validate classification with a stratified fetched sample; record per-template confidence
- [ ] Emit `templates-map.json`, `templates-map.csv`, and `template-summary.json` (+ pivot table)
- [ ] Analyze representative sample pages per public template (NorCal-first) for block structure
- [ ] Document dynamic templates (T5/T6) and excluded areas (T10) rather than decomposing them
- [ ] Produce per-template block catalog and identify shared global chrome dependency
- [ ] Write `PHASED-MIGRATION-PLAN.md` with Phases 0–5, page counts, dependencies, gates
- [ ] Derive a per-phase migration backlog from the URL→template mapping

---

**Next step:** Approve and switch to **Execute mode** to run Part A (full mapping → sheet/JSON), Part B (template block analysis), and Part C (phased plan). Tell me if you want any template rules, sampling depth, or phase ordering adjusted first.
