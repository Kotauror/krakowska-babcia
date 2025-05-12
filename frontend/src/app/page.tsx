"use client";

import { useFeaturedPosts } from "@/hooks/useFeaturedPosts";
import { useApi } from "@/hooks/useApi";
import { format } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Post } from "@/types";
import Banner from "@/components/Banner";

async function getPosts() {
  const response = await fetch("http://localhost:8000/api/v1/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      {post.content_images?.[0]?.url && (
        <img
          src={post.content_images[0].url}
          alt={post.content_images[0].alt_text || post.title}
          className="w-full h-64 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">
          <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        <div className="text-gray-600 mb-4">
          {/* <p>By {post.author.username}</p> */}
          <p>{format(new Date(post.created_at), "MMMM d, yyyy")}</p>
        </div>
        <div className="prose prose-sm max-w-none line-clamp-3">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        <Link
          href={`/posts/${post.id}`}
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}

export default function Home() {
  const { data: posts, loading, error } = useApi(getPosts);
  const { data: featuredPosts, isLoading: isFeaturedLoading } =
    useFeaturedPosts();

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

        {/* Latest Posts Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Ostatnie Wpisy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts?.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
