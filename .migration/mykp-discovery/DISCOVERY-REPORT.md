# mykp.kp.org → AEM Edge Delivery — Discovery Report

**Site:** `https://mykp.kp.org/` ("MyKP Home") · **Date:** 2026-08-29 · **Scope:** Discovery only.
**Site type:** Authenticated **employee intranet** (AEM Sites). **No migration performed.**

> This discovery is **access-limited by design**: robots.txt Disallows the entire `/en/` content tree
> and both sitemaps, and content pages are OAuth-gated. Findings reflect the **public landing surface
> only** (144 links). A complete inventory requires a CMS export or authenticated URL list from KP.

---

## 1. Executive summary

`mykp.kp.org` is **not a member/patient portal** and not a marketing site — it is Kaiser Permanente's
**internal employee intranet**: HR, procurement ("buy"), workforce well-being, tools, and corporate
"about-kp" pages. It sits behind PingFederate/Adobe OAuth (`MyKP_OAuth_PROD`).

**Recommendation: this site is largely OUT OF SCOPE for public EDS migration.**
- The overwhelming majority of content is **authenticated, personalized, workforce-facing** — the same
  exclusion rationale as a member portal (session-bound, identity-gated, not public editorial).
- A **small public informational subset** (`/en/about-kp/*` — mission, history, fast-facts) is authored
  editorial that *could* migrate if KP wants a public-facing "about" surface, but that content largely
  overlaps `about.kaiserpermanente.org` (Site 2) and is better served there.
- EDS is a **public content-delivery** platform; an authenticated intranet is an architectural
  mismatch. If KP wants to modernize the intranet, that is a separate AEM Sites/authoring effort, not
  a public EDS migration.

## 2. Access & method
- robots.txt: `Disallow: /en/`, `Disallow: /sitemap.xml`, `Disallow: /en/private/sitemap.xml`.
  `/sitemap.xml` → 404. Details in `robots-findings.md`.
- Content pages (`/en/content/`, `/en/hr/`, …) return a **"Sign On"** OAuth redirect unauthenticated.
- Respecting robots.txt and using no credentials, inventory = public landing link surface (144 URLs).

## 3. Inventory & template map (public surface)

| Template | Meaning | Links | Disposition |
|---|---|---|---|
| M2 | Authenticated intranet content (HR / procurement / tools / news) | 115 | **exclude** |
| M1 | Public informational (`about-kp/*`, home) | 15 | migrate w/ caveats |
| M3 | Auth / utility / assets (sign-in, clientlibs, feedback) | 14 | exclude |
| M0 | Unclassified | 0 | — |
| **Total** | | **144** | |

Full data: `templates-map.csv` / `.json`, `template-summary.json`, `inventory-summary.json`,
`urls-all.json`. Section split on landing: HR 82, content 26, about-kp 14, tools/admin 5.

## 4. Block-level analysis
Not performed by decomposition — the site is exclude-dominated and content is auth-gated. The public
`about-kp` pages are standard authored editorial (title + rich text + cards), architecturally identical
to Site 2's templates; no new block types were observed. Documented, not decomposed (per method for
excluded/authenticated areas).

## 5. Suitability matrix

| Area | Nature | Recommendation | Reasoning |
|---|---|---|---|
| HR / workforce / procurement / tools (M2) | Authenticated, personalized | **Do not migrate** | Session-bound intranet; not public editorial. EDS is a public platform. |
| Auth / utility / assets (M3) | Login, clientlibs | **Do not migrate** | Infrastructure, not content. |
| Public `about-kp` info (M1) | Public editorial | **Migrate with caveats** | Small, authorable — but overlaps `about.kaiserpermanente.org`; migrate there, not as a separate intranet EDS. |

## 6. Recommended phasing
There is **no standalone EDS migration recommended** for `mykp.kp.org`. If any action is taken:
- **Option A (recommended):** treat the public `about-kp` content as candidate pages within the
  **Site 2 (about.kaiserpermanente.org)** engagement; retire duplicates.
- **Option B:** if KP wants to modernize the intranet itself, scope a **separate authenticated AEM
  Sites project** (with a CMS export for full inventory) — this is outside public EDS discovery.

## 7. Open items
1. **Full inventory blocked** — needs a CMS export or authenticated URL list to size the intranet.
2. **Ownership/overlap** — confirm whether `about-kp` public pages should consolidate into Site 2.
3. **Intranet modernization** — separate decision; not part of this public EDS discovery.

## 8. Deliverables index
| File | Contents |
|---|---|
| `DISCOVERY-REPORT.md` | This report |
| `robots-findings.md` | robots.txt + access analysis |
| `urls-all.json` | 144 public-surface URLs (access-limited) |
| `inventory-summary.json` | site type + template totals |
| `templates-map.csv` / `.json` | URL → template (M1–M3) |
| `template-summary.json` | template totals + T0 list |
| `landing-links.json` | raw extracted landing links |
