import { useEffect, useState } from "react";
import BannerMobile from "./BannerMobile";
import BannerDesktop from "./BennerDesktop";

export default function Banner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <BannerMobile /> : <BannerDesktop />;
}
