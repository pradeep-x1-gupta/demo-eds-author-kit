// about.kaiserpermanente.org — corporate/newsroom site. Single sitemap.xml (836 URLs).
// Builds urls-all.json, inventory-summary.json, templates-map.json/csv, template-summary.json.
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = '/backups/pradeep-x1-gupta/demo-eds-author-kit/repo/.migration/about-kp-discovery';
const xml = readFileSync(`${DIR}/sitemap.xml`, 'utf8');
const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1].trim());
const urls = [...new Set(locs)].filter((u) => /^https?:\/\//.test(u));

const TEMPLATES = {
  A1: 'Home / section landing',
  A2: 'News article / press release',
  A3: 'News hub / archive listing',
  A4: 'Who-we-are editorial (history, mission, people)',
  A5: 'Leadership profile',
  A6: 'Labor relations content',
  A7: 'Expertise & impact editorial (communities, policy, research)',
  A8: 'Annual report / publication',
  A9: 'Utility (RSS, feedback, sitemap)',
  A0: 'Unclassified (review)',
};
const DISPOSITION = {
  A1: 'migrate', A2: 'migrate', A3: 'migrate', A4: 'migrate', A5: 'migrate',
  A6: 'migrate', A7: 'migrate', A8: 'migrate-caveats', A9: 'exclude', A0: 'review',
};

function classify(u) {
  const p = new URL(u).pathname.replace(/\/$/, '') || '/';
  const seg = p.split('/').filter(Boolean);
  const s0 = seg[0] || '(home)';
  const s1 = seg[1] || '';

  if (/rss-feeds|site-feedback|sitemap|feedback/i.test(p)) return 'A9';
  if (p === '/' || seg.length === 0) return 'A1';

  if (s0 === 'news') {
    if (seg.length === 1) return 'A3';
    if (s1 === 'press-release-archive' && seg.length === 2) return 'A3';
    return 'A2'; // press-release-archive/{slug} or news/{slug}
  }
  if (s0 === 'who-we-are') {
    if (seg.length === 1) return 'A1';
    if (s1 === 'leadership-team') return 'A5';
    if (s1 === 'labor-relations') return 'A6';
    return 'A4'; // our-history, our-mission, our-people, fast-facts, etc.
  }
  if (s0 === 'expertise-and-impact') {
    if (seg.length === 1) return 'A1';
    if (s1 === 'annual-reports') return 'A8';
    return 'A7'; // healthy-communities, public-policy, health-research
  }
  if (seg.length === 1) return 'A1'; // other top-level section landings
  return 'A0';
}

const rows = urls.map((url) => {
  const t = classify(url);
  const seg = new URL(url).pathname.split('/').filter(Boolean);
  return { url, section: seg[0] || '(home)', subsection: seg[1] || '', template: t, templateName: TEMPLATES[t], disposition: DISPOSITION[t] };
});

const totals = {};
const sectionPivot = {};
for (const r of rows) {
  totals[r.template] = (totals[r.template] || 0) + 1;
  sectionPivot[r.template] = sectionPivot[r.template] || {};
  sectionPivot[r.template][r.section] = (sectionPivot[r.template][r.section] || 0) + 1;
}
const t0 = rows.filter((r) => r.template === 'A0');

writeFileSync(`${DIR}/urls-all.json`, JSON.stringify({
  'analysis-urls-all': {
    captured: new Date().toISOString(),
    totalUrls: rows.length, totalDocuments: 0,
    method: 'sitemap', sitemapURL: '/sitemap.xml',
    robotsTxtFound: true, robotsTxtRulesApplied: true,
    limitations: 'Single flat sitemap.xml; no region/language partitioning. Fully public (robots.txt Disallow is empty).',
    confidence: '95%',
    urls: rows.map((r) => ({ url: r.url })), documents: [],
  },
}, null, 2));

writeFileSync(`${DIR}/inventory-summary.json`, JSON.stringify({
  captured: new Date().toISOString(),
  siteType: 'Corporate / newsroom (fully public)',
  totalUrls: rows.length,
  sectionCounts: rows.reduce((a, r) => { a[r.section] = (a[r.section] || 0) + 1; return a; }, {}),
  templateTotals: totals,
}, null, 2));

writeFileSync(`${DIR}/templates-map.json`, JSON.stringify({
  captured: new Date().toISOString(), totalUrls: rows.length, templates: TEMPLATES, disposition: DISPOSITION, urls: rows,
}, null, 2));

const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
writeFileSync(`${DIR}/templates-map.csv`,
  ['url,section,subsection,template,templateName,disposition']
    .concat(rows.map((r) => [r.url, r.section, r.subsection, r.template, r.templateName, r.disposition].map(esc).join(',')))
    .join('\n'));

const t0pct = ((t0.length / rows.length) * 100).toFixed(2);
writeFileSync(`${DIR}/template-summary.json`, JSON.stringify({
  captured: new Date().toISOString(), totalUrls: rows.length, templateTotals: totals, sectionPivot,
  unclassified: { count: t0.length, pct: `${t0pct}%`, sample: t0.map((r) => r.url).slice(0, 30) },
}, null, 2));

process.stderr.write('about template totals:\n');
for (const [t, n] of Object.entries(totals).sort((a, b) => b[1] - a[1])) process.stderr.write(`  ${String(n).padStart(4)}  ${t}  ${TEMPLATES[t]} [${DISPOSITION[t]}]\n`);
process.stderr.write(`  T0: ${t0.length} (${t0pct}%)  TOTAL: ${rows.length}\n`);
