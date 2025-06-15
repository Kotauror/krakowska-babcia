import { Post } from "@/types";
import { pl } from "date-fns/locale";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

function extractFirstImageUrl(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
}

function removeImagesFromMarkdown(content: string): string {
  return content.replace(/!\[.*?\]\(.*?\)/g, "");
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

function SinglePostCard({ post }: { post: Post }) {
  const handleClick = () => {
    console.log("in handle click", window.scrollY.toString());
    sessionStorage.setItem("homeScrollPosition", window.scrollY.toString());
  };

  const firstImageUrl = extractFirstImageUrl(post.content);
  const [imageError, setImageError] = useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-between">
      <div>
        <div className="text-2xl font-bold mb-2">{post.title}</div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          <div className="text-xl font-bold mb-0">{post.destination}</div>
        </div>
        <div className="flex items-center gap-2">
          {post.tags.map((tag) => (
            <div
              key={tag.name}
              className="text-sm text-gray-600 border-1 rounded px-2 m-2 text-black"
            >
              {tag.name}
            </div>
          ))}
        </div>

        <p className="text-gray-600 mb-4">
          {format(new Date(post.created_at), "d MMMM yyyy", {
            locale: pl,
          })}
        </p>
        <div className="items-stretch rounded-lg overflow-hidden">
          <div className="flex flex-col justify-between">
            <div>
              {/* <ReactMarkdown> */}
              {truncateText(removeImagesFromMarkdown(post.content), 800)}
              {/* </ReactMarkdown> */}
              <Link
                href={`/posts/${post.slug}`}
                onClick={handleClick}
                className="mt-4 inline-block w-full"
              >
                <div className="text-sm text-gray-600 py-2">Read more</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white flex items-center justify-center">
          {firstImageUrl && !imageError ? (
            <img
              src={firstImageUrl}
              alt={post.title}
              className="max-h-100 p-2"
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src="/icon.png"
              alt="Default icon"
              className="max-w-full max-h-150 object-contain p-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePostCard;
