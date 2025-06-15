"use client";

import { getPosts } from "@/lib/api";
import { useApi } from "@/hooks/useApi";

import PostCard from "@/components/PostCard";

function FilterTag({ name }: { name: string }) {
  return (
    <div className="bg-light-brick-orange border-1 border-gray-500 mx-2 my-1 md:px-4 px-2 py-1 rounded-md">
      {name}
    </div>
  );
}

export default function Destinations() {
  const { data: posts, loading, error } = useApi(getPosts);

  return (
    <div className="pt-12 space-y-8 bg-orange-gray md:pl-12 md:pr-12 pl-8 pr-8 min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Wycieczki</h1>
      </div>

      {/* <div> */}
      <div className="flex flex-wrap justify-center sticky top-20 bg-orange-gray md:text-xl text-s p-2">
        <FilterTag name="w góry" />
        <FilterTag name="nad wodę" />
        <FilterTag name="z regionalną kulturą" />
        <FilterTag name="w niepogodę" />
        <FilterTag name="budżetowo" />
        <FilterTag name="z nocowankiem" />
        <FilterTag name="dzieciaczkowy raj" />
      </div>
      {/* </div> */}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading destinations...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">
            Error loading destinations. Please try again later.
          </p>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No destinations available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
