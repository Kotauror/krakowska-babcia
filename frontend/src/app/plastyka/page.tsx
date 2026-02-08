"use client";

import { useState, useEffect, Suspense } from "react";
import PostCard from "@/components/PostCard";
import ContentWrapper from "@/components/ContentWrapper";

export default function Plastyka() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlastykaContent />
    </Suspense>
  );
}

function PlastykaContent() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}items/post?fields=*,kategoria.kategoria_id.*&sort=-date_created`;

        const response = await fetch(url);
        const data = await response.json();

        // Filter posts with "plastyka" tag
        const plastykaPosts = data.data.filter((post: any) => {
          return post.kategoria?.some(
            (kat: any) => kat.kategoria_id?.nazwa === "plastyka"
          );
        });

        setPosts(plastykaPosts);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <ContentWrapper
      header="Plastyka"
      subheader="Na dni kiedy nie chce się wyjść z domu"
    >
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">
            Błąd ładowania wpisów. Spróbuj ponownie później.
          </p>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 md:pl-12 md:pr-12 pl-2 pr-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            W tej kategorii jeszcze nic nie ma, ale będzie!
          </p>
        </div>
      )}
    </ContentWrapper>
  );
}
