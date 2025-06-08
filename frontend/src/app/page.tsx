"use client";
import Banner from "@/components/Banner";
import FeaturedPostsCarousel from "@/components/FeaturedPostsCarousel";
import SinglePostCard from "@/components/SinglePostCard";
import { getPosts } from "@/lib/api";
import { Post } from "@/types";
import { useApi } from "@/hooks/useApi";
import { useEffect } from "react";
import { useFeaturedPosts } from "@/hooks/useFeaturedPosts";
import PostCard from "@/components/PostCard";

async function getLatestPost() {
  const response = await fetch("http://localhost:8000/api/v1/posts/latest");
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
      <main className="mx-auto py-8 mt-4">
        {/* Featured Posts Section */}
        {featuredPosts && featuredPosts.length > 0 && (
          <div className="mb-12 bg-olive-green p-8">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
