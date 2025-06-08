import { ArrowDownIcon } from "@heroicons/react/24/outline";

export default function BannerMobile() {
  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Mobile and tablet image */}
      <img
        src="/headerSmallScreen.png"
        alt="Header image"
        className="w-full h-[calc(100vh-4rem)] object-cover md:hidden"
      />
      {/* Desktop image */}
      <div>
        <img
          src="/headerBigScreen.png"
          alt="Header image"
          className="hidden w-full h-[calc(100vh-4rem)] object-cover md:block brightness-90"
        />
      </div>

      {/* Overlay with text and button */}
      <div className="absolute inset-0 bg-opacity-40 flex flex-col items-center justify-center brightness-90">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4 mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Zabierz wnuki na wycieczkę
        </h1>
        <div className="mobile-navigation md:hidden">
          <div>
            <a
              href="#posts"
              className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
            >
              Wpisy
            </a>
          </div>
          <div className="py-8">
            <a
              href="#posts"
              className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
            >
              Mapa
            </a>
          </div>
        </div>

        {/* Scroll arrow */}
        <button
          onClick={scrollDown}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-gray-200 transition-colors animate-bounce"
        >
          <ArrowDownIcon className="h-8 w-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
        </button>
      </div>
    </div>
  );
}
