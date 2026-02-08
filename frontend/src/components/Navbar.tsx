"use client";

import Link from "next/link";
import {
  MapIcon,
  UserIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Annie_Use_Your_Telescope } from "next/font/google";

const navigation = [
  {
    name: "Wycieczki",
    href: "/wycieczki",
    icon: BookOpenIcon,
  },
  { name: "Plastyka", href: "/plastyka", icon: PaintBrushIcon },
  { name: "Mapa Miejsc", href: "/map", icon: MapIcon },
  { name: "O mnie", href: "/about", icon: UserIcon },
];

const annie_use_your_telescope = Annie_Use_Your_Telescope({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <Link href="/" className="md:text-xl text-xl font-bold text-gray-900">
            <div className="flex-shrink-0 flex items-center">
              <img src="/icon.png" alt="Logo" className="h-16 w-16 mr-2" />
              Krakowska Babcia
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-md font-medium ${
                    pathname === item.href
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } ${annie_use_your_telescope.className}`}
                >
                  <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                  {item.name.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200 transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item, index) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ease-out transform ${
                    (() => {
                      const itemPath = item.href.split("?")[0];
                      const currentPath = pathname.split("?")[0];
                      return itemPath === currentPath;
                    })()
                      ? "text-[#215a80]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  } ${
                    mobileMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0"
                  } ${annie_use_your_telescope.className}`}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                    {item.name.toUpperCase()}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
