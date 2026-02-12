"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchBlogBySlug, fetchBlogs, Blog } from "../../../services/api"; // Added fetchBlogs for 'Other Blogs'
import { Share2, Check } from "lucide-react";
import CTASection from "@/components/home/cta-section";

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
  const [showToast, setShowToast] = useState(false);

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
    <main className="min-h-screen w-full bg-white font-sans">
      <div className="pt-32 pb-20 px-6 md:px-14">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-purple-mutu mb-4 leading-tight">
            {blog.title}
          </h1>
          <p className="text-lg font-medium text-black-mutu">
            {blog.category} | {blog.date}
          </p>
        </div>

        {/* Main Image */}
        <div className="w-full max-w-6xl mx-auto aspect-16/8 md:aspect-16/7 bg-zinc-300 rounded-xl mb-4 md:mb-16 relative overflow-hidden">
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

        {/* Mobile: Browse Other Blogs Link */}
        <div className="flex justify-end md:hidden w-full max-w-6xl mx-auto mb-8">
          <Link
            href="/mutualist-blogs"
            className="text-xs font-medium text-purple-mutu"
          >
            Browse Other Blogs
          </Link>
        </div>

        {/* Content Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Main Content (Right) - DOM Order 1st (Mobile Top) */}
          <article className="md:col-span-9">
            <div
              className="prose prose-sm md:prose-sm lg:prose-lg max-w-none prose-headings:font-bold prose-p:text-black-mutu prose-p:leading-relaxed prose-p:text-xs md:prose-p:text-sm lg:prose-p:text-lg prose-h2:text-lg md:prose-h2:text-xl lg:prose-h2:text-2xl prose-h2:font-bold prose-h2:text-green-mutu prose-h2:mb-4 prose-h3:text-base md:prose-h3:text-lg lg:prose-h3:text-xl prose-h3:font-bold prose-h3:text-black-mutu prose-h3:mb-3 prose-p:mb-6"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Sidebar (Left) - DOM Order 2nd (Mobile Bottom) */}
          <aside className="md:col-span-3 md:order-first">
            <div className="sticky top-32 flex flex-col gap-10">
              {/* Contact Us (Mobile Only - Coded) */}
              <div className="block md:hidden mb-2">
                <Link href="/contact" className="block w-fit">
                  <h3 className="text-3xl font-bold text-purple-mutu mb-6">
                    Contact Us
                  </h3>
                </Link>
                <div className="flex flex-col gap-1 text-base font-normal text-black-mutu">
                  <p>
                    Ready to take your brand to the next level? Our team is
                    excited to discuss your needs. We&apos;re here to help.
                  </p>
                </div>
              </div>

              {/* Share Section */}
              <div>
                <h3 className="text-xl font-bold text-purple-mutu mb-4">
                  Feeling Insightful?
                </h3>
                <p className="text-sm text-black-mutu mb-4">Share this Blog:</p>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                  }}
                  className="w-10 h-10 rounded-xl border-2 border-black-mutu flex items-center justify-center hover:bg-black-mutu hover:text-white transition-colors cursor-pointer"
                  title="Copy link to clipboard"
                >
                  <Share2 size={20} />
                </button>

                {/* Toast Notification */}
                <div
                  className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-mutu text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${
                    showToast
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <Check size={18} />
                  <span className="text-sm font-medium">
                    Link copied to clipboard!
                  </span>
                </div>
              </div>

              {/* Browse Other Blogs */}
              <div className="hidden md:block">
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
                        href={`/mutualist-blogs/${otherBlog.slug}`}
                        className="group"
                      >
                        <p className="text-sm font-medium text-black-mutu group-hover:text-green-mutu transition-colors">
                          {otherBlog.title}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <CTASection />
    </main>
  );
}
