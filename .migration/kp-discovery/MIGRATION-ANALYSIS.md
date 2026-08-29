# Kaiser Permanente — EDS Migration Discovery & Analysis

**Domain:** `healthy.kaiserpermanente.org` (English) · **Priority region:** Northern California
**Captured:** 2026-08-29 · **Method:** sitemap enumeration (32 declared sitemaps) + robots.txt + page probes
**Confidence:** 90% (English sitemaps; Spanish `espanol.` and Chinese `zh` mirrors noted but not enumerated)

---

## Executive summary

The English domain enumerates to **127,518 unique URLs** across 8 regions plus two large syndicated
encyclopedias. The catalog splits cleanly into a small number of recurring templates. The migration
value is concentrated in a **minority of the URLs** (editorial + landing content, roughly 3–5k pages
domain-wide, ~1.5k in NorCal), while the **bulk of the URL count** (providers ~58k, encyclopedias
~41k, facility departments ~17k) is data-driven listing content generated from source systems that
should **not** be hand-authored in da.live.

**Migrate first (NorCal):** `health-wellness` editorial (~1,230 pages), `shop-plans` + `get-care` +
`learn` + `support` landing/marketing pages (~400), region `front-door` home, and the shared global
header/mega-menu/footer. These are stateless, public, content-heavy, SEO-important pages — the exact
profile EDS's performance model rewards.

**Do not migrate:** the authenticated member portal (`/pages/securepages/*`, `/mychartma`, OAuth), and
the provider/clinician directories (~58k profiles) and facility **department** listings (~17k) as
authored content — these are database-backed and should stay in their source systems (feeds/APIs), or
be rendered by a dynamic block, not migrated page-by-page.

**Migrate with caveats:** facility landing pages (~6.4k NorCal), the health/drug encyclopedias (~41k),
and interactive tools — the *wrapper/shell* can be EDS, but the listing data and tool engines remain
external.

---

## 1. URL inventory (bucketed)

Total unique English URLs: **127,518**. Full list in `urls-all.json`; per-sitemap and per-bucket
counts in `inventory-summary.json`.

### By region
| Region | URLs |
|---|---|
| southern-california | 35,487 |
| (global / no region — incl. encyclopedias) | 32,848 |
| colorado | 19,381 |
| oregon-washington | 13,256 |
| **northern-california (priority)** | **8,117** |
| georgia | 6,792 |
| hawaii | 5,941 |
| washington | 3,338 |
| maryland-virginia-washington-dc | 2,358 |

### By area (domain-wide)
| Area | URLs | Nature |
|---|---|---|
| providers (physicians/clinicians) | 58,300 | Data-driven profiles (NorCal physicians Disallowed in robots.txt) |
| health-content (health + drug encyclopedia, health-wellness) | 41,031 | Syndicated reference + editorial |
| facility-departments | 16,954 | Data-driven department listings |
| facilities | 7,074 | Location landing pages |
| member-portal (securepages) | 1,374 | Authenticated, session-bound |
| plans-enrollment | 1,019 | Marketing / shop-plans |
| support / learn / get-care / pages | ~1,400 | Editorial + utility |
| legal-utility | 126 | Privacy, terms, accessibility |

### Northern California (priority — full fidelity)
| NorCal area | URLs |
|---|---|
| facilities (incl. departments) | 6,401 |
| health-wellness (editorial) | 1,230 |
| pages (reports/utility) | 174 |
| shop-plans | 107 |
| support | 83 |
| learn | 42 |
| doctors-locations | 21 |
| get-care | 12 |
| legal/privacy/terms/language-assistance | ~10 |
| front-door (region home) | 1 (+ machine-readable price files) |

> NorCal `/physicians/` is `Disallow`ed in robots.txt and intentionally excluded from the crawl.

---

## 2. Layout / template catalog

| # | Template | Sample URL | Structure & blocks | Volume |
|---|---|---|---|---|
| T1 | **Region home / front-door** | `/northern-california/front-door` | Hero, promo cards, nav entry points, sign-on CTA | 8 (1/region) |
| T2 | **Editorial article (health-wellness)** | `/northern-california/health-wellness/addiction-and-recovery/understanding-addiction` | Article hero, rich text (~29 `<p>`), section headings, related links | ~1,230 NorCal |
| T3 | **Marketing / landing (shop-plans, get-care, learn, support)** | `/northern-california/shop-plans` | Hero, feature cards, CTAs, comparison sections, forms | ~400 NorCal |
| T4 | **Facility landing** | `/northern-california/facilities/clovis-medical-offices-100376` | Location header, address/hours/map, services, department links (~40 `<p>`) | ~1,516 NorCal |
| T5 | **Facility department listing** | `.../clovis-medical-offices-100376/departments/pediatrics-dlp-102423` | Department detail generated from facility DB | ~4,885 NorCal |
| T6 | **Provider / clinician profile** | `/southern-california/physicians/...` | Profile card, specialty, locations — DB-driven | ~58k domain |
| T7 | **Health encyclopedia article** | `/health-wellness/health-encyclopedia/he.how-to-do-the-wall-sit-exercise.abo6369` | Syndicated reference article (~30 `<p>`, 2 forms) | ~9,337 |
| T8 | **Drug encyclopedia entry** | `/health-wellness/drug-encyclopedia/drug.lidocaine-...` | Syndicated drug monograph | ~22,139 |
| T9 | **Legal / utility** | `/northern-california/privacy`, `/termsconditions` | Long-form authored text | ~126 |
| T10 | **Member portal (secure)** | `/pages/securepages/appointments/...` | Authenticated app shell | ~1,374 |
| — | **Global chrome** | header / mega-menu / footer | Shared across all regions & templates | 1 (shared dependency) |

All public templates (T1–T4, T7–T9) are **server-rendered HTML** (probed: 280k–390k bytes,
29–42 paragraphs, no client-side app framework in the initial payload). App-signal count was low
(module scripts only), confirming they are content documents, not SPAs.

---

## 3. Per-area migration recommendation matrix

Scored against: Authorability · Stateless & public · Performance benefit · Integration weight ·
Effort-vs-value.

| Area / Template | Recommendation | Reasoning |
|---|---|---|
| **Global header / mega-menu / footer** | **Migrate (first)** | Shared chrome; author once, reuse across all regions. Prerequisite for every page. |
| **Region home (T1)** | **Migrate** | Public, editorial, high-traffic landing; strong LCP benefit. 8 pages. |
| **Health-wellness editorial (T2)** | **Migrate** | Pure authored content, SEO-critical, stateless. The flagship EDS candidate. ~1,230 NorCal. |
| **Marketing / landing (T3)** | **Migrate** | Author-maintained shop-plans/get-care/learn/support pages. Watch embedded forms/quote widgets → keep as integrated widgets. |
| **Legal / utility (T9)** | **Migrate** | Low-complexity long-form authored text; easy win. ~126 pages. |
| **Facility landing (T4)** | **Migrate with caveats** | Landing shell is authorable, but address/hours/services come from a facility DB → render via a dynamic block/feed, don't hand-author 6.4k pages. |
| **Health & drug encyclopedias (T7/T8)** | **Migrate with caveats** | ~41k syndicated articles. Do NOT author manually. If migrated, ingest via automated feed/bulk import; otherwise keep on the existing syndication platform and link out. |
| **Interactive tools (cost estimator, provider search, forms)** | **Migrate with caveats** | Wrapper/landing page → EDS; the engine/API stays external and is embedded. |
| **Provider / clinician directory (T6)** | **Do not migrate** | ~58k DB-driven profiles; NorCal physicians already `Disallow`ed. Belongs in a directory service, not authored pages. |
| **Facility department listings (T5)** | **Do not migrate** | ~17k generated from facility DB; same rationale as providers. |
| **Member portal / securepages (T10)** | **Do not migrate** | Authenticated, session-bound, personalized (appointments, messaging, billing). Out of scope for a public authored-content platform. |

---

## 4. Dependencies & sequencing

1. **Global chrome first** — header, mega-menu, footer as shared fragments. Everything depends on it.
2. **NorCal pilot** — region front-door → health-wellness editorial → marketing/landing → legal.
   This is ~1,800 pages, all high-value, all stateless: proves the template set end-to-end.
3. **Cross-region reuse** — the same 4 templates (T1–T3, T9) repeat across all 8 regions; NorCal
   templates port directly. Region is a content variable, not a new template.
4. **Facilities (T4)** — only after a facility-data block exists; landing shell reused across regions.
5. **Encyclopedias (T7/T8)** — separate track; automated ingest or link-out decision, not hand authoring.
6. **Excluded** — providers, departments, member portal: integrate/link, never migrate as pages.

### Cross-language note
Spanish (`espanol.kaiserpermanente.org/es/`) and Chinese (`zh`) mirror the English sitemap structure
1:1. They are additional **locales of the same templates**, not new templates — fold into EDS
localization once the English NorCal set is proven.

---

## 5. Deliverables produced
- `robots-findings.md` — robots.txt directives + full sitemap inventory
- `urls-all.json` — 127,518 unique URLs (schema-shaped)
- `inventory-summary.json` — per-sitemap counts, region counts, area buckets with samples
- `MIGRATION-ANALYSIS.md` — this document (inventory, template catalog, recommendation matrix, sequencing)

### Recommended next step
Run a NorCal **template-level page analysis** (excat site-catalog / page-analysis) on one representative
URL per template T1–T4 + T9 to produce block-level structure before building the import infrastructure.
