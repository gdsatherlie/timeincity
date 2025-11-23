import type { VercelRequest, VercelResponse } from "@vercel/node";
import { findCityBySlug } from "../../../src/data/cities";
import { getCityPois } from "../../../src/lib/opentripmap";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { slug } = req.query;

    if (!slug || Array.isArray(slug)) {
      res.status(400).json({ error: "Missing or invalid city slug" });
      return;
    }

    console.log("POI handler called with slug:", slug);

    const cityConfig = findCityBySlug(slug);
    if (!cityConfig) {
      console.error("City not found for slug:", slug);
      res.status(404).json({ error: "City not found" });
      return;
    }

    const cityMeta = {
      slug: cityConfig.slug,
      name: cityConfig.name,
      region: cityConfig.state ?? cityConfig.region ?? "",
      country: cityConfig.country,
      lat: cityConfig.lat,
      lon: cityConfig.lon,
      timezoneLabel: cityConfig.timezone,
      utcOffsetLabel: cityConfig.timezone,
      observesDst: false,
    };

    const pois = await getCityPois(cityMeta);

    res
      .setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400")
      .status(200)
      .json(pois);
  } catch (err: any) {
    console.error("Error in /api/cities/[slug]/pois:", err);
    const message = typeof err?.message === "string" ? err.message : "Unknown error";
    res.status(500).json({ error: "Failed to load city POIs", detail: message });
  }
}
