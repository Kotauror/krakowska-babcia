"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // If we're on the home page, store the scroll position
    if (pathname === "/") {
      const handleScroll = () => {
        sessionStorage.setItem("homeScrollPosition", window.scrollY.toString());
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
    // If we're leaving the home page, store the final position
    else if (pathname.startsWith("/posts/")) {
      const homeScrollPosition = sessionStorage.getItem("homeScrollPosition");
      if (homeScrollPosition) {
        // Don't clear the position yet, we'll need it when going back
        return;
      }
    }
  }, [pathname]);

  return null;
}
