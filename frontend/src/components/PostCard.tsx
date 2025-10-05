import Link from "next/link";
import { Post } from "@/types";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

function slugify(text: string) {
  return text && text.toLowerCase().replace(/ /g, "-");
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${slugify(post.tytul)}?id=${post.id}`} className="mt-4">
      <article className="min-h-[400px] bg-white rounded-lg shadow-lg overflow-hidden border-1 border-gray-400 hover:scale-105 transition-all duration-300 relative">
        <div className="mx-auto overflow-hidden h-[200px]">
          <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${post.zdjecie_glowne}`}
            // alt={post.title}
            className="w-full h-full object-cover object-center"
            // onError={() => setImageError(true)}
          />
        </div>
        <div className="p-6 flex flex-col h-full">
          <div className="flex-grow">
            <h3 className="text-xl font-bold mb-1">{post.tytul}</h3>
            <div className="flex flex-row my-2">
              <img
                src="/transparent-marker.png"
                alt="Destination icon"
                className="w-4 h-6 mr-1"
              />
              <span className="text-gray-500 text-m">{post.lokalizacja}</span>
            </div>
            <div className="flex flex-wrap my-2">
              {post.kategoria.map((kategoria, key) => (
                <span
                  className="text-gray-500 text-[12px] border-1 border-gray-500 rounded-full px-2 py-1 mr-2 my-1"
                  key={key}
                >
                  {kategoria.kategoria_id.nazwa}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-6 right-6 text-gray-400 text-xs">
          <p>
            {format(new Date(post.date_created), "d MMMM yyyy", {
              locale: pl,
            })}
          </p>
        </div>
      </article>
    </Link>
  );
}

PostCard.defaultProps = {
  variant: "compact",
};

export default PostCard;
