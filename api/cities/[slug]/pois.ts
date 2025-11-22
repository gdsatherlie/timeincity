import type { CityMeta } from "../../../src/types/cityTypes";
import { findCityBySlug } from "../../../src/data/cities";
import { toCityMeta } from "../../../src/utils/cityMeta";
import { getCityPois } from "../../../src/lib/opentripmap";

export default async function handler(req: { query?: { slug?: string } }, res: any) {
  const slug = req.query?.slug;
  if (!slug || Array.isArray(slug)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Missing city slug" }));
    return;
  }

  const cityConfig = findCityBySlug(slug);
  if (!cityConfig) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "City not found" }));
    return;
  }

  let cityMeta: CityMeta;
  try {
    cityMeta = toCityMeta(cityConfig);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Failed to prepare city metadata" }));
    return;
  }

  try {
    const pois = await getCityPois(cityMeta);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.end(JSON.stringify(pois));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Failed to load city POIs" }));
  }
}
