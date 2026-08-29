# Additional Site Discovery — mykp.kp.org & about.kaiserpermanente.org

## Objective

Run the **same discovery & analysis methodology** already applied to `healthy.kaiserpermanente.org`
against two additional sites, keeping each in its **own separate workspace folder**. Produce, per site,
a full URL inventory, a template map covering every URL, block-level analysis of public templates, an
EDS suitability matrix, and a recommended phased migration plan — ending in a consolidated discovery
report.

> **Discovery only.** No migration or code changes. Phasing is a recommendation, not work in progress.
> Execution requires **Execute mode**.

## Sites in scope (separate folders)

| # | Site | New workspace folder | Likely nature (to validate) |
|---|---|---|---|
| 1 | `https://mykp.kp.org/` | `.migration/mykp-discovery/` | Authenticated member portal (login-gated, app-like) — expect **mostly exclude** |
| 2 | `https://about.kaiserpermanente.org/` | `.migration/about-kp-discovery/` | Corporate / newsroom / marketing — expect **strong EDS candidate** |

Each folder gets its own `.catalog-config.json` and full deliverable set, mirroring
`.migration/kp-discovery/`. The two runs are independent and do not touch the existing KP discovery.

## Method (per site — same as the completed KP engagement)

### A. Access & inventory
- [ ] Fetch `robots.txt`; record disallow rules, auth-gated paths, and declared sitemaps.
- [ ] Enumerate all sitemaps → dedupe into `urls-all.json`. If a site blocks automated access
  (403/redirect-loop, likely for `mykp.kp.org`), fall back to a bounded crawl, then note the
  limitation and request a URL list rather than attempting authenticated crawling.
- [ ] Bucket URLs by top-level path segment; capture per-area counts in `inventory-summary.json`.

### B. Template classification (cover every URL)
- [ ] Derive a site-specific template catalog from the bucket structure (each site gets its **own**
  T-set — do not reuse KP `healthy` templates blindly).
- [ ] Build a deterministic path-pattern classifier; map every URL with `{url, region/section,
  template, disposition}`.
- [ ] Drive Unclassified below 1%; validate with a stratified fetched sample; record confidence.

### C. Block-level analysis (public templates only)
- [ ] Fetch representative samples per public template; extract section/block outlines.
- [ ] Document dynamic/authenticated templates rather than decomposing them.
- [ ] Identify shared global chrome (header/nav/footer) as a cross-template dependency.

### D. Suitability & phasing
- [ ] Score each area (authorability, stateless/public, performance benefit, integration weight,
  effort-vs-value) → Migrate / Migrate-with-caveats / Exclude with reasoning.
- [ ] Produce a phased migration plan with page counts, dependencies, and gates.
- [ ] Consolidate into a per-site `DISCOVERY-REPORT.md`.

## Per-site deliverables (in each folder)

- [ ] `robots-findings.md`, `urls-all.json`, `inventory-summary.json`
- [ ] `templates-map.json` + `templates-map.csv`, `template-summary.json` (pivot + T0 list)
- [ ] `classification-validation.md`
- [ ] `block-catalog.md` + `template-analysis/{Tn}.json`
- [ ] `MIGRATION-ANALYSIS.md`, `PHASED-MIGRATION-PLAN.md`
- [ ] `DISCOVERY-REPORT.md` (consolidated handover)

## Anticipated findings (hypotheses to validate, not conclusions)

- **`mykp.kp.org`** — member portal; likely login-gated with little public content and a small
  sitemap. Expect most URLs to be **Exclude** (authenticated, session-bound). Discovery will confirm
  how much, if any, public/marketing surface exists and document why the rest is out of scope.
- **`about.kaiserpermanente.org`** — corporate site (newsroom, press releases, leadership, careers).
  Expect **strong EDS candidates**: editorial articles, press releases, landing pages — plus possible
  excluded areas (investor tools, dynamic search, third-party embeds).

## Checklist

- [ ] Create separate workspace folders for both sites (`mykp-discovery/`, `about-kp-discovery/`)
- [ ] **Site 1 (mykp.kp.org):** robots.txt + sitemaps → `urls-all.json`; handle auth/blocking gracefully
- [ ] **Site 1:** classify all URLs into a site-specific template set (T0 < 1%) + validate sample
- [ ] **Site 1:** block analysis of any public templates; document authenticated areas
- [ ] **Site 1:** suitability matrix + phased plan + consolidated `DISCOVERY-REPORT.md`
- [ ] **Site 2 (about.kaiserpermanente.org):** robots.txt + sitemaps → `urls-all.json`
- [ ] **Site 2:** classify all URLs into a site-specific template set (T0 < 1%) + validate sample
- [ ] **Site 2:** block analysis of public templates + shared chrome identification
- [ ] **Site 2:** suitability matrix + phased plan + consolidated `DISCOVERY-REPORT.md`
- [ ] Confirm each site's deliverables are self-contained in its own folder (no cross-contamination)

---

**Next step:** Approve and switch to **Execute mode** to run both discoveries. I'll process the two
sites sequentially (Site 1 then Site 2), each into its own folder. Tell me if you'd prefer a different
order, want either site's crawl breadth narrowed, or want to skip one.
