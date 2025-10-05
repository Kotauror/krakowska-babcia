import { Post } from "@/types";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { htmlToText } from "html-to-text";
import { Annie_Use_Your_Telescope } from "next/font/google";

// function removeImagesFromMarkdown(content: string): string {
//   return content.replace(/!\[.*?\]\(.*?\)/g, "");
// }

function truncateText(
  text: string,
  maxWords: number,
  suffix: string = "..."
): string {
  if (!text) return "";

  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(" ") + suffix;
}
function slugify(text: string) {
  return text && text.toLowerCase().replace(/ /g, "-");
}

const options = {
  selectors: [
    { selector: "img", format: "skip" }, // Skip image tags completely
    { selector: "script", format: "skip" }, // Also skip scripts
    { selector: "style", format: "skip" }, // And styles
  ],
};

const annie_use_your_telescope = Annie_Use_Your_Telescope({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

function SinglePostCard({ post }: { post: Post }) {
  return (
    <section className="bg-[#f3f5f7] mb-12 containe mx-autor grid grid-cols-1 md:grid-cols-2 justify-between">
      <div className="gap-8 p-8 md:p-16">
        <h2 className={`text-4xl font-bold mb-6 ${annie_use_your_telescope.className}`}>Najnowszy Wpis</h2>
        <div>
          <div className="text-2xl font-bold mb-2">{post.tytul}</div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            <div className="text-lg my-1">{post.lokalizacja}</div>
          </div>
          <div className="flex items-center flex-wrap my-2">
            {post.kategoria.map((kategoria) => (
              <div
                key={kategoria.kategoria_id.nazwa}
                className="text-sm text-gray-600 border-1 rounded-full px-4 m-1 text-black"
              >
                {kategoria.kategoria_id.nazwa}
              </div>
            ))}
          </div>

          <div className="items-stretch rounded-lg overflow-hidden">
            <div className="flex flex-col justify-between">
              <div>
                {htmlToText(truncateText(post.tresc, 50), options)}
              </div>
                <Link
                  href={`/posts/${slugify(post.tytul)}?id=${post.id}`}
                  className="mt-4 w-fit"
                >
                  <div   className="text-sm text-gray-600 py-2 hover:cursor-pointer rounded-full px-4 bg-[#215a80] text-white">
                    Czytaj więcej...
                  </div>
                </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className="h-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${post.zdjecie_glowne})`,
          }}
        >
          {/* <img
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${post.zdjecie_glowne}`}
            alt={post.tytul}
            className="max-h-70 p-2 object-cover"
            // onError={() => setImageError(true)}
          /> */}
        </div>
      </div>
    </section>
  );
}

export default SinglePostCard;
