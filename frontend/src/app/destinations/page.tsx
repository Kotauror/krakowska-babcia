"use client";

import { getPosts } from "@/lib/api";
import { useState, useEffect, Suspense } from "react";
import PostCard from "@/components/PostCard";
import { useSearchParams, useRouter } from "next/navigation";

const ALLOWED_TAGS = [
  "w góry",
  "nad wodę",
  "regionalna kultura",
  "w niepogodę",
  "budżetowo",
  "z nocowankiem",
  "dzieciaczkowy raj",
];

function FilterTag({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`mx-2 my-1 md:px-4 px-2 py-1 rounded-md border-1 border-gray-500 ${selected ? "bg-orange-400 text-white" : "bg-light-brick-orange"
        }`}
      onClick={onClick}
      type="button"
    >
      {name}
    </button>
  );
}

export default function Destinations() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}


function DestinationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Get all tag params from URL
  const initialTags = Array.from(searchParams.getAll("tag"));
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  // Manual fetching of posts
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    getPosts(selectedTags.length > 0 ? selectedTags : undefined)
      .then(setPosts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [selectedTags]);

  // Keep URL in sync with selectedTags
  useEffect(() => {
    const params = selectedTags
      .map((tag) => `tag=${encodeURIComponent(tag)}`)
      .join("&");
    router.replace(`/destinations${params ? `?${params}` : ""}`);
    // eslint-disable-next-line
  }, [selectedTags]);

  // Keep selectedTags in sync with URL (for back/forward navigation)
  useEffect(() => {
    const urlTags = Array.from(searchParams.getAll("tag"));
    setSelectedTags(urlTags);
    // eslint-disable-next-line
  }, [searchParams]);

  return (
    <div className="pt-12 space-y-8 bg-orange-gray md:pl-12 md:pr-12 pl-8 pr-8 min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Wycieczki</h1>
      </div>

      {/* <div> */}
      <div className="flex flex-wrap justify-center sticky top-20 bg-orange-gray md:text-xl text-s p-2">
        {ALLOWED_TAGS.map((tag) => (
          <FilterTag
            key={tag}
            name={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => {
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag]
              );
            }}
          />
        ))}
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