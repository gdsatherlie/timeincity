import type { CityMeta, CityPoi, CityPoisResponse } from "../types/cityTypes";

const OPEN_TRIPMAP_BASE = "https://api.opentripmap.com/0.1/en/places";
const OPEN_TRIPMAP_API_KEY = process.env.OPEN_TRIPMAP_API_KEY as string | undefined;

const ATTRACTION_KINDS = "interesting_places,tourist_facilities,museums,architecture,historic,cultural";
const RESTAURANT_KINDS = "catering.restaurant,catering.cafe";

type OtmFeatureCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    id: string;
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: {
      xid: string;
      name: string;
      dist?: number;
      rate?: number;
      kinds?: string;
    };
  }[];
};

async function fetchRadiusPois(lat: number, lon: number, kinds: string, limit: number): Promise<OtmFeatureCollection> {
  const url = new URL(`${OPEN_TRIPMAP_BASE}/radius`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("radius", "8000");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("kinds", kinds);
  url.searchParams.set("format", "geojson");
  url.searchParams.set("apikey", OPEN_TRIPMAP_API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`OpenTripMap error: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as OtmFeatureCollection;
}

function mapFeaturesToPois(features: OtmFeatureCollection["features"], category: "attraction" | "restaurant"): CityPoi[] {
  return features
    .map((feature) => {
      const [lon, lat] = feature.geometry.coordinates;
      const kindsArray = (feature.properties.kinds ?? "")
        .split(",")
        .map((kind) => kind.trim())
        .filter(Boolean);

      return {
        xid: feature.properties.xid,
        name: feature.properties.name || "Unnamed place",
        category,
        distanceMeters: feature.properties.dist ?? null,
        rating: typeof feature.properties.rate === "number" ? feature.properties.rate : null,
        kinds: kindsArray,
        lat,
        lon,
      } as CityPoi;
    })
    .filter((poi) => poi.name && poi.name.toLowerCase() !== "unnamed place");
}

function sortByRatingThenDistance(a: CityPoi, b: CityPoi) {
  const ratingA = a.rating ?? 0;
  const ratingB = b.rating ?? 0;
  if (ratingA !== ratingB) return ratingB - ratingA;
  const distA = a.distanceMeters ?? Number.POSITIVE_INFINITY;
  const distB = b.distanceMeters ?? Number.POSITIVE_INFINITY;
  return distA - distB;
}

export async function getCityPois(city: CityMeta): Promise<CityPoisResponse> {
  if (!OPEN_TRIPMAP_API_KEY) {
    throw new Error("Missing OPEN_TRIPMAP_API_KEY env var");
  }

  const [attractionsRaw, restaurantsRaw] = await Promise.all([
    fetchRadiusPois(city.lat, city.lon, ATTRACTION_KINDS, 8),
    fetchRadiusPois(city.lat, city.lon, RESTAURANT_KINDS, 8),
  ]);

  const attractions = mapFeaturesToPois(attractionsRaw.features, "attraction");
  const restaurants = mapFeaturesToPois(restaurantsRaw.features, "restaurant");

  attractions.sort(sortByRatingThenDistance);
  restaurants.sort(sortByRatingThenDistance);

  return {
    city: {
      slug: city.slug,
      name: city.name,
      region: city.region,
      country: city.country,
    },
    attractions,
    restaurants,
    sourceAttribution:
      "POI data from OpenTripMap, based on OpenStreetMap and other open data sources (ODbL).",
  };
}
