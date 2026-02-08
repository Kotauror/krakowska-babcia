import { Post } from "@/types";
import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { htmlToText } from "html-to-text";
import { Fuzzy_Bubbles } from "next/font/google";

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

const fuzzy_bubbles = Fuzzy_Bubbles({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

function SinglePostCard({ post }: { post: Post }) {
  return (
    <section className="bg-[#f3f5f7] containe mx-autor grid grid-cols-1 md:grid-cols-2 justify-between px-4 md:px-64">
      <div className="gap-8 py-8">
        <h2 className={`md:text-4xl text-2xl font-bold mb-6 ${fuzzy_bubbles.className}`}>Najnowszy Wpis</h2>
        <div>
          <div className="md:text-2xl text-xl font-bold mb-2">{post.tytul}</div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            <div className="md:text-lg text-base my-1">{post.lokalizacja}</div>
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
      <div className="py-8 relative">
        <div
          className="h-full w-full flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg border-4 border-[#215a80] relative"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${post.zdjecie_glowne})`,
            minHeight: '300px'
          }}
        >
          {/* Child-like tape stickers in corners */}
          {/* Top-left tape */}
          <div className="absolute -top-2 -left-2 w-16 h-8 bg-[#ffdaa9] opacity-90 transform -rotate-12 shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}></div>
          {/* Top-right tape */}
          <div className="absolute -top-2 -right-2 w-16 h-8 bg-[#b8b257] opacity-90 transform rotate-12 shadow-md" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}></div>
          {/* Bottom-left tape */}
          <div className="absolute -bottom-2 -left-2 w-16 h-8 bg-[#215a80] opacity-90 transform rotate-12 shadow-md" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}></div>
          {/* Bottom-right tape */}
          <div className="absolute -bottom-2 -right-2 w-16 h-8 bg-[#ffdaa9] opacity-90 transform -rotate-12 shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}></div>
        </div>
      </div>
    </section>
  );
}

export default SinglePostCard;
