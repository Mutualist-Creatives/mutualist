import FallingShapes from "./falling-shapes";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <main className="flex flex-col items-center justify-center min-h-screen relative z-10 pointer-events-none px-4 pb-40 max-w-screen-2xl mx-auto">
        <p className="text-xl md:text-3xl lg:text-[46px] xl:text-[56px] 2xl:text-[64px] text-black-mutu pb-4 pointer-events-none text-center">
          10+ Years of
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-[88px] xl:text-[94px] 2xl:text-[100px] leading-[115%] font-medium text-purple-mutu max-w-[15em] text-center pointer-events-none">
          Creating the <br /> ABC&apos;s of Brand
        </h1>
      </main>
      <div className="absolute inset-0 z-20">
        <FallingShapes />
      </div>
    </div>
  );
}
