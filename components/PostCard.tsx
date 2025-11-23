import Link from "next/link";
import type { Post } from "@lib/types";

export function PostCard({ post }: { post: Post }): JSX.Element {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        <span>•</span>
        <span>{post.author}</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">
        <Link href={`/blog/${post.slug}`} className="hover:text-brand-700">
          {post.title}
        </Link>
      </h3>
      <p className="subtext">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2 text-xs text-slate-700">
        {post.tags.map((tag) => (
          <span key={tag} className="pill">
            {tag}
          </span>
        ))}
      </div>
      <div>
        <Link href={`/blog/${post.slug}`} className="btn-secondary">
          Read article
        </Link>
      </div>
    </div>
  );
}
