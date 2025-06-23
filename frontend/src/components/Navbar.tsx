"use client";

import Link from "next/link";
import { MapIcon, UserIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Wycieczki", href: "/destinations?tag=nad%20wodę&tag=w%20góry&tag=w%20niepogodę&tag=regionalna%20kultura&tag=budżetowo&tag=z%20nocowankiem&tag=dzieciaczkowy%20raj", icon: BookOpenIcon },
  { name: "Mapa Miejsc", href: "/map", icon: MapIcon },
  { name: "O mnie", href: "/about", icon: UserIcon },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
          <div className="flex-shrink-0 flex items-center">
            <img src="/icon.png" alt="Logo" className="h-16 w-16 mr-2" />
              Krakowska Babcia
          </div>
            </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    pathname === item.href
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
