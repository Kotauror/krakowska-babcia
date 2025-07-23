"use client";
import Banner from "@/components/Banner";
import FeaturedPostsCarousel from "@/components/FeaturedPostsCarousel";
import SinglePostCard from "@/components/SinglePostCard";
import { Post } from "@/types";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { useFeaturedPosts } from "@/hooks/useFeaturedPosts";
import PostCard from "@/components/PostCard";
import { useRouter } from "next/navigation";
import { usePosts } from "@/hooks/usePosts";
import FilterTag from "@/components/FilterTag";
import Link from "next/link";
// const ALLOWED_TAGS = [
//   "w góry",
//   "nad wodę",
//   "regionalna kultura",
//   "w niepogodę",
//   "budżetowo",
//   "z nocowankiem",
//   "dzieciaczkowy raj",
// ];

// async function getLatestPost() {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BABCIA_API}/api/v1/posts/latest`
//   );
//   if (!response.ok) {
//     throw new Error("Failed to fetch latest post");
//   }
//   return response.json();
// }

export default function Home() {
  // const { data: latestPost } = useApi<Post>(getLatestPost);
  // const {
  //   data: featuredPosts,
  //   isLoading: isFeaturedLoading,
  //   isError: isFeaturedError,
  // } = useFeaturedPosts();
  // const {
  //   data: posts,
  //   isLoading: isPostsLoading,
  //   isError: isPostsError,
  // } = usePosts();
  const router = useRouter();
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async (selectedCats: string[] = []) => {
      try {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}items/post?fields=*,kategoria.kategoria_id.*`;

        // Add filter if categories are selected
        if (
          selectedCats.length > 0 &&
          selectedCats.length < categories.length
        ) {
          const categoryIds = selectedCats
            .map((catName) => {
              const category = categories.find((c) => c.nazwa === catName);
              return category?.id;
            })
            .filter(Boolean);

          if (categoryIds.length > 0) {
            url += `&filter[kategoria][kategoria_id][_in]=${categoryIds.join(
              ","
            )}`;
          }
        }

        const response = await fetch(url);
        const data = await response.json();

        console.log(data.data);
        setPosts(data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DIRECTUS_URL}items/kategoria`
        );
        const data = await response.json();
        setCategories(data.data);
        // Initially select all categories
        setSelectedCategories(data.data.map((cat: any) => cat.nazwa));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchPosts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        // Don't allow deselecting the last category
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((cat) => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  console.log(posts);
  return (
    <div>
      <Banner />
      {/* Tag Filter Bar */}
      <div className="flex flex-wrap justify-center sticky bg-light-background md:text-xl text-sm">
        <Link href="/wycieczki">
        <button className="bg-[#215a80] text-white px-8 py-2 rounded-full mt-8 hover:cursor-pointer hover:bg-[#27377d]">
          Znajdź swoją wycieczkę
        </button>
        </Link>
        {/* {categories.map((category) => (
          <FilterTag
            showCheckbox={false}
            key={category.id}
            name={category.nazwa}
            selected={selectedCategories.includes(category.nazwa)}
            onClick={() => router.push(`/wycieczki`)}
          />
        ))} */}
      </div>

      {/* <div className="flex flex-wrap justify-center gap-2 my-4 relative">
        {ALLOWED_TAGS.map((tag) => (
          <div key={tag} className="relative flex flex-col items-center">
            {tag === "nad wodę" && hoveredTag === tag && (
              <img
                src="/fish-jump.gif"
                alt="fish jump"
                className="w-16 h-16 absolute -top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                style={{}}
              />
            )}
            {tag === "w niepogodę" && hoveredTag === tag && (
              <img
                src="/rain.gif"
                alt="rain"
                className="w-16 h-16 absolute -top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              />
            )}
            <button
              className="bg-[#b9cbf6] text-[#27377d] md:mx-2 my-1 md:px-4 px-3 py-2 text-sm md:text-base rounded-full hover:bg-custom-straw hover:text-black hover:cursor-pointer"
              onClick={() =>
                router.push(`/destinations?tag=${encodeURIComponent(tag)}`)
              }
              onMouseEnter={() => setHoveredTag(tag)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          </div>
        ))}
      </div> */}
      <main className="mx-auto py-8 mt-4">
        {/* Featured Posts Section */}
        {/* {isFeaturedLoading && (
          <div className="container mx-auto">Pobieram ulubione miejsca...</div>
        )}
        {isFeaturedError && (
          <div className="container mx-auto">
            Błąd ładowania ulubionych miejsc.
          </div>
        )}
        {featuredPosts && featuredPosts.length > 0 && (
          <div className="mb-12 bg-dirty-olive-green py-8 px-4">
            <section className="container mx-auto">
              <h2 className="text-3xl font-bold mb-6">Ulubione Miejsca</h2>

              <FeaturedPostsCarousel posts={featuredPosts.map((f) => f.post)} />
            </section>
          </div>
        )} */}
        <div className="mx-auto">
          {posts &&
            posts.length > 0 &&
            // <section className="md:p-16 p-8 bg-light-brick-orange mb-12 containe mx-autor">
            //   <h2 className="text-3xl font-bold mb-6">Najnowszy Wpis</h2>
            //   <div className="gap-8">
            posts && (
              <SinglePostCard post={posts[0]} />
              //   </div>
              // </section>
            )}

          <section className="p-8 bg-gray-50">
            <h2 className="text-3xl font-bold mb-6">Wycieczki</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
              {posts
                ?.filter((post) => post.id !== "111122")
                .map((post: Post) => (
                  <PostCard key={post.tytul} post={post} />
                ))}
              {loading && (
                <div className="col-span-3">
                  <div className="animate-pulse h-full w-full bg-gray-200 rounded-lg"></div>
                </div>
              )}
              {error && (
                <div className="col-span-3">
                  <div className="text-red-500">Błąd ładowania wpisów.</div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
