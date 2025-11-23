import { notFound } from "next/navigation";

import { NavBar } from "@components/NavBar";
import { posts } from "@lib/data";

export default function BlogDetailPage({ params }: { params: { slug: string } }): JSX.Element {
  const post = posts.find((item) => item.slug === params.slug);
  if (!post) return notFound();

  return (
    <div>
      <NavBar />
      <article className="section-shell space-y-6 py-12">
        <p className="text-sm font-semibold text-brand-700">{new Date(post.publishedAt).toLocaleDateString()}</p>
        <h1 className="text-4xl font-semibold text-slate-900">{post.title}</h1>
        <p className="subtext">By {post.author}</p>
        <div className="max-w-3xl space-y-4 text-lg leading-7 text-slate-700" dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, "<br />") }} />
      </article>
    </div>
  );
}
