"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

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

function MapComponent() {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    ALLOWED_TAGS.map((tag) => tag)
  );
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

  const generateInput = (tag: string) => {
    return (
      <input
        type="checkbox"
        checked={selectedTags.includes(tag)}
        onChange={() => {
          setSelectedTags((prev) =>
            prev.includes(tag)
              ? prev.filter((t) => t !== tag)
              : [...prev, tag]
          );
        }}
        className="mr-2 accent-gray-300"
      />
    );
  };

  const filterCard = (name: string, image: string) => {
    return (
      <div className="border-1 border-gray-900 rounded-lg p-4 items-center justify-center text-center flex flex-col w-20 h-25">
        <img src={image} alt="marker" />
        <h3> {name}</h3>
      </div>
    );
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="bg-dirty-olive-green">
        <div className="flex flex-wrap justify-center pt-4">
          <label
            key={"w góry"}
            className="flex items-center mx-2 my-1 md:px-4 px-2 py-2 rounded-md border-1 border-gray-500 text-sm bg-gray-100 cursor-pointer"
          >
            {generateInput("w góry")}
            <span
              className={`inline-block w-4 h-4 rounded-full mr-2 bg-mountains-marker`}
            ></span>
            "w góry"
          </label>
          <label
            key={"nad wodę"}
            className="flex items-center mx-2 my-1 md:px-4 px-2 py-2 rounded-md border-1 border-gray-500 text-sm bg-gray-100 cursor-pointer"
          >
            {generateInput("nad wodę")}
            <span
              className={`inline-block w-4 h-4 rounded-full mr-2 bg-water-marker`}
            ></span>
            "nad wodę"
          </label>
          <label
            key={"regionalna kultura"}
            className="flex items-center mx-2 my-1 md:px-4 px-2 py-2 rounded-md border-1 border-gray-500 text-sm bg-gray-100 cursor-pointer"
          >
            {generateInput("regionalna kultura")}
            <span
              className={`inline-block w-4 h-4 rounded-full mr-2 bg-culture-marker`}
            ></span>
            "regionalna kultura"
          </label>
          <label
            key={"w niepogodę"}
            className="flex items-center mx-2 my-1 md:px-4 px-2 py-2 rounded-md border-1 border-gray-500 text-sm bg-gray-100 cursor-pointer"
          >
            {generateInput("w niepogodę")}
            <span
              className={`inline-block w-4 h-4 rounded-full mr-2 bg-weather-marker`}
            ></span>
            "w niepogodę"
          </label>
          <label
            key={"budżetowo"}
            className="flex items-center mx-2 my-1 md:px-4 px-2 py-2 rounded-md border-1 border-gray-500 text-sm bg-gray-100 cursor-pointer"
          >
            {generateInput("budżetowo")}
            <span
              className={`inline-block w-4 h-4 rounded-full mr-2 bg-budget-marker`}
            ></span>
            budżetowo
          </label>
          <label
            key={"z nocowankiem"}
            className="flex items-center mx-2 my-1 md:px-4 px-2 py-2 rounded-md border-1 border-gray-500 text-sm bg-gray-100 cursor-pointer"
          >
            {generateInput("z nocowankiem")}
            <span
              className={`inline-block w-4 h-4 rounded-full mr-2 bg-camping-marker`}
            ></span>
            z nocowankiem
          </label>
          <label
            key={"dzieciaczkowy raj"}
            className="flex items-center mx-2 my-1 md:px-4 px-2 py-2 rounded-md border-1 border-gray-500 text-sm bg-gray-100 cursor-pointer"
          >
            {generateInput("dzieciaczkowy raj")}
            <span
              className={`inline-block w-4 h-4 rounded-full mr-2 bg-children-marker`}
            ></span>
            dzieciaczkowy raj
          </label>
        </div>
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
            mapId={"298d9f1b27024ac234909302"}
          />
          {posts.map((post) => (
            <AdvancedMarker
              key={post.id}
              position={{ lat: post.latitude, lng: post.longitude }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255, 0, 0, 1) 0%, rgba(255, 0, 0, 0) 90%)",
                }}
              ></div>
            </AdvancedMarker>
          ))}
        </div>
      </div>
    </APIProvider>
  );
}

export default MapComponent;
