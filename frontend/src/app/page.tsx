"use client";
import Banner from "@/components/Banner";
import FeaturedPostsCarousel from "@/components/FeaturedPostsCarousel";
import SinglePostCard from "@/components/SinglePostCard";
import { Post } from "@/types";
import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { useFeaturedPosts } from "@/hooks/useFeaturedPosts";
import PostCard from "@/components/PostCard";
import { useRouter } from "next/navigation";
import { usePosts } from "@/hooks/usePosts";
const ALLOWED_TAGS = [
  "w góry",
  "nad wodę",
  "regionalna kultura",
  "w niepogodę",
  "budżetowo",
  "z nocowankiem",
  "dzieciaczkowy raj",
];

async function getLatestPost() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BABCIA_API}/api/v1/posts/latest`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch latest post");
  }
  return response.json();
}

export default function Home() {
  const { data: latestPost } = useApi<Post>(getLatestPost);
  const {
    data: featuredPosts,
    isLoading: isFeaturedLoading,
    isError: isFeaturedError,
  } = useFeaturedPosts();
  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = usePosts();
  const router = useRouter();
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  return (
    <div>
      <Banner />
      {/* Tag Filter Bar */}
      <div className="flex flex-wrap justify-center gap-2 my-4 relative">
        {ALLOWED_TAGS.map((tag) => (
          <div key={tag} className="relative flex flex-col items-center">
            {tag === "nad wodę" && hoveredTag === tag && (
              <img
                src="/fish-jump.gif"
                alt="fish jump"
                className="w-16 h-16 absolute -top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                style={{}}
              />
            )}
            {tag === "w niepogodę" && hoveredTag === tag && (
              <img
                src="/rain.gif"
                alt="rain"
                className="w-16 h-16 absolute -top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              />
            )}
            <button
              className="bg-custom-dark-green text-white md:mx-2 my-1 md:px-4 px-3 py-2 text-sm md:text-base rounded-full hover:bg-custom-straw hover:text-black hover:cursor-pointer"
              onClick={() =>
                router.push(`/destinations?tag=${encodeURIComponent(tag)}`)
              }
              onMouseEnter={() => setHoveredTag(tag)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {tag}
            </button>
          </div>
        ))}
      </div>
      <main className="mx-auto py-8 mt-4">
        {/* Featured Posts Section */}
        {isFeaturedLoading && (
          <div className="container mx-auto">Pobieram ulubione miejsca...</div>
        )}
        {isFeaturedError && (
          <div className="container mx-auto">
            Błąd ładowania ulubionych miejsc.
          </div>
        )}
        {featuredPosts && featuredPosts.length > 0 && (
          <div className="mb-12 bg-dirty-olive-green py-8 px-4">
            <section className="container mx-auto">
              <h2 className="text-3xl font-bold mb-6">Ulubione Miejsca</h2>

              <FeaturedPostsCarousel posts={featuredPosts.map((f) => f.post)} />
            </section>
          </div>
        )}
        <div className="container mx-auto">
          <section className="p-8 bg-light-brick-orange mb-12">
            <h2 className="text-3xl font-bold mb-6">Ostatni Wpis</h2>
            <div className="gap-8">
              {latestPost && <SinglePostCard post={latestPost} />}
            </div>
          </section>

          <section className="p-8 bg-gray-50">
            <h2 className="text-3xl font-bold mb-6">Wycieczki</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
              {posts
                ?.filter((post) => post.id !== latestPost?.id)
                .map((post: Post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              {isPostsLoading && (
                <div className="col-span-3">
                  <div className="animate-pulse h-full w-full bg-gray-200 rounded-lg"></div>
                </div>
              )}
              {isPostsError && (
                <div className="col-span-3">
                  <div className="text-red-500">Błąd ładowania wpisów.</div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
