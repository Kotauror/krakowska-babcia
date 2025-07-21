"use client";

import { format } from "date-fns";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Post } from "@/types";
import { pl } from "date-fns/locale";

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log(postId);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DIRECTUS_URL}items/post/${postId}?fields=*,kategoria.kategoria_id.*`
        );
        const data = await response.json();
        console.log(data);
        setPost(data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Error loading post. Please try again later.
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Post not found.</p>
      </div>
    );
  }

  return (
    <main>
      {/* Hero section with background image - full width */}
      <div
        className="relative h-130 w-full"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${post.zdjecie_glowne})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Back button */}
        <div className="absolute top-0 left-0 z-20 p-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center text-black hover:text-gray-700 bg-white rounded-full px-4 py-2 shadow-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Powrót
          </button>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
          <div className="container mx-auto max-w-4xl">
            <header
              className="rounded-lg p-8"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <h1 className="text-4xl font-bold text-gray-700 mb-4">
                {post.tytul}
              </h1>
              <div className="flex flex-row my-4">
                <div className="text-black">
                  {post.kategoria.map((kategoria, key) => (
                    <span
                      className="text-gray-500 text-[12px] border-1 border-gray-500 rounded-full px-2 py-1 mr-2 my-1 bg-white"
                      key={key}
                    >
                      {kategoria.kategoria_id.nazwa}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-black">
                <p>
                  {format(new Date(post.date_created), "d MMMM yyyy", {
                    locale: pl,
                  })}
                </p>
              </div>
            </header>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: post.tresc,
              }}
            />
            {/* <ReactMarkdown>{post.tresc}</ReactMarkdown> */}
          </div>
        </article>
      </div>
    </main>
  );
}
