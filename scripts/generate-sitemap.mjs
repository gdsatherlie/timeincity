import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = 'https://www.timeincity.com';

const cityDataPath = resolve(__dirname, '../src/data/cities_over_50000_clean.json');
const rawCities = JSON.parse(readFileSync(cityDataPath, 'utf8'));

const staticRoutes = [
  { path: '/', priority: 1.0 },
  { path: '/world-time-converter', priority: 0.9 },
  { path: '/time-zone-map', priority: 0.9 },
  { path: '/what-time-is-it-around-the-world', priority: 0.9 },
  { path: '/why-time-zones-exist', priority: 0.9 },
  { path: '/daylight-saving-time', priority: 0.9 },
  { path: '/utc-explained', priority: 0.9 },
  { path: '/about', priority: 0.5 },
  { path: '/privacy', priority: 0.5 },
  { path: '/terms', priority: 0.5 },
  { path: '/contact', priority: 0.5 },
  { path: '/cities', priority: 0.8 },
  { path: '/cities/united-states', priority: 0.8 },
  { path: '/cities/europe', priority: 0.8 },
  { path: '/cities/asia', priority: 0.8 },
  { path: '/cities/south-america', priority: 0.8 },
  { path: '/cities/africa', priority: 0.8 },
  { path: '/cities/oceania', priority: 0.8 }
];

const sortedByPopulation = [...rawCities].sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
const topCitySet = new Set(sortedByPopulation.slice(0, 200).map((city) => city.slug));

const cityRoutes = rawCities.map((city) => ({
  path: `/city/${city.slug}`,
  priority: topCitySet.has(city.slug) ? 0.9 : 0.7
}));

const urls = [...staticRoutes, ...cityRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
  urls
    .map(
      (entry) =>
        `  <url>\n    <loc>${baseUrl}${entry.path}</loc>\n    <priority>${entry.priority.toFixed(1)}</priority>\n    <changefreq>daily</changefreq>\n  </url>`
    )
    .join('\n')
}\n</urlset>\n`;

const outputPath = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(outputPath, xml);
