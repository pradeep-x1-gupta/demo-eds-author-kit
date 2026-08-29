// Extract structural outlines from locally-saved sample HTML → template-analysis/{Tn}.json
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const OUT = '/backups/pradeep-x1-gupta/demo-eds-author-kit/repo/.migration/kp-discovery';
const HTML = `${OUT}/template-analysis/html`;

const MAP = {
  T1: ['T1_frontdoor.html'],
  T2: ['T2_hw_index.html', 'T2_hw_article.html'],
  T3: ['T3_shopplans.html', 'T3_getcare.html'],
  T4: ['T4_facility.html'],
  T5: ['T5_department.html'],
  T6: ['T6_provider.html'],
  T7: ['T7_healthenc.html'],
  T8: ['T8_drugenc.html'],
  T9: ['T9_language.html'],
};

function outline(html) {
  const count = (re) => (html.match(re) || []).length;
  const headings = [...html.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ level: +m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }))
    .filter((h) => h.text && h.text.length < 120)
    .slice(0, 30);
  return {
    bytes: html.length,
    counts: {
      h1: count(/<h1[\s>]/gi), h2: count(/<h2[\s>]/gi), h3: count(/<h3[\s>]/gi),
      p: count(/<p[\s>]/gi), img: count(/<img[\s>]/gi), picture: count(/<picture[\s>]/gi),
      a: count(/<a[\s>]/gi), form: count(/<form[\s>]/gi), input: count(/<input[\s>]/gi),
      iframe: count(/<iframe[\s>]/gi), ul: count(/<ul[\s>]/gi), table: count(/<table[\s>]/gi),
      section: count(/<section[\s>]/gi), article: count(/<article[\s>]/gi), button: count(/<button[\s>]/gi),
    },
    signals: {
      hasMap: /google\.com\/maps|mapbox|leaflet|data-map|maps\.googleapis/i.test(html),
      hasBreadcrumb: /breadcrumb/i.test(html),
      hasAccordion: /accordion/i.test(html),
      hasCarousel: /carousel|slider|swiper/i.test(html),
      hasHours: /department hours|office hours|open now|hours of operation/i.test(html),
      hasPhone: /tel:/i.test(html),
      hasVideo: /<video|youtube|vimeo|brightcove/i.test(html),
    },
  };
}

for (const [t, files] of Object.entries(MAP)) {
  const samples = files.map((f) => {
    try {
      const html = readFileSync(`${HTML}/${f}`, 'utf8');
      return { file: f, ...outline(html) };
    } catch (e) {
      return { file: f, error: String(e) };
    }
  });
  writeFileSync(`${OUT}/template-analysis/${t}.json`, JSON.stringify({ template: t, samples }, null, 2));
  const s = samples[0];
  if (s.counts) {
    process.stderr.write(`${t}: h1=${s.counts.h1} h2=${s.counts.h2} p=${s.counts.p} img=${s.counts.img} form=${s.counts.form} table=${s.counts.table} | map=${s.signals.hasMap} hours=${s.signals.hasHours} accordion=${s.signals.hasAccordion} carousel=${s.signals.hasCarousel}\n`);
  }
}
process.stderr.write('done\n');
