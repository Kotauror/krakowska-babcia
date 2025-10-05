"use client";

import { Post } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import FavouritesCard from "./FavouritesCard";
interface FeaturedPostsCarouselProps {
  posts: Post[];
}

export default function FeaturedPostsCarousel({
  posts,
}: FeaturedPostsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [leftBtnHover, setLeftBtnHover] = useState(false);
  const [rightBtnHover, setRightBtnHover] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {posts.map((post) => (
            <div key={post.id} className="p-1 md:p-3">
              <FavouritesCard post={post} />
            </div>
          ))}
        </div>
      </div>
      <button
        className={`bg-[#215a80] absolute left-[-10px] top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg disabled:invisible disabled:cursor-not-allowed md:block hidden ${leftBtnHover ? "bg-white text-[#215a80]" : "bg-[#215a80] text-white"}`}
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        onMouseEnter={() => setLeftBtnHover(true)}
        onMouseLeave={() => setLeftBtnHover(false)}
      >
        <ChevronLeftIcon className="md:h-8 md:w-8 h-6 w-6" />
      </button>
      <button
        className={`bg-[#215a80] absolute right-[-10px] top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg disabled:invisible disabled:cursor-not-allowed md:block hidden ${rightBtnHover ? "bg-white text-[#215a80]" : "bg-[#215a80] text-white"}`}
        onClick={scrollNext}
        onMouseEnter={() => setRightBtnHover(true)}
        onMouseLeave={() => setRightBtnHover(false)}
        disabled={!nextBtnEnabled}
      >
        <ChevronRightIcon className="md:h-8 md:w-8 h-6 w-6" />
      </button>
    </div>
  );
}
