# robots.txt — mykp.kp.org (captured 2026-08-29)

Root returns HTTP 200. Title: **"MyKP Home"**. Site is an **authenticated employee intranet**.

## robots.txt (verbatim)
```
# robots.txt for https://mykp.kp.org
User-agent: *
Allow: /
Disallow: /en/
Disallow: /en/private/sitemap.xml
Disallow: /sitemap.xml
```

## Interpretation
- `/en/` — the **entire content tree** is Disallowed. All authored intranet content lives here.
- Both sitemaps are Disallowed, and `/sitemap.xml` returns **404** — there is no crawlable sitemap.
- Sign-in redirects to `https://fam.kp.org/as/authorization.oauth2?...client_id=MyKP_OAuth_PROD...`
  (Adobe/PingFederate OAuth). Content pages under `/en/content/`, `/en/hr/`, `/en/admin/`, `/en/tools/`
  return HTTP 200 but render a **"Sign On"** page (OAuth redirect) when fetched unauthenticated.
- A small set of `/en/about-kp/*` informational pages (fast-facts, our-history, our-mission) render
  publicly.

## Access decision (respecting robots.txt)
- The content tree is Disallowed **and** auth-gated, so it was **not crawled**. No credentials were
  used (and none should be pasted into chat).
- Inventory is limited to the **public landing-page link surface** (144 unique on-host links).
- A complete inventory would require an **export from the intranet CMS** or an authenticated URL list
  supplied by KP — out of scope for automated discovery.

## Site nature signals
- Sections surfaced on the landing page: `hr` (82 links), `content` (26), `about-kp` (14),
  `tools` (3), `admin` (2), plus utility (`sign-in`, `profile-preferences`, `tasks`, `feedback`).
- No `__NEXT_DATA__`/React app-shell signals; server-rendered AEM-style pages (`.html` extensions,
  `etc.clientlibs`) — this is a classic **AEM Sites intranet**, not a SPA.
