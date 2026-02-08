export default function ZigzagDivider() {
  return (
    <div className="relative w-full h-12 md:h-16 overflow-hidden bg-white">
      {/* Left side - Blue - child's scissor cut style */}
      <div 
        className="absolute inset-0 bg-[#215a80]"
        style={{
          clipPath: 'polygon(0% 0%, 10% 0%, 5% 20%, 11% 40%, 6% 60%, 10% 80%, 5% 100%, 0% 100%)'
        }}
      />
      <div 
        className="hidden md:block absolute inset-0 bg-[#215a80]"
        style={{
          clipPath: 'polygon(0% 0%, 20% 0%, 11% 20%, 21% 40%, 13% 60%, 20% 80%, 11% 100%, 0% 100%)'
        }}
      />
      
      {/* Right side - Yellow - child's scissor cut style */}
      <div 
        className="absolute inset-0 bg-[#b8b257]"
        style={{
          clipPath: 'polygon(90% 0%, 95% 20%, 89% 40%, 94% 60%, 91% 80%, 95% 100%, 100% 100%, 100% 0%)'
        }}
      />
      <div 
        className="hidden md:block absolute inset-0 bg-[#b8b257]"
        style={{
          clipPath: 'polygon(80% 0%, 89% 20%, 79% 40%, 88% 60%, 81% 80%, 89% 100%, 100% 100%, 100% 0%)'
        }}
      />
    </div>
  );
}
