// Fetch all declared English sitemaps for healthy.kaiserpermanente.org,
// extract <loc> URLs, dedupe, bucket by area, and write urls-all.json + inventory summary.
import { writeFileSync } from 'node:fs';

const UA = 'Mozilla/5.0 (compatible; EDS-migration-discovery/1.0)';
const OUT = '/backups/pradeep-x1-gupta/demo-eds-author-kit/repo/.migration/kp-discovery';

const REGIONS = [
  'northern-california', 'southern-california', 'colorado', 'georgia',
  'hawaii', 'maryland-virginia-washington-dc', 'oregon-washington', 'washington',
];

// English sitemaps declared in robots.txt (region + facility + department + doctor + main + encyclopedia)
const SITEMAPS = [
  { url: 'https://healthy.kaiserpermanente.org/sitemap', kind: 'main' },
  { url: 'https://healthy.kaiserpermanente.org/sitemap-healthenc.xml', kind: 'health-encyclopedia' },
  { url: 'https://healthy.kaiserpermanente.org/sitemap-drugenc.xml', kind: 'drug-encyclopedia' },
];
for (const r of REGIONS) {
  SITEMAPS.push({ url: `https://healthy.kaiserpermanente.org/${r}/sitemap`, kind: 'region', region: r });
  SITEMAPS.push({ url: `https://healthy.kaiserpermanente.org/${r}/facilities/sitemap`, kind: 'facilities', region: r });
  SITEMAPS.push({ url: `https://healthy.kaiserpermanente.org/${r}/facilities/departments/sitemap`, kind: 'departments', region: r });
}
// Doctor/clinician sitemaps (NorCal physicians are disallowed → not fetched)
const DOCTOR = {
  'southern-california': 'physicians', colorado: 'clinicians', georgia: 'clinicians',
  hawaii: 'provider', 'oregon-washington': 'clinicians', washington: 'clinicians',
};
for (const [r, seg] of Object.entries(DOCTOR)) {
  SITEMAPS.push({ url: `https://healthy.kaiserpermanente.org/${r}/${seg}/sitemap`, kind: 'doctors', region: r });
}

async function fetchLocs(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    if (!res.ok) return { ok: false, status: res.status, locs: [] };
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1].trim());
    return { ok: true, status: res.status, locs };
  } catch (e) {
    return { ok: false, status: 0, error: String(e), locs: [] };
  }
}

const all = new Map(); // url -> {url}
const perSitemap = [];
for (const sm of SITEMAPS) {
  const r = await fetchLocs(sm.url);
  perSitemap.push({ ...sm, status: r.status, ok: r.ok, count: r.locs.length, error: r.error });
  for (const u of r.locs) if (!all.has(u)) all.set(u, { url: u });
  process.stderr.write(`${r.ok ? 'OK ' : 'ERR'} ${r.status} ${r.locs.length.toString().padStart(6)}  ${sm.url}\n`);
}

const urls = [...all.values()];

// Bucket by top-level area
function bucketOf(u) {
  const p = new URL(u).pathname;
  const seg = p.split('/').filter(Boolean);
  const region = REGIONS.includes(seg[0]) ? seg[0] : null;
  const rest = region ? seg.slice(1) : seg;
  const r0 = rest[0] || '(region-home)';
  let area;
  if (/health-wellness|health-encyclopedia|drug-encyclopedia|healthenc|drugenc/.test(p)) area = 'health-content';
  else if (rest.includes('facilities') && rest.includes('departments')) area = 'facility-departments';
  else if (rest.includes('facilities')) area = 'facilities';
  else if (/physicians|clinicians|provider|doctors/.test(p)) area = 'providers';
  else if (/insurance|plans|shop|enroll|medicare|medicaid/.test(p)) area = 'plans-enrollment';
  else if (/mychartma|secure|member|sign-on|sign-in|account/.test(p)) area = 'member-portal';
  else if (/privacy|terms|legal|accessibility|nondiscrimination|disclaimer/.test(p)) area = 'legal-utility';
  else if (region && rest.length === 0) area = 'region-home';
  else area = `other:${r0}`;
  return { region: region || '(none)', area };
}

const buckets = {};
const regionCounts = {};
for (const { url } of urls) {
  const { region, area } = bucketOf(url);
  regionCounts[region] = (regionCounts[region] || 0) + 1;
  buckets[area] = buckets[area] || { count: 0, sample: [] };
  buckets[area].count += 1;
  if (buckets[area].sample.length < 8) buckets[area].sample.push(url);
}

writeFileSync(`${OUT}/urls-all.json`, JSON.stringify({
  'analysis-urls-all': {
    captured: new Date().toISOString(),
    totalUrls: urls.length,
    totalDocuments: 0,
    method: 'sitemap',
    sitemapURL: '/sitemap (+ region/facility/department/doctor/encyclopedia sitemaps)',
    robotsTxtFound: true,
    robotsTxtRulesApplied: true,
    limitations: 'English-language sitemaps only; NorCal /physicians/ Disallowed in robots.txt and excluded. Spanish (espanol.) and Chinese (zh) mirrors not enumerated in this pass.',
    confidence: '90%',
    urls,
    documents: [],
  },
}, null, 2));

writeFileSync(`${OUT}/inventory-summary.json`, JSON.stringify({
  captured: new Date().toISOString(),
  totalUniqueUrls: urls.length,
  perSitemap,
  regionCounts,
  areaBuckets: Object.fromEntries(Object.entries(buckets).sort((a, b) => b[1].count - a[1].count)),
}, null, 2));

process.stderr.write(`\nTOTAL UNIQUE URLS: ${urls.length}\n`);
