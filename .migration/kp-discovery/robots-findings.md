# robots.txt — healthy.kaiserpermanente.org (captured 2026-08-29)

Root returns HTTP 302 (redirect to region-specific landing); site is publicly accessible to automated fetches.

## Disallowed paths (User-agent: *)
- `/northern-california/physicians/` — NorCal physician profiles blocked from crawl
- `/failover/failover.htm`
- `/static/health/en-us/error/global/4XXerrorpage.html`
- `/mobile-app/`
- `/as/authorization.oauth2` — IMS/OAuth auth endpoint
- `/mychartma` — MyChart / authenticated member portal
- `/content/dam/kporg/final/documents/community-providers/`

## Sitemap inventory declared in robots.txt

### English (healthy.kaiserpermanente.org)
- `/sitemap` (main), `/sitemapdam` (DAM assets)
- Region sitemaps: northern-california, southern-california, colorado, georgia, hawaii,
  maryland-virginia-washington-dc, oregon-washington, washington
- Facility sitemaps: same 8 regions (`/{region}/facilities/sitemap`)
- Doctor/clinician sitemaps: southern-california/physicians, colorado/clinicians,
  georgia/clinicians, hawaii/provider, oregon-washington/clinicians, washington/clinicians
  (NorCal physicians deliberately NOT listed — matches the Disallow above)
- Health encyclopedia: `/sitemap-healthenc.xml`
- Drug encyclopedia: `/sitemap-drugenc.xml`
- Department sitemaps: 8 regions (`/{region}/facilities/departments/sitemap`)

### Spanish (espanol.kaiserpermanente.org/es/)
- Full mirror of the English structure (region, facility, doctor, encyclopedia, department).

### Chinese (zh)
- `/zh/northern-california/sitemap` (and additional zh sitemaps)

## Implications for discovery
- The domain is region-partitioned. NorCal is the priority region.
- Physician/clinician profile pages are dynamic, data-driven listings (and NorCal's are
  Disallowed) → strong "do not migrate" signal for provider-search engines.
- `/mychartma` + `/as/authorization.oauth2` confirm an authenticated member portal that is
  session-bound → exclude candidate.
- Encyclopedia sitemaps (healthenc, drugenc) are large syndicated reference content sets.
