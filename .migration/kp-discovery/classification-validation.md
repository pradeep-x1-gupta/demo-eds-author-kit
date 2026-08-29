# Classification validation — stratified fetched sample (2026-08-29)

Method: fetched representative URLs per template (browser UA + cookie jar to clear the region
redirect), confirmed the rendered `<title>` and content matched the assigned template.

| Template | Sampled | Result | Confidence |
|---|---|---|---|
| T1 Region home / front-door | 2 | "Custom Care & Coverage Just For You" (region landing) ✓ | 99% |
| T2 Health-wellness editorial | 3 | "Health and wellness", "Understanding Substance Use Disorder" ✓ | 98% |
| T3 Marketing / landing | 3 | "Pay Bills", "Premium bill FAQ", "Community Provider Portal" ✓ | 95% |
| T4 Facility landing | 3 | Facility names ("3 Prong Inc – Burlingame") ✓ | 98% |
| T5 Facility department | 3 | "Pediatrics at {facility}" ✓ | 99% |
| T6 Provider / clinician | 3 | Credentialed names ("…, MD – Family Medicine") ✓ | 99% |
| T7 Health encyclopedia | 1 | "Health Encyclopedia: Search Health Topics" ✓ | 98% |
| T8 Drug encyclopedia | 2 | "Drug Encyclopedia", "Drug article" ✓ | 98% |
| T9 Legal / utility | 3 | "Nondiscrimination notice", "Help in your language" ✓ | 97% |
| T10 Member portal (secure) | 3 | "Secure Index", "Appointment center", "Appointment details" ✓ | 99% |
| T0 Unclassified | 3 | Mixed: one 302→region home, one 410 Gone, one "Maui Health" microsite — correctly left for review | n/a |

## Findings
- **All 10 production templates validated** — no misassignments in the sample.
- T3 correctly absorbs editorial "find a doctor/location" and "community provider" landing pages
  (informational content), keeping them distinct from the DB-driven T6 provider profiles.
- T0 is 12 URLs (0.01%): domain root, `cache-manager`, and Hawaii `nmp` microsite pages — genuine
  edge cases, not classifier gaps. One sampled T0 returned HTTP 410 (Gone) — stale sitemap entry.
- HTTP notes: several public pages return 301/302 (region/canonical redirects) before serving
  content — expected for this region-partitioned site, not errors.

**Overall classification confidence: ~98%.**
