"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ContentWrapper from "@/components/ContentWrapper";
import FilterTag from "@/components/FilterTag";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

function MapComponent() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const center = { lat: 49.8335, lng: 19.9396 };

  // Fetch categories
  useEffect(() => {
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

    fetchCategories();
  }, []);

  // Fetch posts when selected categories change
  useEffect(() => {
    if (categories.length > 0) {
      const fetchPosts = async () => {
        try {
          setIsLoading(true);
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
          // Filter posts that have geographic coordinates
          const postsWithCoords = data.data.filter(
            (post: any) =>
              post.szerokosc_geograficzna && post.dlugosc_geograficzna
          );
          setPosts(postsWithCoords);
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
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

  const handleMarkerClick = (post: any, event: any) => {
    setSelectedMarker(post);
    // Calculate modal position based on click event
    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const closeModal = () => {
    setSelectedMarker(null);
    setModalPosition(null);
  };

  if (isLoading) {
    return (
      <div className="pt-12 space-y-8 bg-orange-gray min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-12 space-y-8 bg-orange-gray min-h-screen pb-20 flex items-center justify-center">
        <p className="text-red-600">
          Error loading map data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <ContentWrapper
        header="Mapa Miejsc"
        subheader="Znajdź wycieczkę na mapie:"
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

        {/* Modal overlay */}
        {selectedMarker && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-20"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg shadow-xl/30 max-w-md md:w-full w-10/12 mx-4 max-h-[80vh] overflow-y-auto m-4"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                left: modalPosition ? `${modalPosition.x}px` : "50%",
                top: modalPosition ? `${modalPosition.y}px` : "50%",
                transform: modalPosition
                  ? "translate(-50%, -100%)"
                  : "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              <div className="p-6 border-1 border-gray-400 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{selectedMarker.tytul}</h3>
                  <button
                    onClick={closeModal}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    {format(
                      new Date(selectedMarker.date_created),
                      "d MMMM yyyy",
                      {
                        locale: pl,
                      }
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMarker.kategoria?.map(
                      (kat: any, index: number) => (
                        <span
                          key={index}
                          className="text-sm text-gray-500 rounded-full bg-gray-200 px-4 py-1"
                        >
                          {kat.kategoria_id?.nazwa}
                        </span>
                      )
                    )}
                  </div>
                  <div className="prose">
                    {selectedMarker.zdjecie_glowne && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${selectedMarker.zdjecie_glowne}`}
                        alt={selectedMarker.tytul}
                        className="w-full h-48 object-cover object-center rounded-lg mb-4"
                      />
                    )}
                    <div
                      className="text-sm text-gray-700 mb-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedMarker.tresc?.substring(0, 300) +
                          (selectedMarker.tresc?.length > 300 ? "..." : ""),
                      }}
                    />
                    <p className="mt-4">
                      <a
                        href={`/posts/${selectedMarker.tytul
                          ?.toLowerCase()
                          .replace(/ /g, "-")}?id=${selectedMarker.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Czytaj więcej
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <div
          className="h-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_DIRECTUS_URL}assets/${selectedMarker?.zdjecie_glowne})`,
          }}
        > */}
        <div className="h-[800px]">

          <Map
            defaultZoom={9}
            defaultCenter={center}
            mapId={"f70864a91d68c622fc65ba40"}
            />
          {posts.map((post) => (
            <AdvancedMarker
            key={post.id}
            position={{
              lat: parseFloat(post.szerokosc_geograficzna),
              lng: parseFloat(post.dlugosc_geograficzna),
            }}
            onClick={(event) => handleMarkerClick(post, event)}
            >
              <img src="/pin.png" alt="marker" width={34} />
            </AdvancedMarker>
          ))}
          </div>
        {/* </div> */}
      </ContentWrapper>
    </APIProvider>
  );
}

export default MapComponent;
