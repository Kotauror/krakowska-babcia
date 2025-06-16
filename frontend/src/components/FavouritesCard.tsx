import Link from "next/link";
import { Post } from "@/types";
import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

// Function to extract first image URL from markdown content
function extractFirstImageUrl(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : null;
}

function FavouritesCard({ post }: { post: Post }) {
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
      className="mt-4 inline-block"
    >
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-[300px] h-[200px] mx-auto overflow-hidden">
          {firstImageUrl && !imageError ? (
            <img
              src={firstImageUrl}
              alt={post.title}
              className="w-full h-full object-cover object-center"
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src="/icon.png"
              alt="Default icon"
              className="w-full h-full object-contain p-4"
            />
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">
            <Link
              href={`/posts/${post.slug}`}
              onClick={handleClick}
              className="hover:text-orange-600"
            >
              {post.destination}
            </Link>
          </h3>
          <div className="text-gray-600 mb-4 text-sm">
            <p>
              {" "}
              {format(new Date(post.created_at), "d MMMM yyyy", {
                locale: pl,
              })}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default FavouritesCard;
