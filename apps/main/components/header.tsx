"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { name: "About", href: "/about" },
  { name: "Works", href: "/works" },
  {
    name: "Services",
    href: "/services",
    subItems: [
      { name: "Advertising", href: "/services/advertising" },
      { name: "Branding", href: "/services/branding" },
      { name: "Character Design", href: "/services/character-design" },
      { name: "Social Media", href: "/services/social-media" },
    ],
  },
  { name: "Blogs", href: "/blogs" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSubMenu = (name: string) =>
    setOpenSubMenu(openSubMenu === name ? null : name);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300">
        <div className="mx-auto max-w-screen-2xl w-full flex items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4 md:py-5 lg:py-6 2xl:py-8">
          {/* Left: Logo */}
          <div className="flex-shrink-0 relative z-50">
            <Link href="/">
              <Image
                src="/assets/identity/header_logo.svg"
                alt="Mutualist Logo"
                width={120}
                height={24}
                className="w-[100px] md:w-[120px] lg:w-[140px] xl:w-[160px] 2xl:w-[180px] transition-all duration-300"
                priority
              />
            </Link>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 md:gap-8 lg:gap-12 xl:gap-20 2xl:gap-28 transition-all duration-300">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-green-mutu hover:opacity-80 transition-opacity capitalize flex items-center gap-1"
                >
                  {item.name}
                  {item.subItems && (
                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 mt-0.5" />
                  )}
                </Link>

                {/* Dropdown */}
                {item.subItems && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px] flex flex-col overflow-hidden">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="px-6 py-3 text-sm lg:text-base xl:text-lg 2xl:text-xl text-black-mutu hover:bg-cream-mutu hover:text-green-mutu transition-colors whitespace-nowrap text-left"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: CTA Button & Hamburger */}
          <div className="flex-shrink-0 flex items-center gap-3 md:gap-4 relative z-50">
            <Link
              href="/consult"
              className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl inline-block px-4 py-2 md:px-5 md:py-2.5 lg:px-8 lg:py-3 2xl:px-10 2xl:py-4 rounded-full bg-green-mutu text-yellow-mutu font-bold hover:bg-purple-mutu transition-all duration-300 whitespace-nowrap"
            >
              Consult Now
            </Link>
            <button
              onClick={toggleMenu}
              className="md:hidden text-green-mutu p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 md:w-8 md:h-8" />
              ) : (
                <Menu className="w-6 h-6 md:w-8 md:h-8" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100dvh" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full z-40 bg-white pt-24 px-6 md:hidden flex flex-col gap-6 overflow-hidden"
          >
            {navItems.map((item) => (
              <div key={item.name} className="flex flex-col pb-4">
                <div className="flex justify-between items-center">
                  <Link
                    href={item.href}
                    onClick={() => !item.subItems && setIsOpen(false)}
                    className="text-2xl font-medium text-green-mutu"
                  >
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <button
                      onClick={() => toggleSubMenu(item.name)}
                      className="p-2"
                    >
                      <ChevronDown
                        className={`w-6 h-6 text-green-mutu transition-transform ${
                          openSubMenu === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {item.subItems && openSubMenu === item.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-col gap-4 mt-4 pl-4"
                  >
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg text-black-mutu"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
