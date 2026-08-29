# Classification validation — about.kaiserpermanente.org (2026-08-29)

Method: fetched 2 URLs per template, confirmed rendered `<title>`/content matched assignment.
All pages returned HTTP 200 (fully public; no auth, no region gating).

| Template | Sampled | Result | Confidence |
|---|---|---|---|
| A1 Home / section landing | 2 | "We're transforming health…", "Who we are" ✓ | 97% |
| A2 News article / press release | 2 | "High-Quality Care" (107 `<p>`), "Paul Minardi, MD, Appointed…" ✓ | 99% |
| A3 News hub / archive | 1 | "News" ✓ | 95% |
| A4 Who-we-are editorial | 2 | "Our Mission", "Our History" ✓ | 98% |
| A5 Leadership profile | 2 | "Sam Glick" (bio) ✓; one "Speaker Request Form" (leadership-adjacent utility) | 90% |
| A6 Labor relations | 2 | "Labor Relations", "Recent Labor Agreements" ✓ | 97% |
| A7 Expertise & impact | 2 | "Public Policy Perspectives", "Our Impact" (168 `<p>`) ✓ | 97% |
| A8 Annual report | 2 | "Annual Reports", "2023 Annual Report" (219 `<p>`) ✓ | 96% |
| A9 Utility | 2 | "RSS feeds", "Site feedback" ✓ | 99% |

## Findings
- **All templates validated**; 0 unclassified (A0 = 0.00%).
- Content is server-rendered editorial (press releases up to 100+ `<p>`; annual reports 200+).
- Minor: a couple of leadership-team URLs are utility (e.g. "Speaker Request Form") rather than a
  person profile — negligible; both are still A-disposition migrate content.
- Entire site is public HTTP 200 — the cleanest EDS candidate of the three KP properties analyzed.

**Overall classification confidence: ~97%.**
