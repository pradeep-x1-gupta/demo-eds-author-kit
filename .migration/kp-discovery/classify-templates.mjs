// Part A: classify every URL in urls-all.json into templates T1–T10 (T0 = unclassified).
// Deterministic path-pattern rules derived from the T1–T10 catalog.
// Emits templates-map.json, templates-map.csv, template-summary.json.
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = '/backups/pradeep-x1-gupta/demo-eds-author-kit/repo/.migration/kp-discovery';

const REGIONS = [
  'northern-california', 'southern-california', 'colorado', 'georgia',
  'hawaii', 'maryland-virginia-washington-dc', 'oregon-washington', 'washington',
];

const TEMPLATES = {
  T1: 'Region home / front-door',
  T2: 'Health-wellness editorial',
  T3: 'Marketing / landing',
  T4: 'Facility landing',
  T5: 'Facility department listing',
  T6: 'Provider / clinician profile',
  T7: 'Health encyclopedia',
  T8: 'Drug encyclopedia',
  T9: 'Legal / utility',
  T10: 'Member portal (secure)',
  T0: 'Unclassified (review)',
};

// EDS disposition per template (from MIGRATION-ANALYSIS.md matrix)
const DISPOSITION = {
  T1: 'migrate', T2: 'migrate', T3: 'migrate', T9: 'migrate',
  T4: 'migrate-caveats', T7: 'migrate-caveats', T8: 'migrate-caveats',
  T5: 'exclude', T6: 'exclude', T10: 'exclude',
  T0: 'review',
};

function regionOf(seg) {
  return REGIONS.includes(seg[0]) ? seg[0] : '(none)';
}

// Returns template id for a URL. Order matters: most specific first.
function classify(pathname) {
  const seg = pathname.split('/').filter(Boolean);
  const region = regionOf(seg);
  const hasRegion = region !== '(none)';
  const rest = hasRegion ? seg.slice(1) : seg;
  const p = pathname;

  // T10 member portal / secure / auth (region-agnostic)
  if (/\/pages\/securepages(\/|$)/.test(p)) return 'T10';
  if (/\/mychartma(\/|$)/.test(p)) return 'T10';
  if (/(sign-on|sign-off|consumer-sign-on|forgotuserid|forgot-password|mfaprogram|consumer-interrupt|register(\/|$)|\/account(\/|$))/.test(p)) return 'T10';
  if (/authorization\.oauth2|as\/authorization/.test(p)) return 'T10';

  // T8 drug encyclopedia
  if (/drug-encyclopedia|\/drug\./.test(p)) return 'T8';
  // T7 health encyclopedia
  if (/health-encyclopedia|\/he\./.test(p)) return 'T7';

  // T5 facility department listing (before T4)
  if (rest[0] === 'facilities' && rest.includes('departments')) return 'T5';
  // T4 facility landing
  if (rest[0] === 'facilities') return 'T4';

  // T6 provider / clinician profiles
  if (/^(physicians|clinicians|provider|doctors)$/.test(rest[0] || '')) return 'T6';

  // T9 legal / utility
  if (/(privacy|termsconditions|terms-conditions|legal-regulatory|language-assistance|accessibility|nondiscrimination|disclaimer|consumer-termsconditions|privacy-practices)/.test(p)) return 'T9';

  // T2 health-wellness editorial (encyclopedias already handled above)
  if (rest[0] === 'health-wellness') return 'T2';

  // T3 marketing / landing (incl. editorial "find a doctor/location" landing pages —
  // these are informational content, NOT the DB-driven provider profiles in T6)
  if (/^(shop-plans|get-care|learn|support|new-members|help-paying-your-bill|billpay|microsites|front-door|doctors-locations|community-providers|engagement)$/.test(rest[0] || '')) {
    // front-door root is the region home (T1); deeper front-door paths are landing/utility
    if (rest[0] === 'front-door' && rest.length === 1) return 'T1';
    return 'T3';
  }

  // T1 region home (region root, or bare region)
  if (hasRegion && rest.length === 0) return 'T1';

  // 'pages' bucket: reports/utility marketing-style content
  if (rest[0] === 'pages') return 'T3';

  return 'T0';
}

const data = JSON.parse(readFileSync(`${OUT}/urls-all.json`, 'utf8'));
const urls = data['analysis-urls-all'].urls;

const rows = [];
const pivot = {}; // template -> region -> count
const t0 = [];

for (const { url } of urls) {
  const pathname = new URL(url).pathname;
  const seg = pathname.split('/').filter(Boolean);
  const region = regionOf(seg);
  const template = classify(pathname);
  const row = {
    url,
    region,
    template,
    templateName: TEMPLATES[template],
    disposition: DISPOSITION[template],
  };
  rows.push(row);
  pivot[template] = pivot[template] || {};
  pivot[template][region] = (pivot[template][region] || 0) + 1;
  if (template === 'T0') t0.push(url);
}

// templates-map.json
writeFileSync(`${OUT}/templates-map.json`, JSON.stringify({
  captured: new Date().toISOString(),
  totalUrls: rows.length,
  templates: TEMPLATES,
  disposition: DISPOSITION,
  urls: rows,
}, null, 2));

// templates-map.csv
const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
const csv = ['url,region,template,templateName,disposition']
  .concat(rows.map((r) => [r.url, r.region, r.template, r.templateName, r.disposition].map(esc).join(',')))
  .join('\n');
writeFileSync(`${OUT}/templates-map.csv`, csv);

// template-summary.json with pivot + totals
const templateTotals = {};
for (const t of Object.keys(pivot)) {
  templateTotals[t] = Object.values(pivot[t]).reduce((a, b) => a + b, 0);
}
const t0pct = ((t0.length / rows.length) * 100).toFixed(2);
writeFileSync(`${OUT}/template-summary.json`, JSON.stringify({
  captured: new Date().toISOString(),
  totalUrls: rows.length,
  templateTotals,
  pivot,
  unclassified: { count: t0.length, pct: `${t0pct}%`, sample: t0.slice(0, 50) },
}, null, 2));

// Console report
process.stderr.write('=== Template totals ===\n');
for (const [t, n] of Object.entries(templateTotals).sort((a, b) => b[1] - a[1])) {
  process.stderr.write(`${String(n).padStart(7)}  ${t}  ${TEMPLATES[t]}  [${DISPOSITION[t]}]\n`);
}
process.stderr.write(`\nT0 unclassified: ${t0.length} (${t0pct}%)\n`);
process.stderr.write(`TOTAL: ${rows.length}\n`);
