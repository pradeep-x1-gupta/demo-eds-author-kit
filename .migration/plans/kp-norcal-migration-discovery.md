I'll ask a couple of scoping questions first, since they materially change the discovery and analysis plan for a site this large.# Kaiser Permanente (healthy.kaiserpermanente.org) — EDS Migration Discovery & Analysis Plan

## Objective

Discover all pages and layouts across **the entire `healthy.kaiserpermanente.org` domain**, then produce a thorough, evidence-based analysis of which site areas should migrate to AEM Edge Delivery Services (EDS) and which should not — with clear reasoning for each area. The stated priority region is **Northern California (`/northern-california`)**, so NorCal pages will be discovered in full detail while the rest of the domain is discovered and annotated for context, dependencies, and cross-region reuse.

> Note: Execution of the crawl and analysis requires **Execute mode**. This artifact defines the scope, method, and deliverables so they can be run once approved.

## Confirmed Scope (from clarification)

- **Crawl breadth:** Whole `healthy.kaiserpermanente.org` domain (all regions), with NorCal analyzed at highest fidelity.
- **Area types to include in analysis (all four):**
  - Public marketing / content pages (primary EDS target)
  - Authenticated member portal (assess & explain why in/out)
  - Interactive tools / apps (assess dynamic vs. authored)
  - Legal / utility pages
- **Deliverable emphasis:** Thorough per-area migration recommendation with justification.

## Discovery Approach

### 1. URL inventory
- [ ] Pull `sitemap.xml` / sitemap index for the domain (and any region-specific sitemaps) as the authoritative URL source.
- [ ] Supplement with a bounded crawl (respecting robots.txt) to catch pages not in the sitemap, especially under `/northern-california`.
- [ ] Capture `robots.txt` directives to note explicitly disallowed/auth-gated paths.
- [ ] De-duplicate and bucket all URLs by top-level path segment (region, section, tool, legal, member portal).

### 2. Layout / template clustering
- [ ] Group discovered pages into recurring **page templates/layouts** (e.g., regional homepage, department/service landing, article/content page, provider/location listing, tool wrapper, legal page).
- [ ] For each template, capture a representative sample URL, its section structure, and the blocks/components it uses.
- [ ] Identify shared global chrome (header, mega-menu navigation, footer) and shared fragments reused across regions.

### 3. Per-area technical characterization
For each bucket, record signals that determine EDS suitability:
- [ ] Content type: static authored content vs. dynamic/data-driven vs. app-like interactivity.
- [ ] Authentication requirement (public vs. login-gated).
- [ ] Personalization / real-time data (member data, availability, pricing).
- [ ] Integration dependencies (search, forms, backend APIs, third-party widgets).
- [ ] SEO importance and content-freshness cadence.

## Analysis Framework — EDS Suitability Criteria

Each area is scored against:
- [ ] **Authorability** — is it editorial content authors would maintain in da.live?
- [ ] **Stateless & public** — no auth/session/personalized data required to render.
- [ ] **Performance benefit** — content-heavy pages that gain from EDS's LCP/Core Web Vitals model.
- [ ] **Integration weight** — low reliance on dynamic backends/app frameworks.
- [ ] **Migration effort vs. value** — reuse across regions, template count, content volume.

Recommendation per area: **Migrate / Migrate with caveats / Do not migrate**, each with rationale.

## Expected Area Buckets & Preliminary Hypotheses (to be validated)

- [ ] **Regional marketing & content (incl. `/northern-california`)** → strong EDS candidate.
- [ ] **Health/wellness articles & editorial** → strong EDS candidate.
- [ ] **Service/department & location landing pages** → likely candidate; verify dynamic listing dependencies.
- [ ] **Authenticated member portal (My Health, messaging, appointments)** → likely **exclude**; personalized, session-bound, app-driven.
- [ ] **Interactive tools/apps (provider search, cost estimator, forms, calculators)** → assess case-by-case; wrappers may migrate, engines stay.
- [ ] **Legal/utility (privacy, terms, accessibility, sitemap)** → candidate; low-complexity authored content.
- [ ] **Global header/nav/footer** → shared migration dependency; plan once, reuse across regions.

## Deliverables

- [ ] **URL inventory** — full domain list bucketed by area, with NorCal called out.
- [ ] **Layout/template catalog** — each recurring layout, sample URL, structure, blocks used.
- [ ] **Per-area migration recommendation matrix** — Migrate / Caveats / Exclude, with reasoning against the suitability criteria.
- [ ] **Dependency & sequencing notes** — shared chrome, cross-region reuse, recommended migration order.
- [ ] **Executive summary** — what should move to EDS first, what should not, and why.

## Checklist

- [ ] Confirm scope assumptions above are correct (Execute mode)
- [ ] Retrieve sitemap(s) and robots.txt for full domain
- [ ] Build complete bucketed URL inventory (NorCal at full fidelity)
- [ ] Perform bounded supplemental crawl for gaps
- [ ] Cluster pages into layouts/templates with sample URLs
- [ ] Characterize each area (content type, auth, personalization, integrations)
- [ ] Score each area against EDS suitability criteria
- [ ] Produce per-area Migrate / Caveats / Exclude recommendations with reasoning
- [ ] Document shared-chrome and cross-region dependencies + sequencing
- [ ] Write executive summary of migration recommendations

---

**Next step:** This plan is ready to execute. Approve and switch to Execute mode to run the discovery crawl and produce the full analysis, or tell me which sections to adjust first.
