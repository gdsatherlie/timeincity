import { NavBar } from "@components/NavBar";
import { ResourceCard } from "@components/ResourceCard";
import { SectionHeader } from "@components/SectionHeader";
import { resources } from "@lib/data";

const skillLevels = Array.from(new Set(resources.map((resource) => resource.skillLevel)));
const types = Array.from(new Set(resources.map((resource) => resource.type)));

export default function ResourcesPage(): JSX.Element {
  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-8 py-12">
        <SectionHeader
          eyebrow="Library"
          title="Underwriting models, templates, and guides"
          description="Search by type, skill level, and asset class. Every download is built for CRE workflows."
        />
        <div className="grid gap-8 lg:grid-cols-[320px,1fr] lg:items-start">
          <aside className="card space-y-4">
            <div>
              <label htmlFor="keyword">Keyword</label>
              <input id="keyword" name="keyword" placeholder="Model, template, guide" />
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <select id="type" name="type" defaultValue="">
                <option value="">Any</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="skill">Skill level</label>
              <select id="skill" name="skill" defaultValue="">
                <option value="">Any</option>
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-primary w-full" type="button">
              Apply filters
            </button>
          </aside>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
