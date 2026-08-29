// mykp.kp.org — employee intranet. robots.txt Disallows /en/ and both sitemaps.
// Respecting robots.txt: inventory is limited to the public landing-page link surface.
// Builds urls-all.json, inventory-summary.json, templates-map.json/csv, template-summary.json.
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = '/backups/pradeep-x1-gupta/demo-eds-author-kit/repo/.migration/mykp-discovery';
const links = JSON.parse(readFileSync(`${DIR}/landing-links.json`, 'utf8'));

// Known access behavior (probed): about-kp/* informational render public; hr/content/* redirect to OAuth Sign On.
const PUBLIC_INFO = /\/en\/about-kp\//i;
const AUTH_GATED = /\/en\/(content|hr|admin|tools)\//i;
const ASSET = /clientlibs|\.js$|\.css$|feedback|profile-preferences|tasks\.html|sign-in/i;

const TEMPLATES = {
  M1: 'Public informational (about-kp)',
  M2: 'Authenticated intranet content (HR / procurement / tools)',
  M3: 'Auth / utility / assets (sign-in, clientlibs, feedback)',
  M0: 'Unclassified (review)',
};
const DISPOSITION = { M1: 'migrate-caveats', M2: 'exclude', M3: 'exclude', M0: 'review' };

function classify(u) {
  const p = new URL(u).pathname;
  if (ASSET.test(p) || /oauth|authorization|sign-in|_codexch/i.test(p)) return 'M3';
  if (PUBLIC_INFO.test(p)) return 'M1';
  if (AUTH_GATED.test(p)) return 'M2';
  if (/\/en(\.html)?$/i.test(p) || p === '/' ) return 'M1'; // landing / home
  if (/news|maui-health/i.test(p)) return 'M2';
  return 'M0';
}

const rows = links.map((url) => {
  const t = classify(url);
  return { url, section: new URL(url).pathname.split('/').filter(Boolean)[1] || '(home)', template: t, templateName: TEMPLATES[t], disposition: DISPOSITION[t] };
});

const totals = {};
for (const r of rows) totals[r.template] = (totals[r.template] || 0) + 1;

writeFileSync(`${DIR}/urls-all.json`, JSON.stringify({
  'analysis-urls-all': {
    captured: new Date().toISOString(),
    totalUrls: rows.length,
    totalDocuments: 0,
    method: 'landing-link-surface',
    sitemapURL: null,
    robotsTxtFound: true,
    robotsTxtRulesApplied: true,
    limitations: 'robots.txt Disallows /en/ (entire content tree) and both sitemaps (/sitemap.xml returns 404). Site is an authenticated employee intranet (MyKP). Inventory limited to the public landing-page link surface; authenticated content was NOT crawled (respecting robots.txt + no credentials). A complete inventory requires an export from the intranet CMS or an authenticated URL list.',
    confidence: '60% (public surface only)',
    urls: rows.map((r) => ({ url: r.url })),
    documents: [],
  },
}, null, 2));

writeFileSync(`${DIR}/inventory-summary.json`, JSON.stringify({
  captured: new Date().toISOString(),
  siteType: 'Authenticated employee intranet (MyKP)',
  totalPublicLinks: rows.length,
  templateTotals: totals,
  note: 'Full site size unknown — content tree is Disallowed/auth-gated. Counts reflect public landing surface only.',
}, null, 2));

writeFileSync(`${DIR}/templates-map.json`, JSON.stringify({
  captured: new Date().toISOString(), totalUrls: rows.length, templates: TEMPLATES, disposition: DISPOSITION, urls: rows,
}, null, 2));

const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
writeFileSync(`${DIR}/templates-map.csv`,
  ['url,section,template,templateName,disposition']
    .concat(rows.map((r) => [r.url, r.section, r.template, r.templateName, r.disposition].map(esc).join(',')))
    .join('\n'));

writeFileSync(`${DIR}/template-summary.json`, JSON.stringify({
  captured: new Date().toISOString(), totalUrls: rows.length, templateTotals: totals,
  unclassified: { count: totals.M0 || 0, sample: rows.filter((r) => r.template === 'M0').map((r) => r.url).slice(0, 20) },
}, null, 2));

process.stderr.write('mykp template totals:\n');
for (const [t, n] of Object.entries(totals).sort((a, b) => b[1] - a[1])) process.stderr.write(`  ${String(n).padStart(4)}  ${t}  ${TEMPLATES[t]} [${DISPOSITION[t]}]\n`);
process.stderr.write(`  TOTAL public links: ${rows.length}\n`);
