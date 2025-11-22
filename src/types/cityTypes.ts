export type CityMeta = {
  slug: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  timezoneLabel: string;
  utcOffsetLabel: string;
  observesDst: boolean;
};

export type PoiCategory = "attraction" | "restaurant";

export type CityPoi = {
  xid: string;
  name: string;
  category: PoiCategory;
  distanceMeters: number | null;
  rating: number | null;
  kinds: string[];
  lat: number;
  lon: number;
};

export type CityPoisResponse = {
  city: {
    slug: string;
    name: string;
    region: string;
    country: string;
  };
  attractions: CityPoi[];
  restaurants: CityPoi[];
  sourceAttribution: string;
};
