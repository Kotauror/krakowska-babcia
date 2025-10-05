import Link from "next/link";
import { Post } from "@/types";
// import { useState } from "react";

function slugify(text: string) {
  return text && text.toLowerCase().replace(/ /g, "-");
}

// // Function to extract first image URL from markdown content
// function extractFirstImageUrl(content: string): string | null {
//   const imageRegex = /!\[.*?\]\((.*?)\)/;
//   const match = content.match(imageRegex);
//   return match ? match[1] : null;
// }

function FavouritesCard({ post }: { post: Post }) {
  // const firstImageUrl = extractFirstImageUrl(post.content);
  // const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/posts/${slugify(post.tytul)}?id=${post.id}`} className="mt-4 inline-block">
      <article className="rounded-lg shadow-lg overflow-hidden border-1 border-gray-300 hover:scale-105 transition-all duration-300 bg-[#fff6e7] h-[300px] flex flex-col">
        <div className="w-[300px] h-[200px] mx-auto overflow-hidden flex-shrink-0">
          <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${post.zdjecie_glowne}`}
            alt={post.tytul}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="p-6 flex flex-col justify-center items-center text-center flex-grow">
          <h3 className="md:text-lg text-base mb-2 leading-tight line-clamp-2 overflow-hidden">{post.tytul}</h3>
          <div className="text-gray-600 mb-4 text-sm">
          </div>
        </div>
      </article>
    </Link>
  );
}

export default FavouritesCard;
