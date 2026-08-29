# robots.txt — about.kaiserpermanente.org (captured 2026-08-29)

Root returns HTTP 200. Fully public corporate/newsroom site.

## robots.txt (verbatim)
```
User-agent: *
Disallow:
Sitemap: https://about.kaiserpermanente.org/sitemap.xml
```

## Interpretation
- **Empty `Disallow:`** — nothing is blocked; the entire site is crawlable.
- **One sitemap:** `/sitemap.xml` — a single flat urlset of **836 URLs** (no sitemap index, no
  region/language partitioning).
- No auth gating observed; all sampled pages return HTTP 200.

## Site structure (from sitemap)
| Top section | URLs |
|---|---|
| `news` (incl. 221 press-release-archive) | 516 |
| `who-we-are` (history, leadership, labor-relations, mission) | 203 |
| `expertise-and-impact` (healthy-communities, public-policy, annual-reports, research) | 114 |
| home + utility (rss-feeds, site-feedback) | 3 |

This is a classic **corporate + newsroom** site: editorial articles, press releases, leadership bios,
policy/impact content, and annual reports — all authored, public content.
