import Link from "next/link";
import { Post } from "@/types";
// import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

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
      <article className="rounded-lg shadow-lg overflow-hidden border-1 border-gray-400 hover:scale-105 transition-all duration-300 bg-[#fff6e7]">
        <div className="w-[300px] h-[200px] mx-auto overflow-hidden">
          {/* {firstImageUrl && !imageError ? ( */}
            <img
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${post.zdjecie_glowne}`}
              alt={post.tytul}
              className="w-full h-full object-cover object-center"
              // onError={() => setImageError(true)}
            />
          {/* ) : ( */}
            {/* <img
              src="/icon.png"
              alt="Default icon"
              className="w-full h-full object-contain p-4"
            /> */}
          {/* )} */}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{post.tytul}</h3>
          <div className="text-gray-600 mb-4 text-sm">
            <p>
              {" "}
              {format(new Date(post.date_created), "d MMMM yyyy", {
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
