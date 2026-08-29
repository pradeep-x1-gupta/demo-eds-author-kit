// Part C block analysis for about.kaiserpermanente.org public templates.
import { writeFileSync, mkdirSync } from 'node:fs';
const DIR = '/backups/pradeep-x1-gupta/demo-eds-author-kit/repo/.migration/about-kp-discovery';
mkdirSync(`${DIR}/template-analysis`, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const SAMPLES = {
  A1: ['https://about.kaiserpermanente.org', 'https://about.kaiserpermanente.org/who-we-are'],
  A2: ['https://about.kaiserpermanente.org/news/press-release-archive/high-quality-care'],
  A3: ['https://about.kaiserpermanente.org/news'],
  A4: ['https://about.kaiserpermanente.org/who-we-are/our-history'],
  A5: ['https://about.kaiserpermanente.org/who-we-are/leadership-team'],
  A6: ['https://about.kaiserpermanente.org/who-we-are/labor-relations'],
  A7: ['https://about.kaiserpermanente.org/expertise-and-impact/healthy-communities'],
  A8: ['https://about.kaiserpermanente.org/annual-report/2023'],
};

function outline(html) {
  const c = (re) => (html.match(re) || []).length;
  return {
    bytes: html.length,
    counts: { h1: c(/<h1[\s>]/gi), h2: c(/<h2[\s>]/gi), h3: c(/<h3[\s>]/gi), p: c(/<p[\s>]/gi), img: c(/<img[\s>]/gi), a: c(/<a[\s>]/gi), form: c(/<form[\s>]/gi), iframe: c(/<iframe[\s>]/gi), ul: c(/<ul[\s>]/gi), table: c(/<table[\s>]/gi), figure: c(/<figure[\s>]/gi), blockquote: c(/<blockquote[\s>]/gi) },
    signals: { hasVideo: /<video|youtube|vimeo|brightcove/i.test(html), hasCarousel: /carousel|slider|swiper/i.test(html), hasAccordion: /accordion/i.test(html), hasShare: /share|social/i.test(html), hasDate: /datetime|published|pubdate/i.test(html), hasBreadcrumb: /breadcrumb/i.test(html) },
  };
}

for (const [t, urls] of Object.entries(SAMPLES)) {
  const samples = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      const html = await res.text();
      samples.push({ url, status: res.status, ...outline(html) });
      process.stderr.write(`${t} ${res.status} p=${(html.match(/<p[\s>]/gi)||[]).length} img=${(html.match(/<img[\s>]/gi)||[]).length} ${url}\n`);
    } catch (e) { samples.push({ url, error: String(e) }); process.stderr.write(`${t} ERR ${url}\n`); }
  }
  writeFileSync(`${DIR}/template-analysis/${t}.json`, JSON.stringify({ template: t, samples }, null, 2));
}
process.stderr.write('done\n');
