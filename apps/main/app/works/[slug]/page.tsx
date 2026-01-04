import { notFound } from "next/navigation";
import { fetchWorkBySlug, fetchWorks } from "../../../services/api";
import WorkSidebar from "../../../components/works/work-sidebar";
import WorkContent from "../../../components/works/work-content";
import AnotherWorks from "../../../components/works/another-works";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const work = await fetchWorkBySlug(slug);
  const allWorks = await fetchWorks();

  if (!work) {
    notFound();
  }

  // Filter out the current work
  const otherWorks = allWorks.filter((w: { slug: string }) => w.slug !== slug);

  return (
    <main className="min-h-screen w-full bg-white font-sans">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 w-full">
        <div className="flex flex-col md:flex-row relative">
          <WorkSidebar work={work} />
          <WorkContent work={work} />
        </div>
      </div>
      <AnotherWorks works={otherWorks} />
    </main>
  );
}
