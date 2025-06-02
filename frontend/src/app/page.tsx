"use client";

import { useFeaturedPosts } from "@/hooks/useFeaturedPosts";
import { useApi } from "@/hooks/useApi";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import { Post } from "@/types";
import Banner from "@/components/Banner";
import { useEffect, useState } from "react";

async function getPosts() {
  const response = await fetch("http://localhost:8000/api/v1/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

// Function to extract first image URL from markdown content
function extractFirstImageUrl(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
}

export function PostCard({ post }: { post: Post }) {
  const handleClick = () => {
    console.log("in handle click", window.scrollY.toString());
    sessionStorage.setItem("homeScrollPosition", window.scrollY.toString());
  };

  const firstImageUrl = extractFirstImageUrl(post.content);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/posts/${post.slug}`}
      onClick={handleClick}
      className="mt-4 inline-block"
    >
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-[400px] h-[300px] mx-auto overflow-hidden">
          {firstImageUrl && !imageError ? (
            <img
              src={firstImageUrl}
              alt={post.title}
              className="w-full h-full object-cover object-center"
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src="/icon.png"
              alt="Default icon"
              className="w-full h-full object-contain p-4"
            />
          )}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">
            <Link
              href={`/posts/${post.slug}`}
              onClick={handleClick}
              className="hover:text-orange-600"
            >
              {post.title}
            </Link>
          </h3>
          <div className="text-gray-600 mb-4">
            <p>
              {" "}
              {format(new Date(post.created_at), "d MMMM yyyy", {
                locale: pl,
              })}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Home() {
  const { data: posts, loading, error } = useApi<Post[]>(getPosts);
  const { data: featuredPosts, isLoading: isFeaturedLoading } =
    useFeaturedPosts();

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
      <main className="container mx-auto py-8">
        {/* Featured Posts Section */}
        {featuredPosts && featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Ulubione Miejsca</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((featured) => (
                <PostCard key={featured.id} post={featured.post} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold mb-6">Ostatnie Wpisy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts?.map((post: Post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
