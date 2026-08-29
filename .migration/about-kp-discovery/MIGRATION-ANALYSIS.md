# about.kaiserpermanente.org — EDS Migration Analysis

**Site:** corporate / newsroom · **Total URLs:** 836 · **Confidence:** ~97% · **Date:** 2026-08-29
**Inputs:** `templates-map.json/csv`, `template-summary.json`, `block-catalog.md`, `classification-validation.md`

## Executive summary
A fully public, editorial corporate site — **the cleanest EDS candidate of the three KP properties**.
Of 836 URLs, **822 (98.3%) are Migrate**, 12 (1.4%) Migrate-with-caveats (annual reports), and only 2
(0.2%) Exclude (RSS/feedback utility). No auth, no region/language partitioning, no dynamic backend
beyond an EDS query index for listings.

## Suitability matrix
| Area / Template | URLs | Recommendation | Reasoning |
|---|---|---|---|
| Global header/nav/footer | shared | **Migrate (first)** | Shared chrome; build once. |
| A2 News article / press release | 515 | **Migrate** | Authored editorial; SEO-critical; the flagship set. |
| A4 Who-we-are editorial | 133 | **Migrate** | Authored (history/mission/people). |
| A7 Expertise & impact editorial | 101 | **Migrate** | Authored (communities/policy/research). |
| A6 Labor relations | 47 | **Migrate** | Authored; may link PDFs. |
| A5 Leadership profile | 22 | **Migrate** | Authored person/bio block. |
| A3 News hub / archive | 1 | **Migrate** | Query-index-driven listing over A2. |
| A1 Home / section landing | 3 | **Migrate** | Authored hero + card blocks. |
| A8 Annual report | 12 | **Migrate w/ caveats** | Long-form; charts/figures as images/embeds; PDF links. |
| A9 Utility (RSS/feedback) | 2 | **Exclude** | Infrastructure, not editorial. |

## Suitability scoring (site-level)
- **Authorability:** very high — nearly all pages are editorial.
- **Stateless & public:** 100% public HTTP 200; no auth/personalization.
- **Performance benefit:** high — content-heavy news/articles gain from EDS LCP model.
- **Integration weight:** very low — only an internal query index for listings; no external backends.
- **Effort vs. value:** high value, moderate effort (bulk import of 515 articles is the main volume).

## Dependencies & sequencing
1. Global chrome (header/nav/footer) first.
2. News track (A2+A3, 516 pages) — highest volume + value; needs the query-index listing pattern.
3. Corporate track (A1/A4/A5/A6/A7, 306 pages) — authored blocks (hero, bio, stat, doc-list).
4. Annual reports (A8, 12) — long-form + PDF/chart handling.
5. Retire A9 utility or replace with EDS-native feeds.

Cross-property note: mykp.kp.org's public `about-kp` pages overlap this site — consolidate here.
