"use client";

import { useState, useEffect, Suspense } from "react";
import PostCard from "@/components/PostCard";
import ContentWrapper from "@/components/ContentWrapper";
import FilterTag from "@/components/FilterTag";

export default function Destinations() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}

function DestinationsContent() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  // Fetch posts when selected categories change
  useEffect(() => {
    if (categories.length > 0) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          let url = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}items/post?fields=*,kategoria.kategoria_id.*`;

          // Add filter if categories are selected
          if (
            selectedCategories.length > 0 &&
            selectedCategories.length < categories.length
          ) {
            const categoryIds = selectedCategories
              .map((catName) => {
                const category = categories.find(
                  (c: any) => c.nazwa === catName
                );
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
          setPosts(data.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [selectedCategories, categories]);

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

  return (
    <ContentWrapper
      header="Wycieczki"
      subheader="Znajdź idealną wycieczkę dla siebie i swoich bliskich:"
    >
      <div className="flex flex-wrap justify-center sticky bg-light-background md:text-xl text-sm">
        {categories.map((category) => (
          <FilterTag
            key={category.id}
            name={category.nazwa}
            selected={selectedCategories.includes(category.nazwa)}
            onClick={() => handleCategoryChange(category.nazwa)}
          />
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">
            Error loading destinations. Please try again later.
          </p>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 md:pl-24 md:pr-24 pl-2 pr-2 ">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            W tej kategorii jeszcze nic nie ma, ale będzie!
          </p>
        </div>
      )}
    </ContentWrapper>
  );
}
