# about.kaiserpermanente.org → AEM Edge Delivery — Discovery Report

**Site:** `https://about.kaiserpermanente.org/` · **Date:** 2026-08-29 · **Scope:** Discovery only.
**Site type:** Corporate / newsroom (fully public). **Total URLs:** 836. **No migration performed.**

> Discovery deliverable. The phasing is a recommendation for a future engagement, not work in progress.

---

## 1. Executive summary
The cleanest EDS candidate of the three KP properties analyzed: a fully public, editorial
corporate/newsroom site with **no auth, no region/language partitioning, and no external backend**.
Of 836 URLs, **822 (98.3%) are Migrate**, 12 (1.4%) Migrate-with-caveats (annual reports), 2 (0.2%)
Exclude (RSS/feedback). News dominates (516 pages); the rest is corporate editorial.

**Recommended first move:** shared chrome (Phase 0) → news track (Phase 1, 516 pages) using an EDS
query index for listings.

## 2. Method
- robots.txt: empty `Disallow` (fully open) + one sitemap. Details in `robots-findings.md`.
- Inventory: single flat `/sitemap.xml` → 836 unique URLs.
- Classification: deterministic path rules into A1–A9 (0 unclassified), validated on a fetched sample
  (~97% confidence, `classification-validation.md`).
- Block analysis on public templates (`block-catalog.md`, `template-analysis/`).

## 3. Inventory & template map
| Template | Meaning | URLs | Disposition |
|---|---|---|---|
| A2 | News article / press release | 515 | migrate |
| A4 | Who-we-are editorial | 133 | migrate |
| A7 | Expertise & impact editorial | 101 | migrate |
| A6 | Labor relations | 47 | migrate |
| A5 | Leadership profile | 22 | migrate |
| A8 | Annual report / publication | 12 | migrate w/ caveats |
| A1 | Home / section landing | 3 | migrate |
| A9 | Utility (RSS, feedback) | 2 | exclude |
| A3 | News hub / archive | 1 | migrate |
| A0 | Unclassified | 0 | — |

Section split: news 516, who-we-are 203, expertise-and-impact 114, home/utility 3.
Full data: `templates-map.csv` / `.json`, `template-summary.json`, `inventory-summary.json`.

## 4. Block model (summary)
- **Shared chrome:** header/nav/footer/search + breadcrumb — build once.
- **New authored blocks:** hero, cards/teaser, person-bio, stat-callout, document-list.
- **Dynamic:** an EDS **query index** (JSON) powers news listings + related cards — native EDS
  pattern, no external backend. Full detail in `block-catalog.md`.

## 5. Recommended phasing
| Phase | Scope | Pages |
|---|---|---|
| 0 | Foundation & shared chrome + query index | — |
| 1 | News track (A2 + A3) | 516 |
| 2 | Corporate editorial (A1/A4/A5/A6/A7) | 306 |
| 3 | Annual reports (A8) | 12 |
| — | Excluded (A9) | 2 |

Full plan + per-phase backlog rules in `PHASED-MIGRATION-PLAN.md`.

## 6. Open decisions
1. Annual-report charts — static images vs. interactive embeds?
2. PDF handling — link out vs. host in EDS DAM?
3. Overlap with mykp.kp.org public `about-kp` pages — consolidate here?

## 7. Deliverables index
| File | Contents |
|---|---|
| `DISCOVERY-REPORT.md` | This report |
| `robots-findings.md` | robots.txt + site structure |
| `urls-all.json` | 836 URLs |
| `inventory-summary.json` | section + template counts |
| `templates-map.csv` / `.json` | URL → template (A1–A9) |
| `template-summary.json` | template totals + section pivot + T0 list |
| `classification-validation.md` | validation sample + confidence |
| `block-catalog.md` | per-template block model |
| `template-analysis/A1–A8.json` | raw structural outlines |
| `MIGRATION-ANALYSIS.md` | suitability matrix |
| `PHASED-MIGRATION-PLAN.md` | phased plan + backlog rules |
