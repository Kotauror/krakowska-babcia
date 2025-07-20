"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getPosts } from "@/lib/api";
import type { Post } from "@/types/post";

const ALLOWED_TAGS = [
  "w góry",
  "nad wodę",
  "regionalna kultura",
  "w niepogodę",
  "budżetowo",
  "z nocowankiem",
  "dzieciaczkowy raj",
];

function extractFirstImageUrl(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match ? match[1] : "/icon.png";
}

function removeImagesFromMarkdown(content: string): string {
  return content.replace(/!\[.*?\]\(.*?\)/g, "");
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

function FilterTag({
  name,
  selected,
  onClick,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`border-1 md:mx-2 mx-1 my-1 md:px-6 px-2 py-2 text-xs md:text-base rounded-full decoration-1 hover:cursor-pointer font-medium
 ${
        selected ? "border-[#27377d]" : "border-gray-600"
      }  ${
        selected ? "bg-[#b9cbf6]" : "bg-white"
      }`}
      onClick={onClick}
      type="button"w
    >
      <div className={`checkbox-container ${selected ? "pl-6" : ""}`}>
        {" "}
        {name.charAt(0).toUpperCase() + name.slice(1)}
        <input type="checkbox" checked={selected} className={`${selected ? "visible" : "collapse"}`} />
        <span className="checkmark"></span>
      </div>
    </button>
  );
}

function MapComponent() {
  const [selectedTags, setSelectedTags] = useState<string[]>(ALLOWED_TAGS);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<Post | null>(null);

  const center = { lat: 49.8335, lng: 19.9396 };

  useEffect(() => {
    if (selectedTags.length === 0) {
      setPosts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getPosts(selectedTags)
      .then(setPosts)
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setIsLoading(false));
  }, [selectedTags]);

  if (isLoading) {
    return (
      <div className="pt-12 space-y-8 bg-orange-gray min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="bg-gray-100 relative">
        <div className="flex flex-wrap justify-center pt-4">
          {ALLOWED_TAGS.map((tag) => (
            <FilterTag
              key={tag}
              name={tag}
              selected={selectedTags.includes(tag)}
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
            />
          ))}
        </div>

        {selectedMarker && (
          <div className="absolute top-0 left-0 h-full w-full max-w-sm bg-white z-10 p-6 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold mb-2">{selectedMarker.title}</h3>
              <button
                onClick={() => setSelectedMarker(null)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div>
              <p className="text-gray-600 mb-4">{selectedMarker.destination}</p>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(selectedMarker.created_at).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMarker.tags.map((tag) => (
                  <p
                    key={tag.id}
                    className="text-sm text-gray-500 mb-4 rounded-full bg-gray-200 px-4 py-1"
                  >
                    {tag.name}
                  </p>
                ))}
              </div>
              <div className="prose">
                <img
                  src={extractFirstImageUrl(selectedMarker.content)}
                  alt={selectedMarker.title}
                  className="w-full h-full object-cover object-center"
                  // onError={() =>  (true)}
                />
                {truncateText(
                  removeImagesFromMarkdown(selectedMarker.content),
                  600
                )}{" "}
                {/* <p>{selectedMarker.content.substring(0, 600)}...</p> */}
                <p className="mt-4">
                  <a
                    href={`/posts/${selectedMarker.slug}`}
                    className="text-blue-500"
                  >
                    Czytaj więcej
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: "100vh", width: "100%" }} className="mt-4">
          <Map
            defaultZoom={9}
            defaultCenter={center}
            onCameraChanged={(ev) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom
              )
            }
            mapId={"f70864a91d68c622fc65ba40"}
          />
          {posts.map((post) => (
            <AdvancedMarker
              key={post.id}
              position={{ lat: post.latitude, lng: post.longitude }}
              onClick={() => setSelectedMarker(post)}
            >
              <img src="/pin.png" alt="marker" width={34} />
            </AdvancedMarker>
          ))}
        </div>
      </div>
    </APIProvider>
  );
}

export default MapComponent;
