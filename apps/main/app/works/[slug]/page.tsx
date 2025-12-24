import { notFound } from "next/navigation";
import { fetchWorkBySlug } from "../../../services/api";
import WorkSidebar from "../../../components/works/work-sidebar";
import WorkContent from "../../../components/works/work-content";
import AnotherWorks from "../../../components/works/another-works";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const work = await fetchWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-white font-sans">
      <div className="flex flex-col md:flex-row relative">
        <WorkSidebar work={work} />
        <WorkContent work={work} />
      </div>
      <AnotherWorks />
    </main>
  );
}
