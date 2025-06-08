import { Post } from "@/types";
import { pl } from "date-fns/locale";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { MapPinIcon } from "@heroicons/react/24/outline";

function extractFirstImageUrl(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
}

function removeImagesFromMarkdown(content: string): string {
  return content.replace(/!\[.*?\]\(.*?\)/g, "");
}

function SinglePostCard({ post }: { post: Post }) {
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
      className="mt-4 inline-block w-full"
    >
      <div className="text-2xl font-bold mb-2">{post.title}</div>
      <div className="flex items-center gap-2">
        <MapPinIcon className="h-5 w-5" />
        <div className="text-xl font-bold mb-0">{post.destination}</div>
      </div>

      <p className="text-gray-600 mb-4">
        {format(new Date(post.created_at), "d MMMM yyyy", {
          locale: pl,
        })}
      </p>
      <div className="grid md:grid-cols-2 items-stretch rounded-lg overflow-hidden">
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="max-h-90">
              <ReactMarkdown>
                {removeImagesFromMarkdown(post.content)}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {firstImageUrl && !imageError ? (
            <img
              src={firstImageUrl}
              alt={post.title}
              className="max-w-full max-h-96 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src="/icon.png"
              alt="Default icon"
              className="max-w-full max-h-96 object-contain p-4"
            />
          )}
        </div>
      </div>
    </Link>
  );
}

export default SinglePostCard;
