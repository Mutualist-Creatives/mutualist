import Image from "next/image";

export default function ReachUsSection() {
  return (
    <section className="relative w-full bg-purple-mutu pt-20 pb-0 md:pt-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-14 relative z-20 pb-20 md:pb-32">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-20">
          {/* Left Side: Title */}
          <div className="w-full md:w-1/3">
            <h2 className="text-5xl md:text-7xl font-bold text-yellow-mutu">
              Reach Us
            </h2>
          </div>

          {/* Right Side: Contact Info */}
          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Column 1 */}
            <div className="space-y-10">
              {/* Office */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Office
                </h3>
                <p className="text-white text-base leading-relaxed">
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
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:andre@mutualist.co"
                    className="text-white hover:opacity-80 transition-opacity"
                  >
                    andre@mutualist.co
                  </a>
                  <a
                    href="mailto:mutualistlab@gmail.com"
                    className="text-white hover:opacity-80 transition-opacity"
                  >
                    mutualistlab@gmail.com
                  </a>
                </div>
              </div>

              {/* Whatsapp */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Whatsapp
                </h3>
                <a
                  href="https://wa.me/6281808008839"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  +62 818 0800 8839 (Andre)
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
                  className="text-white hover:opacity-80 transition-opacity"
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
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  Mutualist Creatives
                </a>
              </div>

              {/* Join Us */}
              <div>
                <h3 className="text-xl font-bold text-yellow-mutu mb-2">
                  Join Us
                </h3>
                <div className="text-white text-base leading-relaxed space-y-4">
                  <p>Interested to join as a fellow Mutual?</p>
                  <p>
                    Send your CV and Portfolio to{" "}
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
      <div className="absolute bottom-[-10%] left-[20%] w-[300px] md:w-[350px] z-10 pointer-events-none">
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
