function FilterTag({ name }: { name: string }) {
  return (
    <div className="border-1 md:m-2 m-1 md:px-4 px-2 md:py-2 py-1 rounded-full">
      {name}
    </div>
  );
}

export default function Banner() {
  return (
    <div>
      <img
        src="/valley.png"
        alt="Header image"
        className="h-[calc(60vh-4rem)] w-full object-cover opacity-95"
      />
      <h1 className="text-2xl md:text-3xl font-bold text-center px-4 m-8 ">
        Zabierz wnuki na wycieczkę
      </h1>
      <div className="justify-center text-center">
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
