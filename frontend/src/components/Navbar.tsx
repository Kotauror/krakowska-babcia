import Link from "next/link";
import { HomeIcon, MapIcon, UserIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Destinations", href: "/destinations", icon: MapIcon },
  { name: "About", href: "/about", icon: UserIcon },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Krakowska Babcia
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
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
