import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const zoneTabPath = '/usr/share/zoneinfo/zone.tab';
const zoneTab = readFileSync(zoneTabPath, 'utf8');
const baseCities = [];
for (const line of zoneTab.split('\n')) {
  if (!line || line.startsWith('#')) continue;
  const parts = line.split('\t');
  const timezone = parts[2];
  if (!timezone) continue;
  const label = timezone.split('/').pop()?.replace(/_/g, ' ');
  if (!label) continue;
  baseCities.push({ label, timezone });
}

const extraCitiesPath = resolve(__dirname, 'extraCities.json');
const extraCities = JSON.parse(readFileSync(extraCitiesPath, 'utf8'));

const orderedUnique = [];
const seen = new Set();
for (const entry of [...extraCities, ...baseCities]) {
  const key = entry.label.trim().toLowerCase();
  if (!key || seen.has(key)) continue;
  seen.add(key);
  orderedUnique.push(entry);
}
if (orderedUnique.length < 500) {
  throw new Error(`Need at least 500 cities, only have ${orderedUnique.length}`);
}
const limited = orderedUnique.slice(0, 500);
const cities = limited.sort((a, b) => a.label.localeCompare(b.label));
const filePath = resolve(__dirname, '../src/data/popularCities.ts');
const header = `export interface PopularCity {\n  label: string;\n  timezone: string;\n}\n\nexport const POPULAR_CITIES: PopularCity[] = [\n`;
const body = cities
  .map((city) => `  { label: ${JSON.stringify(city.label)}, timezone: ${JSON.stringify(city.timezone)} },`)
  .join('\n');
const footer = '\n];\n';
writeFileSync(filePath, header + body + footer + `\nexport const POPULAR_CITIES_COUNT = POPULAR_CITIES.length;\n`);

const jsonPath = resolve(__dirname, 'popularCities.json');
writeFileSync(jsonPath, JSON.stringify(cities, null, 2));
