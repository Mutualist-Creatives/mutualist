import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-green-mutu">
      <div className="max-w-screen-2xl mx-auto w-full py-6 px-4 md:px-8 lg:px-12 xl:px-20 flex flex-row flex-wrap items-center justify-between text-yellow-mutu font-medium text-xs md:text-base gap-y-4">
        <div className="flex items-center gap-2 md:gap-4 lg:gap-8 uppercase">
          <Link
            href="#"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <span className="lg:hidden">IG</span>
            <span className="hidden lg:inline">Instagram</span>
          </Link>
          <Link
            href="#"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <span className="lg:hidden">BE</span>
            <span className="hidden lg:inline">Behance</span>
          </Link>
          <Link
            href="#"
            className="hover:text-white transition-colors lowercase cursor-pointer"
          >
            lifeatmutualist.com
          </Link>
        </div>
        <div className="text-center">© Mutualist Creatives 2025</div>
      </div>
    </footer>
  );
}
