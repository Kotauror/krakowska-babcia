import { Fuzzy_Bubbles } from "next/font/google";
import Link from "next/link";

const fuzzy_bubbles = Fuzzy_Bubbles({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export default function Banner() {
  return (
    <div className={fuzzy_bubbles.className}>
      <img
        src="/banner.webp"
        alt="Header image"
        className="md:h-[calc(50vh-4rem)] h-[calc(40vh-4rem)] w-full object-cover object-[40%_60%] opacity-95"
      />
      
      {/* Two-color background with zigzag merge and white middle band */}
      <div className="relative w-full pt-8 md:pt-12 pb-8 md:pb-12 overflow-hidden bg-white">
        {/* Left side - Blue - responsive: 10% on mobile, 20% on desktop */}
        <div 
          className="absolute inset-0 bg-[#215a80]"
          style={{
            clipPath: 'polygon(0% 0%, 10% 0%, 5% 5%, 11% 11%, 6% 17%, 10% 23%, 5% 29%, 11% 35%, 7% 41%, 9% 47%, 6% 53%, 11% 59%, 5% 65%, 10% 71%, 7% 77%, 10% 83%, 6% 89%, 11% 95%, 4% 100%, 0% 100%)'
          }}
        />
        <div 
          className="hidden md:block absolute inset-0 bg-[#215a80]"
          style={{
            clipPath: 'polygon(0% 0%, 20% 0%, 11% 5%, 21% 11%, 13% 17%, 20% 23%, 12% 29%, 21% 35%, 15% 41%, 19% 47%, 14% 53%, 21% 59%, 11% 65%, 20% 71%, 16% 77%, 20% 83%, 13% 89%, 21% 95%, 9% 100%, 0% 100%)'
          }}
        />
        
        {/* Right side - Orange/Yellow - responsive: 10% on mobile, 20% on desktop */}
        <div 
          className="absolute inset-0 bg-[#b8b257]"
          style={{
            clipPath: 'polygon(90% 0%, 95% 5%, 89% 11%, 94% 17%, 91% 23%, 94% 29%, 89% 35%, 93% 41%, 91% 47%, 94% 53%, 90% 59%, 95% 65%, 90% 71%, 93% 77%, 91% 83%, 94% 89%, 89% 95%, 96% 100%, 100% 100%, 100% 0%)'
          }}
        />
        <div 
          className="hidden md:block absolute inset-0 bg-[#b8b257]"
          style={{
            clipPath: 'polygon(80% 0%, 89% 5%, 79% 11%, 88% 17%, 81% 23%, 88% 29%, 79% 35%, 87% 41%, 81% 47%, 86% 53%, 80% 59%, 89% 65%, 80% 71%, 85% 77%, 81% 83%, 87% 89%, 79% 95%, 91% 100%, 100% 100%, 100% 0%)'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Main text - centered over merged area */}
          <h1 className="text-xl md:text-3xl text-center px-4 mb-2">
            WYCIECZKI Z WNUKAMI
          </h1>
          <h2 className="text-l md:text-xl text-center px-2 m-2">
            I KILKA POMYSŁÓW NA DESZCZ
          </h2>
          <div className="justify-center text-center md:px-2 px-1 text-l md:text-xl mb-6 md:mb-8">
            <div>Hej! Tu Marta - babcia z Krakowa :)</div>
            <div>
              Podrzucam pomysły na wycieczki, a przy okazji trochę kreatywnych zabaw.
            </div>
          </div>
          
          {/* Buttons - one on each side */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4">
            {/* Left button - on blue side */}
            <Link href="/wycieczki" className="flex justify-center md:w-auto">
              <button className={`bg-white text-[#215a80] px-4 md:px-8 py-2 md:py-3 rounded-full w-fit md:w-auto hover:cursor-pointer hover:bg-gray-100 font-bold text-sm md:text-base transition-all border-2 border-[#215a80] ${fuzzy_bubbles.className}`}>
                ZNAJDŹ WYCIECZKĘ
              </button>
            </Link>
            
            {/* Right button - on orange side */}
            <Link href="/plastyka" className="flex justify-center md:w-auto">
              <button className={`bg-white text-[#b8b257] px-4 md:px-8 py-2 md:py-3 rounded-full w-fit md:w-auto hover:cursor-pointer hover:bg-gray-100 font-bold text-sm md:text-base transition-all border-2 border-[#b8b257] ${fuzzy_bubbles.className}`}>
                ZNAJDŹ PROJEKT PLASTYCZNY
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
