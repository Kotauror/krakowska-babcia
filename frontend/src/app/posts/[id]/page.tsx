"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", params.id],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${params.id}`);
      return data;
    },
  });

  if (isLoading) {
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
    <main className="container mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Powrót
      </button>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="text-gray-600">
            <p>{format(new Date(post.created_at), "MMMM d, yyyy")}</p>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
