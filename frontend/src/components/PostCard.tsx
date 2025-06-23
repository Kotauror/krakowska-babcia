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

function PostCard({ post }: { post: Post }) {
  const firstImageUrl = extractFirstImageUrl(post.content);
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/posts/${post.slug}`} className="mt-4">
      <article className="bg-white rounded-lg shadow-lg overflow-hidden border-1 border-gray-400">
        <div className="w-[300px] h-[200px] mx-auto overflow-hidden mt-4">
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
          <h3 className="text-xl font-bold mb-1">{post.title}</h3>
          <div>
            <div className="flex flex-row">
              <img
                src="/transparent-marker.png"
                alt="Destination icon"
                className="w-4 h-4 mr-1"
              />
              <span className="text-gray-500 text-m">{post.destination}</span>
            </div>
            <div className="flex flex-wrap">
              {post.tags.map((tag, key) => (
                <span
                  className="text-gray-500 text-sm border-1 border-gray-500 rounded-full px-2 py-1 mr-1 my-1"
                  key={key}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="text-gray-400 m1-4 text-xs">
              <p>
                {" "}
                {format(new Date(post.created_at), "d MMMM yyyy", {
                  locale: pl,
                })}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

PostCard.defaultProps = {
  variant: "compact",
};

export default PostCard;
