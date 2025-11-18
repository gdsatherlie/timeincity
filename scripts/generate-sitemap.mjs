import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { buildSync } from "esbuild";

const tempDir = mkdtempSync(join(tmpdir(), "timeincity-sitemap-"));
const cityBundlePath = join(tempDir, "cities.mjs");
const staticBundlePath = join(tempDir, "static-pages.mjs");
const regionBundlePath = join(tempDir, "regions.mjs");

buildSync({
  entryPoints: ["./src/data/cities.ts"],
  outfile: cityBundlePath,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  sourcemap: false
});

buildSync({
  entryPoints: ["./src/data/staticPages.ts"],
  outfile: staticBundlePath,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  sourcemap: false
});

buildSync({
  entryPoints: ["./src/data/regions.ts"],
  outfile: regionBundlePath,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  sourcemap: false
});

const cityModuleUrl = pathToFileURL(cityBundlePath).href;
const staticModuleUrl = pathToFileURL(staticBundlePath).href;
const regionModuleUrl = pathToFileURL(regionBundlePath).href;
const { CITY_CONFIGS = {} } = await import(cityModuleUrl);
const { STATIC_PAGE_ROUTES = {} } = await import(staticModuleUrl);
const { REGION_PAGE_CONTENT = {} } = await import(regionModuleUrl);
const cities = Object.values(CITY_CONFIGS);

const baseUrl = "https://www.timeincity.com";
const today = new Date().toISOString().split("T")[0];

const priorityByGroup = {
  tools: "0.9",
  guides: "0.8",
  info: "0.5"
};

const staticPages = Object.values(STATIC_PAGE_ROUTES).map((meta) => ({
  loc: `${baseUrl}${meta.path}`,
  priority: priorityByGroup[meta.group] ?? "0.7"
}));

const regionPages = Object.values(REGION_PAGE_CONTENT).map((meta) => ({
  loc: `${baseUrl}${meta.path}`,
  priority: "0.8"
}));

const urls = [
  { loc: `${baseUrl}/`, priority: "1.0" },
  ...regionPages,
  ...staticPages,
  ...cities.map((city) => ({
    loc: `${baseUrl}/city/${city.slug}`,
    priority: "0.7"
  }))
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((entry) => {
      return [
        "  <url>",
        `    <loc>${entry.loc}</loc>`,
        `    <priority>${entry.priority}</priority>`,
        `    <lastmod>${today}</lastmod>`,
        "  </url>"
      ].join("\n");
    })
    .join("\n") +
  "\n</urlset>\n";

writeFileSync("./public/sitemap.xml", xml, "utf8");
rmSync(tempDir, { recursive: true, force: true });

console.log(`Sitemap generated with ${urls.length} URLs.`);
