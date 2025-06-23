"use client";
import Banner from "@/components/Banner";
import FeaturedPostsCarousel from "@/components/FeaturedPostsCarousel";
import SinglePostCard from "@/components/SinglePostCard";
import { getPosts } from "@/lib/api";
import { Post } from "@/types";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { useFeaturedPosts } from "@/hooks/useFeaturedPosts";
import PostCard from "@/components/PostCard";
import { useRouter } from "next/navigation";

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
  const response = await fetch(`${process.env.NEXT_PUBLIC_BABCIA_API}/api/v1/posts/latest`);
  if (!response.ok) {
    throw new Error("Failed to fetch latest post");
  }
  return response.json();
}

export default function Home() {
  const { data: latestPost, loading, error } = useApi<Post>(getLatestPost);
  const { data: featuredPosts, isLoading: isFeaturedLoading } =
    useFeaturedPosts();
  const { data: posts, isLoading: isPostsLoading } = useApi<Post[]>(getPosts);
  const router = useRouter();
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  useEffect(() => {
    console.log("in use effect");
    // Restore scroll position when component mounts
    const savedPosition = sessionStorage.getItem("homeScrollPosition");
    console.log("savedPosition", savedPosition);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
      // Clear the saved position after restoring
      // sessionStorage.removeItem("homeScrollPosition");
    }
  }, [latestPost]);

  useEffect(() => {
    console.log("posts", posts);
  }, [posts]);

  if (loading || isFeaturedLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
            <button
              className="bg-light-brick-orange border-1 border-gray-500 mx-2 my-1 md:px-4 px-2 py-1 rounded-md hover:bg-orange-300"
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
                  <PostCard key={post.slug} post={post} variant="detailed" />
                ))}
              {isPostsLoading && (
                <div className="col-span-3">
                  <div className="animate-pulse h-full w-full bg-gray-200 rounded-lg"></div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
