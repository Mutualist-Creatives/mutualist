import Image from "next/image";

export default function SlingshotSection() {
  return (
    <section className="w-full bg-purple-mutu relative z-20">
      <div className="max-w-screen-2xl mx-auto w-full py-20 md:py-24 lg:py-32 xl:py-40 2xl:py-52 px-6 md:px-20 flex flex-col items-center justify-center text-center relative z-20">
        <div className="-mt-26 md:-mt-32 lg:-mt-44 xl:-mt-54 2xl:-mt-64 mb-[-30px] md:mb-[-40px] lg:mb-[-50px] 2xl:mb-[-60px] relative z-0">
          <Image
            src="/assets/home/slingshot/slingshot_mascot.png"
            alt="Slingshot Mascot"
            width={300}
            height={300}
            className="object-contain w-[160px] md:w-[220px] lg:w-[250px] xl:w-[300px] 2xl:w-[450px] h-auto"
          />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium text-yellow-mutu max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mb-6 md:mb-8 lg:mb-10 2xl:mb-12 leading-tight relative z-10">
          Let&apos;s Aim For Your <br />
          Brand&apos;s Next Big Story.
        </h2>
        <p className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mb-12 leading-relaxed">
          By merging bold creativity with clear strategic thinking, we shape
          brands that sparks connection, build trust, and turn audiences into
          advocates.
        </p>
      </div>
    </section>
  );
}
