// Part B: fetch representative sample pages per public template and extract a
// structural outline (headings, landmarks, media, forms, lists, embeds) to inform
// EDS section/block modeling. Writes template-analysis/{Tn}.json.
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = '/backups/pradeep-x1-gupta/demo-eds-author-kit/repo/.migration/kp-discovery';
const DIR = `${OUT}/template-analysis`;
mkdirSync(DIR, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

// Samples per template (NorCal-first). T5/T6 = one sample (dynamic doc); T10 documented, not decomposed here.
const SAMPLES = {
  T1: ['https://healthy.kaiserpermanente.org/northern-california/front-door'],
  T2: [
    'https://healthy.kaiserpermanente.org/northern-california/health-wellness',
    'https://healthy.kaiserpermanente.org/northern-california/health-wellness/addiction-and-recovery/understanding-addiction',
  ],
  T3: [
    'https://healthy.kaiserpermanente.org/northern-california/shop-plans',
    'https://healthy.kaiserpermanente.org/northern-california/get-care/traveling',
  ],
  T4: ['https://healthy.kaiserpermanente.org/northern-california/facilities/clovis-medical-offices-100376'],
  T5: ['https://healthy.kaiserpermanente.org/northern-california/facilities/clovis-medical-offices-100376/departments/pediatrics-dlp-102423'],
  T7: ['https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.how-to-do-the-wall-sit-exercise.abo6369'],
  T8: ['https://healthy.kaiserpermanente.org/health-wellness/drug-encyclopedia/drug.lidocaine-2--hydrocortisone-2--aloe-vera-rectal-kit.551027'],
  T9: ['https://healthy.kaiserpermanente.org/northern-california/language-assistance'],
};

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US,en' }, redirect: 'follow' });
  return { status: res.status, finalUrl: res.url, html: await res.text() };
}

// Cheap structural extraction via regex (no DOM lib needed for an outline).
function outline(html) {
  const count = (re) => (html.match(re) || []).length;
  const headings = [...html.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ level: +m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }))
    .filter((h) => h.text)
    .slice(0, 40);
  return {
    bytes: html.length,
    counts: {
      h1: count(/<h1[\s>]/gi), h2: count(/<h2[\s>]/gi), h3: count(/<h3[\s>]/gi),
      p: count(/<p[\s>]/gi), img: count(/<img[\s>]/gi), picture: count(/<picture[\s>]/gi),
      a: count(/<a[\s>]/gi), form: count(/<form[\s>]/gi), input: count(/<input[\s>]/gi),
      iframe: count(/<iframe[\s>]/gi), video: count(/<video[\s>]/gi),
      ul: count(/<ul[\s>]/gi), ol: count(/<ol[\s>]/gi), table: count(/<table[\s>]/gi),
      section: count(/<section[\s>]/gi), article: count(/<article[\s>]/gi),
      button: count(/<button[\s>]/gi), nav: count(/<nav[\s>]/gi),
    },
    signals: {
      hasMap: /google\.com\/maps|mapbox|leaflet|data-map/i.test(html),
      hasNextData: /__NEXT_DATA__/i.test(html),
      hasReact: /data-reactroot|react/i.test(html),
      hasBreadcrumb: /breadcrumb/i.test(html),
      hasAccordion: /accordion/i.test(html),
      hasCarousel: /carousel|slider|swiper/i.test(html),
      hasHours: /hours|open now|closed/i.test(html),
      hasPhone: /tel:/i.test(html),
    },
    headings,
  };
}

for (const [t, urls] of Object.entries(SAMPLES)) {
  const samples = [];
  for (const url of urls) {
    try {
      const { status, finalUrl, html } = await fetchHtml(url);
      samples.push({ url, status, finalUrl, ...outline(html) });
      process.stderr.write(`${t} ${status} ${url}\n`);
    } catch (e) {
      samples.push({ url, error: String(e) });
      process.stderr.write(`${t} ERR ${url} ${e}\n`);
    }
  }
  writeFileSync(`${DIR}/${t}.json`, JSON.stringify({ template: t, samples }, null, 2));
}
process.stderr.write('done\n');
