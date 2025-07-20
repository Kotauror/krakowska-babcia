export default function Banner() {
  return (
    <div>
      <img
        src="/banner.JPG"
        alt="Header image"
        className="md:h-[calc(70vh-4rem)] h-[calc(50vh-4rem)] w-full object-cover opacity-95"
      />
      <h1 className="text-2xl md:text-3xl font-bold text-center px-4 m-8 ">
        Zabierz wnuki na wycieczkę
      </h1>
      <div className="justify-center text-center md:px-2 px-1">
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
