import Image from "next/image";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="w-full bg-cream-mutu">
      <div className="max-w-screen-2xl mx-auto w-full py-20 px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <Image
            src="/assets/home/cta/abcs.png"
            alt="ABCS"
            width={350}
            height={350}
            className="w-[300px] md:w-[550px] lg:w-[600px] xl:w-[750px] 2xl:w-[750px] h-auto object-contain"
          />
        </div>
        <h2 className="text-xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-bold text-purple-mutu mb-4 md:mb-10 leading-tight">
          Ready to Make <br />
          Something Great?
        </h2>
        <Link
          href="https://wa.me/6281808008839"
          className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl inline-block px-4 py-2 md:px-5 md:py-2.5 lg:px-8 lg:py-3 2xl:px-10 2xl:py-4 rounded-full bg-green-mutu text-yellow-mutu font-bold hover:bg-purple-mutu transition-all duration-300 whitespace-nowrap"
        >
          Consult Now
        </Link>
      </div>
    </section>
  );
}
