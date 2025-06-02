"use client";

import { Post } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { PostCard } from "@/app/page";

interface FeaturedPostsCarouselProps {
  posts: Post[];
}

export default function FeaturedPostsCarousel({
  posts,
}: FeaturedPostsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

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
            <div key={post.id} className="p-2">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
      <button
        className="bg-orange-300 absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        className="bg-orange-300 absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
