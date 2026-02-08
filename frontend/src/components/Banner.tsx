import { Mynerve } from "next/font/google";

const mynerve = Mynerve({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Banner() {
  return (
    <div className={mynerve.className}>
      <img
        src="/banner.webp"
        alt="Header image"
        className="md:h-[calc(50vh-4rem)] h-[calc(40vh-4rem)] w-full object-cover object-[40%_60%] opacity-95"
      />
      <h1 className="text-2xl md:text-4xl font-bold text-center px-4 mt-8 mb-2">
        WYCIECZKI Z WNUKAMI
      </h1>
      <h2 className="text-xl md:text-xl font-bold text-center px-2 m-2">
        I KILKA POMYSŁÓW NA DESZCZ
      </h2>
      <div className="justify-center text-center md:px-2 px-1 text-xl md:text-2xl">
        <div>Hej! Tu Marta - babcia z Krakowa :)</div>
        <div>
          Podrzucam pomysły na wycieczki, a przy okazji trochę kreatywnych zabaw.
        </div>
      </div>
    </div>
  );
}
