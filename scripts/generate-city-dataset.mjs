import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const popularPath = resolve(__dirname, 'popularCities.json');
const popularCities = JSON.parse(readFileSync(popularPath, 'utf8'));

const zoneTabRaw = readFileSync('/usr/share/zoneinfo/zone.tab', 'utf8');
const zoneMeta = new Map();

function decodeCoordinate(segment, degreeDigits) {
  if (!segment) return 0;
  const sign = segment.startsWith('-') ? -1 : 1;
  const digits = segment.slice(1);
  const degrees = Number(digits.slice(0, degreeDigits)) || 0;
  const minutes = Number(digits.slice(degreeDigits, degreeDigits + 2)) || 0;
  const seconds = Number(digits.slice(degreeDigits + 2, degreeDigits + 4)) || 0;
  return sign * (degrees + minutes / 60 + seconds / 3600);
}

for (const line of zoneTabRaw.split('\n')) {
  if (!line || line.startsWith('#')) continue;
  const parts = line.split('\t');
  if (parts.length < 3) continue;
  const countryCodes = parts[0];
  const coords = parts[1];
  const timezone = parts[2];
  if (!coords || !timezone) continue;
  const lonIndex = coords.indexOf('-', 1) !== -1 ? coords.indexOf('-', 1) : coords.indexOf('+', 1);
  if (lonIndex === -1) continue;
  const latSegment = coords.slice(0, lonIndex);
  const lonSegment = coords.slice(lonIndex);
  const lat = decodeCoordinate(latSegment, 2);
  const lon = decodeCoordinate(lonSegment, 3);
  const countryCode = countryCodes.split(',')[0];
  zoneMeta.set(timezone, { lat, lon, countryCode });
}

const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const dataset = popularCities.map((entry) => {
  const zone = zoneMeta.get(entry.timezone) || { lat: 0, lon: 0, countryCode: 'UN' };
  const country = displayNames.of(zone.countryCode) || 'Unknown';
  return {
    name: entry.label,
    slug: slugify(entry.label),
    country,
    countryCode: zone.countryCode,
    state: null,
    timezone: entry.timezone,
    lat: Number(zone.lat.toFixed(6)),
    lon: Number(zone.lon.toFixed(6)),
    population: 500000,
  };
});

const outputPath = resolve(__dirname, '../src/data/cities_over_50000_clean.json');
writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
console.log(`Wrote ${dataset.length} cities to ${outputPath}`);
