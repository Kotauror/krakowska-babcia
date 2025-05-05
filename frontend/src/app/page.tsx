"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { getPosts } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import type { Post } from "@/types/api";

function PostCard({ post }: { post: Post }) {
  const mainImage = post.images[0];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {mainImage && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={mainImage.file_path}
            alt={mainImage.alt_text}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {post.content.substring(0, 150)}...
        </p>
        <Link
          href={`/posts/${post.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: posts, loading, error } = useApi(getPosts);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Discover the World Through Stories
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Join me on a journey through fascinating destinations, local
            experiences, and unforgettable adventures.
          </p>
          <div className="mt-10">
            <Link
              href="/destinations"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
            >
              Explore Destinations
              <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Featured Stories
        </h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">
              Error loading stories. Please try again later.
            </p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No stories available yet. Check back soon!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
