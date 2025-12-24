"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchBlogBySlug, fetchBlogs, Blog } from "../../../services/api"; // Added fetchBlogs for 'Other Blogs'
import {
  MessageCircle,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Globe,
} from "lucide-react";

interface BlogsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogsDetailPage({ params }: BlogsDetailPageProps) {
  // Unwrap params using React.use() if it's a promise, though here we might need to handle it differently in client component
  // Since this is "use client", params won't be a Promise in older Next versions, but in 15 it is.
  // We will assume we can await it or use `use` hook.
  // Actually, to be safe in "use client", better to untype it or treat as any if unsure, but let's try standard approach.
  const { slug } = React.use(params);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [otherBlogs, setOtherBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const b = await fetchBlogBySlug(slug);
      setBlog(b);
      const all = await fetchBlogs();
      setOtherBlogs(all);
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) return <div>Loading...</div>; // Simple loading state

  if (!blog) {
    return notFound();
  }

  return (
    <main className="min-h-screen w-full bg-white pt-32 pb-20 px-6 md:px-14 font-sans">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-purple-mutu mb-4 leading-tight">
          {blog.title}
        </h1>
        <p className="text-lg font-medium text-black-mutu">
          {blog.category} | {blog.date}
        </p>
      </div>

      {/* Main Image */}
      <div className="w-full max-w-6xl mx-auto aspect-[16/6] bg-zinc-300 rounded-xl mb-16 relative overflow-hidden">
        {blog.image ? (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Content Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar (Left) */}
        <aside className="lg:col-span-3">
          <div className="sticky top-32 flex flex-col gap-10">
            {/* Share Section */}
            <div>
              <h3 className="text-xl font-bold text-purple-mutu mb-4">
                Feeling Insightful?
              </h3>
              <p className="text-sm text-black-mutu mb-4">Share this Blog:</p>
              <div className="grid grid-cols-3 gap-3 w-fit">
                <button className="w-10 h-10 rounded-xl border-2 border-black-mutu flex items-center justify-center hover:bg-black-mutu hover:text-white transition-colors">
                  <MessageCircle size={20} />
                </button>
                <button className="w-10 h-10 rounded-xl border-2 border-black-mutu flex items-center justify-center hover:bg-black-mutu hover:text-white transition-colors">
                  <Instagram size={20} />
                </button>
                <button className="w-10 h-10 rounded-xl border-2 border-black-mutu flex items-center justify-center hover:bg-black-mutu hover:text-white transition-colors">
                  <Twitter size={20} />
                </button>
                <button className="w-10 h-10 rounded-xl border-2 border-black-mutu flex items-center justify-center hover:bg-black-mutu hover:text-white transition-colors">
                  <Globe size={20} /> {/* Reddit replacement */}
                </button>
                <button className="w-10 h-10 rounded-xl border-2 border-black-mutu flex items-center justify-center hover:bg-black-mutu hover:text-white transition-colors">
                  <Linkedin size={20} />
                </button>
                <button className="w-10 h-10 rounded-xl border-2 border-black-mutu flex items-center justify-center hover:bg-black-mutu hover:text-white transition-colors">
                  <Facebook size={20} />
                </button>
              </div>
            </div>

            {/* Browse Other Blogs */}
            <div>
              <h3 className="text-xl font-bold text-purple-mutu mb-4">
                Browse Other Blogs
              </h3>
              <div className="flex flex-col gap-4">
                {otherBlogs
                  .filter((b) => b.slug !== slug)
                  .slice(0, 3)
                  .map((otherBlog) => (
                    <Link
                      key={otherBlog.slug}
                      href={`/blogs/${otherBlog.slug}`}
                      className="group"
                    >
                      <p className="text-sm font-medium text-black-mutu group-hover:text-green-mutu transition-colors">
                        {otherBlog.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {otherBlog.category}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content (Right) */}
        <article className="lg:col-span-9">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-black-mutu prose-p:leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </main>
  );
}
