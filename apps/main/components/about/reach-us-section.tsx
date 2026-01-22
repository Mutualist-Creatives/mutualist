import Image from "next/image";

export default function ReachUsSection() {
  return (
    <section className="relative w-full bg-purple-mutu pt-20 pb-0 md:pt-32 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-20 pb-20 md:pb-32">
        <div className="grid grid-cols-2 md:grid-cols-3 items-start gap-4 md:gap-20">
          {/* Left Side: Title */}
          <div className="col-span-1">
            <h2 className="text-3xl md:text-5xl xl:text-6xl font-semibold text-yellow-mutu">
              Reach Us
            </h2>
          </div>

          {/* Right Side: Contact Info */}
          <div className="col-span-1 md:col-span-2 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-sm lg:text-base break-words">
            {/* Column 1 */}
            <div className="space-y-10">
              {/* Office */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Office
                </h3>
                <p className="text-white leading-relaxed font-[family-name:var(--font-instrument-sans)]">
                  Victoria River Park
                  <br />
                  Blok A10 No 20 BSD City,
                  <br />
                  Tangerang Selatan, Banten
                  <br />
                  Indonesia
                </p>
              </div>

              {/* Email */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Email
                </h3>
                <div className="flex flex-col gap-1 font-[family-name:var(--font-instrument-sans)]">
                  <a
                    href="mailto:hello@mutualist.co"
                    className="text-white hover:opacity-80 transition-opacity break-all"
                  >
                    hello@mutualist.co
                  </a>
                </div>
              </div>

              {/* Whatsapp */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Whatsapp
                </h3>
                <a
                  href="https://wa.me/6287787242397"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-opacity font-[family-name:var(--font-instrument-sans)]"
                >
                  +62 877 8724 2397 (Mutu)
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-10">
              {/* Instagram */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Instagram
                </h3>
                <a
                  href="https://instagram.com/mutualistcreatives"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-opacity font-[family-name:var(--font-instrument-sans)]"
                >
                  @mutualistcreatives
                </a>
              </div>

              {/* Behance */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Behance
                </h3>
                <a
                  href="https://behance.net/mutualistcreatives"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-opacity font-[family-name:var(--font-instrument-sans)]"
                >
                  Mutualist Creatives
                </a>
              </div>

              {/* Join Us */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Join Us
                </h3>
                <div className="text-white leading-relaxed space-y-4 font-[family-name:var(--font-instrument-sans)]">
                  <p>
                    Interested to join as a fellow Mutual? Send your CV and
                    Portfolio to{" "}
                  </p>
                  <p>
                    <a
                      href="mailto:recruitment@mutualist.co"
                      className="font-bold underline hover:opacity-80"
                    >
                      recruitment@mutualist.co
                    </a>
                  </p>
                  <p>
                    with the specific role you are applying for as the email
                    subject.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mascot */}
      <div className="absolute bottom-[-5%] left-[10%] md:bottom-[-10%] md:left-[20%] w-[200px] md:w-[300px] lg:w-[350px] z-10 pointer-events-none">
        <Image
          src="/assets/about/reach_us/reach_us_mascot.png"
          alt="Reach Us Mascot"
          width={500}
          height={500}
          className="w-full h-auto object-contain"
        />
      </div>
    </section>
  );
}
