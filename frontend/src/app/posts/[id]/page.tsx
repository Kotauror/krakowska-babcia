"use client";

import { format } from "date-fns";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Post } from "@/types";
import { pl } from "date-fns/locale";
import { Mynerve } from "next/font/google";
import { processPostImages } from "@/utils/imageUtils";

const mynerve = Mynerve({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function PostPage({ }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DIRECTUS_URL}items/post/${postId}?fields=*,kategoria.kategoria_id.*`
        );
        const data = await response.json();
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
            className="md:text-sm text-xs inline-flex items-center text-black hover:text-gray-700 bg-white rounded-full px-4 py-2 shadow-lg"
          >
            <ArrowLeftIcon className="md:h-5 md:w-5 h-4 w-4 mr-2" />
            Powrót
          </button>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end md:p-8 p-4">
          <div className="container mx-auto max-w-4xl">
            <header
              className="rounded-lg md:p-8 p-4"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <h1 className={`md:text-4xl text-2xl font-bold text-graya-700 mb-4 ${mynerve.className}`}>
                {post.tytul}
              </h1>
              <div className="flex flex-row my-4">
                <div className="text-black flex flex-wrap">
                  {post.kategoria.map((kategoria, key) => (
                    <p
                      className="text-gray-500 md:text-[14px] text-[12px] border-1 border-gray-500 rounded-full px-2 py-1 mr-1 mb-1 bg-white"
                      key={key}
                    >
                      {kategoria.kategoria_id.nazwa}
                    </p>
                  ))}
                </div>
              </div>
              <div className="text-black md:text-sm text-xs">
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
                __html: processPostImages(post.tresc, 600, 400, 80),
              }}
            />
            {/* <ReactMarkdown>{post.tresc}</ReactMarkdown> */}
          </div>
        </article>
      </div>
    </main>
  );
}
