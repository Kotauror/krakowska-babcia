export default function BannerDesktop() {
  return (
    <div className="relative">
      {/* Desktop image */}
      <div>
        <img src="/heroheader.png" alt="Header image" className=" w-full" />
      </div>

      {/* Overlay with text and button */}
      <div className="absolute inset-0 flex h-fit w-120 mt-50 ml-20 bg-orange" style={{background: "orange"}}>
        <h1 className="text-6xl font-bold text-white text-center px-4 mt-4 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          Zabierz wnuki na wycieczkę
        </h1>
      </div>
    </div>
  );
}
