import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-green-mutu">
      <div className="max-w-screen-2xl mx-auto w-full py-6 px-4 md:px-8 lg:px-12 xl:px-20 flex flex-col md:flex-row items-center justify-between text-yellow-mutu font-medium text-sm md:text-base">
        <div className="flex items-center gap-8 md:gap-12 uppercase mb-4 md:mb-0">
          <Link href="#" className="hover:text-white transition-colors">
            Instagram
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Behance
          </Link>
          <Link
            href="#"
            className="hover:text-white transition-colors lowercase"
          >
            lifeatmutualist.com
          </Link>
        </div>
        <div>© Mutualist Creatives 2025</div>
      </div>
    </footer>
  );
}
