export default function Banner() {
  return (
    <div className="relative">
      {/* Mobile and tablet image */}
      <img
        src="/headerSmallScreen.png"
        alt="Header image"
        className="w-full h-[calc(100vh-4rem)] object-cover md:hidden"
      />
      {/* Desktop image */}
      <img
        src="/headerBigScreen.png"
        alt="Header image"
        className="hidden w-full h-[calc(100vh-4rem)] object-cover md:block"
      />
    </div>
  );
}
