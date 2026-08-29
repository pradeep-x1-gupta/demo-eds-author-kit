# Block catalog — per-template section/block model

Derived from structural analysis of representative sample pages (NorCal-first). Raw outlines in
`template-analysis/{Tn}.json`; saved sample HTML in `template-analysis/html/`.

> **Reading the signals:** every sampled page shows ~79–88 `<img>`, 2+ forms, and
> accordion/carousel/search markup. That is the **shared global chrome** (header, mega-menu, footer,
> site search) present on all pages — not per-template content. The catalog below separates that
> shared chrome from the blocks unique to each template.

## Shared global chrome (cross-template dependency — build once, Phase 0)
- **Header + utility bar** — logo, region indicator, sign-in CTA, site search (form).
- **Mega-menu navigation** — multi-column dropdown; consistent markup across all regions/templates.
- **Footer** — link columns, legal/utility links, language selector, social.
- **Breadcrumb** — present on interior pages.
- These map to EDS `header`/`footer` fragments + a `nav`/mega-menu block. Every migrated page depends
  on them, so they are Phase 0 and reused verbatim across all 8 regions and both languages.

## T1 — Region home / front-door  *(migrate)*
- **Blocks:** hero (headline + CTA), promo/feature card grid, "get care your way" tiles, plan-shopping
  CTA, links to health-wellness & facilities. Map embed present (locate-care entry).
- **Content model:** heavily authored marketing layout; 12 H2 sections. Authorable as default content
  + a cards block + hero block. 17 pages total (≈2/region) — low volume, high visibility.

## T2 — Health-wellness editorial  *(migrate — flagship)*
- **Index variant** (`/health-wellness`): topic hub — category cards, featured articles.
- **Article variant**: article hero, rich text body (~29–38 `<p>`), H2/H3 subheads, related-links list,
  inline images. No maps, no data feeds.
- **Blocks:** hero, rich-text (default content), cards (related topics), optional callout/quote.
- **Content model:** pure authored editorial — the cleanest EDS fit. ~9,516 pages domain-wide
  (~1,227 NorCal). Straightforward default-content + a couple of blocks.

## T3 — Marketing / landing  *(migrate)*
- **Blocks:** hero, feature/benefit cards, step lists, comparison/plan tables, CTAs, **embedded forms**
  (bill pay, eligibility) and occasional map. 17 H2 sections on shop-plans.
- **Content model:** authored landing pages. **Caveat:** embedded forms/quote widgets stay as
  integrated widgets (form block or external embed), not re-authored. ~2,772 pages.

## T4 — Facility landing  *(migrate with caveats)*
- **Blocks:** facility header (name/address), **hours** block, **map** entry, services list, department
  links, phone (`tel:`). 26 H2 sections — the richest interior template.
- **Content model:** landing shell is authorable, but **address / hours / services / department list
  come from a facility database**. Build a **facility-data block** fed by a feed/API; do not
  hand-author 7,076 pages. NorCal has 1,516.

## T5 — Facility department listing  *(exclude — dynamic)*
- **Shape:** "{Specialty} at {Facility}" — department hours, location, contact. Generated per
  facility×department from the facility DB. ~16,957 pages.
- **Disposition:** render via a dynamic block/feed or keep in source system; **do not migrate as
  authored pages**. Documented, not decomposed.

## T6 — Provider / clinician profile  *(exclude — dynamic)*
- **Shape:** provider name + credentials, specialty, locations, languages, accepting-patients status.
  ~58,092 profiles, DB-backed. **NorCal physicians are `Disallow`ed in robots.txt (0 in inventory).**
- **Disposition:** belongs in a directory/provider-search service, integrated or linked; **never
  migrated page-by-page**. Documented, not decomposed.

## T7 — Health encyclopedia  *(migrate with caveats)*
- **Shape:** syndicated reference article — title, body (~30 `<p>`), H2 sections, media. Global
  (non-region) content. ~9,346 pages.
- **Disposition:** syndicated third-party content. If migrated, **automated bulk ingest**, not hand
  authoring; otherwise keep on the syndication platform and link out.

## T8 — Drug encyclopedia  *(migrate with caveats)*
- **Shape:** drug monograph — name, uses, dosage, warnings (~60 `<p>`, long structured text).
  ~22,155 entries, global.
- **Disposition:** same as T7 — automated ingest or link-out. Largest single content set; do not
  hand-author.

## T9 — Legal / utility  *(migrate)*
- **Blocks:** title + long-form authored text, occasional table/list. ~10 H2 sections. No feeds.
- **Content model:** simplest authored content; default content only. ~134 pages (≈14/region + global).

## T10 — Member portal (secure)  *(exclude)*
- Authenticated app shell (`/pages/securepages/*`): appointments, messaging, billing. Session-bound,
  personalized. ~1,441 pages. **Out of scope** for a public authored-content platform — documented,
  not decomposed.

---

## Block reuse summary
| Block | Used by | Authored vs. dynamic |
|---|---|---|
| header / mega-menu / footer / search | all | authored (shared fragments) |
| breadcrumb | all interior | authored |
| hero | T1, T2, T3, T4 | authored |
| cards (feature/related/topic) | T1, T2, T3 | authored |
| rich-text (default content) | T2, T7, T8, T9 | authored |
| CTA / button | T1, T2, T3, T4 | authored |
| comparison / plan table | T3 | authored |
| embedded form (bill pay, eligibility) | T3 | integrated widget |
| map / locate-care | T1, T3, T4 | integrated widget |
| **facility-data (hours/address/services)** | T4, T5 | **dynamic feed** |
| **provider-directory** | T6 | **dynamic feed / external** |
| encyclopedia article | T7, T8 | ingested / external |

**New blocks to build (authored):** hero, cards, comparison-table, breadcrumb (if not in template).
**New dynamic integration:** facility-data block (unlocks T4; T5 optional). Provider directory (T6)
and encyclopedias (T7/T8) are integrations/ingests, not authored blocks.
