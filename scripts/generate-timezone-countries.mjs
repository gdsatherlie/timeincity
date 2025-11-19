import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const zoneTabPath = '/usr/share/zoneinfo/zone.tab';
const contents = readFileSync(zoneTabPath, 'utf8');
const lines = contents.split('\n');

const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
const map = new Map();

for (const line of lines) {
  if (!line || line.startsWith('#')) continue;
  const [territoryRaw,, timezone] = line.split('\t');
  if (!timezone) continue;
  const territoryCode = territoryRaw?.split(',')[0]?.trim();
  if (!territoryCode) continue;
  const countryName = displayNames.of(territoryCode) ?? territoryCode;
  map.set(timezone.trim(), { countryCode: territoryCode, countryName });
}

const entries = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));

const output = `export interface TimezoneCountryMeta {\n  countryCode: string;\n  countryName: string;\n}\n\nexport const TIMEZONE_COUNTRIES: Record<string, TimezoneCountryMeta> = {\n${
  entries
    .map(([timezone, meta]) => `  ${JSON.stringify(timezone)}: { countryCode: ${JSON.stringify(meta.countryCode)}, countryName: ${JSON.stringify(meta.countryName)} },`)
    .join('\n')
}\n};\n`;

const target = resolve(__dirname, '../src/data/timezoneCountries.ts');
writeFileSync(target, output);
