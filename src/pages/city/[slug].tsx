import { useEffect, useMemo } from "react";

import type { CityConfig } from "../../data/cities";
import { Experience } from "../../components/Experience";
import { CitySeoSection } from "../../components/CitySeoSection";

interface CityPageProps {
  city: CityConfig;
  onSelectCity: (slug: string) => void;
}

export function CityPage({ city, onSelectCity }: CityPageProps): JSX.Element {
  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Place",
      name: city.name,
      address: [city.region, city.country].filter(Boolean).join(", "),
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.lat,
        longitude: city.lon
      }
    }),
    [city]
  );

  useEffect(() => {
    const scriptId = `city-schema-${city.slug}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
    return () => {
      script?.remove();
    };
  }, [city.slug, schema]);

  return (
    <div className="flex flex-col gap-10">
      <Experience
        initialTimezone={city.timezone}
        initialLabel={city.name}
        initialCitySlug={city.slug}
        onSelectCity={onSelectCity}
      />
      <CitySeoSection city={city} />
    </div>
  );
}
