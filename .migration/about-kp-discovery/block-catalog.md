# Block catalog — about.kaiserpermanente.org

Derived from structural analysis of representative samples per template. Raw outlines in
`template-analysis/{An}.json`.

> **Note on landing pages:** section landings (A1, A3, A5, A6, A7 hubs) return few `<p>`/`<img>` in
> raw HTML because their card lists hydrate client-side. Article/detail pages (A2 press releases,
> A4 history, A8 annual reports) are fully server-rendered and content-rich (100–219 `<p>`). For EDS
> the listings become **query-index-driven card blocks**; the articles become authored default content.

## Shared global chrome (build once — Phase 0)
- **Header** — KP logo, primary nav (News / Who We Are / Expertise & Impact), search.
- **Footer** — link columns, legal/utility, social, RSS.
- **Breadcrumb** on interior pages.
- Maps to EDS `header`/`footer` fragments + nav block. Reused across all templates.

## A1 — Home / section landing  *(migrate)*
- **Blocks:** hero, feature/promo cards, section entry tiles, CTA. Card lists hydrate dynamically.
- **Model:** authored hero + a **cards/teaser block backed by a query index** of news/who-we-are.

## A2 — News article / press release  *(migrate — flagship, 515 pages)*
- **Blocks:** article hero (title, date, byline), rich text body (up to ~107 `<p>`), inline images
  (~100), pull-quotes, share/social, related-articles cards.
- **Model:** authored editorial (default content) + metadata (publish date, category) + related block.
  The single largest and cleanest EDS candidate.

## A3 — News hub / archive listing  *(migrate)*
- **Blocks:** filter/search, paginated **article-card list** (dynamic), featured story.
- **Model:** query-index-driven listing block over A2 articles + metadata facets.

## A4 — Who-we-are editorial  *(migrate, 133 pages)*
- **Blocks:** hero, rich text, timeline/history media, image galleries (our-history had ~118 imgs),
  quote blocks.
- **Model:** authored editorial; occasional media-rich timeline block.

## A5 — Leadership profile  *(migrate, 22 pages)*
- **Blocks:** person header (name, title, photo), bio rich text, related leaders.
- **Model:** authored profile; a **person/bio block** with a small content model. A couple of
  leadership-team URLs are utility (e.g. "Speaker Request Form") — treat as A9-style utility.

## A6 — Labor relations  *(migrate, 47 pages)*
- **Blocks:** rich text, agreement/document lists, tables.
- **Model:** authored content; document-list block (may link PDFs).

## A7 — Expertise & impact editorial  *(migrate, 101 pages)*
- **Blocks:** hero, rich text (Our Impact had ~168 `<p>`), stat callouts, cards, media.
- **Model:** authored editorial + stat/callout block.

## A8 — Annual report / publication  *(migrate with caveats, 12 pages)*
- **Blocks:** long-form multi-section report (219 `<p>`), data callouts, charts/figures, PDF download.
- **Model:** authored long-form; **caveat** — charts/figures may be images or embeds; PDF versions
  linked. Rich but low volume.

## A9 — Utility  *(exclude, 2 pages)*
- RSS feeds, site feedback form. Infrastructure, not editorial.

---

## Block reuse summary
| Block | Used by | Authored vs. dynamic |
|---|---|---|
| header / nav / footer / search | all | authored (shared) |
| breadcrumb | all interior | authored |
| hero | A1, A2, A4, A7, A8 | authored |
| rich-text (default content) | A2, A4, A6, A7, A8 | authored |
| article-card list | A1, A3 | **dynamic (query index)** |
| related-articles cards | A2 | dynamic (query index) |
| person/bio | A5 | authored |
| stat / callout | A7, A8 | authored |
| document/agreement list | A6, A8 | authored (may link PDFs) |
| share / social | A2 | authored widget |

**New authored blocks:** hero, cards/teaser, person-bio, stat-callout, document-list.
**Dynamic integration:** a **query-index** (EDS JSON index) powering news listings + related cards —
standard EDS pattern, no external backend required.
