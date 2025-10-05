import { Annie_Use_Your_Telescope } from "next/font/google";

const annie_use_your_telescope = Annie_Use_Your_Telescope({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Banner() {
  return (
    <div>
      <img
        src="/banner.webp"
        alt="Header image"
        className="md:h-[calc(50vh-4rem)] h-[calc(40vh-4rem)] w-full object-cover object-[40%_60%] opacity-95"
      />
      <h1 className="text-2xl md:text-4xl font-bold text-center px-4 m-8 ">
        ZABIERZ WNUKI NA WYCIECZKĘ
      </h1>
      <div className={`justify-center text-center md:px-2 px-1 text-xl md:text-2xl ${annie_use_your_telescope.className}`}>
        <div>Hej! Tu Marta - babcia z Krakowa :)</div>
        <div>
          Piszę o miejscach w Małopolsce i okolicach, które zachwycą zarówno
          maluchy, jak i seniorów.
        </div>
        <div>
          Szukasz inspiracji na wycieczkę z wnukami? Jesteś w dobrym miejscu!
        </div>
      </div>
    </div>
  );
}
