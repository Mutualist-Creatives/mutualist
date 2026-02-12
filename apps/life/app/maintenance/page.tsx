import React from "react";
import Image from "next/image";

export default function MaintenancePage() {
  const gifs = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
      style={{ backgroundColor: "#121212" }}
    >
      {/* Logo */}
      <div className="w-28 h-12 md:w-36 md:h-14 lg:w-40 lg:h-16 relative mb-8 md:mb-12 lg:mb-15">
        <Image
          src="/assets/logo/logo.gif"
          alt="Mutualist Logo"
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      <h1 className="text-4xl md:text-6xl font-medium font-serif text-white mb-4">
        Under Maintenance
      </h1>
      <p className="font-serif leading-relaxed max-w-3xl text-white mb-8 md:mb-12 lg:mb-15 text-xl md:text-3xl">
        We are currently updating our website to serve you better. Please check
        back later.
      </p>

      {/* GIFs - Responsive grid */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-md md:max-w-none">
        {gifs.map((num) => (
          <div key={num} className="w-6 h-6 md:w-14 md:h-14 relative shrink-0">
            <Image
              src={`/assets/gif/${num}.GIF`}
              alt={`Mutualist GIF ${num}`}
              fill
              className="object-cover rounded-lg"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
