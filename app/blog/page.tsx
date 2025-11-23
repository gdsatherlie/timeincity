import Link from "next/link";

import { NavBar } from "@components/NavBar";
import { PostCard } from "@components/PostCard";
import { SectionHeader } from "@components/SectionHeader";
import { posts } from "@lib/data";

export default function BlogPage(): JSX.Element {
  return (
    <div>
      <NavBar />
      <section className="section-shell space-y-8 py-12">
        <SectionHeader
          eyebrow="Editorial"
          title="CRE career, underwriting, and market insights"
          description="SEO-friendly articles that speak to acquisitions, development, and capital markets operators."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
