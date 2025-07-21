"use client";

import { getPosts } from "@/lib/api";
import { useState, useEffect, Suspense } from "react";
import PostCard from "@/components/PostCard";
import { useSearchParams, useRouter } from "next/navigation";
import ContentWrapper from "@/components/ContentWrapper";
import FilterTag from "@/components/FilterTag";

const ALLOWED_TAGS = [
  "w góry",
  "nad wodę",
  "regionalna kultura",
  "w niepogodę",
  "budżetowo",
  "z nocowankiem",
  "dzieciaczkowy raj",
];

export default function Destinations() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}

function DestinationsContent() {
  // const searchParams = useSearchParams();
  const router = useRouter();
  // Get all tag params from URL
  // const initialTags = Array.from(searchParams.getAll("tag"));
  // const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  // Manual fetching of posts
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DIRECTUS_URL}items/post?fields=*,kategoria.kategoria_id.*`
        );
        const data = await response.json();
        console.log("!!", data);
        setPosts(data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  console.log(posts);
  // useEffect(() => {
  //   if (selectedTags.length === 0) {
  //     setPosts([]);
  //     setLoading(false);
  //     return;
  //   }
  //   setLoading(true);
  //   getPosts(selectedTags)
  //     .then(setPosts)
  //     .catch(setError)
  //     .finally(() => setLoading(false));
  // }, [selectedTags]);

  // // Keep URL in sync with selectedTags
  // useEffect(() => {
  //   const params = selectedTags
  //     .map((tag) => `tag=${encodeURIComponent(tag)}`)
  //     .join("&");
  //   router.replace(`/destinations${params ? `?${params}` : ""}`);
  //   // eslint-disable-next-line
  // }, [selectedTags]);

  // // Keep selectedTags in sync with URL (for back/forward navigation)
  // useEffect(() => {
  //   const urlTags = Array.from(searchParams.getAll("tag"));
  //   setSelectedTags(urlTags);
  //   // eslint-disable-next-line
  // }, [searchParams]);

  // const handleTagChange = (tag: string) => {
  //   setSelectedTags((prev) => {
  //     // If this is the last selected tag and the user is deselecting it, do nothing.
  //     if (prev.length === 1 && prev.includes(tag)) {
  //       return prev;
  //     }
  //     // Otherwise, toggle the tag as normal.
  //     return prev.includes(tag)
  //       ? prev.filter((t) => t !== tag)
  //       : [...prev, tag];
  //   });
  // };

  return (
    <ContentWrapper
      header="Wycieczki"
      subheader="Znajdź idealną wycieczkę dla siebie i swoich bliskich:"
    >
      {/* <div className="flex flex-wrap justify-center sticky bg-light-background md:text-xl text-sm">
          {ALLOWED_TAGS.map((tag) => (
            <FilterTag
              key={tag}
              name={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => handleTagChange(tag)}
            />
          ))}
        </div> */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 md:pl-24 md:pr-24 pl-8 pr-8 ">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No destinations available yet. Check back soon!
          </p>
        </div>
      )}
    </ContentWrapper>
  );
}
